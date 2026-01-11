import type { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  centered?: boolean;
}

/**
 * Reusable hero section component
 * Matches the design system established in the landing page
 *
 * @param title - Large Bebas Neue heading
 * @param subtitle - Optional smaller heading above title
 * @param description - Optional tagline/description (Inter font)
 * @param icon - Optional icon to display with title
 * @param centered - Set to true for centered layout (default: left-aligned)
 */
const PageHero = ({
  title,
  subtitle,
  description,
  icon,
  centered = false
}: PageHeroProps) => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className={`max-w-4xl ${centered ? 'mx-auto text-center' : ''}`}>
          {subtitle && (
            <p className="text-sm md:text-base text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
              {subtitle}
            </p>
          )}

          <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
            {icon && <div className="text-cyan-400">{icon}</div>}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
              {title}
            </h1>
          </div>

          {description && (
            <p className={`text-base md:text-lg text-gray-300 ${centered ? 'mx-auto max-w-3xl' : ''}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
