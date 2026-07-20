import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
    <div className="text-center">
      <p className="text-8xl font-black text-surface-700">404</p>
      <h2 className="text-2xl font-bold text-white mt-2">Page Not Found</h2>
      <p className="text-slate-500 mt-2">The page you are looking for does not exist.</p>
    </div>
    <Link to="/" className="btn-primary" id="go-home-btn">
      Go to Dashboard
    </Link>
  </div>
);

export default NotFound;
