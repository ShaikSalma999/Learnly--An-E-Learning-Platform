import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { categories } from '../data/mockData.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>Practical, expert-led courses that help you learn at your own pace and build a career you are proud of.</p>
        </div>
        <nav className="footer__col" aria-label="Explore">
          <h4>Explore</h4>
          <Link to="/courses">All courses</Link>
          <Link to="/my-learning">My learning</Link>
          <Link to="/register">Create account</Link>
        </nav>
        <nav className="footer__col" aria-label="Categories">
          <h4>Categories</h4>
          {categories.filter((category) => category !== 'All').map((category) => (
            <Link key={category} to={`/courses?category=${encodeURIComponent(category)}`}>{category}</Link>
          ))}
        </nav>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Learnly. Built as a front-end demo.</span>
      </div>
    </footer>
  );
}
