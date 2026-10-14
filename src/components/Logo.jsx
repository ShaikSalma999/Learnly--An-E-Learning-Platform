import { Link } from 'react-router-dom';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo${light ? ' logo--light' : ''}`} aria-label="Learnly home">
      <span className="logo__mark" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 5v12a2 2 0 0 0 2 2h9" />
        </svg>
      </span>
      <span className="logo__text">Learnly</span>
    </Link>
  );
}
