async function handler() {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const results = await sql`
    SELECT role 
    FROM user_roles 
    WHERE user_id = ${session.user.id}
  `;

  if (results.length === 0) {
    return { role: null };
  }

  return { role: results[0].role };
}