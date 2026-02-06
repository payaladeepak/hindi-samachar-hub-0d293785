-- Create visitor_data table for tracking visitors
CREATE TABLE public.visitor_data (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    visitor_name TEXT,
    user_agent TEXT,
    page_visited TEXT,
    referrer TEXT,
    device_type TEXT,
    browser TEXT,
    country TEXT,
    city TEXT,
    push_token TEXT,
    is_subscribed_push BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_visitor_data_ip ON public.visitor_data(ip_address);
CREATE INDEX idx_visitor_data_user_id ON public.visitor_data(user_id);
CREATE INDEX idx_visitor_data_created_at ON public.visitor_data(created_at DESC);

-- Enable RLS
ALTER TABLE public.visitor_data ENABLE ROW LEVEL SECURITY;

-- Only admins can view visitor data
CREATE POLICY "Admins can view all visitor data"
ON public.visitor_data
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert visitor data"
ON public.visitor_data
FOR INSERT
WITH CHECK (true);

-- Admins can update (for push token management)
CREATE POLICY "Admins can update visitor data"
ON public.visitor_data
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete visitor data"
ON public.visitor_data
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));