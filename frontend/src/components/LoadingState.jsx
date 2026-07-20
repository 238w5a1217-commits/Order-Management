const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
    </div>
    <p className="text-slate-500 text-sm">Loading orders...</p>
  </div>
);

export default LoadingState;
