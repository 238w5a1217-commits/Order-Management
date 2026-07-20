import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
      <AlertTriangle className="w-8 h-8 text-rose-500" />
    </div>
    <div className="text-center">
      <p className="text-surface-900 font-medium">Failed to load orders</p>
      <p className="text-surface-500 text-sm mt-1 max-w-xs">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary mt-2" id="retry-btn">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
