import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body - user_id kommt aus dem state Parameter
    const { code, redirect_uri, user_id } = await req.json()

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing code parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!user_id) {
      console.warn('No user_id provided in request')
      return new Response(
        JSON.stringify({ error: 'Missing user_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Slack credentials from environment
    const SLACK_CLIENT_ID = Deno.env.get('SLACK_CLIENT_ID')
    const SLACK_CLIENT_SECRET = Deno.env.get('SLACK_CLIENT_SECRET')

    if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET) {
      console.error('Missing Slack credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Exchange code for access token with Slack
    const slackResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: redirect_uri
      })
    })

    const slackData = await slackResponse.json()

    if (!slackData.ok) {
      console.error('Slack OAuth error:', slackData.error)
      return new Response(
        JSON.stringify({ error: `Slack error: ${slackData.error}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract webhook info
    const webhookUrl = slackData.incoming_webhook?.url
    const teamId = slackData.team?.id
    const teamName = slackData.team?.name
    const channel = slackData.incoming_webhook?.channel

    if (!webhookUrl || !teamId) {
      console.error('Missing webhook data from Slack:', slackData)
      return new Response(
        JSON.stringify({ error: 'Invalid Slack response - missing webhook data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Supabase Client mit Service Role für DB-Zugriff (RLS bypass)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Store in database (upsert to handle reconnections)
    const { error: dbError } = await supabase
      .from('slack_subscribers')
      .upsert({
        user_id: user_id,
        webhook_url: webhookUrl,
        team_id: teamId,
        team_name: teamName,
        channel: channel
      }, {
        onConflict: 'user_id,team_id'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save subscription' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        team_name: teamName,
        channel: channel 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
