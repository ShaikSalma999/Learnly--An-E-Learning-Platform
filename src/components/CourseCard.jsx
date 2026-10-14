import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Rating from './Rating.jsx';
import ProgressBar from './ProgressBar.jsx';
import CourseArt from './CourseArt.jsx';
import { useLearning } from '../context/LearningContext.jsx';
import { formatMinutes, formatPrice } from '../utils/format.js';

export default function CourseCard({ course }) {
  const { isEnrolled, getProgress } = useLearning();
  const enrolled = isEnrolled(course.id);
  const progress = enrolled ? getProgress(course.id) : null;

  return (
    <article className="course-card">
      <Link to={`/courses/${course.id}`} className="course-card__link" aria-label={`View ${course.title}`}>
        <div className="course-card__thumb">
          <CourseArt thumbnail={course.thumbnail} size="lg" />
          <span className="badge badge--light course-card__level">{course.level}</span>
          {enrolled && (
            <span className="badge badge--success course-card__enrolled">
              <Icon name="check" size={13} /> {progress.isComplete ? 'Completed' : 'Enrolled'}
            </span>
          )}
        </div>
        <div className="course-card__body">
          <span className="course-card__category">{course.category}</span>
          <h3 className="course-card__title">{course.title}</h3>
          <p className="course-card__instructor">{course.instructor.name}</p>
          <Rating value={course.rating} count={course.reviews} />
          <ul className="course-card__meta">
            <li><Icon name="clock" size={15} /> {formatMinutes(course.totalMinutes)}</li>
            <li><Icon name="layers" size={15} /> {course.lessons.length} lessons</li>
          </ul>
          {enrolled ? (
            <div className="course-card__progress">
              <ProgressBar value={progress.percent} label={`${course.title} progress`} tone={progress.isComplete ? 'success' : 'primary'} />
              <span>{progress.percent}% complete</span>
            </div>
          ) : (
            <div className="course-card__price">
              <strong>{formatPrice(course.price)}</strong>
              {course.originalPrice > course.price && <s>{formatPrice(course.originalPrice)}</s>}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
