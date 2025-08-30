import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetailedAddForm } from "@/components/ui/detailed-add-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock subscription data
const subscriptions = [
  {
    id: '1',
    name: 'Netflix Premium',
    category: 'Entertainment',
    price: 15.99,
    cycle: 'monthly',
    next_bill: '2024-12-18',
    status: 'active',
    badges: ['trial_ending']
  },
  {
    id: '2',
    name: 'Spotify Premium',
    category: 'Entertainment', 
    price: 11.99,
    cycle: 'monthly',
    next_bill: '2024-12-15',
    status: 'active',
    badges: ['price_increase']
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    category: 'Design',
    price: 52.99,
    cycle: 'monthly',
    next_bill: '2024-12-20',
    status: 'active',
    badges: ['duplicate']
  },
  {
    id: '4',
    name: 'GitHub Pro',
    category: 'Development',
    price: 4.00,
    cycle: 'monthly',
    next_bill: '2024-12-22',
    status: 'active',
    badges: []
  },
  {
    id: '5',
    name: 'Dropbox Plus',
    category: 'Storage',
    price: 9.99,
    cycle: 'monthly',
    next_bill: '2024-12-25',
    status: 'paused',
    badges: []
  }
];

export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'paused':
        return <Badge variant="warning">Paused</Badge>;
      case 'canceled':
        return <Badge variant="danger">Canceled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage all your recurring subscriptions
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subscriptions</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscription Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.map((subscription) => (
          <Card key={subscription.id} className="hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{subscription.name}</CardTitle>
                  <CardDescription>{subscription.category}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Pause</DropdownMenuItem>
                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Price and Cycle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${subscription.price}</p>
                    <p className="text-sm text-muted-foreground">per {subscription.cycle.replace('ly', '')}</p>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>

                {/* Next Bill Date */}
                <div>
                  <p className="text-sm font-medium">Next Bill</p>
                  <p className="text-sm text-muted-foreground">{formatDate(subscription.next_bill)}</p>
                </div>

                {/* Risk Badges */}
                {subscription.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subscription.badges.map((badge, index) => (
                      <RiskBadge key={index} type={badge as any} />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No subscriptions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first subscription'}
                </p>
              </div>
              {!searchTerm && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Subscription Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
          </DialogHeader>
          <DetailedAddForm 
            onSuccess={() => {
              setShowAddModal(false);
              // TODO: Refresh subscription list or add to local state
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}