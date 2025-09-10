-- Fix trigger authentication issues by allowing anonymous operations

-- Update check_client_field_permissions to allow anonymous operations
CREATE OR REPLACE FUNCTION public.check_client_field_permissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role text;
BEGIN
  -- Get current user role (will be NULL for anonymous operations)
  SELECT role INTO user_role 
  FROM user_profiles 
  WHERE auth_user_id = auth.uid();
  
  -- If no auth user (anonymous), allow the operation to proceed
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- If authenticated user exists but no role found, reject
  IF user_role IS NULL THEN
    RAISE EXCEPTION 'User role not found';
  END IF;
  
  -- Check drive_link permissions (MediaTeam only)
  IF OLD.drive_link IS DISTINCT FROM NEW.drive_link AND user_role != 'MediaTeam' AND user_role NOT IN ('Admin', 'SuperAdmin') THEN
    RAISE EXCEPTION 'Only Media Team can update drive link';
  END IF;
  
  -- Check e-commerce and social media field permissions (WebDeveloper only)
  IF (
    OLD.shopify_url IS DISTINCT FROM NEW.shopify_url OR
    OLD.shopify_username IS DISTINCT FROM NEW.shopify_username OR
    OLD.shopify_password IS DISTINCT FROM NEW.shopify_password OR
    OLD.courier_url IS DISTINCT FROM NEW.courier_url OR
    OLD.courier_username IS DISTINCT FROM NEW.courier_username OR
    OLD.courier_password IS DISTINCT FROM NEW.courier_password OR
    OLD.instagram_username IS DISTINCT FROM NEW.instagram_username OR
    OLD.instagram_password IS DISTINCT FROM NEW.instagram_password OR
    OLD.instagram_profile_url IS DISTINCT FROM NEW.instagram_profile_url OR
    OLD.facebook_page_url IS DISTINCT FROM NEW.facebook_page_url
  ) AND user_role != 'WebDeveloper' AND user_role NOT IN ('Admin', 'SuperAdmin') THEN
    RAISE EXCEPTION 'Only Web Developers can update e-commerce and social media fields';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update log_client_changes to handle anonymous operations
CREATE OR REPLACE FUNCTION public.log_client_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Skip logging for anonymous operations (no auth.uid())
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get the current user's role
  SELECT role INTO user_role 
  FROM user_profiles 
  WHERE auth_user_id = auth.uid();
  
  -- Log changes for specific fields only if user is authenticated
  IF OLD.phone IS DISTINCT FROM NEW.phone THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'phone', OLD.phone, NEW.phone, auth.uid(), user_role);
  END IF;
  
  IF OLD.business_number IS DISTINCT FROM NEW.business_number THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'business_number', OLD.business_number, NEW.business_number, auth.uid(), user_role);
  END IF;
  
  IF OLD.business_address IS DISTINCT FROM NEW.business_address THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'business_address', OLD.business_address, NEW.business_address, auth.uid(), user_role);
  END IF;
  
  IF OLD.business_email IS DISTINCT FROM NEW.business_email THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'business_email', OLD.business_email, NEW.business_email, auth.uid(), user_role);
  END IF;
  
  IF OLD.ntn IS DISTINCT FROM NEW.ntn THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'ntn', OLD.ntn, NEW.ntn, auth.uid(), user_role);
  END IF;
  
  IF OLD.strn IS DISTINCT FROM NEW.strn THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'strn', OLD.strn, NEW.strn, auth.uid(), user_role);
  END IF;
  
  IF OLD.bank_details IS DISTINCT FROM NEW.bank_details THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'bank_details', OLD.bank_details, NEW.bank_details, auth.uid(), user_role);
  END IF;
  
  IF OLD.drive_link IS DISTINCT FROM NEW.drive_link THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'drive_link', OLD.drive_link, NEW.drive_link, auth.uid(), user_role);
  END IF;
  
  IF OLD.shopify_username IS DISTINCT FROM NEW.shopify_username THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'shopify_username', OLD.shopify_username, NEW.shopify_username, auth.uid(), user_role);
  END IF;
  
  IF OLD.instagram_username IS DISTINCT FROM NEW.instagram_username THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'instagram_username', OLD.instagram_username, NEW.instagram_username, auth.uid(), user_role);
  END IF;
  
  IF OLD.labels_details IS DISTINCT FROM NEW.labels_details THEN
    INSERT INTO client_activity_log (client_id, field_name, old_value, new_value, changed_by, changed_by_role)
    VALUES (NEW.id, 'labels_details', OLD.labels_details, NEW.labels_details, auth.uid(), user_role);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update notify_client_changes to handle anonymous operations
