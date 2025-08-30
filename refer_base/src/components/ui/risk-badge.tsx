import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RiskType = 'trial_ending' | 'price_increase' | 'duplicate' | 'unused' | 'ghost';

interface RiskBadgeProps {
  type: RiskType;
  className?: string;
}

const riskConfig = {
  trial_ending: {
    label: 'Trial Ending',
    variant: 'warning' as const,
    className: 'bg-warning-light text-warning border-warning/20'
  },
  price_increase: {
    label: 'Price Increase',
    variant: 'danger' as const,
    className: 'bg-danger-light text-danger border-danger/20'
  },
  duplicate: {
    label: 'Duplicate',
    variant: 'warning' as const,
    className: 'bg-warning-light text-warning border-warning/20'
  },
  unused: {
    label: 'Unused',
    variant: 'secondary' as const,
    className: 'bg-muted text-muted-foreground border-border'
  },
  ghost: {
    label: 'Ghost Sub',
    variant: 'secondary' as const,
    className: 'bg-muted text-muted-foreground border-border'
  }
};

export function RiskBadge({ type, className }: RiskBadgeProps) {
  const config = riskConfig[type];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}