import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CourseCard from '../components/CourseCard.jsx';
import CategoryPills from '../components/CategoryPills.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { categories, courses } from '../data/mockData.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const sortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const sorters = {
  popular: (a, b) => b.students - a.students,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export default function Courses() {
  useDocumentTitle('Courses');
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const requestedCategory = searchParams.get('category');
  const category = categories.includes(requestedCategory) ? requestedCategory : 'All';
  const requestedSort = searchParams.get('sort');
  const sort = sorters[requestedSort] ? requestedSort : 'popular';

  /* Keep the URL in sync with the search box, but wait for the user to pause typing. */
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim();
      if ((searchParams.get('q') ?? '') === trimmed) return;
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (trimmed) next.set('q', trimmed);
          else next.delete('q');
          return next;
        },
        { replace: true },
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchParams, setSearchParams]);

  const updateParam = (key, value, defaultValue) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const categoryCounts = useMemo(() => {
    const counts = { All: courses.length };
    courses.forEach((course) => {
      counts[course.category] = (counts[course.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses
      .filter((course) => category === 'All' || course.category === category)
      .filter((course) => {
        if (!term) return true;
        const haystack = [course.title, course.instructor.name, course.category, course.shortDescription].join(' ').toLowerCase();
        return haystack.includes(term);
      })
      .sort(sorters[sort]);
  }, [query, category, sort]);

  const hasFilters = query.trim() !== '' || category !== 'All';

  const clearFilters = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="container page">
      <header className="page-header">
        <h1>Explore courses</h1>
        <p>Search our catalog and filter by topic to find the right fit.</p>
      </header>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" size={18} className="search__icon" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by course, topic or instructor"
            aria-label="Search courses"
          />
          {query && (
            <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
        <label className="select">
          <span className="visually-hidden">Sort courses</span>
          <select value={sort} onChange={(event) => updateParam('sort', event.target.value, 'popular')}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <CategoryPills
        categories={categories}
        active={category}
        counts={categoryCounts}
        onSelect={(next) => updateParam('category', next, 'All')}
      />

      <p className="results-count" aria-live="polite">
        {results.length} {results.length === 1 ? 'course' : 'courses'} found
        {category !== 'All' ? ` in ${category}` : ''}
        {query.trim() ? ` for “${query.trim()}”` : ''}
      </p>

      {results.length > 0 ? (
        <div className="course-grid">
          {results.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses match your search"
          message="Try a different keyword, check the spelling, or remove a filter to see more results."
        >
          {hasFilters && (
            <button type="button" className="btn btn--primary" onClick={clearFilters}>
              <Icon name="refresh" size={16} /> Clear all filters
            </button>
          )}
        </EmptyState>
      )}
    </div>
  );
}
