import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'ATHLETES', path: '/athletes', disabled: false },
    { name: 'HEAD TO HEADS', path: '/head-to-heads', disabled: false },
    { name: 'EVENTS', path: '/events', disabled: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Home Button */}
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-800/50"
            aria-label="Home"
          >
            <Home size={22} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              item.disabled ? (
                <span
                  key={item.name}
                  className="text-sm text-gray-500 cursor-not-allowed"
                  title="Coming soon"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              item.disabled ? (
                <span
                  key={item.name}
                  className="block py-2 text-sm text-gray-500 cursor-not-allowed"
                  title="Coming soon"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
