
import React from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isRounded?: boolean;
  withShadow?: boolean;
  withAnimation?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    isRounded = false, 
    withShadow = true,
    withAnimation = true,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          // Base styles - Neubrutalism style with border and shadow
          "relative inline-flex items-center justify-center font-bold transition-all border-2 border-black font-space-grotesk",
          
          // Size variants
          {
            'text-sm px-3 py-1': size === 'sm',
            'text-base px-5 py-2': size === 'md',
            'text-lg px-7 py-3': size === 'lg',
          },
          
          // Color variants with neubrutalism styling
          {
            'bg-doodle-yellow hover:bg-doodle-yellow-dark text-black': variant === 'primary',
            'bg-doodle-blue hover:bg-doodle-blue/90 text-white': variant === 'secondary',
            'bg-white hover:bg-gray-100 text-black': variant === 'outline',
            'bg-transparent hover:bg-gray-100 text-black': variant === 'ghost',
          },
          
          // Rounded variant - Neubrutalism typically uses minimal rounding
          isRounded ? 'rounded-xl' : 'rounded-md',
          
          // Shadow variant - Chunky offset shadow is key to neubrutalism
          withShadow && 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
          
          // Animation - Neubrutalism often has interactive shadows/translation
          withAnimation && 'hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none',
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export { CustomButton };
