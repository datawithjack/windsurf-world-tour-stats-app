import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  hero?: ReactNode;
}

/**
 * Standard page layout component
 * Provides consistent spacing and structure across all pages
 */
const PageLayout = ({ children, hero }: PageLayoutProps) => {
  return (
    <div className="min-h-screen pt-16">
      {hero && hero}
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
