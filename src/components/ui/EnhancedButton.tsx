import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

const enhancedButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline',
        premium: 'bg-gradient-to-r from-academy-blue to-academy-purple text-white hover:shadow-lg hover:shadow-academy-blue/25 active:scale-95 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10'
      },
      animation: {
        none: '',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
        wiggle: 'hover:animate-wiggle',
        glow: 'hover:shadow-lg hover:shadow-current/25'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none'
    }
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  hapticFeedback?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    loadingText,
    hapticFeedback = true,
    icon,
    rightIcon,
    children,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const { getAnimationClasses } = useAccessibility();
    const { triggerFeedback, touchHandlers } = useTouchFeedback({
      haptic: hapticFeedback,
      visual: true
    });

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      
      triggerFeedback();
      onClick?.(e);
    }, [loading, disabled, triggerFeedback, onClick]);

    const buttonContent = React.useMemo(() => {
      if (loading) {
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            {loadingText || 'Loading...'}
          </>
        );
      }

      return (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      );
    }, [loading, loadingText, icon, children, rightIcon]);

    return (
      <Comp
        className={cn(
          enhancedButtonVariants({ variant, size, animation, className }),
          getAnimationClasses('transform transition-all duration-200'),
          loading && 'cursor-wait'
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...touchHandlers}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export { EnhancedButton, enhancedButtonVariants };