async function handler({ type, lessonId, title, questions, quizId, answers }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  if (type === "create") {
    const roleResult = await sql`
      SELECT role FROM user_roles WHERE user_id = ${session.user.id}
    `;

    if (
      !roleResult[0] ||
      !["instructor", "admin"].includes(roleResult[0].role)
    ) {
      return { error: "Unauthorized" };
    }

    if (!lessonId || !title || !questions || !Array.isArray(questions)) {
      return { error: "Missing required fields" };
    }

    const result = await sql.transaction(async (sql) => {
      const quiz = await sql`
        INSERT INTO quizzes (lesson_id, title)
        VALUES (${lessonId}, ${title})
        RETURNING id
      `;

      const quizQuestions = await sql`
        INSERT INTO quiz_questions (quiz_id, question, correct_answer, options)
        SELECT ${quiz[0].id}, q.question, q.correct_answer, q.options
        FROM json_populate_recordset(null::quiz_questions, ${JSON.stringify(
          questions
        )}) as q
        RETURNING id, question, options
      `;

      return { quiz: quiz[0], questions: quizQuestions };
    });

    return result;
  }

  if (type === "submit") {
    if (!quizId || !answers || !Array.isArray(answers)) {
      return { error: "Missing required fields" };
    }

    const questions = await sql`
      SELECT id, correct_answer
      FROM quiz_questions
      WHERE quiz_id = ${quizId}
      ORDER BY id
    `;

    if (questions.length === 0) {
      return { error: "Quiz not found" };
    }

    const score = questions.reduce((total, q, index) => {
      return total + (q.correct_answer === answers[index] ? 1 : 0);
    }, 0);

    const finalScore = Math.round((score / questions.length) * 100);

    const attempt = await sql`
      INSERT INTO quiz_attempts (user_id, quiz_id, score)
      VALUES (${session.user.id}, ${quizId}, ${finalScore})
      RETURNING id, score, completed_at
    `;

    return {
      attempt: attempt[0],
      score: finalScore,
      totalQuestions: questions.length,
      correctAnswers: score,
    };
  }

  if (type === "fetch") {
    if (!quizId) {
      return { error: "Missing quiz ID" };
    }

    const result = await sql.transaction(async (sql) => {
      const quiz = await sql`
        SELECT q.*, l.title as lesson_title
        FROM quizzes q
        LEFT JOIN lessons l ON q.lesson_id = l.id
        WHERE q.id = ${quizId}
      `;

      if (quiz.length === 0) {
        return { error: "Quiz not found" };
      }

      const questions = await sql`
        SELECT id, question, options
        FROM quiz_questions
        WHERE quiz_id = ${quizId}
        ORDER BY id
      `;

      const attempts = await sql`
        SELECT id, score, completed_at
        FROM quiz_attempts
        WHERE quiz_id = ${quizId} AND user_id = ${session.user.id}
        ORDER BY completed_at DESC
      `;

      return {
        quiz: quiz[0],
        questions,
        attempts,
      };
    });

    return result;
  }

  return { error: "Invalid operation type" };
}