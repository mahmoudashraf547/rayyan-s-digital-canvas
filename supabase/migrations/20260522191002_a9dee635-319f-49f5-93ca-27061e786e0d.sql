
-- Editable site content (text, settings, etc.)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert site_content"
  ON public.site_content FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update site_content"
  ON public.site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete site_content"
  ON public.site_content FOR DELETE
  TO authenticated USING (true);

-- Uploaded items (files, images, videos) grouped by section
CREATE TABLE public.site_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  title TEXT,
  description TEXT,
  file_path TEXT,
  file_type TEXT,
  file_url TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX site_items_section_idx ON public.site_items(section_key, position);

ALTER TABLE public.site_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_items"
  ON public.site_items FOR SELECT USING (true);
CREATE POLICY "Auth can insert site_items"
  ON public.site_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update site_items"
  ON public.site_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete site_items"
  ON public.site_items FOR DELETE TO authenticated USING (true);

-- Visitor comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved comments"
  ON public.comments FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can insert comments"
  ON public.comments FOR INSERT WITH CHECK (
    length(name) BETWEEN 1 AND 80 AND
    length(message) BETWEEN 1 AND 2000
  );
CREATE POLICY "Auth can manage comments"
  ON public.comments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket for portfolio files (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);

CREATE POLICY "Public read portfolio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Auth upload portfolio"
  ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Auth update portfolio"
  ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'portfolio');

CREATE POLICY "Auth delete portfolio"
  ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'portfolio');

-- Update trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER touch_site_content BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_site_items BEFORE UPDATE ON public.site_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
