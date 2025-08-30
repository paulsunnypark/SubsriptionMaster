import { useState } from "react";
import { Bell, Clock, CheckCircle, X, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock alerts data
const alerts = [
  {
    id: '1',
    type: 'trial_d3',
    title: 'Trial ending soon',
    description: 'Your Netflix Premium trial ends in 3 days',
    created_at: '2024-12-10T10:00:00Z',
    read_at: null,
    priority: 'high',
    subscription: 'Netflix Premium',
    action_needed: true
  },
  {
    id: '2',
    type: 'price_up',
    title: 'Price increase detected',
    description: 'Spotify Premium will increase from $9.99 to $11.99 next month',
    created_at: '2024-12-09T15:30:00Z',
    read_at: null,
    priority: 'medium',
    subscription: 'Spotify Premium',
    action_needed: true
  },
  {
    id: '3',
    type: 'duplicate',
    title: 'Duplicate subscription found',
    description: 'You have two active Adobe Creative Cloud subscriptions',
    created_at: '2024-12-08T09:15:00Z',
    read_at: '2024-12-08T14:20:00Z',
    priority: 'medium',
    subscription: 'Adobe Creative Cloud',
    action_needed: true
  },
  {
    id: '4',
    type: 'unused_seat',
    title: 'Unused team seats',
    description: 'You have 3 unused seats in your Slack workspace',
    created_at: '2024-12-07T11:45:00Z',
    read_at: null,
    priority: 'low',
    subscription: 'Slack Pro',
    action_needed: false
  }
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'trial_d3':
      return <Clock className="h-4 w-4" />;
    case 'price_up':
      return <TrendingUp className="h-4 w-4" />;
    case 'duplicate':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="danger">High Priority</Badge>;
    case 'medium':
      return <Badge variant="warning">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export default function Alerts() {
  const [selectedTab, setSelectedTab] = useState('all');
  
  const unreadAlerts = alerts.filter(alert => !alert.read_at);
  const readAlerts = alerts.filter(alert => alert.read_at);
  const actionNeededAlerts = alerts.filter(alert => alert.action_needed);

  const getAlertsForTab = (tab: string) => {
    switch (tab) {
      case 'unread':
        return unreadAlerts;
      case 'read':
        return readAlerts;
      case 'action':
        return actionNeededAlerts;
      default:
        return alerts;
    }
  };

  const currentAlerts = getAlertsForTab(selectedTab);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">
            Stay informed about your subscription changes and opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-danger-light rounded-lg">
                <Bell className="h-4 w-4 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unreadAlerts.length}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning-light rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{actionNeededAlerts.length}</p>
                <p className="text-sm text-muted-foreground">Action Needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success-light rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{readAlerts.length}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadAlerts.length})</TabsTrigger>
          <TabsTrigger value="action">Action Needed ({actionNeededAlerts.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({readAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {currentAlerts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No alerts</h3>
                    <p className="text-muted-foreground">
                      You're all caught up! No {selectedTab} alerts at the moment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            currentAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`transition-all hover:shadow-[var(--shadow-card-hover)] ${
                  !alert.read_at ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        alert.priority === 'high' ? 'bg-danger-light' :
                        alert.priority === 'medium' ? 'bg-warning-light' : 'bg-muted'
                      }`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription>{alert.description}</CardDescription>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatRelativeTime(alert.created_at)}</span>
                          <span>•</span>
                          <span>{alert.subscription}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(alert.priority)}
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {alert.action_needed && (
                  <CardContent className="pt-0">
                    <div className="flex items-center space-x-2">
                      <Button size="sm">Take Action</Button>
                      <Button variant="outline" size="sm">Dismiss</Button>
                      {!alert.read_at && (
                        <Button variant="ghost" size="sm">Mark as Read</Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}