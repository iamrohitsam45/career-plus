import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-indigo-500/20',
        gradient:
          'bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:shadow-indigo-500/40',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600 dark:hover:bg-red-600',
        outline:
          'border border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800/80 dark:hover:text-slate-50',
        link: 'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400',
        glass:
          'glass-panel text-slate-900 dark:text-white hover:bg-white/20 dark:hover:bg-slate-800/60 shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
