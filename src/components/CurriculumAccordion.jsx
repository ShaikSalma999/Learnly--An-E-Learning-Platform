import Icon from './Icon.jsx';
import { formatMinutes } from '../utils/format.js';

export default function CurriculumAccordion({
  modules,
  openIds,
  onToggleModule,
  completedIds,
  canTrack,
  onToggleLesson,
  focusLessonId,
}) {
  return (
    <div className="accordion">
      {modules.map((module, index) => {
        const isOpen = openIds.has(module.id);
        const doneInModule = module.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
        const moduleMinutes = module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
        const panelId = `panel-${module.id}`;

        return (
          <section key={module.id} className={`accordion__item${isOpen ? ' is-open' : ''}`}>
            <h3 className="accordion__heading">
              <button
                type="button"
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggleModule(module.id)}
              >
                <Icon name="chevronDown" size={18} className="accordion__chevron" />
                <span className="accordion__title">
                  <span className="accordion__index">Module {index + 1}</span>
                  {module.title}
                </span>
                <span className="accordion__summary">
                  {canTrack ? `${doneInModule}/${module.lessons.length} done · ` : ''}
                  {module.lessons.length} lessons · {formatMinutes(moduleMinutes)}
                </span>
              </button>
            </h3>
            <div id={panelId} className="accordion__panel" hidden={!isOpen}>
              <ul className="lesson-list">
                {module.lessons.map((lesson) => {
                  const done = completedIds.has(lesson.id);
                  const classes = ['lesson'];
                  if (done) classes.push('is-done');
                  if (focusLessonId === lesson.id) classes.push('is-focus');
                  return (
                    <li key={lesson.id} id={`lesson-${lesson.id}`} className={classes.join(' ')}>
                      {canTrack ? (
                        <button
                          type="button"
                          className="lesson__check"
                          role="checkbox"
                          aria-checked={done}
                          aria-label={`Mark "${lesson.title}" as ${done ? 'not completed' : 'completed'}`}
                          onClick={() => onToggleLesson(lesson.id)}
                        >
                          {done && <Icon name="check" size={14} />}
                        </button>
                      ) : (
                        <span className="lesson__lock" title="Enroll to unlock this lesson">
                          <Icon name="lock" size={15} />
                        </span>
                      )}
                      <span className="lesson__title">{lesson.title}</span>
                      <span className="lesson__time">{lesson.minutes} min</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
