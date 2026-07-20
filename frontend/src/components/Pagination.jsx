import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
      <p className="text-xs text-surface-500">
        Showing <span className="text-surface-900 font-medium">{from}–{to}</span> of{' '}
        <span className="text-surface-900 font-medium">{total}</span> orders
      </p>

      <div className="flex items-center gap-1">
        <button
          id="prev-page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-500
                     hover:bg-surface-100 hover:text-surface-900 disabled:opacity-30
                     disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {start > 1 && (
          <>
            <PageBtn p={1} current={page} onClick={onPageChange} />
            {start > 2 && <span className="text-surface-400 text-sm px-1">…</span>}
          </>
        )}

        {pages.map((p) => (
          <PageBtn key={p} p={p} current={page} onClick={onPageChange} />
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-surface-400 text-sm px-1">…</span>}
            <PageBtn p={totalPages} current={page} onClick={onPageChange} />
          </>
        )}

        <button
          id="next-page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-500
                     hover:bg-surface-100 hover:text-surface-900 disabled:opacity-30
                     disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PageBtn = ({ p, current, onClick }) => (
  <button
    id={`page-btn-${p}`}
    onClick={() => onClick(p)}
    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      p === current
        ? 'bg-brand-600 text-white'
        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
    }`}
  >
    {p}
  </button>
);

export default Pagination;
