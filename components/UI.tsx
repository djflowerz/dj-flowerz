import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-flowerz-purple to-flowerz-blue text-white hover:opacity-90 shadow-[0_0_20px_rgba(123,92,255,0.3)]',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/5',
    outline: 'border border-flowerz-blue/50 text-flowerz-blue hover:bg-flowerz-blue/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        'rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export const Section = ({ className, children, id, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <section id={id} className={cn('py-20 px-4 max-w-7xl mx-auto', className)} {...props}>
    {children}
  </section>
);

export const GlassCard = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('glass-card rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1', className)} {...props}>
    {children}
  </div>
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    color?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
    className?: string;
    children?: React.ReactNode;
}

export const Badge = ({ children, color = 'blue', className, ...props }: BadgeProps) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-semibold border', colors[color], className)} {...props}>
      {children}
    </span>
  );
};

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        className={cn("w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-flowerz-blue focus:ring-1 focus:ring-flowerz-blue transition-all", className)}
        {...props}
    />
)

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={cn("block text-sm font-medium text-gray-300 mb-1", className)} {...props}>{children}</label>
)

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    image?: string;
    className?: string;
}

export const PageHeader = ({ title, subtitle, image, className, ...props }: PageHeaderProps) => (
    <div className={cn("relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden", className)} {...props}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/80 to-transparent z-10"></div>
            <img 
                src={image || "https://picsum.photos/1920/1080?blur=4"} 
                alt="Header" 
                className="w-full h-full object-cover opacity-60"
            />
        </div>
        
        <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 animate-fade-in-up">
                {title}
            </h1>
            {subtitle && (
                <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-100">
                    {subtitle}
                </p>
            )}
        </div>
    </div>
)