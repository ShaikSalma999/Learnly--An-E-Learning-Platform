import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="container page">
      <EmptyState icon="alert" title="404 – Page not found" message="The page you're looking for doesn't exist or has been moved.">
        <Link to="/" className="btn btn--primary">Back to home</Link>
        <Link to="/courses" className="btn btn--secondary">Browse courses</Link>
      </EmptyState>
    </div>
  );
}
