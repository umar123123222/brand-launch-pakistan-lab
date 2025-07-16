
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Circle, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  task_name: string;
  task_order: number;
  status: string;
  completion_date?: string;
  notes?: string;
}

interface TaskListProps {
  brandId: string;
  tasks: Task[];
  onUpdate: () => void;
}

const TaskList = ({ brandId, tasks, onUpdate }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const { toast } = useToast();

  const sortedTasks = [...tasks].sort((a, b) => a.task_order - b.task_order);

  const updateTaskStatus = async (taskId: string, newStatus: string, notes?: string, completion_date?: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (notes !== undefined) {
        updateData.notes = notes;
      }
      
      if (newStatus === 'Done') {
        updateData.completion_date = completion_date || new Date().toISOString().split('T')[0];
      } else if (newStatus === 'Not Started') {
        updateData.completion_date = null;
      }

      const { error } = await supabase
        .from('brand_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task Updated",
        description: "Task status has been updated successfully.",
      });
      
      onUpdate();
      setEditingTask(null);
      setTaskNotes('');
      setCompletionDate('');
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Done': return <Check className="h-4 w-4 text-green-600" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setTaskNotes(task.notes || '');
    setCompletionDate(task.completion_date || '');
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      <h4 className="font-semibold text-gray-900 mb-3">Task Progress</h4>
      
      {sortedTasks.map((task) => (
        <div key={task.id} className="border rounded-lg p-3 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{task.task_name}</p>
                {task.completion_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Completed: {new Date(task.completion_date).toLocaleDateString()}
                  </p>
                )}
                {task.notes && (
                  <p className="text-xs text-gray-600 mt-1 p-2 bg-gray-100 rounded">
                    <MessageSquare className="h-3 w-3 inline mr-1" />
                    {task.notes}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(task.status)} variant="secondary">
                {task.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEditing(task)}
                className="text-xs"
              >
                Edit
              </Button>
            </div>
          </div>

          {editingTask === task.id && (
            <div className="mt-3 p-3 bg-white rounded border space-y-3">
              <Select
                value={task.status}
                onValueChange={(value) => {
                  // Update immediately for status change
                  updateTaskStatus(task.id, value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>

              {task.status === 'Done' && (
                <Input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  placeholder="Completion date"
                />
              )}

              <Textarea
                placeholder="Add notes (optional)"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                rows={2}
              />

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => updateTaskStatus(task.id, task.status, taskNotes, completionDate)}
                >
                  Save Notes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingTask(null);
                    setTaskNotes('');
                    setCompletionDate('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
