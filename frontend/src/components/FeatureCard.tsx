import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  headerAction?: ReactNode;
}

const FeatureCard = ({ title, children, isLoading = false, headerAction }: FeatureCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-inter)' }}>
          {title}
        </h3>
        {headerAction}
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      ) : (
        <div className="text-white">{children}</div>
      )}
    </motion.div>
  );
};

export default FeatureCard;
