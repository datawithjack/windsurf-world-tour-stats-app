import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Reusable section component with consistent spacing
 *
 * @param containerSize - Controls max-width: sm(640px), md(768px), lg(1024px), xl(1280px), full(100%)
 */
const Section = ({ children, className = '', containerSize = 'xl' }: SectionProps) => {
  const containerClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-12 md:py-16 ${className}`}>
      <div className={`${containerClasses[containerSize]} mx-auto`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
