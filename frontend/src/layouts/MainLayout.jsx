import { Outlet } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Header */}
      <header className="border-b border-surface-200 bg-surface-50/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-surface-900 leading-none">OrderMS</h1>
              <p className="text-xs text-surface-500 leading-none mt-0.5">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-surface-400">
          Order Management System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
