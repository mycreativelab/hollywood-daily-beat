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
    // This function should be called with service role key or from admin context
    const { episode_title, podcast_title, episode_url } = await req.json()

    if (!episode_title || !podcast_title) {
      return new Response(
        JSON.stringify({ error: 'Missing episode_title or podcast_title' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client to fetch all subscribers
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch all webhook URLs
    const { data: subscribers, error: dbError } = await supabase
      .from('slack_subscribers')
      .select('webhook_url, team_name, channel')

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscribers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No subscribers to notify', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare Slack message
    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎙️ Neue Podcast-Folge!",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${podcast_title}*\n${episode_title}`
          }
        },
        ...(episode_url ? [{
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${episode_url}|Jetzt anhören>`
          }
        }] : [])
      ]
    }

    // Send to all webhooks
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        const response = await fetch(subscriber.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackMessage)
        })
        
        if (!response.ok) {
          const text = await response.text()
          throw new Error(`Slack webhook failed: ${response.status} - ${text}`)
        }
        
        return { team: subscriber.team_name, channel: subscriber.channel }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected')

    if (failed.length > 0) {
      console.error('Some notifications failed:', failed)
    }

    return new Response(
      JSON.stringify({ 
        message: `Notifications sent`, 
        sent: successful,
        failed: failed.length
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
