-- Create slack_subscribers table for storing webhook connections
CREATE TABLE public.slack_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  team_id TEXT NOT NULL,
  team_name TEXT,
  channel TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, team_id)
);

-- Enable Row Level Security
ALTER TABLE public.slack_subscribers ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.slack_subscribers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON public.slack_subscribers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON public.slack_subscribers FOR DELETE
  USING (auth.uid() = user_id);