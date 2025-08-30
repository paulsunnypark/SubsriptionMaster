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
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  price_increase: {
    label: 'Price Increase',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  duplicate: {
    label: 'Duplicate',
    variant: 'secondary' as const,
    className: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  unused: {
    label: 'Unused',
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  ghost: {
    label: 'Ghost Sub',
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 border-gray-200'
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
