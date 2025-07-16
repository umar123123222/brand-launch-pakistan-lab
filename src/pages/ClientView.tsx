
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Phone, User, Clock, CheckCircle, Circle, Clock3 } from 'lucide-react';

const ClientView = () => {
  const { brandId } = useParams();

  const { data: brand, isLoading } = useQuery({
    queryKey: ['client-brand', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select(`
          *,
          brand_tasks (*)
        `)
        .eq('id', brandId)
        .single();
      
      if (error) {
        console.error('Error fetching brand:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!brandId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your brand progress...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Not Found</h2>
          <p className="text-gray-600">The requested brand could not be found.</p>
        </div>
      </div>
    );
  }

  const completedTasks = brand.brand_tasks.filter(task => task.status === 'Done').length;
  const totalTasks = brand.brand_tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const getDaysRemaining = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'Done': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'In Progress': return <Clock3 className="h-6 w-6 text-orange-500" />;
      default: return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-800 border-green-200';
      case 'At Risk': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Behind': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const daysRemaining = getDaysRemaining(brand.estimated_delivery_date);
  const sortedTasks = [...brand.brand_tasks].sort((a, b) => a.task_order - b.task_order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{brand.brand_name}</h1>
            <p className="text-xl text-gray-600">Brand Development Progress</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                <span className="font-semibold text-gray-900">Client</span>
              </div>
              <p className="text-gray-700">{brand.client_name}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                <span className="font-semibold text-gray-900">Expected Launch</span>
              </div>
              <p className="text-gray-700">{formatDate(brand.estimated_delivery_date)}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                <span className="font-semibold text-gray-900">Timeline</span>
              </div>
              <p className={`font-semibold ${daysRemaining <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Progress</h2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge className={`${getStatusColor(brand.status)} text-lg px-4 py-2`}>
                {brand.status}
              </Badge>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className="font-bold">{completedTasks}/{totalTasks} completed</span>
              </div>
              <Progress value={progressPercentage} className="h-4" />
              <p className="text-sm text-gray-600 mt-2">{Math.round(progressPercentage)}% Complete</p>
            </div>
          </div>
        </div>

        {/* Task Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Development Milestones</h3>
          
          <div className="space-y-6">
            {sortedTasks.map((task, index) => (
              <div key={task.id} className="relative">
                {/* Timeline line */}
                {index < sortedTasks.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-purple-300 to-blue-300"></div>
                )}
                
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {getTaskIcon(task.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{task.task_name}</h4>
                          {task.completion_date && (
                            <p className="text-sm text-green-600 font-medium">
                              ✅ Completed on {formatDate(task.completion_date)}
                            </p>
                          )}
                          {task.notes && (
                            <p className="text-sm text-gray-600 mt-2 bg-white p-3 rounded-lg">
                              <strong>Note:</strong> {task.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <Badge 
                            variant="secondary" 
                            className={
                              task.status === 'Done' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-600'
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your Success is Our Mission</h3>
          <p className="text-gray-600">
            Our expert team is working diligently to bring your brand vision to life. 
            Each milestone represents hours of dedicated work and attention to detail.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {formatDate(brand.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
