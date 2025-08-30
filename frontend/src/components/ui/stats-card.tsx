import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: "border-border bg-card",
  success: "border-green-200 bg-green-50",
  warning: "border-yellow-200 bg-yellow-50",
  danger: "border-red-200 bg-red-50"
};

const iconVariantStyles = {
  default: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600", 
  danger: "text-red-600"
};

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-card-foreground">{value}</p>
              {trend && (
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  trend.isPositive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-lg bg-background/80",
            iconVariantStyles[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
