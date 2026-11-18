import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-nowrap',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/80 text-primary-foreground hover:bg-primary/60',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/60',
      },
      size: {
        default: 'px-2 py-0.5 text-xs',
        sm: 'px-1 py-0 text-[10px]',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({className, variant, size, ...props}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({variant, size}), className)} {...props} />
  );
}

export {Badge, badgeVariants};
