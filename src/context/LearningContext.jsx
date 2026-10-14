import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getCourseById } from '../data/mockData.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const LearningContext = createContext(null);

/* Gives the demo account a believable starting point on first launch. */
function createSeedEnrollments() {
  const sqlCourse = getCourseById('c6');
  return {
    u_demo: {
      c1: {
        enrolledAt: '2026-09-02T10:00:00.000Z',
        completedLessons: ['c1-m1-l1', 'c1-m1-l2', 'c1-m1-l3', 'c1-m2-l1', 'c1-m2-l2'],
        lastLessonId: 'c1-m2-l2',
      },
      c4: {
        enrolledAt: '2026-09-20T18:15:00.000Z',
        completedLessons: ['c4-m1-l1', 'c4-m1-l2'],
        lastLessonId: 'c4-m1-l2',
      },
      c6: {
        enrolledAt: '2026-08-21T08:00:00.000Z',
        completedLessons: sqlCourse ? sqlCourse.lessons.map((lesson) => lesson.id) : [],
        lastLessonId: sqlCourse ? sqlCourse.lessons[sqlCourse.lessons.length - 1].id : null,
      },
    },
  };
}

export function LearningProvider({ children }) {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? null;

  const [store, setStore] = useState(() => readStorage('enrollments', null) ?? createSeedEnrollments());

  useEffect(() => {
    writeStorage('enrollments', store);
  }, [store]);

  const userEnrollments = useMemo(() => (userId ? store[userId] ?? {} : {}), [store, userId]);

  const patchEnrollment = useCallback(
    (courseId, patcher) => {
      if (!userId) return;
      setStore((previous) => {
        const mine = previous[userId] ?? {};
        const current = mine[courseId];
        if (!current) return previous;
        return { ...previous, [userId]: { ...mine, [courseId]: patcher(current) } };
      });
    },
    [userId],
  );

  const isEnrolled = useCallback((courseId) => Boolean(userEnrollments[courseId]), [userEnrollments]);

  const enroll = useCallback(
    (courseId) => {
      if (!userId) return { ok: false, reason: 'unauthenticated' };
      if (!getCourseById(courseId)) return { ok: false, reason: 'not-found' };
      setStore((previous) => {
        const mine = previous[userId] ?? {};
        if (mine[courseId]) return previous;
        return {
          ...previous,
          [userId]: {
            ...mine,
            [courseId]: { enrolledAt: new Date().toISOString(), completedLessons: [], lastLessonId: null },
          },
        };
      });
      return { ok: true };
    },
    [userId],
  );

  const unenroll = useCallback(
    (courseId) => {
      if (!userId) return;
      setStore((previous) => {
        const mine = { ...(previous[userId] ?? {}) };
        delete mine[courseId];
        return { ...previous, [userId]: mine };
      });
    },
    [userId],
  );

  const toggleLesson = useCallback(
    (courseId, lessonId) => {
      patchEnrollment(courseId, (enrollment) => {
        const alreadyDone = enrollment.completedLessons.includes(lessonId);
        return {
          ...enrollment,
          completedLessons: alreadyDone
            ? enrollment.completedLessons.filter((id) => id !== lessonId)
            : [...enrollment.completedLessons, lessonId],
          lastLessonId: alreadyDone ? enrollment.lastLessonId : lessonId,
        };
      });
    },
    [patchEnrollment],
  );

  const markCourseComplete = useCallback(
    (courseId) => {
      const course = getCourseById(courseId);
      if (!course) return;
      patchEnrollment(courseId, (enrollment) => ({
        ...enrollment,
        completedLessons: course.lessons.map((lesson) => lesson.id),
        lastLessonId: course.lessons[course.lessons.length - 1].id,
      }));
    },
    [patchEnrollment],
  );

  const resetProgress = useCallback(
    (courseId) => {
      patchEnrollment(courseId, (enrollment) => ({ ...enrollment, completedLessons: [], lastLessonId: null }));
    },
    [patchEnrollment],
  );

  const getCompletedLessonIds = useCallback(
    (courseId) => {
      const course = getCourseById(courseId);
      const enrollment = userEnrollments[courseId];
      if (!course || !enrollment) return [];
      const validIds = new Set(course.lessons.map((lesson) => lesson.id));
      return enrollment.completedLessons.filter((id) => validIds.has(id));
    },
    [userEnrollments],
  );

  const getProgress = useCallback(
    (courseId) => {
      const course = getCourseById(courseId);
      const total = course ? course.lessons.length : 0;
      const completed = getCompletedLessonIds(courseId).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { completed, total, percent, isComplete: total > 0 && completed === total };
    },
    [getCompletedLessonIds],
  );

  const getResumeLesson = useCallback(
    (courseId) => {
      const course = getCourseById(courseId);
      if (!course) return null;
      const done = new Set(getCompletedLessonIds(courseId));
      return course.lessons.find((lesson) => !done.has(lesson.id)) ?? null;
    },
    [getCompletedLessonIds],
  );

  const enrolledCourses = useMemo(
    () =>
      Object.entries(userEnrollments)
        .map(([courseId, enrollment]) => ({ course: getCourseById(courseId), enrollment }))
        .filter((entry) => entry.course)
        .sort((a, b) => new Date(b.enrollment.enrolledAt) - new Date(a.enrollment.enrolledAt)),
    [userEnrollments],
  );

  const value = useMemo(
    () => ({
      enrolledCourses,
      isEnrolled,
      enroll,
      unenroll,
      toggleLesson,
      markCourseComplete,
      resetProgress,
      getCompletedLessonIds,
      getProgress,
      getResumeLesson,
    }),
    [enrolledCourses, isEnrolled, enroll, unenroll, toggleLesson, markCourseComplete, resetProgress, getCompletedLessonIds, getProgress, getResumeLesson],
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used inside a <LearningProvider>.');
  return context;
}
