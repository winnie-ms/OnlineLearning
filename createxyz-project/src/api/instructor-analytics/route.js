async function handler() {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const roleResult = await sql`
    SELECT role FROM user_roles 
    WHERE user_id = ${session.user.id} 
    AND role = 'instructor'
  `;

  if (!roleResult.length) {
    return { error: "Unauthorized - Instructor access only" };
  }

  const courseStats = await sql`
    SELECT 
      c.id,
      c.title,
      COUNT(DISTINCT e.id) as total_enrollments,
      AVG(e.progress) as average_progress
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e.course_id
    WHERE c.instructor_id = ${session.user.id}
    GROUP BY c.id, c.title
  `;

  const quizStats = await sql`
    WITH instructor_quizzes AS (
      SELECT q.id as quiz_id
      FROM courses c
      JOIN lessons l ON l.course_id = c.id
      JOIN quizzes q ON q.lesson_id = l.id
      WHERE c.instructor_id = ${session.user.id}
    )
    SELECT 
      q.lesson_id,
      AVG(qa.score) as average_score,
      COUNT(DISTINCT qa.user_id) as total_attempts
    FROM instructor_quizzes iq
    JOIN quizzes q ON q.id = iq.quiz_id
    LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.id
    GROUP BY q.lesson_id
  `;

  const lessonStats = await sql`
    SELECT 
      l.id,
      l.title,
      l.course_id,
      COUNT(DISTINCT e.user_id) as students_started,
      SUM(CASE WHEN e.progress >= l.order_number THEN 1 ELSE 0 END) as students_completed
    FROM lessons l
    JOIN courses c ON c.id = l.course_id
    LEFT JOIN enrollments e ON e.course_id = c.id
    WHERE c.instructor_id = ${session.user.id}
    GROUP BY l.id, l.title, l.course_id
  `;

  return {
    courses: courseStats.map((course) => ({
      id: course.id,
      title: course.title,
      enrollments: course.total_enrollments,
      averageProgress: Math.round(course.average_progress || 0),
    })),
    quizzes: quizStats.map((quiz) => ({
      lessonId: quiz.lesson_id,
      averageScore: Math.round(quiz.average_score || 0),
      totalAttempts: quiz.total_attempts,
    })),
    lessons: lessonStats.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      courseId: lesson.course_id,
      studentsStarted: lesson.students_started,
      studentsCompleted: lesson.students_completed,
      completionRate: lesson.students_started
        ? Math.round(
            (lesson.students_completed / lesson.students_started) * 100
          )
        : 0,
    })),
  };
}