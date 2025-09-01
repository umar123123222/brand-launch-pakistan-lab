
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddBrandModal = ({ isOpen, onClose, onSuccess }: AddBrandModalProps) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    brand_name: '',
    assigned_team_member: '',
    start_date: new Date().toISOString().split('T')[0],
    estimated_delivery_date: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Calculate default delivery date (45 days from start date)
  React.useEffect(() => {
    if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      const deliveryDate = new Date(startDate);
      deliveryDate.setDate(deliveryDate.getDate() + 45);
      setFormData(prev => ({
        ...prev,
        estimated_delivery_date: deliveryDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.start_date]);

  const teamMembers = [
    'Shoaib Ahmad',
    'Mehreen',
    'Naba',
    'Arbaz',
    'Sarah',
    'Ahmad',
    'Team Lead 1',
    'Team Lead 2'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('brands')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand added successfully with all tasks created!",
      });

      onSuccess();
      onClose();
      setFormData({
        client_name: '',
        client_phone: '',
        brand_name: '',
        assigned_team_member: '',
        start_date: new Date().toISOString().split('T')[0],
        estimated_delivery_date: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding brand:', error);
      toast({
        title: "Error",
        description: "Failed to add brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client_name">Client Name *</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => handleInputChange('client_name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="client_phone">Client Phone/WhatsApp *</Label>
            <PhoneInput
              id="client_phone"
              value={formData.client_phone}
              onChange={(value) => handleInputChange('client_phone', value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="brand_name">Brand Name *</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => handleInputChange('brand_name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="assigned_team_member">Assigned Team Member *</Label>
            <Select
              value={formData.assigned_team_member}
              onValueChange={(value) => handleInputChange('assigned_team_member', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="estimated_delivery_date">Delivery Date *</Label>
              <Input
                id="estimated_delivery_date"
                type="date"
                value={formData.estimated_delivery_date}
                onChange={(e) => handleInputChange('estimated_delivery_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Adding...' : 'Add Brand'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBrandModal;
