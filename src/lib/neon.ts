import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

type SqlClient = NeonQueryFunction<false, false>;

export type ProgressRow = {
  student_id: string;
  module_id: number;
  completed: boolean;
  score: number;
  updated_at: string;
};

let sqlClient: SqlClient | null = null;
let schemaPromise: Promise<void> | null = null;
let userSchemaPromise: Promise<void> | null = null;

function getSqlClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (!sqlClient) {
    sqlClient = neon(connectionString);
  }

  return sqlClient;
}

async function ensureProgressSchema(sql: SqlClient) {
  schemaPromise ??= sql`
    CREATE TABLE IF NOT EXISTS lms_progress (
      student_id TEXT NOT NULL,
      module_id INTEGER NOT NULL CHECK (module_id BETWEEN 1 AND 8),
      completed BOOLEAN NOT NULL DEFAULT false,
      score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (student_id, module_id)
    )
  `.then(() => undefined);

  await schemaPromise;
}

async function ensureUserSchema(sql: SqlClient) {
  userSchemaPromise ??= sql`
    CREATE TABLE IF NOT EXISTS lms_users (
      username TEXT PRIMARY KEY,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      student_id TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.then(() => undefined);

  await userSchemaPromise;
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function passwordMatches(password: string, salt: string, expectedHash: string) {
  const actualHash = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  return (
    actualHash.length === expectedBuffer.length &&
    timingSafeEqual(actualHash, expectedBuffer)
  );
}

export async function createUser({
  username,
  password,
  studentId,
}: {
  username: string;
  password: string;
  studentId: string;
}) {
  const sql = getSqlClient();

  if (!sql) {
    return null;
  }

  await ensureUserSchema(sql);

  const { salt, hash } = hashPassword(password);
  const rows = await sql`
    INSERT INTO lms_users (username, password_salt, password_hash, student_id)
    VALUES (${username}, ${salt}, ${hash}, ${studentId})
    ON CONFLICT (username)
    DO UPDATE SET
      password_salt = EXCLUDED.password_salt,
      password_hash = EXCLUDED.password_hash,
      student_id = EXCLUDED.student_id
    RETURNING username, student_id
  `;

  return (rows as Array<{ username: string; student_id: string }>)[0];
}

export async function verifyUser(username: string, password: string) {
  const sql = getSqlClient();

  if (!sql) {
    return null;
  }

  await ensureUserSchema(sql);

  const rows = await sql`
    SELECT username, password_salt, password_hash, student_id
    FROM lms_users
    WHERE username = ${username}
    LIMIT 1
  `;
  const user = (
    rows as Array<{
      username: string;
      password_salt: string;
      password_hash: string;
      student_id: string;
    }>
  )[0];

  if (!user || !passwordMatches(password, user.password_salt, user.password_hash)) {
    return null;
  }

  return {
    username: user.username,
    studentId: user.student_id,
  };
}

export async function readProgress(studentId: string) {
  const sql = getSqlClient();

  if (!sql) {
    return null;
  }

  await ensureProgressSchema(sql);

  const rows = await sql`
    SELECT student_id, module_id, completed, score, updated_at
    FROM lms_progress
    WHERE student_id = ${studentId}
    ORDER BY module_id ASC
  `;

  return rows as ProgressRow[];
}

export async function upsertProgress({
  studentId,
  moduleId,
  completed,
  score,
}: {
  studentId: string;
  moduleId: number;
  completed: boolean;
  score: number;
}) {
  const sql = getSqlClient();

  if (!sql) {
    return null;
  }

  await ensureProgressSchema(sql);

  const rows = await sql`
    INSERT INTO lms_progress (student_id, module_id, completed, score, updated_at)
    VALUES (${studentId}, ${moduleId}, ${completed}, ${score}, NOW())
    ON CONFLICT (student_id, module_id)
    DO UPDATE SET
      completed = EXCLUDED.completed,
      score = EXCLUDED.score,
      updated_at = NOW()
    RETURNING student_id, module_id, completed, score, updated_at
  `;

  return (rows as ProgressRow[])[0];
}