CREATE OR REPLACE FUNCTION public.notify_client_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  change_summary TEXT := '';
  field_changes TEXT[] := '{}';
  recipient_id UUID;
  recipients UUID[];
  triggered_by_name TEXT;
  client_name TEXT;
  assigned_agent_email TEXT;
  actor_role TEXT;
  action_type TEXT;
BEGIN
  -- Skip notifications for anonymous operations (no auth.uid())
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get client name and assigned agent email
  client_name := COALESCE(NEW.name, OLD.name, 'Unknown Client');
  assigned_agent_email := COALESCE(NEW.assigned_agent_id, OLD.assigned_agent_id);
  
  -- Get the name and role of the user who made the change
  SELECT name, role::text INTO triggered_by_name, actor_role
  FROM user_profiles 
  WHERE auth_user_id = auth.uid();
  
  triggered_by_name := COALESCE(triggered_by_name, 'System');
  actor_role := COALESCE(actor_role, 'Unknown');

  -- Determine action type based on actor role
  action_type := CASE actor_role
    WHEN 'SalesAgent' THEN 'client_update_by_sales'
    WHEN 'MediaTeam' THEN 'client_update_by_media_webdev'
    WHEN 'WebDeveloper' THEN 'client_update_by_media_webdev'
    WHEN 'Admin' THEN 'client_update_by_admin'
    WHEN 'SuperAdmin' THEN 'client_update_by_admin'
    ELSE 'client_update_by_client'
  END;

  -- Track specific field changes with new message format
  IF TG_OP = 'UPDATE' THEN
    IF OLD.advance_payment_paid != NEW.advance_payment_paid AND NEW.advance_payment_paid = true THEN
      field_changes := array_append(field_changes, 'recorded first half payment');
    END IF;
    
    IF OLD.full_payment_paid != NEW.full_payment_paid AND NEW.full_payment_paid = true THEN
      field_changes := array_append(field_changes, 'recorded full payment');
    END IF;
    
    IF OLD.ntn IS DISTINCT FROM NEW.ntn AND NEW.ntn IS NOT NULL THEN
      field_changes := array_append(field_changes, 'updated NTN to: ' || NEW.ntn);
    END IF;
    
    IF OLD.brand_name IS DISTINCT FROM NEW.brand_name AND NEW.brand_name IS NOT NULL THEN
      field_changes := array_append(field_changes, 'updated brand name to: ' || NEW.brand_name);
    END IF;
    
    IF OLD.labels_name IS DISTINCT FROM NEW.labels_name AND NEW.labels_name IS NOT NULL THEN
      field_changes := array_append(field_changes, 'updated labels to: ' || NEW.labels_name);
    END IF;
    
    IF OLD.drive_link IS DISTINCT FROM NEW.drive_link AND NEW.drive_link IS NOT NULL THEN
      field_changes := array_append(field_changes, 'added drive link');
    END IF;
    
    IF OLD.shopify_username IS DISTINCT FROM NEW.shopify_username AND NEW.shopify_username IS NOT NULL THEN
      field_changes := array_append(field_changes, 'updated Shopify credentials');
    END IF;
    
    IF OLD.instagram_username IS DISTINCT FROM NEW.instagram_username AND NEW.instagram_username IS NOT NULL THEN
      field_changes := array_append(field_changes, 'updated Instagram credentials');
    END IF;
  END IF;

  -- Only proceed if there are actual changes we care about
  IF array_length(field_changes, 1) > 0 THEN
    change_summary := array_to_string(field_changes, ', ');
    
    -- Get recipients based on action type and context
    recipients := public.get_notification_recipients(
      action_type, 
      actor_role, 
      NEW.id, 
      assigned_agent_email
    );
    
    -- Insert notifications with new message format: "User did action of Client"
    FOREACH recipient_id IN ARRAY recipients
    LOOP
      INSERT INTO public.notifications (
        recipient_user_id, 
        title, 
        message, 
        notification_type,
        entity_type,
        entity_id,
        triggered_by_user_id
      ) VALUES (
        recipient_id,
        triggered_by_name || ' updated ' || client_name,
        triggered_by_name || ' ' || change_summary || ' of ' || client_name,
        'client_update',
        'client',
        NEW.id,
        auth.uid()
      );
    END LOOP;
    
    -- Call edge function to send email notifications (async)
    PERFORM
      net.http_post(
        url := (SELECT COALESCE(
          'https://bsqtjhjqytuncpvbnuwp.supabase.co/functions/v1/send-client-update-notification',
          'http://localhost:54321/functions/v1/send-client-update-notification'
        )),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT COALESCE(current_setting('app.jwt_token', true), ''))
        ),
        body := jsonb_build_object(
          'clientId', NEW.id,
          'clientName', client_name,
          'changes', change_summary,
          'triggeredBy', triggered_by_name,
          'assignedAgentEmail', assigned_agent_email
        )
      );
  END IF;

  RETURN NEW;
END;
$function$;