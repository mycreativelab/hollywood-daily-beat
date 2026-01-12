import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getMP3Duration(audioUrl: string): Promise<number> {
  try {
    const response = await fetch(audioUrl, { method: "HEAD" });
    if (!response.ok) {
      console.log(`HEAD request failed for ${audioUrl}, trying GET with range`);
      const rangeResponse = await fetch(audioUrl, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
      });
      const contentRange = rangeResponse.headers.get("content-range");
      if (contentRange) {
        const match = contentRange.match(/\/(\d+)/);
        if (match) {
          const fileSizeBytes = parseInt(match[1], 10);
          const durationSeconds = Math.round(fileSizeBytes / 16000);
          console.log(`Estimated duration from range: ${durationSeconds}s for size ${fileSizeBytes}`);
          return durationSeconds;
        }
      }
      return 0;
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      const fileSizeBytes = parseInt(contentLength, 10);
      const durationSeconds = Math.round(fileSizeBytes / 16000);
      console.log(`Estimated duration: ${durationSeconds}s for size ${fileSizeBytes} bytes`);
      return durationSeconds;
    }

    return 0;
  } catch (error) {
    console.error("Error getting MP3 duration:", error);
    return 0;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const results: { episode: string; audioUrl: string; duration: number; updated: boolean }[] = [];

    // Episode 1: c782a9a4-1e2d-4c71-9f03-02cc8c6f36c9 - nur Duration berechnen
    const episode1Id = "c782a9a4-1e2d-4c71-9f03-02cc8c6f36c9";
    const episode1AudioUrl = "https://cloud.allenberg.de/s/4Jfio3HiJC6MtXD/download";
    
    console.log("Calculating duration for Episode 1...");
    const episode1Duration = await getMP3Duration(episode1AudioUrl);
    
    if (episode1Duration > 0) {
      const { error: error1 } = await supabase
        .from("episodes")
        .update({ duration: episode1Duration })
        .eq("id", episode1Id);

      if (error1) {
        console.error("Error updating Episode 1:", error1);
        results.push({ episode: "Episode 1", audioUrl: episode1AudioUrl, duration: episode1Duration, updated: false });
      } else {
        results.push({ episode: "Episode 1", audioUrl: episode1AudioUrl, duration: episode1Duration, updated: true });
      }
    } else {
      results.push({ episode: "Episode 1", audioUrl: episode1AudioUrl, duration: 0, updated: false });
    }

    // Episode 2: 6423d98a-1058-4f70-a42e-12f0a6a54ee4 - Audio-URL korrigieren + Duration berechnen
    const episode2Id = "6423d98a-1058-4f70-a42e-12f0a6a54ee4";
    const episode2NewAudioUrl = "https://cloud.allenberg.de/s/acA24q3BMkMFbCy/download?path=%2F&files=Episode%2002%2011.01.26.mp3";
    
    console.log("Calculating duration for Episode 2...");
    const episode2Duration = await getMP3Duration(episode2NewAudioUrl);
    
    const { error: error2 } = await supabase
      .from("episodes")
      .update({ 
        audio_url: episode2NewAudioUrl,
        duration: episode2Duration > 0 ? episode2Duration : 0
      })
      .eq("id", episode2Id);

    if (error2) {
      console.error("Error updating Episode 2:", error2);
      results.push({ episode: "Episode 2", audioUrl: episode2NewAudioUrl, duration: episode2Duration, updated: false });
    } else {
      results.push({ episode: "Episode 2", audioUrl: episode2NewAudioUrl, duration: episode2Duration, updated: true });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Episodes updated successfully",
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
