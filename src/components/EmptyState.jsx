import { Inbox } from 'lucide-react';

const EmptyState = ({ hasFilters }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center">
      <Inbox className="w-8 h-8 text-surface-400" />
    </div>
    <div className="text-center">
      <p className="text-surface-900 font-medium">
        {hasFilters ? 'No orders match your filters' : 'No orders yet'}
      </p>
      <p className="text-surface-500 text-sm mt-1">
        {hasFilters
          ? 'Try adjusting your search or filter criteria'
          : 'Orders will appear here once they are created via the API'}
      </p>
    </div>
  </div>
);

export default EmptyState;
