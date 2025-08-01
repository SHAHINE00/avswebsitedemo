-- Enhance subscriber management with better structure
ALTER TABLE IF EXISTS newsletter_subscribers 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unsubscribed')),
ADD COLUMN IF NOT EXISTS interests text[],
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_email_sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Create email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  template_type text DEFAULT 'newsletter',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  total_recipients integer DEFAULT 0,
  total_sent integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for email campaigns
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policy for email campaigns (admin only)
CREATE POLICY "Admin can manage email campaigns" 
ON email_campaigns 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create email stats table for tracking
CREATE TABLE IF NOT EXISTS email_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  subscriber_email text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  event_data jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for email stats
ALTER TABLE email_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for email stats (admin only)
CREATE POLICY "Admin can view email stats" 
ON email_stats 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create function to update campaign updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaign_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email campaigns
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_updated_at();