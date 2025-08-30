import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Target,
  ArrowRight
} from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app this would come from API
const dashboardStats = {
  monthly_total: 127.99,
  yearly_total: 1535.88,
  total_savings: 245.50,
  active_subscriptions: 12,
  at_risk_count: 3
};

const riskSubscriptions = [
  {
    id: '1',
    name: 'Netflix Premium',
    type: 'trial_ending' as const,
    days_left: 3,
    price: 15.99
  },
  {
    id: '2', 
    name: 'Spotify Premium',
    type: 'price_increase' as const,
    old_price: 9.99,
    new_price: 11.99
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    type: 'duplicate' as const,
    price: 52.99
  }
];

const recentSavings = [
  { name: 'Cancelled Unused VPN', amount: 39.99, type: 'cancel' },
  { name: 'Switched to Annual Plan', amount: 85.88, type: 'yearly' },
  { name: 'Paused Gym Membership', amount: 29.99, type: 'pause' }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your subscriptions and savings opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Monthly Total"
          value={`$${dashboardStats.monthly_total}`}
          icon={DollarSign}
          trend={{ value: -12.5, isPositive: false }}
        />
        <StatsCard
          title="Yearly Total"
          value={`$${dashboardStats.yearly_total}`}
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Total Savings"
          value={`$${dashboardStats.total_savings}`}
          icon={Target}
          variant="success"
          trend={{ value: 23.1, isPositive: true }}
        />
        <StatsCard
          title="At Risk"
          value={dashboardStats.at_risk_count}
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Risk Alerts */}
      <Card className="border-warning/20 bg-warning-light/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-warning">Action Required</CardTitle>
              <CardDescription>
                {dashboardStats.at_risk_count} subscriptions need your attention
              </CardDescription>
            </div>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskSubscriptions.map((sub) => (
            <div 
              key={sub.id}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center space-x-3">
                <RiskBadge type={sub.type} />
                <div>
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {sub.type === 'trial_ending' && `Ends in ${sub.days_left} days`}
                    {sub.type === 'price_increase' && `$${sub.old_price} → $${sub.new_price}`}
                    {sub.type === 'duplicate' && `$${sub.price}/month`}
                  </p>
                </div>
              </div>
              <Button size="sm">
                Take Action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Savings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Savings</CardTitle>
            <CardDescription>Money saved in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSavings.map((saving, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{saving.name}</p>
                  <Badge 
                    variant={saving.type === 'cancel' ? 'danger' : 'success'}
                    className="mt-1"
                  >
                    {saving.type === 'cancel' ? 'Cancelled' : 
                     saving.type === 'yearly' ? 'Annual Switch' : 'Paused'}
                  </Badge>
                </div>
                <p className="font-bold text-success">+${saving.amount}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Bills */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Spotify Premium</p>
                  <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                </div>
              </div>
              <p className="font-bold">$11.99</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Netflix Premium</p>
                  <p className="text-sm text-muted-foreground">Dec 18, 2024</p>
                </div>
              </div>
              <p className="font-bold">$15.99</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Adobe Creative Cloud</p>
                  <p className="text-sm text-muted-foreground">Dec 20, 2024</p>
                </div>
              </div>
              <p className="font-bold">$52.99</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}