
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Phone, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import TaskList from './TaskList';

interface Brand {
  id: string;
  client_name: string;
  client_phone: string;
  brand_name: string;
  assigned_team_member: string;
  start_date: string;
  estimated_delivery_date: string;
  status: string;
  notes?: string;
  brand_tasks: Array<{
    id: string;
    task_name: string;
    task_order: number;
    status: string;
    completion_date?: string;
    notes?: string;
  }>;
}

interface BrandCardProps {
  brand: Brand;
  onUpdate: () => void;
}

const BrandCard = ({ brand, onUpdate }: BrandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getDaysRemaining = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-800 border-green-200';
      case 'At Risk': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Behind': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedTasks = brand.brand_tasks.filter(task => task.status === 'Done').length;
  const totalTasks = brand.brand_tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const daysRemaining = getDaysRemaining(brand.estimated_delivery_date);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCardBorderColor = () => {
    if (daysRemaining <= 10 || brand.status === 'Behind') return 'border-red-300';
    if (brand.status === 'At Risk') return 'border-orange-300';
    return 'border-gray-200';
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${getCardBorderColor()} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{brand.brand_name}</h3>
            <p className="text-gray-600 text-sm">{brand.client_name}</p>
          </div>
          <Badge className={getStatusColor(brand.status)}>
            {brand.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <a href={`https://wa.me/${brand.client_phone.replace(/[^\d]/g, '')}`} 
               className="hover:text-purple-600 transition-colors">
              {brand.client_phone}
            </a>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {brand.assigned_team_member}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Started: {formatDate(brand.start_date)}
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span className={daysRemaining <= 10 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{completedTasks}/{totalTasks} tasks</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Due: {formatDate(brand.estimated_delivery_date)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 hover:text-purple-700"
            >
              {isExpanded ? (
                <>Hide Tasks <ChevronUp className="h-4 w-4 ml-1" /></>
              ) : (
                <>View Tasks <ChevronDown className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </div>

          {isExpanded && (
            <div className="mt-4 border-t pt-4">
              <TaskList brandId={brand.id} tasks={brand.brand_tasks} onUpdate={onUpdate} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
