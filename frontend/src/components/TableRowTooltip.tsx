import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface TableRowTooltipProps {
  children: ReactNode;
  content: string;
  className?: string;
}

const TableRowTooltip = ({ children, content, className = '' }: TableRowTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setIsVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <tr
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </tr>
      {isVisible && createPortal(
        <div
          className="fixed z-50 bg-slate-800/95 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{
            left: `${position.x + 10}px`,
            top: `${position.y - 35}px`,
          }}
        >
          <p className="text-xs text-gray-300 whitespace-nowrap">{content}</p>
        </div>,
        document.body
      )}
    </>
  );
};

export default TableRowTooltip;
