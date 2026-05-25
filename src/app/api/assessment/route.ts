import { NextRequest, NextResponse } from "next/server";
import { allModules } from "@/lib/modules";
import {
  readAssessments,
  upsertAssessment,
  type AssessmentRow,
} from "@/lib/neon";

export const runtime = "nodejs";

const demoStore = new Map<string, AssessmentRow[]>();
const validModuleIds = new Set(allModules.map((moduleItem) => moduleItem.id));
const validGameIdsByModule = new Map(
  allModules.map((moduleItem) => [
    moduleItem.id,
    new Set(moduleItem.games.map((game) => game.id)),
  ]),
);

function normalizeStudentId(value: unknown) {
  if (typeof value !== "string") {
    return "xii-rpl-smkn13-demo";
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "xii-rpl-smkn13-demo";
}

function getDemoRows(studentId: string) {
  return demoStore.get(studentId) ?? [];
}

function normalizeGameIds(value: unknown, validGameIds: Set<string>) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" && validGameIds.has(item),
      ),
    ),
  );
}

function upsertDemoRow(row: AssessmentRow) {
  const rows = getDemoRows(row.student_id).filter(
    (item) => item.module_id !== row.module_id,
  );

  demoStore.set(
    row.student_id,
    [...rows, row].sort((first, second) => first.module_id - second.module_id),
  );

  return row;
}

export async function GET(request: NextRequest) {
  const studentId = normalizeStudentId(
    request.nextUrl.searchParams.get("student_id"),
  );

  try {
    const rows = await readAssessments(studentId);

    if (!rows) {
      return NextResponse.json({
        source: "demo",
        assessments: getDemoRows(studentId),
      });
    }

    return NextResponse.json({
      source: "neon",
      assessments: rows,
    });
  } catch (error) {
    return NextResponse.json(
      {
        source: "error",
        error:
          error instanceof Error
            ? error.message
            : "Tidak dapat memuat assessment.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const studentId = normalizeStudentId(body?.student_id);
  const moduleId = Number(body?.module_id);
  const activeGameId =
    typeof body?.active_game_id === "string" ? body.active_game_id : "";
  const validGameIds = validGameIdsByModule.get(moduleId);

  if (!Number.isInteger(moduleId) || !validModuleIds.has(moduleId) || !validGameIds) {
    return NextResponse.json(
      { error: "module_id tidak terdaftar pada course LMS." },
      { status: 400 },
    );
  }

  if (!validGameIds.has(activeGameId)) {
    return NextResponse.json(
      { error: "active_game_id tidak terdaftar pada module." },
      { status: 400 },
    );
  }

  const completedGameIds = normalizeGameIds(body?.completed_game_ids, validGameIds);
  const failedGameIds = normalizeGameIds(body?.failed_game_ids, validGameIds).filter(
    (gameId) => !completedGameIds.includes(gameId),
  );
  const attempts = Math.max(0, Number(body?.attempts ?? 0));
  const wrongAttempts = Math.max(0, Number(body?.wrong_attempts ?? 0));
  const streak = Math.max(0, Number(body?.streak ?? 0));
  const hintUses = Math.max(0, Number(body?.hint_uses ?? 0));
  const startedAt =
    typeof body?.started_at === "string" && Number.isFinite(Date.parse(body.started_at))
      ? body.started_at
      : undefined;

  if (
    !Number.isFinite(attempts) ||
    !Number.isFinite(wrongAttempts) ||
    !Number.isFinite(streak) ||
    !Number.isFinite(hintUses)
  ) {
    return NextResponse.json(
      { error: "Stat assessment harus berupa angka valid." },
      { status: 400 },
    );
  }

  try {
    const row = await upsertAssessment({
      studentId,
      moduleId,
      activeGameId,
      completedGameIds,
      failedGameIds,
      attempts,
      wrongAttempts,
      streak,
      hintUses,
      startedAt,
    });

    if (!row) {
      return NextResponse.json(
        {
          source: "demo",
          assessment: upsertDemoRow({
            student_id: studentId,
            module_id: moduleId,
            started_at: startedAt ?? new Date().toISOString(),
            active_game_id: activeGameId,
            completed_game_ids: completedGameIds,
            failed_game_ids: failedGameIds,
            attempts,
            wrong_attempts: wrongAttempts,
            streak,
            hint_uses: hintUses,
            updated_at: new Date().toISOString(),
          }),
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        source: "neon",
        assessment: row,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        source: "error",
        error:
          error instanceof Error
            ? error.message
            : "Tidak dapat menyimpan assessment.",
      },
      { status: 500 },
    );
  }
}
