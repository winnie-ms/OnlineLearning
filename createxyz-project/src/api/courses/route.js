async function handler({ type, courseId, title, description }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const roleResult = await sql`
    SELECT role FROM user_roles WHERE user_id = ${session.user.id}
  `;

  const userRole = roleResult[0]?.role;

  if (!userRole) {
    return { error: "User role not found" };
  }

  if (type === "create") {
    if (userRole !== "instructor" && userRole !== "admin") {
      return { error: "Unauthorized" };
    }

    if (!title || !description) {
      return { error: "Missing required fields" };
    }

    const result = await sql`
      INSERT INTO courses (title, description, instructor_id)
      VALUES (${title}, ${description}, ${session.user.id})
      RETURNING id, title, description, instructor_id, created_at
    `;

    return { course: result[0] };
  }

  if (type === "update") {
    if (userRole !== "instructor" && userRole !== "admin") {
      return { error: "Unauthorized" };
    }

    if (!courseId || (!title && !description)) {
      return { error: "Missing required fields" };
    }

    const courseCheck = await sql`
      SELECT instructor_id FROM courses WHERE id = ${courseId}
    `;

    if (courseCheck.length === 0) {
      return { error: "Course not found" };
    }

    if (
      userRole !== "admin" &&
      courseCheck[0].instructor_id !== session.user.id
    ) {
      return { error: "Unauthorized" };
    }

    const setValues = [];
    const queryParams = [];

    if (title) {
      setValues.push("title = $" + (queryParams.length + 1));
      queryParams.push(title);
    }

    if (description) {
      setValues.push("description = $" + (queryParams.length + 1));
      queryParams.push(description);
    }

    const setClause = setValues.join(", ");
    queryParams.push(courseId);

    const result = await sql(
      `UPDATE courses SET ${setClause} 
       WHERE id = $${queryParams.length} 
       RETURNING id, title, description, instructor_id, created_at`,
      queryParams
    );

    return { course: result[0] };
  }

  if (type === "fetch") {
    if (courseId) {
      const result = await sql`
        SELECT c.*, u.name as instructor_name 
        FROM courses c
        LEFT JOIN auth_users u ON c.instructor_id = u.id
        WHERE c.id = ${courseId}
      `;

      return { course: result[0] };
    }

    const result = await sql`
      SELECT c.*, u.name as instructor_name 
      FROM courses c
      LEFT JOIN auth_users u ON c.instructor_id = u.id
      ORDER BY c.created_at DESC
    `;

    return { courses: result };
  }

  return { error: "Invalid operation type" };
}