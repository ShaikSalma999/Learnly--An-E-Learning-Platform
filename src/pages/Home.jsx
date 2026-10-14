import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CourseCard from '../components/CourseCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import CourseArt from '../components/CourseArt.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { categories, categoryMeta, courses, testimonials } from '../data/mockData.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { formatCount } from '../utils/format.js';

const benefits = [
  { icon: 'users', title: 'Expert instructors', text: 'Learn from practitioners who work in the field every day, not just academics.' },
  { icon: 'clock', title: 'Learn at your pace', text: 'Short, focused lessons you can fit around work, study or family life.' },
  { icon: 'trophy', title: 'Track every win', text: 'See progress on every course and pick up exactly where you left off.' },
  { icon: 'globe', title: 'Lifetime access', text: 'Enroll once and revisit the material whenever you need a refresher.' },
];

function FeaturedCarousel({ items }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      atStart: track.scrollLeft <= 4,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges]);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    const step = firstCard ? firstCard.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <div className="carousel__controls">
        <button type="button" className="icon-btn" onClick={() => scrollByCard(-1)} disabled={edges.atStart} aria-label="Previous courses">
          <Icon name="chevronLeft" size={20} />
        </button>
        <button type="button" className="icon-btn" onClick={() => scrollByCard(1)} disabled={edges.atEnd} aria-label="Next courses">
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
      <div className="carousel__track" ref={trackRef} onScroll={updateEdges}>
        {items.map((course) => (
          <div className="carousel__item" key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useDocumentTitle('');
  const { currentUser } = useAuth();

  const featured = useMemo(() => courses.filter((course) => course.featured), []);
  const stats = useMemo(() => {
    const learners = courses.reduce((sum, course) => sum + course.students, 0);
    const instructors = new Set(courses.map((course) => course.instructor.name)).size;
    const averageRating = courses.reduce((sum, course) => sum + course.rating, 0) / courses.length;
    return [
      { value: `${courses.length}`, label: 'Expert-led courses' },
      { value: `${formatCount(learners)}+`, label: 'Learners enrolled' },
      { value: `${instructors}`, label: 'Industry instructors' },
      { value: averageRating.toFixed(1), label: 'Average course rating' },
    ];
  }, []);

  const categoryCounts = useMemo(
    () =>
      categories
        .filter((category) => category !== 'All')
        .map((category) => ({
          name: category,
          count: courses.filter((course) => course.category === category).length,
          ...categoryMeta[category],
        })),
    [],
  );

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">New learning paths for 2026</span>
            <h1>
              Learn in-demand skills at <span className="text-gradient">your own pace</span>
            </h1>
            <p className="hero__lead">
              Join thousands of learners building careers in web development, data science, design and business with practical,
              project-based courses.
            </p>
            <div className="hero__actions">
              <Link to="/courses" className="btn btn--primary btn--lg">
                Explore courses <Icon name="arrowRight" size={18} />
              </Link>
              {currentUser ? (
                <Link to="/my-learning" className="btn btn--secondary btn--lg">Continue learning</Link>
              ) : (
                <Link to="/register" className="btn btn--secondary btn--lg">Create free account</Link>
              )}
            </div>
            <ul className="hero__proof">
              <li><Icon name="check" size={16} /> Free course included</li>
              <li><Icon name="check" size={16} /> Lifetime access</li>
              <li><Icon name="check" size={16} /> Progress tracking</li>
            </ul>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero-card hero-card--main">
              <span className="hero-card__label">Continue learning</span>
              <strong>Complete React Developer Bootcamp</strong>
              <div className="hero-card__row">
                <ProgressBar value={68} label="Sample progress" />
                <span>68%</span>
              </div>
              <span className="hero-card__meta">Lesson 7 of 10 · 24 min left</span>
            </div>
            <div className="hero-card hero-card--float hero-card--top">
              <Icon name="star" size={18} filled className="rating__star" />
              <div>
                <strong>4.8 / 5</strong>
                <span>Average rating</span>
              </div>
            </div>
            <div className="hero-card hero-card--float hero-card--bottom">
              <Icon name="award" size={20} />
              <div>
                <strong>Course completed</strong>
                <span>Certificate ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Platform statistics">
        <div className="container stats__grid">
          {stats.map((stat) => (
            <div className="stats__item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header section__header--split">
            <div>
              <h2>Featured courses</h2>
              <p>Hand-picked by our team and loved by learners.</p>
            </div>
            <Link to="/courses" className="link-arrow">View all courses <Icon name="arrowRight" size={16} /></Link>
          </div>
          <FeaturedCarousel items={featured} />
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container">
          <div className="section__header">
            <h2>Browse by category</h2>
            <p>Find the learning path that fits where you want to go next.</p>
          </div>
          <div className="category-grid">
            {categoryCounts.map((category) => (
              <Link key={category.name} to={`/courses?category=${encodeURIComponent(category.name)}`} className="category-card">
                <span className="category-card__art">
                  <CourseArt thumbnail={category.thumbnail} size="sm" />
                </span>
                <h3>{category.name}</h3>
                <p>{category.blurb}</p>
                <span className="category-card__count">{category.count} courses</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2>Why learners choose Learnly</h2>
            <p>Everything you need to stay motivated and finish what you start.</p>
          </div>
          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <div className="benefit" key={benefit.title}>
                <span className="benefit__icon"><Icon name={benefit.icon} size={22} /></span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container">
          <div className="section__header">
            <h2>Stories from our learners</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <figure className="testimonial" key={testimonial.id}>
                <blockquote>“{testimonial.quote}”</blockquote>
                <figcaption>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2>Ready to start learning?</h2>
              <p>Create a free account and enroll in your first course in under a minute.</p>
            </div>
            <Link to={currentUser ? '/courses' : '/register'} className="btn btn--light btn--lg">
              {currentUser ? 'Find your next course' : 'Get started free'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
