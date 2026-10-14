import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import CourseArt from '../components/CourseArt.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLearning } from '../context/LearningContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { formatDate, formatMinutes } from '../utils/format.js';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
];

export default function MyLearning() {
  useDocumentTitle('My Learning');
  const { currentUser } = useAuth();
  const { enrolledCourses, getProgress, getResumeLesson, getCompletedLessonIds, markCourseComplete, resetProgress, unenroll } = useLearning();
  const [filter, setFilter] = useState('all');

  const items = useMemo(
    () =>
      enrolledCourses.map(({ course, enrollment }) => ({
        course,
        enrollment,
        progress: getProgress(course.id),
        resumeLesson: getResumeLesson(course.id),
      })),
    [enrolledCourses, getProgress, getResumeLesson],
  );

  const summary = useMemo(() => {
    const completedCourses = items.filter((item) => item.progress.isComplete).length;
    const lessonsDone = items.reduce((sum, item) => sum + item.progress.completed, 0);
    const minutesLearned = items.reduce((sum, item) => {
      const done = new Set(getCompletedLessonIds(item.course.id));
      return sum + item.course.lessons.filter((lesson) => done.has(lesson.id)).reduce((acc, lesson) => acc + lesson.minutes, 0);
    }, 0);
    return { completedCourses, lessonsDone, minutesLearned };
  }, [items, getCompletedLessonIds]);

  const visible = items.filter((item) => {
    if (filter === 'completed') return item.progress.isComplete;
    if (filter === 'in-progress') return !item.progress.isComplete;
    return true;
  });

  const handleRemove = (course) => {
    if (window.confirm(`Remove “${course.title}” from your learning? Your progress will be lost.`)) {
      unenroll(course.id);
    }
  };

  const firstName = currentUser.name.split(' ')[0];

  return (
    <div className="container page">
      <header className="page-header">
        <h1>My learning</h1>
        <p>Welcome back, {firstName}. Pick up where you left off.</p>
      </header>

      {items.length === 0 ? (
        <EmptyState icon="book" title="You haven't enrolled in any courses yet" message="Browse the catalog, enroll in a course and it will show up here with your progress.">
          <Link to="/courses" className="btn btn--primary">Browse courses</Link>
        </EmptyState>
      ) : (
        <>
          <div className="summary-grid">
            <div className="summary-card"><span>Enrolled courses</span><strong>{items.length}</strong></div>
            <div className="summary-card"><span>Completed</span><strong>{summary.completedCourses}</strong></div>
            <div className="summary-card"><span>Lessons finished</span><strong>{summary.lessonsDone}</strong></div>
            <div className="summary-card"><span>Time learned</span><strong>{formatMinutes(summary.minutesLearned)}</strong></div>
          </div>

          <div className="tabs" role="tablist" aria-label="Filter your courses">
            {filters.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={filter === option.id}
                className={`tab${filter === option.id ? ' is-active' : ''}`}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={filter === 'completed' ? 'trophy' : 'book'}
              title={filter === 'completed' ? 'No completed courses yet' : 'Nothing in progress'}
              message={filter === 'completed' ? 'Finish all lessons in a course and it will appear here.' : 'Everything you are enrolled in is complete. Time to find your next challenge!'}
            >
              <Link to="/courses" className="btn btn--secondary">Browse courses</Link>
            </EmptyState>
          ) : (
            <ul className="learning-list">
              {visible.map(({ course, enrollment, progress, resumeLesson }) => (
                <li key={course.id} className="learning-card">
                  <Link
                    to={`/courses/${course.id}`}
                    className="learning-card__thumb"
                    aria-label={`Open ${course.title}`}
                  >
                    <CourseArt thumbnail={course.thumbnail} size="md" />
                  </Link>

                  <div className="learning-card__body">
                    <div className="learning-card__top">
                      <div>
                        <span className="course-card__category">{course.category}</span>
                        <h2 className="learning-card__title"><Link to={`/courses/${course.id}`}>{course.title}</Link></h2>
                        <p className="learning-card__meta">
                          {course.instructor.name} · Enrolled {formatDate(enrollment.enrolledAt)}
                        </p>
                      </div>
                      {progress.isComplete && (
                        <span className="badge badge--success"><Icon name="trophy" size={13} /> Completed</span>
                      )}
                    </div>

                    <div className="learning-card__progress">
                      <ProgressBar value={progress.percent} label={`${course.title} progress`} tone={progress.isComplete ? 'success' : 'primary'} />
                      <span>{progress.percent}%</span>
                    </div>
                    <p className="learning-card__count">
                      {progress.completed} of {progress.total} lessons completed
                      {resumeLesson && <> · Next: <em>{resumeLesson.title}</em></>}
                    </p>

                    <div className="learning-card__actions">
                      {resumeLesson ? (
                        <Link to={`/courses/${course.id}?lesson=${resumeLesson.id}`} className="btn btn--primary btn--sm">
                          <Icon name="play" size={14} filled /> {progress.completed > 0 ? 'Resume' : 'Start'}
                        </Link>
                      ) : (
                        <Link to={`/courses/${course.id}`} className="btn btn--secondary btn--sm">Review course</Link>
                      )}
                      {progress.isComplete ? (
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => resetProgress(course.id)}>
                          <Icon name="refresh" size={14} /> Reset progress
                        </button>
                      ) : (
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => markCourseComplete(course.id)}>
                          <Icon name="check" size={14} /> Mark course complete
                        </button>
                      )}
                      <button type="button" className="btn btn--text btn--sm" onClick={() => handleRemove(course)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
