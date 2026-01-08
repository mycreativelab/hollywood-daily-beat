import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Get the auth token from the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token to verify identity
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role using service client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { episodeId, audioUrl } = await req.json();

    if (!episodeId || !audioUrl) {
      return new Response(
        JSON.stringify({ error: 'episodeId and audioUrl are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize Nextcloud share links
    let normalizedUrl = audioUrl.trim();
    const nextcloudSharePattern = /^(https?:\/\/[^\/]+\/s\/[a-zA-Z0-9]+)$/;
    if (nextcloudSharePattern.test(normalizedUrl)) {
      normalizedUrl = `${normalizedUrl}/download`;
    }

    // Validate the URL
    let validationResponse: Response;
    try {
      validationResponse = await fetch(normalizedUrl, {
        method: 'HEAD',
        redirect: 'follow',
      });
    } catch {
      validationResponse = await fetch(normalizedUrl, {
        method: 'GET',
        headers: { 'Range': 'bytes=0-1023' },
        redirect: 'follow',
      });
    }

    const contentType = validationResponse.headers.get('content-type') || '';
    const isAudioContentType = 
      contentType.includes('audio/') || 
      contentType.includes('application/octet-stream') ||
      contentType.includes('binary/octet-stream');
    const isHtml = contentType.includes('text/html');

    if (validationResponse.status >= 400) {
      return new Response(
        JSON.stringify({ 
          error: `URL returned HTTP ${validationResponse.status}`,
          status: validationResponse.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isHtml && !isAudioContentType) {
      return new Response(
        JSON.stringify({ 
          error: 'URL returns HTML instead of audio - use a direct download link',
          contentType
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the episode
    const { data, error } = await supabaseAdmin
      .from('episodes')
      .update({ audio_url: normalizedUrl })
      .eq('id', episodeId)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        episode: data,
        normalizedUrl,
        contentType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
