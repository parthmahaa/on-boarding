// components/ui/Breadcrumbs.tsx
import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  
  // uses route to diplay dashboard > next path
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
        </li>
        {segments.map((segment, index) => {
          const path = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="mx-2" size={16} />
              {isLast ? (
                <span className="font-semibold">{label}</span>
              ) : (
                <Link to={path} className="text-blue-600 hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
