
-- site_settings (singleton row keyed by id='singleton')
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings public read"
  ON public.site_settings FOR SELECT
  USING (true);

-- comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a new comment (will be pending until approved)
CREATE POLICY "comments anyone can insert"
  ON public.comments FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND char_length(author_name) BETWEEN 1 AND 80
    AND char_length(message) BETWEEN 1 AND 1000
  );

-- Anyone can read approved comments
CREATE POLICY "comments read approved"
  ON public.comments FOR SELECT
  USING (status = 'approved');

-- admin_settings (server-only via service role; no policies for anon)
CREATE TABLE public.admin_settings (
  id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  recovery_code_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
-- No policies = no anon/auth access. Service role bypasses RLS.

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;
