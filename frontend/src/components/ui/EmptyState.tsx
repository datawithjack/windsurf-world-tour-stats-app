import { Search, FileX, AlertCircle, Users, Filter, RefreshCw } from 'lucide-react';

type EmptyStateVariant = 'no-results' | 'no-selection' | 'no-data' | 'error' | 'filtered';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  className?: string;
  onRetry?: () => void;
}

const variantConfig: Record<EmptyStateVariant, { icon: typeof Search; defaultTitle: string; defaultDescription: string }> = {
  'no-results': {
    icon: FileX,
    defaultTitle: 'No Results Available',
    defaultDescription: 'Results will appear here when available.',
  },
  'no-selection': {
    icon: Users,
    defaultTitle: 'Select an Item',
    defaultDescription: 'Make a selection to view details.',
  },
  'no-data': {
    icon: Search,
    defaultTitle: 'No Data Available',
    defaultDescription: 'Data is not available for this selection.',
  },
  'error': {
    icon: AlertCircle,
    defaultTitle: 'Something Went Wrong',
    defaultDescription: 'Unable to load data. Please try again.',
  },
  'filtered': {
    icon: Filter,
    defaultTitle: 'No Matches Found',
    defaultDescription: 'Try adjusting your filters.',
  },
};

const EmptyState = ({
  variant = 'no-data',
  title,
  description,
  className = '',
  onRetry,
}: EmptyStateProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/30 mb-4">
        <Icon size={24} className={variant === 'error' ? 'text-red-400' : 'text-gray-500'} />
      </div>
      <h3 className={`text-lg font-semibold mb-1 ${variant === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
        {displayTitle}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{displayDescription}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 transition-colors duration-200 text-sm font-medium"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default EmptyState;
