import { NextRequest, NextResponse } from "next/server";
import {
  readProgress,
  upsertProgress,
  type ProgressRow,
} from "@/lib/neon";

export const runtime = "nodejs";

const demoStore = new Map<string, ProgressRow[]>();

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

    return NextResponse.json({
      source: "neon",
      progress: rows,
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

  if (!Number.isInteger(moduleId) || moduleId < 1 || moduleId > 8) {
    return NextResponse.json(
      {
        error: "module_id harus berupa angka 1 sampai 8.",
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
