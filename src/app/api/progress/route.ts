import { NextRequest, NextResponse } from "next/server";
import {
  readAssessments,
  readProgress,
  upsertProgress,
  type ProgressRow,
} from "@/lib/neon";
import { allModules } from "@/lib/modules";

export const runtime = "nodejs";

const demoStore = new Map<string, ProgressRow[]>();
const validModuleIds = new Set(allModules.map((moduleItem) => moduleItem.id));
const modulesById = new Map(allModules.map((moduleItem) => [moduleItem.id, moduleItem]));

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

function upsertDemoRow({
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
  const rows = getDemoRows(studentId).filter((row) => row.module_id !== moduleId);
  const row: ProgressRow = {
    student_id: studentId,
    module_id: moduleId,
    completed,
    score,
    updated_at: new Date().toISOString(),
  };

  demoStore.set(
    studentId,
    [...rows, row].sort((first, second) => first.module_id - second.module_id),
  );

  return row;
}

function mergeFinishedAssessments(rows: ProgressRow[], assessments: Awaited<ReturnType<typeof readAssessments>>) {
  if (!assessments) {
    return rows;
  }

  const rowsByModule = new Map(rows.map((row) => [row.module_id, row]));

  for (const assessment of assessments) {
    const moduleItem = modulesById.get(assessment.module_id);

    if (!moduleItem) {
      continue;
    }

    const answeredGameIds = new Set([
      ...assessment.completed_game_ids,
      ...assessment.failed_game_ids,
    ]);
    const isFinished =
      Boolean(assessment.finished_at) ||
      answeredGameIds.size >= moduleItem.games.length;

    if (!isFinished) {
      continue;
    }

    const score = Math.round(
      (assessment.completed_game_ids.length / moduleItem.games.length) * 100,
    );
    const currentRow = rowsByModule.get(assessment.module_id);

    rowsByModule.set(assessment.module_id, {
      student_id: assessment.student_id,
      module_id: assessment.module_id,
      completed: true,
      score,
      updated_at: currentRow?.updated_at ?? assessment.updated_at,
    });
  }

  return Array.from(rowsByModule.values()).sort(
    (first, second) => first.module_id - second.module_id,
  );
}

export async function GET(request: NextRequest) {
  const studentId = normalizeStudentId(
    request.nextUrl.searchParams.get("student_id"),
  );

  try {
    const rows = await readProgress(studentId);

    if (!rows) {
      return NextResponse.json({
        source: "demo",
        progress: getDemoRows(studentId),
      });
    }

    const assessments = await readAssessments(studentId);

    return NextResponse.json({
      source: "neon",
      progress: mergeFinishedAssessments(rows, assessments),
    });
  } catch (error) {
    return NextResponse.json(
      {
        source: "error",
        error:
          error instanceof Error
            ? error.message
            : "Tidak dapat memuat progress.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const studentId = normalizeStudentId(body?.student_id);
  const moduleId = Number(body?.module_id);
  const completed = Boolean(body?.completed);
  const score = Math.max(0, Math.min(100, Number(body?.score ?? 0)));

  if (!Number.isInteger(moduleId) || !validModuleIds.has(moduleId)) {
    return NextResponse.json(
      {
        error: "module_id tidak terdaftar pada course LMS.",
      },
      { status: 400 },
    );
  }

  if (!Number.isFinite(score)) {
    return NextResponse.json(
      {
        error: "score harus berupa angka valid.",
      },
      { status: 400 },
    );
  }

  try {
    const row = await upsertProgress({
      studentId,
      moduleId,
      completed,
      score,
    });

    if (!row) {
      return NextResponse.json(
        {
          source: "demo",
          progress: upsertDemoRow({
            studentId,
            moduleId,
            completed,
            score,
          }),
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        source: "neon",
        progress: row,
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
            : "Tidak dapat menyimpan progress.",
      },
      { status: 500 },
    );
  }
}
