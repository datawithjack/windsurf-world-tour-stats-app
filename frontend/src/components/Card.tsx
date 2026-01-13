import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * Reusable card component matching the design system
 * Uses frosted glass effect with dark background and cyan accent on hover
 *
 * @param hoverable - Adds hover effects (default: true)
 * @param clickable - Makes card appear clickable with cursor pointer
 * @param onClick - Click handler for interactive cards
 */
const Card = ({
  children,
  className = '',
  hoverable = true,
  clickable = false,
  onClick
}: CardProps) => {
  const prefersReducedMotion = useReducedMotion();

  const hoverClasses = hoverable
    ? 'hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
    : '';

  const clickableClasses = clickable || onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
      onClick={onClick}
      className={`
        bg-slate-800/40
        backdrop-blur-sm
        border border-slate-700/50
        rounded-lg
        p-6
        transition-all duration-300
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
