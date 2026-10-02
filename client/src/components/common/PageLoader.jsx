const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark-950">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
        <div className="absolute inset-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">N</span>
        </div>
      </div>
      <p className="text-dark-500 dark:text-dark-400 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

export default PageLoader;
