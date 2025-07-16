
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Search } from 'lucide-react';
import BrandCard from '@/components/dashboard/BrandCard';
import AddBrandModal from '@/components/dashboard/AddBrandModal';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamMemberFilter, setTeamMemberFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: brands = [], isLoading, refetch } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select(`
          *,
          brand_tasks (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || brand.status === statusFilter;
    const matchesTeamMember = teamMemberFilter === 'all' || brand.assigned_team_member === teamMemberFilter;
    
    return matchesSearch && matchesStatus && matchesTeamMember;
  });

  const uniqueTeamMembers = [...new Set(brands.map(brand => brand.assigned_team_member))];

  const getDaysRemaining = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const priorityBrands = filteredBrands.filter(brand => {
    const daysRemaining = getDaysRemaining(brand.estimated_delivery_date);
    return daysRemaining <= 10 || brand.status === 'Behind';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Delivery Dashboard</h1>
              <p className="text-gray-600 mt-1">Track client brand progress from start to launch</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Brand
            </Button>
          </div>
        </div>

        {/* Priority Alerts */}
        {priorityBrands.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Urgent Attention Needed</h3>
            <p className="text-red-700">
              {priorityBrands.length} brand(s) need immediate attention (≤10 days remaining or behind schedule)
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search by client or brand name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="On Track">On Track</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
              <SelectItem value="Behind">Behind</SelectItem>
            </SelectContent>
          </Select>
          <Select value={teamMemberFilter} onValueChange={setTeamMemberFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {uniqueTeamMembers.map(member => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Brands</h3>
            <p className="text-2xl font-bold text-gray-900">{brands.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">On Track</h3>
            <p className="text-2xl font-bold text-green-600">
              {brands.filter(b => b.status === 'On Track').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">At Risk</h3>
            <p className="text-2xl font-bold text-orange-500">
              {brands.filter(b => b.status === 'At Risk').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Behind</h3>
            <p className="text-2xl font-bold text-red-600">
              {brands.filter(b => b.status === 'Behind').length}
            </p>
          </div>
        </div>

        {/* Brand Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} onUpdate={refetch} />
            ))}
          </div>
        )}

        {/* Add Brand Modal */}
        <AddBrandModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            refetch();
            toast({
              title: "Brand Added",
              description: "New brand has been added successfully with all tasks created.",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
