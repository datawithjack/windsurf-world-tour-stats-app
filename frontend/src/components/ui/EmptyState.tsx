import { Search, FileX, AlertCircle, Users, Filter } from 'lucide-react';

type EmptyStateVariant = 'no-results' | 'no-selection' | 'no-data' | 'error' | 'filtered';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  className?: string;
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
}: EmptyStateProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/30 mb-4">
        <Icon size={24} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-400 mb-1">{displayTitle}</h3>
      <p className="text-sm text-gray-500">{displayDescription}</p>
    </div>
  );
};

export default EmptyState;
