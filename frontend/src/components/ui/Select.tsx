import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  size?: 'default' | 'sm';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      default: 'px-4 py-2 text-sm rounded-md focus:ring-2',
      sm: 'px-2 py-1 text-xs rounded focus:ring-1',
    };

    return (
      <select
        ref={ref}
        className={`
          bg-slate-800/60
          border border-slate-700/50
          text-gray-300
          focus:outline-none
          focus:ring-cyan-500/50
          focus:border-cyan-500/50
          transition-all
          ${sizeClasses[size]}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
