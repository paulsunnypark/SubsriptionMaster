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
  success: "border-success/20 bg-success-light/50 shadow-[var(--shadow-success)]",
  warning: "border-warning/20 bg-warning-light/50",
  danger: "border-danger/20 bg-danger-light/50 shadow-[var(--shadow-danger)]"
};

const iconVariantStyles = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning", 
  danger: "text-danger"
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
      "transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]",
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
                    ? "bg-success-light text-success" 
                    : "bg-danger-light text-danger"
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