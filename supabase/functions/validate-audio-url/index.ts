import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize Nextcloud share links
    let normalizedUrl = url.trim();
    
    // If it's a Nextcloud share link without /download, add it
    const nextcloudSharePattern = /^(https?:\/\/[^\/]+\/s\/[a-zA-Z0-9]+)$/;
    if (nextcloudSharePattern.test(normalizedUrl)) {
      normalizedUrl = `${normalizedUrl}/download`;
    }

    // Try HEAD request first, then GET with range if HEAD fails
    let response: Response;
    let method = 'HEAD';
    
    try {
      response = await fetch(normalizedUrl, {
        method: 'HEAD',
        redirect: 'follow',
      });
    } catch {
      // HEAD might be blocked, try GET with range
      method = 'GET';
      response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: { 'Range': 'bytes=0-1023' },
        redirect: 'follow',
      });
    }

    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');
    const finalUrl = response.url;

    // Check if it's a valid audio response
    const isAudioContentType = 
      contentType.includes('audio/') || 
      contentType.includes('application/octet-stream') ||
      contentType.includes('binary/octet-stream');

    const isHtml = contentType.includes('text/html');
    
    // Check for common error patterns
    const isError = response.status >= 400;
    const isRedirectToLogin = isHtml && (
      finalUrl.includes('login') || 
      finalUrl.includes('auth') ||
      finalUrl.includes('signin')
    );

    if (isError) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          contentType,
          normalizedUrl,
          finalUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isRedirectToLogin) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'URL redirects to login page - not publicly accessible',
          status: response.status,
          contentType,
          normalizedUrl,
          finalUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (isHtml && !isAudioContentType) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'URL returns HTML instead of audio - likely a share page, not direct download',
          status: response.status,
          contentType,
          normalizedUrl,
          finalUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        valid: true,
        status: response.status,
        contentType,
        contentLength: contentLength ? parseInt(contentLength) : null,
        normalizedUrl,
        finalUrl,
        method,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
