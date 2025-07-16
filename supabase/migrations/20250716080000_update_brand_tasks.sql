
-- Update the task name for "Logo + Box files sent to Aftab Bhai"
UPDATE public.brand_tasks 
SET task_name = 'Logo and Box sent for manufacturing'
WHERE task_name = 'Logo + Box files sent to Aftab Bhai';

-- Remove "Shopify store created" task
DELETE FROM public.brand_tasks 
WHERE task_name = 'Shopify store created';

-- Update the create_brand_tasks function to reflect these changes
CREATE OR REPLACE FUNCTION public.create_brand_tasks()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  task_names TEXT[] := ARRAY[
    'Perfumes manufactured',
    'Logo design started',
    'Logo finalized',
    'Box design finalized',
    'Logo and Box sent for manufacturing',
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
$function$;
