import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Normalize title by removing line breaks and trimming
function normalizeTitle(title: string): string {
  return title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// Check if episode data is valid (not a faulty upload)
function isValidEpisode(data: { audio_url?: string; description?: string; title: string }): boolean {
  const hasValidAudioUrl = Boolean(data.audio_url && !data.audio_url.includes('undefined.mp3'));
  const hasDescription = Boolean(data.description && data.description.trim().length > 0);
  const hasTitleWithoutLineBreaks = !data.title.includes('\n');
  
  return hasValidAudioUrl && hasDescription && hasTitleWithoutLineBreaks;
}

// Extract base title pattern for matching (e.g., "Episode 01 08.01.26" from various formats)
function extractTitlePattern(title: string): string {
  const normalized = normalizeTitle(title);
  // Match pattern like "Episode XX DD.MM.YY" or similar
  const match = normalized.match(/Episode\s*\d*\s*\d{2}\.\d{2}\.\d{2}/i);
  return match ? match[0] : normalized;
}

// Get MP3 duration from file size (assuming 128kbps bitrate)
async function getMP3Duration(audioUrl: string): Promise<number> {
  try {
    const headResponse = await fetch(audioUrl, { method: 'HEAD' });
    const contentLength = headResponse.headers.get('content-length');
    
    if (!contentLength) {
      console.log('No content-length header found');
      return 0;
    }
    
    const fileSizeBytes = parseInt(contentLength, 10);
    // Assuming 128 kbps bitrate = 16000 bytes per second
    const bytesPerSecond = 16000;
    const durationSeconds = Math.round(fileSizeBytes / bytesPerSecond);
    
    console.log(`MP3 size: ${fileSizeBytes} bytes, estimated duration: ${durationSeconds} seconds`);
    return durationSeconds;
  } catch (error) {
    console.error('Error getting MP3 duration:', error);
    return 0;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    console.log('Received webhook payload:', JSON.stringify(body));

    // Validate required fields
    if (!body.title) {
      console.error('Validation error: title is required');
      return new Response(JSON.stringify({ error: 'title is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body.podcast_id) {
      console.error('Validation error: podcast_id is required');
      return new Response(JSON.stringify({ error: 'podcast_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if this is a valid episode
    const isValid = isValidEpisode({
      audio_url: body.audio_url,
      description: body.description,
      title: body.title
    });

    console.log('Episode validation result:', isValid);

    // If this is a valid episode, clean up faulty duplicates first
    if (isValid) {
      const titlePattern = extractTitlePattern(body.title);
      console.log('Looking for faulty duplicates with pattern:', titlePattern);

      // Find all episodes in the same podcast that might be faulty duplicates
      const { data: existingEpisodes, error: fetchError } = await supabase
        .from('episodes')
        .select('id, title, audio_url, description')
        .eq('podcast_id', body.podcast_id);

      if (fetchError) {
        console.error('Error fetching existing episodes:', fetchError);
      } else if (existingEpisodes && existingEpisodes.length > 0) {
        // Find faulty episodes that match the title pattern
        const faultyEpisodes = existingEpisodes.filter(ep => {
          const epPattern = extractTitlePattern(ep.title);
          const patternMatches = epPattern === titlePattern;
          
          const isFaulty = 
            (ep.audio_url && ep.audio_url.includes('undefined.mp3')) ||
            !ep.description ||
            ep.description.trim().length === 0 ||
            ep.title.includes('\n');
          
          return patternMatches && isFaulty;
        });

        if (faultyEpisodes.length > 0) {
          console.log(`Found ${faultyEpisodes.length} faulty duplicate(s) to delete:`, 
            faultyEpisodes.map(e => ({ id: e.id, title: e.title })));

          // Delete faulty duplicates
          const idsToDelete = faultyEpisodes.map(ep => ep.id);
          const { error: deleteError, count } = await supabase
            .from('episodes')
            .delete()
            .in('id', idsToDelete);

          if (deleteError) {
            console.error('Error deleting faulty episodes:', deleteError);
          } else {
            console.log(`Successfully deleted ${count || idsToDelete.length} faulty episode(s)`);
          }
        } else {
          console.log('No faulty duplicates found');
        }
      }
    }

    // Normalize the title before inserting
    const normalizedTitle = normalizeTitle(body.title);

    // Get MP3 duration from audio URL if available
    let duration = body.duration || 0;
    if (body.audio_url && duration === 0) {
      duration = await getMP3Duration(body.audio_url);
    }

    // Prepare episode data
    const episodeData = {
      title: normalizedTitle,
      podcast_id: body.podcast_id,
      description: body.description || null,
      audio_url: body.audio_url || null,
      duration: duration,
      episode_number: body.episode_number || null,
      thumbnail: body.thumbnail || null,
      published_at: body.published_at || new Date().toISOString(),
    };

    console.log('Inserting episode:', JSON.stringify(episodeData));

    // Insert episode into database
    const { data, error } = await supabase
      .from('episodes')
      .insert(episodeData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Episode created successfully:', JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, episode: data }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
