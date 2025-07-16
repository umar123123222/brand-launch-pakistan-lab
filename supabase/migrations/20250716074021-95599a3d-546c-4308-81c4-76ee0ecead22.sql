
-- Create brands table to store client brand information
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  assigned_team_member TEXT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_delivery_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '45 days'),
  status TEXT NOT NULL DEFAULT 'On Track' CHECK (status IN ('On Track', 'At Risk', 'Behind')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brand_tasks table to track individual task progress
CREATE TABLE public.brand_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Done')),
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to automatically create tasks for new brands
CREATE OR REPLACE FUNCTION create_brand_tasks()
RETURNS TRIGGER AS $$
DECLARE
  task_names TEXT[] := ARRAY[
    'Perfumes manufactured',
    'Logo design started',
    'Logo finalized',
    'Box design finalized',
    'Logo + Box files sent to Aftab Bhai',
    'Shopify store created',
    'Shopify store live',
    'Courier accounts integrated',
    'Box manufacturing complete',
    'Flyers designed',
    'Flyers printed',
    'Product photoshoot complete',
    'Video ad shoot + edit done',
    'Shopify updated with final content (photos + descriptions)',
    'Social media handles created',
    'Meta Business Manager created',
    'Ad account created',
    'Facebook Pixel installed on Shopify',
    'FBR registration initiated (optional)',
    'Trademark filed (optional)',
    'Final QC before dispatch',
    'Brand ready for launch'
  ];
  task_name TEXT;
  task_index INTEGER := 1;
BEGIN
  FOREACH task_name IN ARRAY task_names
  LOOP
    INSERT INTO public.brand_tasks (brand_id, task_name, task_order)
    VALUES (NEW.id, task_name, task_index);
    task_index := task_index + 1;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create tasks when a new brand is added
CREATE TRIGGER create_brand_tasks_trigger
  AFTER INSERT ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION create_brand_tasks();

-- Create function to update brand status based on task progress
CREATE OR REPLACE FUNCTION update_brand_status()
RETURNS TRIGGER AS $$
DECLARE
  brand_record RECORD;
  total_tasks INTEGER;
  completed_tasks INTEGER;
  days_remaining INTEGER;
  overdue_tasks INTEGER;
BEGIN
  -- Get brand information
  SELECT * INTO brand_record FROM public.brands WHERE id = NEW.brand_id;
  
  -- Count total and completed tasks
  SELECT COUNT(*) INTO total_tasks FROM public.brand_tasks WHERE brand_id = NEW.brand_id;
  SELECT COUNT(*) INTO completed_tasks FROM public.brand_tasks WHERE brand_id = NEW.brand_id AND status = 'Done';
  
  -- Calculate days remaining
  days_remaining := brand_record.estimated_delivery_date - CURRENT_DATE;
  
  -- Count overdue tasks (tasks that have been in progress for more than 5 days)
  SELECT COUNT(*) INTO overdue_tasks 
  FROM public.brand_tasks 
  WHERE brand_id = NEW.brand_id 
    AND status = 'In Progress' 
    AND created_at < (CURRENT_TIMESTAMP - INTERVAL '5 days');
  
  -- Update brand status based on progress and timeline
  IF days_remaining <= 10 OR overdue_tasks >= 3 OR (completed_tasks::FLOAT / total_tasks::FLOAT) < 0.5 THEN
    UPDATE public.brands SET status = 'Behind' WHERE id = NEW.brand_id;
  ELSIF days_remaining <= 20 OR overdue_tasks >= 1 OR (completed_tasks::FLOAT / total_tasks::FLOAT) < 0.7 THEN
    UPDATE public.brands SET status = 'At Risk' WHERE id = NEW.brand_id;
  ELSE
    UPDATE public.brands SET status = 'On Track' WHERE id = NEW.brand_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update brand status when tasks are updated
CREATE TRIGGER update_brand_status_trigger
  AFTER UPDATE ON public.brand_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_status();

-- Add updated_at trigger for brands table
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for brand_tasks table
CREATE TRIGGER update_brand_tasks_updated_at
  BEFORE UPDATE ON public.brand_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admin can manage brands" ON public.brands FOR ALL USING (true);
CREATE POLICY "Admin can manage brand tasks" ON public.brand_tasks FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_brands_status ON public.brands(status);
CREATE INDEX idx_brands_start_date ON public.brands(start_date);
CREATE INDEX idx_brands_assigned_team_member ON public.brands(assigned_team_member);
CREATE INDEX idx_brand_tasks_brand_id ON public.brand_tasks(brand_id);
CREATE INDEX idx_brand_tasks_status ON public.brand_tasks(status);
