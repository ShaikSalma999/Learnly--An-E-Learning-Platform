import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Rating from '../components/Rating.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import CourseArt from '../components/CourseArt.jsx';
import CurriculumAccordion from '../components/CurriculumAccordion.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLearning } from '../context/LearningContext.jsx';
import { getCourseById } from '../data/mockData.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { formatCount, formatMinutes, formatPrice, getInitials } from '../utils/format.js';

function CourseDetailsContent({ courseId }) {
  const course = getCourseById(courseId);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { isEnrolled, enroll, unenroll, toggleLesson, getProgress, getResumeLesson, getCompletedLessonIds } = useLearning();

  const focusLessonId = searchParams.get('lesson');

  const [openModules, setOpenModules] = useState(() => {
    const focusModule = course?.modules.find((module) => module.lessons.some((lesson) => lesson.id === focusLessonId));
    return new Set([focusModule?.id ?? course?.modules[0]?.id].filter(Boolean));
  });
  const [notice, setNotice] = useState('');

  useDocumentTitle(course ? course.title : 'Course not found');

  /* When arriving from "Resume", open the matching module and bring the lesson into view. */
  useEffect(() => {
    if (!course || !focusLessonId) return undefined;
    const owner = course.modules.find((module) => module.lessons.some((lesson) => lesson.id === focusLessonId));
    if (!owner) return undefined;
    setOpenModules((previous) => new Set(previous).add(owner.id));
    const timer = setTimeout(() => {
      document.getElementById(`lesson-${focusLessonId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
    return () => clearTimeout(timer);
  }, [course, focusLessonId]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const completedIds = useMemo(() => new Set(getCompletedLessonIds(courseId)), [getCompletedLessonIds, courseId]);

  if (!course) {
    return (
      <div className="container page">
        <EmptyState icon="alert" title="We couldn't find that course" message="It may have been removed, or the link might be incorrect.">
          <Link to="/courses" className="btn btn--primary">Browse all courses</Link>
        </EmptyState>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = getProgress(course.id);
  const resumeLesson = getResumeLesson(course.id);
  const allOpen = openModules.size === course.modules.length;
  const discount = course.originalPrice > course.price
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login', {
        state: { from: location, message: 'Log in or create an account to enroll in this course.' },
      });
      return;
    }
    const result = enroll(course.id);
    if (result.ok) setNotice(`You're enrolled in “${course.title}”. Happy learning!`);
  };

  const handleUnenroll = () => {
    if (window.confirm('Unenroll from this course? Your progress will be removed.')) {
      unenroll(course.id);
      setNotice('You have been unenrolled from this course.');
    }
  };

  const toggleModule = (moduleId) => {
    setOpenModules((previous) => {
      const next = new Set(previous);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const toggleAllModules = () => {
    setOpenModules(allOpen ? new Set() : new Set(course.modules.map((module) => module.id)));
  };

  return (
    <>
      <section
        className="course-hero"
        style={{ '--thumb-from': course.thumbnail.from, '--thumb-to': course.thumbnail.to }}
      >
        <div className="container course-hero__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/courses">Courses</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/courses?category=${encodeURIComponent(course.category)}`}>{course.category}</Link>
          </nav>
          <div className="course-hero__badge">
            <CourseArt thumbnail={course.thumbnail} size="md" />
          </div>
          <h1>{course.title}</h1>
          <p className="course-hero__lead">{course.shortDescription}</p>
          <div className="course-hero__meta">
            <Rating value={course.rating} count={course.reviews} />
            <span><Icon name="users" size={16} /> {formatCount(course.students)} students</span>
            <span><Icon name="layers" size={16} /> {course.level}</span>
            <span><Icon name="clock" size={16} /> Updated {course.updated}</span>
          </div>
          <p className="course-hero__instructor">
            Created by <strong>{course.instructor.name}</strong>, {course.instructor.title}
          </p>
        </div>
      </section>

      <div className="container course-layout">
        <div className="course-main">
          {notice && (
            <div className="alert alert--success" role="status">
              <Icon name="check" size={18} /> {notice}
              {enrolled && <Link to="/my-learning">Go to My Learning</Link>}
            </div>
          )}

          <section className="panel">
            <h2>What you'll learn</h2>
            <ul className="learn-list">
              {course.learn.map((item) => (
                <li key={item}><Icon name="check" size={18} /> {item}</li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h2>Course content</h2>
                <p className="panel__sub">
                  {course.modules.length} modules · {course.lessons.length} lessons · {formatMinutes(course.totalMinutes)} total
                </p>
              </div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={toggleAllModules}>
                {allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            </div>
            <CurriculumAccordion
              modules={course.modules}
              openIds={openModules}
              onToggleModule={toggleModule}
              completedIds={completedIds}
              canTrack={enrolled}
              onToggleLesson={(lessonId) => toggleLesson(course.id, lessonId)}
              focusLessonId={focusLessonId}
            />
            {!enrolled && (
              <p className="panel__hint"><Icon name="lock" size={14} /> Enroll to unlock lessons and track your progress.</p>
            )}
          </section>

          <section className="panel">
            <h2>Description</h2>
            <p>{course.description}</p>
            <h3 className="panel__subheading">Requirements</h3>
            <ul className="bullet-list">
              {course.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="panel instructor">
            <h2>Your instructor</h2>
            <div className="instructor__body">
              <span className="avatar avatar--lg" aria-hidden="true">{getInitials(course.instructor.name)}</span>
              <div>
                <h3>{course.instructor.name}</h3>
                <p className="instructor__title">{course.instructor.title}</p>
                <p>{course.instructor.bio}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="course-aside">
          <div className="buy-card">
            <div className="buy-card__preview">
              <CourseArt thumbnail={course.thumbnail} size="lg" />
            </div>
            <div className="buy-card__body">
              {enrolled ? (
                <>
                  <div className="buy-card__status">
                    <span className="badge badge--success"><Icon name="check" size={13} /> {progress.isComplete ? 'Completed' : 'Enrolled'}</span>
                    <strong>{progress.percent}%</strong>
                  </div>
                  <ProgressBar value={progress.percent} label="Your progress" tone={progress.isComplete ? 'success' : 'primary'} />
                  <p className="buy-card__progress-text">{progress.completed} of {progress.total} lessons completed</p>
                  {resumeLesson ? (
                    <Link to={`/courses/${course.id}?lesson=${resumeLesson.id}`} className="btn btn--primary btn--lg btn--block">
                      <Icon name="play" size={16} filled /> {progress.completed > 0 ? 'Continue learning' : 'Start course'}
                    </Link>
                  ) : (
                    <Link to="/my-learning" className="btn btn--success btn--lg btn--block">
                      <Icon name="trophy" size={18} /> Course completed
                    </Link>
                  )}
                  <button type="button" className="btn btn--text btn--block" onClick={handleUnenroll}>Unenroll from course</button>
                </>
              ) : (
                <>
                  <div className="buy-card__price">
                    <strong>{formatPrice(course.price)}</strong>
                    {discount > 0 && (
                      <>
                        <s>{formatPrice(course.originalPrice)}</s>
                        <span className="badge badge--warning">{discount}% off</span>
                      </>
                    )}
                  </div>
                  <button type="button" className="btn btn--primary btn--lg btn--block" onClick={handleEnroll}>
                    Enroll Now
                  </button>
                  {!currentUser && <p className="buy-card__note">You'll be asked to log in or sign up first.</p>}
                </>
              )}

              <ul className="buy-card__features">
                <li><Icon name="clock" size={17} /> {formatMinutes(course.totalMinutes)} of on-demand lessons</li>
                <li><Icon name="layers" size={17} /> {course.modules.length} modules, {course.lessons.length} lessons</li>
                <li><Icon name="globe" size={17} /> Lifetime access on any device</li>
                <li><Icon name="award" size={17} /> Certificate of completion</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function CourseDetails() {
  const { courseId } = useParams();
  return <CourseDetailsContent key={courseId} courseId={courseId} />;
}
