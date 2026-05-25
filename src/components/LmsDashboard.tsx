"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Boxes,
  BrainCircuit,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Code2,
  Cpu,
  Eye,
  EyeOff,
  FileCode2,
  Gamepad2,
  GraduationCap,
  HelpCircle,
  KeyRound,
  Keyboard,
  Layers3,
  Lightbulb,
  LineChart,
  Lock,
  LogOut,
  LogIn,
  MousePointer2,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  RotateCcw,
  Route,
  Send,
  ShieldCheck,
  Shuffle,
  Target,
  TerminalSquare,
  Timer,
  Trophy,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  allModules,
  getCourseBySlug,
  lmsCourses,
  modules,
  gamesPerModule,
  type ChoiceGame,
  type LiveCodeGame,
  type LmsModule,
  type LocateGame,
  type OutputGame,
  type LmsCourse,
  type ModuleIcon,
  type SequenceGame,
} from "@/lib/modules";
import wallpaper from "@/assets/wallpaper.png";

type ProgressItem = {
  completed: boolean;
  score: number;
  updatedAt?: string;
};

type ProgressMap = Record<number, ProgressItem>;
type DatabaseMode = "checking" | "neon" | "demo" | "error";
type SyncState = "idle" | "saving" | "saved" | "offline";
type AuthSession = {
  username: string;
  studentId: string;
};

const AUTH_STORAGE_KEY = "lms-auth";
const MAX_HINTS_PER_MODULE = 3;
const MODULE_GAME_SECONDS = 15 * 60;

const moduleIcons: Record<ModuleIcon, LucideIcon> = {
  syntax: Code2,
  data: Boxes,
  flow: Route,
  function: Cpu,
  oop: Layers3,
  file: FileCode2,
  debug: Bug,
  api: Network,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function shuffleItems<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function LoadingScreen({
  label,
  detail = "Menyiapkan pengalaman belajar...",
}: {
  label: string;
  detail?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] grid place-items-center bg-[#05070b]/82 px-4 text-slate-100 backdrop-blur-xl"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ y: 18, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 10, scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative w-full max-w-sm overflow-hidden border border-white/10 bg-white/[0.065] p-6 shadow-2xl shadow-black/45"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(116,212,255,0.22),transparent_30%),radial-gradient(circle_at_82%_76%,rgba(55,229,165,0.18),transparent_30%)]" />
        <div className="relative">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center border border-sky-300/25 bg-sky-300/10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="h-11 w-11 border-2 border-sky-200/20 border-t-sky-200"
            />
          </div>
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500">System process</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{label}</h2>
            <p className="mt-3 leading-6 text-slate-300">{detail}</p>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden bg-white/10">
            <motion.div
              animate={{ x: ["-40%", "140%"] }}
              transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-sky-300"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgrammerBackground({
  variant = "module",
}: {
  variant?: "login" | "dashboard" | "module";
}) {
  const codeTokens =
    variant === "login"
      ? ["auth()", "POST /login", "session", "JWT", "hash", "200 OK"]
      : variant === "dashboard"
        ? ["modules.map()", "progress", "score", "course.id", "sync", "8/8"]
        : ["def main():", "print()", "for item in data:", "return JSON", "API", "debug"];
  const tokenPositions = [
    ["8%", "14%"],
    ["66%", "12%"],
    ["18%", "44%"],
    ["74%", "46%"],
    ["10%", "76%"],
    ["58%", "72%"],
  ];

  return (
    <div className={cx("programmer-bg", `programmer-bg-${variant}`)} aria-hidden="true">
      <div className="programmer-bg-grid" />
      <div className="programmer-bg-scan" />
      <div className="programmer-bg-circuit">
        <span className="programmer-line programmer-line-1" />
        <span className="programmer-line programmer-line-2" />
        <span className="programmer-line programmer-line-3" />
        <span className="programmer-line programmer-line-4" />
        <span className="programmer-node programmer-node-1" />
        <span className="programmer-node programmer-node-2" />
        <span className="programmer-node programmer-node-3" />
      </div>
      <div className="programmer-bg-code">
        {codeTokens.map((token, index) => (
          <span
            key={token}
            className="programmer-token"
            style={
              {
                "--token-index": index,
                "--token-left": tokenPositions[index][0],
                "--token-top": tokenPositions[index][1],
              } as CSSProperties
            }
          >
            {token}
          </span>
        ))}
      </div>
    </div>
  );
}

function getAccentStyle(color: string): CSSProperties {
  return {
    "--accent": color,
  } as CSSProperties;
}

function isModuleUnlocked(
  moduleId: number,
  progress: ProgressMap,
  moduleItems: LmsModule[] = modules,
) {
  return moduleItems
    .filter((moduleItem) => moduleItem.id < moduleId)
    .every((moduleItem) => progress[moduleItem.id]?.completed);
}

function getStoredAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession =
    window.localStorage.getItem(AUTH_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession) as Partial<AuthSession>;

    if (typeof parsedSession.username === "string" && typeof parsedSession.studentId === "string") {
      const session = {
        username: parsedSession.username,
        studentId: parsedSession.studentId,
      };

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);

      return session;
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);

  return null;
}

function useAuthSession() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isReady: false,
    session: null as AuthSession | null,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getStoredAuthSession();
      setAuthState({
        isAuthenticated: Boolean(session),
        isReady: true,
        session,
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    function syncAuthAcrossTabs(event: StorageEvent) {
      if (event.key !== AUTH_STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState({
          isAuthenticated: false,
          isReady: true,
          session: null,
        });
        return;
      }

      try {
        const parsedSession = JSON.parse(event.newValue) as Partial<AuthSession>;

        if (
          typeof parsedSession.username === "string" &&
          typeof parsedSession.studentId === "string"
        ) {
          setAuthState({
            isAuthenticated: true,
            isReady: true,
            session: {
              username: parsedSession.username,
              studentId: parsedSession.studentId,
            },
          });
        }
      } catch {
        setAuthState({
          isAuthenticated: false,
          isReady: true,
          session: null,
        });
      }
    }

    window.addEventListener("storage", syncAuthAcrossTabs);

    return () => window.removeEventListener("storage", syncAuthAcrossTabs);
  }, []);

  function login(session: AuthSession) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: true,
      isReady: true,
      session,
    });
  }

  function logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      isReady: true,
      session: null,
    });
  }

  return { ...authState, login, logout };
}

function useLmsProgress(
  studentId: string | null | undefined,
  moduleItems: LmsModule[] = modules,
) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [databaseMode, setDatabaseMode] = useState<DatabaseMode>("checking");
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const completedCount = moduleItems.filter(
    (item) => progress[item.id]?.completed,
  ).length;
  const completionRate = Math.round((completedCount / moduleItems.length) * 100);
  const averageScore =
    completedCount === 0
      ? 0
      : Math.round(
          moduleItems.reduce((total, item) => total + (progress[item.id]?.score ?? 0), 0) /
            completedCount,
        );

  useEffect(() => {
    if (!studentId) {
      return;
    }

    const activeStudentId = studentId;
    let cancelled = false;

    async function loadProgress() {
      setIsLoadingProgress(true);

      try {
        const response = await fetch(`/api/progress?student_id=${encodeURIComponent(activeStudentId)}`, {
          cache: "no-store",
        });
        const payload = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Gagal memuat progress.");
        }

        const nextProgress: ProgressMap = {};
        for (const row of payload.progress ?? []) {
          nextProgress[row.module_id] = {
            completed: Boolean(row.completed),
            score: Number(row.score ?? 0),
            updatedAt: row.updated_at,
          };
        }

        setProgress(nextProgress);
        setDatabaseMode(payload.source === "neon" ? "neon" : "demo");
      } catch {
        if (!cancelled) {
          setDatabaseMode("error");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProgress(false);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  async function saveProgress(moduleId: number, score: number, completed: boolean) {
    if (!studentId) {
      return;
    }

    setProgress((current) => ({
      ...current,
      [moduleId]: {
        completed,
        score,
        updatedAt: new Date().toISOString(),
      },
    }));
    setSyncState("saving");

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          module_id: moduleId,
          completed,
          score,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Gagal menyimpan progress.");
      }

      setDatabaseMode(payload.source === "neon" ? "neon" : "demo");
      setSyncState("saved");
    } catch {
      setDatabaseMode("error");
      setSyncState("offline");
    }
  }

  return {
    averageScore,
    completedCount,
    completionRate,
    databaseMode,
    isLoadingProgress,
    progress,
    saveProgress,
    setSyncState,
    syncState,
  };
}

export function LmsDashboard() {
  const router = useRouter();
  const { isAuthenticated, isReady, logout, session } = useAuthSession();
  const { completedCount, completionRate, isLoadingProgress, progress } = useLmsProgress(
    session?.studentId,
    allModules,
  );
  const [guideOpen, setGuideOpen] = useState(false);
  const [transitionLoading, setTransitionLoading] = useState<{
    label: string;
    detail: string;
  } | null>(null);

  function handleLogout() {
    setTransitionLoading({
      label: "Keluar akun",
      detail: "Sesi sedang ditutup dan kamu akan kembali ke halaman login.",
    });
    window.setTimeout(() => {
      logout();
      router.replace("/login");
    }, 350);
  }

  function handleEnterCourse(courseSlug: string) {
    setTransitionLoading({
      label: "Membuka course",
      detail: "Menyiapkan ruang belajar dan modul interaktif.",
    });
    window.setTimeout(() => {
      router.push(`/course/${courseSlug}`);
    }, 350);
  }

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <RouteRedirectScreen label="Mengarahkan ke halaman login" />;
  }

  return (
    <>
      <AnimatePresence>
        {isLoadingProgress && (
          <LoadingScreen
            label="Memuat progress"
            detail="Mengambil data modul terbaru...."
          />
        )}
        {transitionLoading && (
          <LoadingScreen
            label={transitionLoading.label}
            detail={transitionLoading.detail}
          />
        )}
      </AnimatePresence>
      <CourseOverview
        completedCount={completedCount}
        completionRate={completionRate}
        onEnterCourse={handleEnterCourse}
        onLogout={handleLogout}
        onOpenGuide={() => setGuideOpen(true)}
        progress={progress}
        username={session?.username ?? "Student"}
      />
      <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}

export function LmsLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isReady, login } = useAuthSession();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router]);

  function handleLogin(session: AuthSession) {
    login(session);
    router.replace("/dashboard");
  }

  if (!isReady || isAuthenticated) {
    return <RouteRedirectScreen label="Membuka dashboard" />;
  }

  return (
    <LoginScreen onLogin={handleLogin} />
  );
}

export function LmsModuleDashboard({ courseSlug = "pemrograman-web" }: { courseSlug?: string }) {
  const router = useRouter();
  const { isAuthenticated, isReady, logout, session } = useAuthSession();
  const course = useMemo(() => getCourseBySlug(courseSlug), [courseSlug]);
  const courseModules = course.modules;
  const [activeId, setActiveId] = useState(() => courseModules[0].id);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [hintUsesByModule, setHintUsesByModule] = useState<Record<number, number>>({});
  const [transitionLoading, setTransitionLoading] = useState<{
    label: string;
    detail: string;
  } | null>(null);
  const {
    averageScore,
    completedCount,
    completionRate,
    isLoadingProgress,
    progress,
    saveProgress,
    setSyncState,
    syncState,
  } = useLmsProgress(session?.studentId, courseModules);

  const activeModule = useMemo(
    () => courseModules.find((item) => item.id === activeId) ?? courseModules[0],
    [activeId, courseModules],
  );

  function handleLogout() {
    setTransitionLoading({
      label: "Keluar akun",
      detail: "Sesi belajar sedang ditutup dengan aman.",
    });
    window.setTimeout(() => {
      logout();
      setSidebarMinimized(false);
      setSyncState("idle");
      router.replace("/login");
    }, 350);
  }

  function handleBackToDashboard() {
    setTransitionLoading({
      label: "Membuka dashboard",
      detail: "Mengembalikan tampilan ke ringkasan course.",
    });
    window.setTimeout(() => {
      router.push("/dashboard");
    }, 350);
  }

  function requestModuleHint(moduleId: number) {
    const currentUses = hintUsesByModule[moduleId] ?? 0;

    if (currentUses >= MAX_HINTS_PER_MODULE) {
      return false;
    }

    setHintUsesByModule((current) => ({
      ...current,
      [moduleId]: (current[moduleId] ?? 0) + 1,
    }));

    return true;
  }

  function resetModuleHints(moduleId: number) {
    setHintUsesByModule((current) => {
      const nextHints = { ...current };
      delete nextHints[moduleId];
      return nextHints;
    });
  }

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return <RouteRedirectScreen label="Mengarahkan ke halaman login" />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08090e] text-slate-100">
      <AnimatePresence>
        {isLoadingProgress && (
          <LoadingScreen
            label="Memuat modul"
            detail="Sinkronisasi progress belajar sedang diproses."
          />
        )}
        {syncState === "saving" && (
          <LoadingScreen
            label="Menyimpan progress"
            detail="Jawaban benar sedang disimpan ke backend."
          />
        )}
        {transitionLoading && (
          <LoadingScreen
            label={transitionLoading.label}
            detail={transitionLoading.detail}
          />
        )}
      </AnimatePresence>
      <ProgrammerBackground variant="module" />

      <Sidebar
        activeId={activeId}
        completionRate={completionRate}
        minimized={sidebarMinimized}
        moduleItems={courseModules}
        progress={progress}
        onToggleMinimized={() => setSidebarMinimized((current) => !current)}
        onSelect={setActiveId}
      />

      <div
        className={cx(
          "relative mx-auto min-h-screen w-full max-w-[1520px] px-4 py-4 transition-[padding] duration-300 lg:px-6",
          sidebarMinimized ? "lg:pl-[96px]" : "lg:pl-[344px]",
        )}
      >
        <section className="min-w-0">
          <TopBar
            focusMode={focusMode}
            syncState={syncState}
            username={session?.username ?? "Student"}
            onBack={handleBackToDashboard}
            onToggleFocus={() => setFocusMode((current) => !current)}
            onOpenGuide={() => setGuideOpen(true)}
            onLogout={handleLogout}
          />

          <MobileModuleRail
            activeId={activeId}
            moduleItems={courseModules}
            progress={progress}
            onSelect={setActiveId}
          />

          <div
            className={cx(
              "grid gap-4",
              focusMode ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_360px]",
            )}
          >
            <div className="min-w-0 space-y-4">
              <ModuleStage
                course={course}
                moduleItem={activeModule}
                progress={progress[activeModule.id]}
                completionRate={completionRate}
                averageScore={averageScore}
              />

              <TutorialVideoPanel key={activeModule.id} moduleItem={activeModule} />

              <MiniGamePanel
                key={activeModule.id}
                hintUses={hintUsesByModule[activeModule.id] ?? 0}
                moduleItem={activeModule}
                progress={progress[activeModule.id]}
                onUseHint={() => requestModuleHint(activeModule.id)}
                onResetHints={() => resetModuleHints(activeModule.id)}
                onProgress={(score, completed) =>
                  saveProgress(activeModule.id, score, completed)
                }
              />
            </div>

            {!focusMode && (
              <RightPanel
                activeModule={activeModule}
                completedCount={completedCount}
                course={course}
                moduleItems={courseModules}
                progress={progress}
                onSelectModule={setActiveId}
              />
            )}
          </div>
        </section>
      </div>
      <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}

function RouteRedirectScreen({ label }: { label: string }) {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#08090e] text-slate-100">
      <ProgrammerBackground variant="login" />
      <div className="relative border border-white/10 bg-white/[0.055] px-5 py-4 text-sm text-slate-300 backdrop-blur-xl">
        {label}
      </div>
    </main>
  );
}

function LoginScreen({ onLogin }: { onLogin: (session: AuthSession) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"username" | "password" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Username atau password tidak sesuai.");
      }

      onLogin(payload.user as AuthSession);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Username atau password tidak sesuai.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090e] text-slate-100">
      <AnimatePresence>
        {isSubmitting && (
          <LoadingScreen
            label="Memeriksa akun"
            detail="Autentikasi sedang diproses....."
          />
        )}
      </AnimatePresence>
      <ProgrammerBackground variant="login" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8">
        <div className="grid w-full overflow-hidden border border-white/10 bg-white/[0.055] shadow-2xl backdrop-blur-xl lg:min-h-[640px] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
          <div
            className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-cover bg-center p-8 lg:flex"
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(8, 9, 14, 0.84), rgba(8, 9, 14, 0.58)), url(${wallpaper.src})`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(55,229,165,0.24),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(94,199,255,0.16),transparent_26%)]" />
            <div className="relative z-10">
              <div className="mb-10 inline-flex items-center gap-3 border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-emerald-100">
                <GraduationCap className="h-5 w-5" />
                SMKN 13 Bandung
              </div>
              <p className="text-sm uppercase text-slate-500">Learning Management System</p>
              <h1 className="mt-3 max-w-xl text-5xl font-semibold leading-tight text-white">
                Portal Dasar Pemrograman XII RPL
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                Akses course Python dan Flutter, mini game, dan live coding
                dalam satu ruang belajar digital.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-3">
              <MetricTile icon={BookOpen} label="Course" value={`${lmsCourses.length}`} />
              <MetricTile icon={Gamepad2} label="Game" value={`${allModules.length * gamesPerModule}`} />
            </div>
          </div>

          <div className="flex min-h-[640px] flex-col justify-center bg-black/30 p-5 md:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase text-slate-500">Secure access</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Login</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center border border-sky-300/30 bg-sky-300/10 text-sky-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <form onSubmit={submitLogin} className="space-y-5">
              <div className="block">
                <label
                  htmlFor="login-username"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Username
                </label>
                <div className="flex items-center border border-white/10 bg-white/[0.055] px-3 focus-within:border-emerald-300/50">
                  <UserRound className="h-5 w-5 shrink-0 text-slate-500" />
                  <input
                    id="login-username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className="login-input h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none placeholder:text-slate-600 focus-visible:outline-none"
                    placeholder={focusedField === "username" ? "" : "Masukkan username"}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="block">
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="flex items-center border border-white/10 bg-white/[0.055] px-3 focus-within:border-emerald-300/50">
                  <KeyRound className="h-5 w-5 shrink-0 text-slate-500" />
                  <input
                    id="login-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    type={showPassword ? "text" : "password"}
                    className="login-input h-12 min-w-0 flex-1 bg-transparent px-3 text-white outline-none placeholder:text-slate-600 focus-visible:outline-none"
                    placeholder={focusedField === "password" ? "" : "Masukkan password"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 text-slate-400 transition hover:border-white/25 hover:text-white"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 border border-rose-300/25 bg-rose-300/10 p-3 text-sm text-rose-100">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 border border-emerald-300/40 bg-emerald-300 px-5 font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn className="h-5 w-5" />
                {isSubmitting ? "Memeriksa akun..." : "Masuk ke LMS"}
              </button>
            </form>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
              <div className="border border-white/10 bg-white/[0.045] p-3">
                <p className="text-xs uppercase text-slate-500">Role</p>
                <p className="mt-1 font-semibold text-white">Siswa XII RPL</p>
              </div>
              <div className="border border-white/10 bg-white/[0.045] p-3">
                <p className="text-xs uppercase text-slate-500">Course</p>
                <p className="mt-1 font-semibold text-white">Python & Flutter</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CourseOverview({
  completedCount,
  completionRate,
  onEnterCourse,
  onLogout,
  onOpenGuide,
  progress,
  username,
}: {
  completedCount: number;
  completionRate: number;
  onEnterCourse: (courseSlug: string) => void;
  onLogout: () => void;
  onOpenGuide: () => void;
  progress: ProgressMap;
  username: string;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function getCourseProgress(course: LmsCourse) {
    const courseCompletedCount = course.modules.filter(
      (moduleItem) => progress[moduleItem.id]?.completed,
    ).length;

    return {
      completedCount: courseCompletedCount,
      completionRate: Math.round((courseCompletedCount / course.modules.length) * 100),
    };
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090e] text-slate-100">
      <ProgrammerBackground variant="dashboard" />

      <div className="relative mx-auto min-h-screen w-full max-w-7xl px-4 py-5 md:px-6">
        <header className="relative z-50 mb-6 flex flex-col gap-4 border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center border border-emerald-300/30 bg-emerald-300/10 text-emerald-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">SMKN 13 Bandung</p>
              <h1 className="text-xl font-semibold text-white">Portal Dasar Pemrograman XII RPL</h1>
            </div>
          </div>

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className={cx(
                "inline-flex h-11 items-center gap-3 border px-2.5 pr-3 text-slate-200 shadow-[0_0_28px_rgba(116,212,255,0.08)] transition hover:border-sky-200/45 hover:bg-white/[0.09] hover:text-white",
                profileOpen
                  ? "border-sky-300/45 bg-sky-300/10"
                  : "border-white/10 bg-white/[0.055]",
              )}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label="Buka menu profile"
            >
              <span className="grid h-8 w-8 place-items-center border border-sky-300/35 bg-sky-300/10 text-sky-100">
                <UserRound className="h-4 w-4" />
              </span>
              <ChevronDown
                className={cx(
                  "h-4 w-4 text-slate-500 transition",
                  profileOpen && "rotate-180 text-sky-100",
                )}
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+0.75rem)] z-[120] w-72 overflow-hidden border border-white/10 bg-[#0b0f16]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
                role="menu"
              >
                <div className="border-b border-white/10 bg-white/[0.055] p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center border border-sky-300/35 bg-sky-300/10 text-sky-100">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase text-slate-500">Student profile</p>
                      <p className="truncate font-semibold text-white">{username}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenGuide();
                      setProfileOpen(false);
                    }}
                    className="group flex w-full items-center gap-3 border border-white/10 bg-black/20 p-3 text-left text-slate-300 transition hover:border-white/25 hover:bg-white/[0.075] hover:text-white"
                    role="menuitem"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-black/25">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">Panduan</span>
                      <span className="block text-xs text-slate-500">
                        Buka instruksi penggunaan LMS.
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="group flex w-full items-center gap-3 border border-rose-300/20 bg-rose-300/10 p-3 text-left text-rose-100 transition hover:border-rose-200/55 hover:bg-rose-300/15"
                    role="menuitem"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center border border-rose-300/20 bg-black/25">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">Logout</span>
                      <span className="block text-xs text-rose-100/65">
                        Keluar dan kembali ke halaman login.
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="grid gap-5">
          <div className="space-y-5">
            <div className="border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl md:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-sm text-sky-100">
                  Course hub
                </span>
                <span className="border border-white/10 bg-black/20 px-3 py-1 text-sm text-slate-300">
                  {lmsCourses.length} course tersedia
                </span>
                <span className="border border-white/10 bg-black/20 px-3 py-1 text-sm text-slate-300">
                  XII RPL
                </span>
              </div>
              <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  <p className="text-sm uppercase text-slate-500">Learning cockpit</p>
                  <h2 className="mt-2 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                    Pilih ruang belajar untuk mulai belajar bahasa pemrograman.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    Portal ini dibuat khusus untuk siswa XII RPL dengan beberapa course bahasa pemrograman yang masing-masing berisi 8 modul interaktif lengkap dengan mini game dan live coding.
                  </p>
                </div>
                <div className="border border-white/10 bg-black/25 p-4">
                  <p className="text-sm text-slate-400">Progress keseluruhan</p>
                  <p className="mt-2 text-4xl font-semibold text-white">{completionRate}%</p>
                  <div className="mt-4 h-2 bg-white/10">
                    <div
                      className="h-full bg-emerald-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-400">
                    {completedCount}/{allModules.length} modul selesai
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              {lmsCourses.map((course) => {
                const courseProgress = getCourseProgress(course);

                return (
                  <CourseCard
                    key={course.id}
                    completionRate={courseProgress.completionRate}
                    completedCount={courseProgress.completedCount}
                    course={course}
                    onEnterCourse={onEnterCourse}
                  />
                );
              })}
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}

function CourseCard({
  completionRate,
  completedCount,
  course,
  onEnterCourse,
}: {
  completionRate: number;
  completedCount: number;
  course: LmsCourse;
  onEnterCourse: (courseSlug: string) => void;
}) {
  const courseHeroStyle =
    course.id === "python"
      ? ({
          backgroundImage:
            "linear-gradient(180deg, rgba(9, 20, 18, 0.18), rgba(9, 20, 18, 0.68)), url('/Python.svg'), url('/Python.png')",
        } as CSSProperties)
      : course.id === "flutter"
        ? ({
            backgroundImage:
              "linear-gradient(180deg, rgba(9, 20, 18, 0.18), rgba(9, 20, 18, 0.68)), url('/flutter.png')",
          } as CSSProperties)
      : undefined;

  return (
    <article className="group overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur-xl transition hover:border-emerald-300/35">
      <div className="grid gap-5 p-5 md:grid-cols-[260px_minmax(0,1fr)_220px] md:p-6">
        <div
          className="relative min-h-56 overflow-hidden border border-emerald-300/20 bg-[#10211f] bg-cover bg-center"
          style={courseHeroStyle}
        >
          {!courseHeroStyle && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(55,229,165,0.28),transparent_26%),radial-gradient(circle_at_80%_72%,rgba(94,199,255,0.2),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_45%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0_45%,rgba(255,255,255,0.1)_45%_48%,transparent_48%_100%)] bg-[size:34px_34px]" />
            </>
          )}
          <div className="absolute left-5 top-5 inline-flex items-center gap-2 border border-white/15 bg-black/30 px-3 py-2 text-sm text-emerald-100">
            <Code2 className="h-4 w-4" />
            {course.stack}
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-sm text-emerald-100/80">{course.level}</p>
            <p className="mt-1 text-3xl font-semibold text-white">{course.shortTitle}</p>
          </div>
        </div>

        <div className="min-w-0 py-1">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="border border-white/10 bg-black/25 px-3 py-1 text-sm text-slate-300">
              {course.modules.length} modul
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-white">{course.title}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            {course.description}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetricTile icon={BrainCircuit} label="Level" value={course.level} />
            <MetricTile icon={Gamepad2} label="Game" value="5/modul" />
            <MetricTile icon={ShieldCheck} label="Lock" value="Berurutan" />
          </div>
        </div>

        <div className="flex flex-col justify-between border border-white/10 bg-black/25 p-4">
          <div>
            <p className="text-sm text-slate-400">Course progress</p>
            <p className="mt-2 text-4xl font-semibold text-white">{completionRate}%</p>
            <div className="mt-4 h-2 bg-white/10">
              <div
                className="h-full bg-emerald-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {completedCount}/{course.modules.length} modul selesai
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEnterCourse(course.slug)}
            className="mt-6 inline-flex items-center justify-center gap-2 border border-emerald-300/40 bg-emerald-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-200"
          >
            <Play className="h-4 w-4" />
            Masuk course
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function GuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  const guideSections = [
    {
      title: "1. Login",
      body: "Masuk melalui halaman login dengan akun yang sudah disediakan. Gunakan tombol ikon mata untuk menampilkan atau menyembunyikan password.",
    },
    {
      title: "2. Dashboard Course",
      body: "Setelah login, kamu masuk ke dashboard. Di sana tersedia course Python dan Flutter. Klik tombol Masuk course untuk membuka halaman modul sesuai course yang dipilih.",
    },
    {
      title: "3. Masuk Course",
      body: "Klik tombol Masuk course untuk membuka halaman modul sesuai course yang dipilih. Tombol Back di halaman modul akan mengembalikan kamu ke dashboard.",
    },
    {
      title: "4. Urutan Modul",
      body: "Modul harus diselesaikan berurutan. Modul 2 dan seterusnya akan terkunci sampai semua mini game pada modul sebelumnya selesai.",
    },
    {
      title: "5. Mini Game",
      body: "Setiap modul memiliki 5 mini game: pilihan konsep, susun kode, cari bug, prediksi output, dan live coding. Progress modul naik 20 poin setiap satu game selesai.",
    },
    {
      title: "6. Live Coding",
      body: "Pada game live coding, tulis kode di editor lalu klik Run Validator. Sistem akan memeriksa syarat kode seperti variabel, fungsi, percabangan, atau struktur data.",
    },
    {
      title: "7. Sidebar Modul",
      body: "Di halaman modul, sidebar kiri menampilkan daftar modul dan statusnya. Sidebar bisa diminimize menjadi ikon saja, lalu dibuka kembali lewat tombol sidebar.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden border border-white/10 bg-[#0b0d12] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-white/[0.055] p-5">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-sm text-sky-100">
              <HelpCircle className="h-4 w-4" />
              Panduan Website
            </div>
            <h2 id="guide-modal-title" className="text-2xl font-semibold text-white">
              Cara menggunakan LMS  XII RPL
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Ikuti alur berikut agar proses belajar, pengerjaan mini game, dan progress
              modul berjalan dengan benar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-white/25 hover:text-white"
            aria-label="Tutup panduan"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(88vh-150px)] overflow-y-auto p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {guideSections.map((section) => (
              <article
                key={section.title}
                className="border border-white/10 bg-white/[0.045] p-4"
              >
                <h3 className="font-semibold text-white">{section.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 border border-emerald-300/25 bg-emerald-300/10 p-4">
            <h3 className="font-semibold text-emerald-100">Target belajar</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-50/90">
              Selesaikan semua 8 modul secara berurutan. Setiap modul selesai jika score
              modul mencapai 100 dari lima mini game. Setelah itu modul berikutnya akan
              otomatis terbuka.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/25 p-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="border border-emerald-300/40 bg-emerald-300 px-5 py-2 font-semibold text-slate-950 transition hover:bg-emerald-200"
          >
            Saya mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

function TopBar({
  focusMode,
  syncState,
  username,
  onBack,
  onToggleFocus,
  onOpenGuide,
  onLogout,
}: {
  focusMode: boolean;
  syncState: SyncState;
  username: string;
  onBack: () => void;
  onToggleFocus: () => void;
  onOpenGuide: () => void;
  onLogout: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const syncCopy: Record<SyncState, string> = {
    idle: "Ready",
    saving: "Saving",
    saved: "Synced",
    offline: "Local only",
  };

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="relative z-50 mb-4 flex flex-col gap-3 border border-white/10 bg-white/[0.055] p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center border border-emerald-300/30 bg-emerald-300/10">
          <GraduationCap className="h-5 w-5 text-emerald-200" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase text-slate-400">SMKN 13 Bandung</p>
          <h1 className="break-words text-xl font-semibold text-white md:text-2xl">
            LMS XII RPL
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 font-semibold text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <StatusPill
          icon={ShieldCheck}
          label={syncCopy[syncState]}
          tone={syncState === "saved" ? "good" : syncState === "offline" ? "warn" : "info"}
        />
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            className={cx(
              "inline-flex h-11 items-center gap-3 border px-2.5 pr-3 text-slate-200 shadow-[0_0_28px_rgba(116,212,255,0.08)] transition hover:border-sky-200/45 hover:bg-white/[0.09] hover:text-white",
              profileOpen
                ? "border-sky-300/45 bg-sky-300/10"
                : "border-white/10 bg-white/[0.055]",
            )}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label="Buka menu profile"
          >
            <span className="grid h-8 w-8 place-items-center border border-sky-300/35 bg-sky-300/10 text-sky-100">
              <UserRound className="h-4 w-4" />
            </span>
            <ChevronDown
              className={cx(
                "h-4 w-4 text-slate-500 transition",
                profileOpen && "rotate-180 text-sky-100",
              )}
            />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-[calc(100%+0.75rem)] z-[120] w-72 overflow-hidden border border-white/10 bg-[#0b0f16]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
              role="menu"
            >
              <div className="border-b border-white/10 bg-white/[0.055] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center border border-sky-300/35 bg-sky-300/10 text-sky-100">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase text-slate-500">Student profile</p>
                    <p className="truncate font-semibold text-white">{username}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 p-2">
                <button
                  type="button"
                  onClick={() => {
                    onToggleFocus();
                    setProfileOpen(false);
                  }}
                  className={cx(
                    "group flex w-full items-center gap-3 border p-3 text-left transition hover:border-white/25 hover:bg-white/[0.075]",
                    focusMode
                      ? "border-amber-300/35 bg-amber-300/10 text-amber-100"
                      : "border-white/10 bg-black/20 text-slate-300",
                  )}
                  role="menuitemcheckbox"
                  aria-checked={focusMode}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-black/25">
                    {focusMode ? <Pause className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      {focusMode ? "Fokus aktif" : "Mode fokus"}
                    </span>
                    <span className="block text-xs text-slate-500">
                      Atur tampilan belajar tanpa distraksi.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenGuide();
                    setProfileOpen(false);
                  }}
                  className="group flex w-full items-center gap-3 border border-white/10 bg-black/20 p-3 text-left text-slate-300 transition hover:border-white/25 hover:bg-white/[0.075] hover:text-white"
                  role="menuitem"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-black/25">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Panduan</span>
                    <span className="block text-xs text-slate-500">
                      Buka instruksi penggunaan LMS.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="group flex w-full items-center gap-3 border border-rose-300/20 bg-rose-300/10 p-3 text-left text-rose-100 transition hover:border-rose-200/55 hover:bg-rose-300/15"
                  role="menuitem"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-rose-300/20 bg-black/25">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Logout</span>
                    <span className="block text-xs text-rose-100/65">
                      Keluar dan kembali ke halaman login.
                    </span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  activeId,
  completionRate,
  minimized,
  moduleItems,
  progress,
  onToggleMinimized,
  onSelect,
}: {
  activeId: number;
  completionRate: number;
  minimized: boolean;
  moduleItems: LmsModule[];
  progress: ProgressMap;
  onToggleMinimized: () => void;
  onSelect: (id: number) => void;
}) {
  return (
    <aside
      className={cx(
        "fixed bottom-4 left-4 top-4 z-40 hidden flex-col gap-4 overflow-y-auto border border-white/10 bg-black/45 shadow-2xl backdrop-blur-xl transition-[width,padding] duration-300 lg:flex",
        minimized ? "w-20 p-3" : "w-80 p-4",
      )}
    >
      <div className={cx("flex items-center", minimized ? "justify-center" : "justify-between")}>
        {!minimized && (
          <div>
            <p className="text-xs uppercase text-slate-500">Learning cockpit</p>
            <h2 className="text-lg font-semibold text-white">KELAS XII RPL</h2>
          </div>
        )}
        <div className={cx("flex items-center", minimized ? "flex-col gap-2" : "gap-3")}>
          {!minimized && <ProgressRing value={completionRate} color="#37e5a5" />}
          <button
            type="button"
            onClick={onToggleMinimized}
            className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
            aria-label={minimized ? "Buka sidebar" : "Minimize sidebar"}
            title={minimized ? "Buka sidebar" : "Minimize sidebar"}
          >
            {minimized ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="grid grid-cols-2 gap-2">
          <MetricTile icon={Users} label="Kelas" value="XII RPL" />
          <MetricTile icon={Trophy} label="Modul" value="1-8" />
        </div>
      )}

      <nav className={cx("space-y-2", minimized && "mt-1")} aria-label="Daftar modul course">
        {moduleItems.map((moduleItem) => (
          <ModuleNavButton
            key={moduleItem.id}
            moduleItem={moduleItem}
            isActive={moduleItem.id === activeId}
            isComplete={Boolean(progress[moduleItem.id]?.completed)}
            isLocked={!isModuleUnlocked(moduleItem.id, progress, moduleItems)}
            minimized={minimized}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </aside>
  );
}

function MobileModuleRail({
  activeId,
  moduleItems,
  progress,
  onSelect,
}: {
  activeId: number;
  moduleItems: LmsModule[];
  progress: ProgressMap;
  onSelect: (id: number) => void;
}) {
  return (
    <nav
      className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden"
      aria-label="Daftar modul mobile"
    >
      {moduleItems.map((moduleItem) => {
        const isActive = activeId === moduleItem.id;
        const isComplete = Boolean(progress[moduleItem.id]?.completed);
        const isLocked = !isModuleUnlocked(moduleItem.id, progress, moduleItems);

        return (
          <button
            key={moduleItem.id}
            type="button"
            disabled={isLocked}
            onClick={() => onSelect(moduleItem.id)}
            className={cx(
              "flex min-w-36 items-center gap-2 border px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed",
              isLocked
                ? "border-white/5 bg-black/20 text-slate-600"
                : isActive
                  ? "border-white/30 bg-white/[0.15] text-white"
                  : "border-white/10 bg-white/[0.055] text-slate-300",
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            ) : isLocked ? (
              <Lock className="h-4 w-4 text-slate-600" />
            ) : (
              <CircleDot className="h-4 w-4 text-slate-500" />
            )}
            <span>{moduleItem.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ModuleNavButton({
  moduleItem,
  isActive,
  isComplete,
  isLocked,
  minimized = false,
  onSelect,
}: {
  moduleItem: LmsModule;
  isActive: boolean;
  isComplete: boolean;
  isLocked: boolean;
  minimized?: boolean;
  onSelect: (id: number) => void;
}) {
  const Icon = moduleIcons[moduleItem.icon];

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={() => onSelect(moduleItem.id)}
      className={cx(
        "group flex w-full items-center border text-left transition disabled:cursor-not-allowed",
        minimized ? "justify-center p-2" : "gap-3 p-3",
        isLocked
          ? "border-white/5 bg-black/20 text-slate-600"
          : isActive
            ? "border-white/30 bg-white/[0.14] text-white shadow-[0_0_24px_rgba(255,255,255,0.08)]"
            : "border-white/10 bg-white/[0.045] text-slate-300 hover:border-white/20 hover:bg-white/[0.075]",
      )}
      style={
        isActive && !isLocked
          ? { boxShadow: `0 0 28px ${moduleItem.color}20` }
          : undefined
      }
      aria-label={moduleItem.title}
      title={moduleItem.title}
    >
      <div
        className="grid h-10 w-10 shrink-0 place-items-center border"
        style={
          isLocked
            ? {
                borderColor: "rgba(148, 163, 184, 0.12)",
                background: "rgba(15, 23, 42, 0.4)",
                color: "#64748b",
              }
            : {
                borderColor: `${moduleItem.color}55`,
                background: `${moduleItem.color}14`,
                color: moduleItem.color,
              }
        }
      >
        <Icon className="h-5 w-5" />
      </div>
      {!minimized && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{moduleItem.title}</p>
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
            ) : isLocked ? (
              <Lock className="h-4 w-4 shrink-0 text-slate-600" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5" />
            )}
          </div>
          <p className="truncate text-xs text-slate-500">
            {isLocked ? "Terkunci - selesaikan modul sebelumnya" : moduleItem.subtitle}
          </p>
        </div>
      )}
    </button>
  );
}

function ModuleStage({
  course,
  moduleItem,
  progress,
  completionRate,
  averageScore,
}: {
  course: LmsCourse;
  moduleItem: LmsModule;
  progress?: ProgressItem;
  completionRate: number;
  averageScore: number;
}) {
  return (
    <section
      className="relative overflow-hidden border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:p-5"
      style={getAccentStyle(moduleItem.color)}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: `${moduleItem.color}22` }}
      />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">
            {course.shortTitle} / {moduleItem.title}
          </p>
          <h2 className="mt-1 max-w-3xl break-words text-3xl font-semibold text-white md:text-4xl">
            {moduleItem.subtitle}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            {moduleItem.focus}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
            <MetricTile icon={LineChart} label="Progress" value={`${completionRate}%`} />
            <MetricTile icon={BrainCircuit} label="Rata-rata" value={`${averageScore}`} />
            <MetricTile
              icon={ShieldCheck}
              label="Status"
              value={progress?.completed ? "Selesai" : "Belajar"}
            />
          </div>

          <div className="mt-5 border border-white/10 bg-black/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              Misi Praktik
            </div>
            <p className="leading-7 text-slate-300">{moduleItem.mission}</p>
          </div>
        </div>

        <div className="relative min-w-0 border border-white/10 bg-[#0d1117]/90 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <TerminalSquare className="h-4 w-4 text-emerald-200" />
              python_runtime.py
            </div>
            <div className="flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
          </div>
          <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">
            <code>{moduleItem.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function TutorialVideoPanel({ moduleItem }: { moduleItem: LmsModule }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const tutorialSteps = getTutorialSteps(moduleItem);
  const activeStep = tutorialSteps[activeStepIndex];
  const progress = Math.round(((activeStepIndex + 1) / tutorialSteps.length) * 100);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveStepIndex((current) => {
        if (current >= tutorialSteps.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPlaying, tutorialSteps.length]);

  function moveStep(direction: "previous" | "next") {
    setIsPlaying(false);
    setActiveStepIndex((current) => {
      const nextIndex = direction === "next" ? current + 1 : current - 1;
      return Math.max(0, Math.min(tutorialSteps.length - 1, nextIndex));
    });
  }

  return (
    <>
      <section
        className="overflow-hidden border border-white/10 bg-white/[0.055] backdrop-blur"
        style={getAccentStyle(moduleItem.color)}
      >
        <div className="grid min-h-[430px] lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="relative min-w-0 border-b border-white/10 bg-[#06080d] p-4 lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0 opacity-45"
            style={{
              background: `linear-gradient(135deg, ${moduleItem.color}24, transparent 34%), radial-gradient(circle at 76% 22%, ${moduleItem.color}20, transparent 26%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:36px_36px] opacity-35" />
          <div className="relative flex min-h-[390px] flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-black/35">
                  {isPlaying ? (
                    <Pause className="h-4 w-4" style={{ color: moduleItem.color }} />
                  ) : (
                    <Play className="h-4 w-4" style={{ color: moduleItem.color }} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase text-slate-500">Video tutorial simulasi</p>
                  <h3 className="truncate text-lg font-semibold text-white">
                    {moduleItem.title}: {moduleItem.subtitle}
                  </h3>
                </div>
              </div>
              <span className="shrink-0 border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-slate-300">
                {activeStepIndex + 1}/{tutorialSteps.length}
              </span>
            </div>

            <div className="grid flex-1 place-items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${moduleItem.id}-${activeStep.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="w-full max-w-2xl"
                >
                  <div className="mb-4 inline-flex border px-3 py-1.5 text-xs font-semibold uppercase text-white"
                    style={{
                      borderColor: `${moduleItem.color}44`,
                      background: `${moduleItem.color}12`,
                    }}
                  >
                    Scene {activeStepIndex + 1}
                  </div>
                  <h4 className="text-2xl font-semibold text-white md:text-3xl">
                    {activeStep.title}
                  </h4>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    {activeStep.narration}
                  </p>
                  <LiveCodingDemo
                    key={activeStep.id}
                    code={activeStep.demo}
                    color={moduleItem.color}
                    fileName={activeStep.fileName}
                    isPlaying={isPlaying}
                    output={activeStep.output}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <div className="mb-3 h-1.5 bg-white/10">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: moduleItem.color }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveStep("previous")}
                    disabled={activeStepIndex === 0}
                    className="inline-flex items-center gap-2 border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300 transition hover:border-white/25 disabled:opacity-45"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep("next")}
                    disabled={activeStepIndex === tutorialSteps.length - 1}
                    className="inline-flex items-center gap-2 border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300 transition hover:border-white/25 disabled:opacity-45"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMaterialOpen(true)}
                    className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.075] px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.12]"
                  >
                    <BookOpen className="h-4 w-4" />
                    Bahan Materi
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    className="inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                    style={{ borderColor: moduleItem.color, background: moduleItem.color }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? "Pause Tutorial" : "Play Tutorial"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 bg-black/20 p-4">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Target className="h-5 w-5" style={{ color: moduleItem.color }} />
            <h3 className="text-lg font-semibold">Checkpoint</h3>
          </div>
          <div className="space-y-2">
            {tutorialSteps.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isDone = index < activeStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStepIndex(index);
                  }}
                  className={cx(
                    "flex w-full items-start gap-3 border p-3 text-left transition hover:-translate-y-0.5",
                    isActive
                      ? "border-white/30 bg-white/[0.12] text-white"
                      : "border-white/10 bg-black/20 text-slate-300 hover:border-white/25",
                  )}
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center border text-xs font-semibold"
                    style={{
                      borderColor: isActive || isDone ? `${moduleItem.color}66` : "rgba(255,255,255,0.1)",
                      background: isActive || isDone ? `${moduleItem.color}16` : "rgba(0,0,0,0.25)",
                      color: isActive || isDone ? moduleItem.color : "#94a3b8",
                    }}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{step.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-400">
                      {step.checkpoint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div
            className="mt-4 border p-3 text-sm leading-6 text-slate-300"
            style={{
              borderColor: `${moduleItem.color}33`,
              background: `${moduleItem.color}10`,
            }}
          >
            Setelah tutorial ini, lanjut ke game interaktif untuk menguji pemahaman modul.
          </div>
        </div>
        </div>
      </section>
      <MaterialModal
        moduleItem={moduleItem}
        open={materialOpen}
        onClose={() => setMaterialOpen(false)}
      />
    </>
  );
}

function MaterialModal({
  moduleItem,
  open,
  onClose,
}: {
  moduleItem: LmsModule;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  const material = getModuleMaterial(moduleItem);

  return (
    <div
      className="fixed inset-0 z-[95] grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden border border-white/10 bg-[#0b0d12] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-white/[0.055] p-5">
          <div className="min-w-0">
            <div
              className="mb-2 inline-flex items-center gap-2 border px-3 py-1 text-sm font-semibold"
              style={{
                borderColor: `${moduleItem.color}44`,
                background: `${moduleItem.color}12`,
                color: moduleItem.color,
              }}
            >
              <BookOpen className="h-4 w-4" />
              Bahan Materi
            </div>
            <h2 id="material-modal-title" className="text-2xl font-semibold text-white">
              {moduleItem.title}: {moduleItem.subtitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Materi detail untuk dipakai sebelum mengerjakan checkpoint dan mini game.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-white/25 hover:text-white"
            aria-label="Tutup bahan materi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-156px)] overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="space-y-4">
              {material.sections.map((section) => (
                <article key={section.title} className="border border-white/10 bg-white/[0.045] p-4">
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}

              <article className="border border-white/10 bg-[#0d1117] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                  <TerminalSquare className="h-4 w-4" style={{ color: moduleItem.color }} />
                  contoh_kode
                </div>
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">
                  <code>{moduleItem.code}</code>
                </pre>
              </article>
            </div>

            <aside className="space-y-4">
              <div
                className="border p-4"
                style={{
                  borderColor: `${moduleItem.color}33`,
                  background: `${moduleItem.color}10`,
                }}
              >
                <h3 className="font-semibold text-white">Fokus Modul</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{moduleItem.focus}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {moduleItem.skills.map((skill) => (
                    <span
                      key={skill}
                      className="border px-2.5 py-1 text-xs font-semibold"
                      style={{
                        borderColor: `${moduleItem.color}44`,
                        background: `${moduleItem.color}12`,
                        color: moduleItem.color,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-black/25 p-4">
                <h3 className="font-semibold text-white">Misi Praktik</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{moduleItem.mission}</p>
              </div>

              <div className="border border-white/10 bg-black/25 p-4">
                <h3 className="font-semibold text-white">Checklist Belajar</h3>
                <div className="mt-3 space-y-2">
                  {material.checklist.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-300">
                      <CheckCircle2
                        className="mt-1 h-4 w-4 shrink-0"
                        style={{ color: moduleItem.color }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/25 p-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="border px-5 py-2 font-semibold text-slate-950 transition hover:brightness-110"
            style={{ borderColor: moduleItem.color, background: moduleItem.color }}
          >
            Tutup materi
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveCodingDemo({
  code,
  color,
  fileName,
  isPlaying,
  output,
}: {
  code: string;
  color: string;
  fileName: string;
  isPlaying: boolean;
  output: string;
}) {
  const [typedText, setTypedText] = useState("");
  const isComplete = typedText.length >= code.length;
  const visibleText =
    typedText || (isPlaying ? "" : "# Tekan Play Tutorial untuk mulai live coding...");
  const lines = visibleText.split("\n");

  useEffect(() => {
    if (!isPlaying || isComplete) {
      return;
    }

    const timer = window.setInterval(() => {
      setTypedText((current) => {
        const nextLength = Math.min(code.length, current.length + Math.max(1, Math.ceil(code.length / 84)));
        return code.slice(0, nextLength);
      });
    }, 48);

    return () => window.clearInterval(timer);
  }, [code, isComplete, isPlaying]);

  return (
    <div className="mt-5 overflow-hidden border border-white/10 bg-[#0b0f16]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/30 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-white">
          <TerminalSquare className="h-4 w-4" style={{ color }} />
          <span className="truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span
            className={cx(
              "inline-flex h-2.5 w-2.5 rounded-full",
              isPlaying && !isComplete ? "animate-pulse" : "",
            )}
            style={{ background: isPlaying && !isComplete ? "#fb7185" : color }}
          />
          {isPlaying && !isComplete ? "REC live coding" : isComplete ? "Run complete" : "Paused"}
        </div>
      </div>

      <div className="max-h-56 overflow-auto bg-[#0d1117] p-3 font-mono text-sm leading-6">
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
            <span className="select-none text-right text-slate-600">{index + 1}</span>
            <pre
              className={cx(
                "min-h-6 whitespace-pre-wrap break-words",
                typedText ? "text-slate-200" : "text-slate-500",
              )}
            >
              <code>{line}</code>
              {index === lines.length - 1 && !isComplete && (
                <motion.span
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="ml-0.5 inline-block h-4 w-2 translate-y-0.5"
                  style={{ background: color }}
                />
              )}
            </pre>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 bg-black/35 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase text-slate-500">
          <Activity className="h-3.5 w-3.5" />
          Terminal output
        </div>
        <p className="font-mono text-sm text-slate-300">
          {isComplete ? output : isPlaying ? "Mengetik kode..." : "Menunggu instruktur menekan Play."}
        </p>
      </div>
    </div>
  );
}

function getTutorialSteps(moduleItem: LmsModule) {
  const firstSkill = moduleItem.skills[0] ?? moduleItem.subtitle;
  const secondSkill = moduleItem.skills[1] ?? moduleItem.focus;
  const codePreview = moduleItem.code.split("\n").slice(0, 7).join("\n");

  return [
    {
      id: "concept",
      title: `Kenali konsep ${moduleItem.subtitle}`,
      narration:
        moduleItem.theory[0] ??
        `Mulai dari gambaran besar ${moduleItem.subtitle} sebelum masuk latihan.`,
      demo: `${moduleItem.title}
Fokus: ${moduleItem.focus}
Skill utama: ${moduleItem.skills.join(", ")}`,
      fileName: "lesson_brief.py",
      output: `Fokus modul ${moduleItem.title} sudah siap.`,
      checkpoint: `Pahami fokus modul: ${moduleItem.focus}.`,
    },
    {
      id: "walkthrough",
      title: `Bedah contoh ${firstSkill}`,
      narration:
        moduleItem.theory[1] ??
        `Perhatikan bagaimana ${firstSkill} dipakai dalam contoh yang tersedia.`,
      demo: codePreview,
      fileName: moduleItem.skills.some((skill) => skill.toLowerCase().includes("widget"))
        ? "main.dart"
        : "live_demo.py",
      output: `Contoh ${firstSkill} berhasil dibedah.`,
      checkpoint: `Temukan bagian kode yang memakai ${firstSkill}.`,
    },
    {
      id: "practice",
      title: `Latihan kecil ${secondSkill}`,
      narration:
        moduleItem.theory[2] ??
        `Sekarang hubungkan konsep dengan tugas praktik yang akan kamu kerjakan.`,
      demo: `Misi:
${moduleItem.mission}

Target:
Gunakan ${moduleItem.skills.slice(0, 3).join(" + ")}.`,
      fileName: "practice_plan.py",
      output: "Misi praktik siap dikerjakan di game interaktif.",
      checkpoint: "Siapkan jawaban untuk game dan live coding setelah panel ini.",
    },
  ];
}

function getModuleMaterial(moduleItem: LmsModule) {
  const primarySkill = moduleItem.skills[0] ?? moduleItem.subtitle;
  const secondarySkill = moduleItem.skills[1] ?? moduleItem.focus;
  const supportingSkill = moduleItem.skills[2] ?? "praktik mandiri";

  return {
    sections: [
      {
        title: "Gambaran Konsep",
        paragraphs: [
          `${moduleItem.subtitle} membahas ${moduleItem.focus.toLowerCase()}. Pada modul ini, materi tidak hanya dibaca sebagai teori, tetapi langsung dihubungkan dengan contoh kode dan latihan interaktif.`,
          moduleItem.theory[0] ??
            `Mulai dari ide utama ${moduleItem.subtitle}, lalu perhatikan bagaimana konsep tersebut muncul dalam contoh program.`,
          `Target pemahaman awalnya adalah siswa dapat menjelaskan kapan ${primarySkill} dipakai, mengapa fitur itu penting, dan bagaimana pengaruhnya terhadap alur program.`,
        ],
      },
      {
        title: "Pembahasan Detail",
        paragraphs: [
          moduleItem.theory[1] ??
            `Bagian ini menekankan penggunaan ${primarySkill} dalam kasus nyata yang dekat dengan proyek siswa.`,
          `${secondarySkill} perlu diperhatikan karena biasanya menjadi titik yang menentukan apakah program hanya berjalan, atau benar-benar mudah dibaca dan mudah diperbaiki.`,
          `Saat membaca contoh, cari bagian kode yang membuat data masuk, diproses, lalu menghasilkan output. Pola input, proses, dan output ini membantu kamu membedah program yang lebih besar.`,
        ],
      },
      {
        title: "Cara Mengerjakan Latihan",
        paragraphs: [
          moduleItem.theory[2] ??
            `Hubungkan konsep ${supportingSkill} dengan misi praktik yang diberikan agar latihan tidak berhenti di hafalan sintaks.`,
          `Kerjakan misi dengan urutan sederhana: pahami kebutuhan, tulis struktur awal, lengkapi logika utama, lalu cek output. Jika hasil belum sesuai, baca pesan error atau perilaku program dari bagian yang paling kecil.`,
          `Gunakan skill ${moduleItem.skills.join(", ")} sebagai acuan utama saat menyelesaikan mini game dan live coding.`,
        ],
      },
    ],
    checklist: [
      `Saya bisa menjelaskan fokus modul: ${moduleItem.focus}.`,
      `Saya menemukan penggunaan ${primarySkill} pada contoh kode.`,
      `Saya memahami hubungan contoh kode dengan misi: ${moduleItem.mission}`,
      `Saya siap mengerjakan checkpoint video dan mini game tanpa hanya menebak jawaban.`,
    ],
  };
}

function getSeededGameIds(moduleItem: LmsModule, progress?: ProgressItem) {
  const seededCount = progress?.completed
    ? moduleItem.games.length
    : Math.floor(((progress?.score ?? 0) / 100) * moduleItem.games.length);
  const safeCount = Math.max(0, Math.min(moduleItem.games.length, seededCount));

  return moduleItem.games.slice(0, safeCount).map((game) => game.id);
}

function MiniGamePanel({
  hintUses,
  moduleItem,
  progress,
  onResetHints,
  onUseHint,
  onProgress,
}: {
  hintUses: number;
  moduleItem: LmsModule;
  progress?: ProgressItem;
  onResetHints: () => void;
  onUseHint: () => boolean;
  onProgress: (score: number, completed: boolean) => void;
}) {
  const initialCompletedGameIds = getSeededGameIds(moduleItem, progress);
  const initialActiveGame =
    moduleItem.games[initialCompletedGameIds.length] ??
    moduleItem.games[moduleItem.games.length - 1];
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeGameId, setActiveGameId] = useState(initialActiveGame.id);
  const [completedGameIds, setCompletedGameIds] = useState<string[]>(
    initialCompletedGameIds,
  );
  const [failedGameIds, setFailedGameIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameResetKey, setGameResetKey] = useState(0);
  const [isChallengeStarted, setIsChallengeStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODULE_GAME_SECONDS);

  const activeGame =
    moduleItem.games.find((game) => game.id === activeGameId) ?? moduleItem.games[0];
  const activeGameIndex = moduleItem.games.findIndex((game) => game.id === activeGame.id);
  const savedCompletedGameIds = getSeededGameIds(moduleItem, progress);
  const effectiveCompletedGameIds = isChallengeStarted
    ? completedGameIds
    : savedCompletedGameIds;
  const completedGameCount = effectiveCompletedGameIds.length;
  const gameScore = Math.round((completedGameCount / moduleItem.games.length) * 100);
  const isActiveGameComplete = completedGameIds.includes(activeGame.id);
  const isTimeUp = timeLeft <= 0 && !progress?.completed;
  const remainingHints = Math.max(0, MAX_HINTS_PER_MODULE - hintUses);
  const canOpenHint = remainingHints > 0 && isChallengeStarted && !isTimeUp;
  const isActiveGameLocked = failedGameIds.includes(activeGame.id);

  useEffect(() => {
    if (!isChallengeStarted || isTimeUp || progress?.completed) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isChallengeStarted, isTimeUp, progress?.completed]);

  function startChallenge() {
    setCompletedGameIds(savedCompletedGameIds);
    setFailedGameIds([]);
    setActiveGameId(
      moduleItem.games[savedCompletedGameIds.length]?.id ??
        moduleItem.games[moduleItem.games.length - 1].id,
    );
    setIsChallengeStarted(true);
    setTimeLeft(MODULE_GAME_SECONDS);
    setStatus(savedCompletedGameIds.length > 0 ? "success" : "idle");
    setShowHint(false);
  }

  function openHint() {
    if (!canOpenHint) {
      return;
    }

    if (onUseHint()) {
      setShowHint(true);
    }
  }

  function restartModule() {
    setCompletedGameIds([]);
    setFailedGameIds([]);
    setActiveGameId(moduleItem.games[0].id);
    setAttempts(0);
    setWrongAttempts(0);
    setStreak(0);
    setShowHint(false);
    setStatus("idle");
    setGameResetKey((current) => current + 1);
    setIsChallengeStarted(false);
    setTimeLeft(MODULE_GAME_SECONDS);
    onResetHints();
    onProgress(0, false);
  }

  function completeGame() {
    if (!isChallengeStarted || isTimeUp) {
      return;
    }

    if (isActiveGameComplete) {
      setStatus("success");
      return;
    }

    const nextCompletedIds = moduleItem.games
      .slice(0, activeGameIndex + 1)
      .map((game) => game.id);
    const nextScore = Math.round((nextCompletedIds.length / moduleItem.games.length) * 100);
    const isModuleComplete = nextCompletedIds.length === moduleItem.games.length;

    setCompletedGameIds(nextCompletedIds);
    setAttempts((current) => current + 1);
    setWrongAttempts(0);
    setStreak((current) => current + 1);
    setShowHint(false);
    setStatus("success");
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.76 },
      colors: [moduleItem.color, "#ffffff", "#ffd166", "#74d4ff"],
    });
    onProgress(nextScore, isModuleComplete);

    if (!isModuleComplete) {
      const nextGame = moduleItem.games[activeGameIndex + 1];
      window.setTimeout(() => {
        setActiveGameId(nextGame.id);
        setStatus("idle");
        setShowHint(false);
      }, 700);
    }
  }

  function missGame() {
    if (!isChallengeStarted || isTimeUp) {
      return;
    }

    setFailedGameIds((current) =>
      current.includes(activeGame.id) ? current : [...current, activeGame.id],
    );
    setAttempts((current) => current + 1);
    setStreak(0);
    setWrongAttempts(1);
    setShowHint(false);
    setStatus("error");
    onProgress(gameScore, false);
  }

  return (
    <section
      className="border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:p-5"
      style={{ boxShadow: `0 0 36px ${moduleItem.color}14` }}
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Gamepad2 className="h-4 w-4" />
            Mini game {activeGameIndex + 1}/{moduleItem.games.length} setelah teori
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <div
            className="border px-3 py-2 text-sm font-semibold"
            style={{
              borderColor: `${moduleItem.color}66`,
              background: `${moduleItem.color}14`,
              color: moduleItem.color,
            }}
          >
            Score modul: {gameScore}/100
          </div>
          <div
            className={cx(
              "inline-flex items-center gap-2 border px-3 py-2 font-mono text-sm font-semibold",
              isTimeUp
                ? "border-rose-300/40 bg-rose-300/10 text-rose-100"
                : "border-white/10 bg-black/30 text-white",
            )}
          >
            <Timer className="h-4 w-4" />
            {formatDuration(timeLeft)}
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <MiniGameStat icon={Award} label="Streak" value={`${streak} benar`} color={moduleItem.color} />
        <MiniGameStat icon={Timer} label="Percobaan" value={`${attempts} run`} color="#ffd166" />
        <MiniGameStat
          icon={AlertCircle}
          label="Salah"
          value={`${wrongAttempts}/1`}
          color="#74d4ff"
        />
        <button
          type="button"
          disabled={!canOpenHint}
          onClick={openHint}
          className={cx(
            "flex min-h-20 items-center gap-3 border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-55",
            canOpenHint
                ? "border-white/10 bg-black/20 text-slate-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.075]"
                : "border-white/5 bg-black/20 text-slate-600",
          )}
        >
          <Lightbulb className="h-5 w-5 shrink-0" />
          <span>
            <span className="block text-xs uppercase text-slate-500">Hint</span>
            <span className="block font-semibold">
              {remainingHints > 0 ? `${remainingHints} tersisa` : "Habis"}
            </span>
          </span>
        </button>
      </div>

      {!isChallengeStarted ? (
        <MiniGameStartPanel
          color={moduleItem.color}
          moduleItem={moduleItem}
          onStart={startChallenge}
        />
      ) : isTimeUp ? (
        <MiniGameTimeUpPanel color={moduleItem.color} onRestart={restartModule} />
      ) : (
        <>
      <div className="mb-5 grid gap-2 sm:grid-cols-5">
        {moduleItem.games.map((game, index) => {
          const isActive = activeGame.id === game.id;
          const isComplete = completedGameIds.includes(game.id);
          const isFailed = failedGameIds.includes(game.id);
          const isLocked = index > completedGameCount;

          return (
            <button
              key={game.id}
              type="button"
              disabled={isLocked}
              onClick={() => {
                setActiveGameId(game.id);
                setStatus(
                  completedGameIds.includes(game.id)
                    ? "success"
                    : failedGameIds.includes(game.id)
                      ? "error"
                      : "idle",
                );
                setShowHint(false);
              }}
              className={cx(
                "min-h-20 border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45",
                isActive
                  ? "border-white/35 bg-white/[0.13] text-white"
                  : "border-white/10 bg-black/20 text-slate-300 hover:border-white/25",
              )}
              style={isActive ? { boxShadow: `0 0 22px ${moduleItem.color}20` } : undefined}
            >
              <span className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                Game {index + 1}
                {isComplete && (
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: moduleItem.color }} />
                )}
                {isFailed && <X className="h-4 w-4 shrink-0 text-rose-200" />}
              </span>
              <span className="line-clamp-2 text-sm font-semibold">{game.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <h3 className="break-words text-2xl font-semibold text-white">
          {activeGame.title}
        </h3>
        <p className="mt-2 max-w-3xl leading-7 text-slate-300">
          {activeGame.prompt}
        </p>
      </div>

      <div key={`${activeGame.id}-${gameResetKey}`}>
        {activeGame.kind === "sequence" && (
          <SequenceGameView
            game={activeGame}
            color={moduleItem.color}
            isComplete={isActiveGameComplete}
            isLocked={isActiveGameLocked}
            onComplete={completeGame}
            onMiss={missGame}
          />
        )}
        {activeGame.kind === "choice" && (
          <ChoiceGameView
            game={activeGame}
            color={moduleItem.color}
            isComplete={isActiveGameComplete}
            isLocked={isActiveGameLocked}
            onComplete={completeGame}
            onMiss={missGame}
          />
        )}
        {activeGame.kind === "locate" && (
          <LocateGameView
            game={activeGame}
            color={moduleItem.color}
            isComplete={isActiveGameComplete}
            isLocked={isActiveGameLocked}
            onComplete={completeGame}
            onMiss={missGame}
          />
        )}
        {activeGame.kind === "output" && (
          <OutputGameView
            game={activeGame}
            color={moduleItem.color}
            isComplete={isActiveGameComplete}
            isLocked={isActiveGameLocked}
            onComplete={completeGame}
            onMiss={missGame}
          />
        )}
        {activeGame.kind === "live-code" && (
          <LiveCodeGameView
            game={activeGame}
            color={moduleItem.color}
            isComplete={isActiveGameComplete}
            isLocked={isActiveGameLocked}
            onComplete={completeGame}
            onMiss={missGame}
          />
        )}
      </div>

      <div
        className={cx(
          "mt-4 border p-3 text-sm transition",
          status === "success"
            ? "border-emerald-300/25 bg-emerald-300/10"
            : status === "error"
              ? "border-amber-300/25 bg-amber-300/10"
              : "border-white/10 bg-black/20",
        )}
        aria-live="polite"
      >
        {(status === "success" || isActiveGameComplete) && (
          <p className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Game selesai. Progress modul tersimpan.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-start gap-2 text-amber-100">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Belum tepat. Soal terkunci dan score berhenti di {gameScore}/100 agar kemampuan
              siswa terlihat sampai titik ini.
            </span>
          </p>
        )}
        {status === "idle" && !isActiveGameComplete && (
          <p>Selesaikan game berurutan untuk membuka semua tantangan modul.</p>
        )}
      </div>
        </>
      )}
      {showHint && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div
            className="w-full max-w-md border border-amber-300/25 bg-[#0b0d12] p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hint-modal-title"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 text-amber-100">
                <div className="grid h-10 w-10 shrink-0 place-items-center border border-amber-300/25 bg-amber-300/10">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase text-slate-500">Hint aktif</p>
                  <h3 id="hint-modal-title" className="break-words text-xl font-semibold text-white">
                    {activeGame.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
                aria-label="Tutup hint"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="leading-7 text-slate-300">{activeGame.hint}</p>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="mt-5 w-full border border-amber-300/40 bg-amber-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function MiniGameStartPanel({
  color,
  moduleItem,
  onStart,
}: {
  color: string;
  moduleItem: LmsModule;
  onStart: () => void;
}) {
  return (
    <div className="relative overflow-hidden border border-white/10 bg-[#070a10] p-5 md:p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(135deg, ${color}20, transparent 34%), radial-gradient(circle at 82% 18%, ${color}22, transparent 28%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div className="min-w-0">
          <div
            className="mb-4 inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              borderColor: `${color}44`,
              background: `${color}12`,
              color,
            }}
          >
            <CircleDot className="h-4 w-4" />
            Locked Assessment
          </div>
          <h3 className="max-w-3xl text-3xl font-semibold text-white md:text-4xl">
            Siap mulai tantangan {moduleItem.subtitle}?
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-black/25 p-3">
              <p className="text-xs uppercase text-slate-500">Durasi</p>
              <p className="mt-1 font-mono text-xl font-semibold text-white">15:00</p>
            </div>
            <div className="border border-white/10 bg-black/25 p-3">
              <p className="text-xs uppercase text-slate-500">Game</p>
              <p className="mt-1 text-xl font-semibold text-white">{moduleItem.games.length} tahap</p>
            </div>
            <div className="border border-white/10 bg-black/25 p-3">
              <p className="text-xs uppercase text-slate-500">Hint</p>
              <p className="mt-1 text-xl font-semibold text-white">{MAX_HINTS_PER_MODULE} bantuan</p>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-black/30 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center border"
              style={{
                borderColor: `${color}55`,
                background: `${color}14`,
                color,
              }}
            >
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Target</p>
              <p className="font-semibold text-white">Score 100/100</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Kerjakan berurutan. Setiap game hanya punya 1 kesempatan menjawab, dan game
            berikutnya terbuka setelah game aktif selesai.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 border px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110"
            style={{ borderColor: color, background: color }}
          >
            <Play className="h-5 w-5" />
            Mulai Mini Game
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniGameTimeUpPanel({
  color,
  onRestart,
}: {
  color: string;
  onRestart: () => void;
}) {
  return (
    <div className="border border-rose-300/25 bg-rose-300/10 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 border border-rose-300/35 bg-rose-300/10 px-3 py-1 text-sm font-semibold text-rose-100">
            <Timer className="h-4 w-4" />
            Waktu Habis
          </div>
          <h3 className="text-2xl font-semibold text-white">Sesi 15 menit sudah selesai.</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Soal dikunci agar pengerjaan tetap adil. Mulai ulang modul untuk mendapatkan sesi
            15 menit yang baru.
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex shrink-0 items-center justify-center gap-2 border px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110"
          style={{ borderColor: color, background: color }}
        >
          <RotateCcw className="h-5 w-5" />
          Mulai Ulang
        </button>
      </div>
    </div>
  );
}

function MiniGameStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex min-h-20 items-center gap-3 border border-white/10 bg-black/20 p-3">
      <div
        className="grid h-10 w-10 shrink-0 place-items-center border"
        style={{
          borderColor: `${color}55`,
          background: `${color}14`,
          color,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase text-slate-500">{label}</p>
        <p className="truncate font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function SequenceGameView({
  game,
  color,
  isComplete,
  isLocked,
  onComplete,
  onMiss,
}: {
  game: SequenceGame;
  color: string;
  isComplete: boolean;
  isLocked: boolean;
  onComplete: () => void;
  onMiss: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [bankOrder, setBankOrder] = useState(() => shuffleItems(game.options));
  const [locked, setLocked] = useState(false);
  const [lastResult, setLastResult] = useState<"idle" | "wrong" | "correct">("idle");

  const remaining = bankOrder.filter((option) => !selected.includes(option));
  const isReadOnly = locked || isComplete || isLocked;
  const canCheck = selected.length === game.answer.length && !isReadOnly;
  const progressValue = Math.round((selected.length / game.answer.length) * 100);

  function addToken(option: string) {
    setSelected((items) => [...items, option]);
    setLastResult("idle");
  }

  function removeToken(index: number) {
    setSelected((items) => items.filter((_, itemIndex) => itemIndex !== index));
    setLastResult("idle");
  }

  function moveToken(index: number, direction: -1 | 1) {
    setSelected((items) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= items.length) {
        return items;
      }

      const nextItems = [...items];
      const [item] = nextItems.splice(index, 1);
      nextItems.splice(nextIndex, 0, item);
      return nextItems;
    });
    setLastResult("idle");
  }

  function resetGame() {
    setSelected([]);
    setLastResult("idle");
  }

  function checkAnswer() {
    const correct = selected.every((item, index) => item === game.answer[index]);
    if (correct) {
      setLocked(true);
      setLastResult("correct");
      onComplete();
    } else {
      setLocked(true);
      setLastResult("wrong");
      onMiss();
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="border border-white/10 bg-black/25 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-white">Token Bank</h4>
            <span className="text-xs text-slate-500">{remaining.length} tersisa</span>
          </div>
          <button
            type="button"
            disabled={isReadOnly || remaining.length < 2}
            onClick={() =>
              setBankOrder((items) =>
                [...items].sort(() => Math.random() - 0.5),
              )
            }
            className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </button>
        </div>
        <div className="space-y-2">
          {remaining.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isReadOnly}
              onClick={() => addToken(option)}
              className="group w-full border border-white/10 bg-white/[0.055] p-3 text-left font-mono text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="break-words">{option}</span>
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={cx(
          "border bg-[#0d1117] p-4 transition",
          lastResult === "wrong" ? "border-amber-300/35" : "border-white/10",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="font-semibold text-white">Runtime Order</h4>
          <button
            type="button"
            disabled={isReadOnly || selected.length === 0}
            onClick={resetGame}
            className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
        <div className="mb-3 h-1.5 bg-white/10">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progressValue}%`, background: color }}
          />
        </div>
        <div className="min-h-40 space-y-2">
          {selected.length === 0 ? (
            <p className="border border-dashed border-white/10 p-4 text-sm text-slate-500">
              Token yang dipilih akan membentuk runtime order di sini.
            </p>
          ) : (
            selected.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex w-full items-start gap-3 border border-white/10 bg-black/25 p-3 text-left font-mono text-sm text-slate-200"
              >
                <span className="text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 break-words">{item}</span>
                <div className="flex shrink-0 flex-wrap gap-1">
                  <button
                    type="button"
                    disabled={isReadOnly || index === 0}
                    onClick={() => moveToken(index, -1)}
                    className="border border-white/10 px-2 py-1 text-xs text-slate-400 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Naik
                  </button>
                  <button
                    type="button"
                    disabled={isReadOnly || index === selected.length - 1}
                    onClick={() => moveToken(index, 1)}
                    className="border border-white/10 px-2 py-1 text-xs text-slate-400 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Turun
                  </button>
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => removeToken(index)}
                    className="grid h-7 w-7 place-items-center border border-white/10 text-slate-400 transition hover:border-rose-300/35 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Hapus token"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {lastResult === "wrong" && (
          <p className="mt-3 border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
            Urutan belum sesuai. Soal terkunci karena kesempatan menjawab hanya 1 kali.
          </p>
        )}
        <button
          type="button"
          disabled={!canCheck}
          onClick={checkAnswer}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-white/10 bg-slate-800 px-4 py-3 font-semibold text-slate-400 transition enabled:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          style={canCheck ? { borderColor: color, background: color } : undefined}
        >
          <Send className="h-4 w-4" />
          Run Check
        </button>
      </div>
    </div>
  );
}

function ChoiceGameView({
  game,
  color,
  isComplete,
  isLocked,
  onComplete,
  onMiss,
}: {
  game: ChoiceGame;
  color: string;
  isComplete: boolean;
  isLocked: boolean;
  onComplete: () => void;
  onMiss: () => void;
}) {
  const [optionOrder] = useState(() => shuffleItems(game.options));
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const isReadOnly = locked || isComplete || isLocked;

  function choose(option: string) {
    if (isReadOnly || wrongOptions.includes(option)) {
      return;
    }

    setSelected(option);
    if (option === game.answer) {
      setLocked(true);
      onComplete();
    } else {
      setLocked(true);
      setWrongOptions((items) => [...items, option]);
      onMiss();
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
      {optionOrder.map((option, index) => {
        const isSelected = selected === option;
        const isCorrect = isReadOnly && option === game.answer;
        const isWrong = wrongOptions.includes(option);

        return (
          <button
            key={option}
            type="button"
            disabled={isReadOnly || isWrong}
            onClick={() => choose(option)}
            className={cx(
              "min-h-24 border p-4 text-left text-lg font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed",
              isCorrect
                ? "border-emerald-300/40 bg-emerald-300/10 text-white"
                : isWrong
                  ? "border-rose-300/35 bg-rose-300/10 text-rose-100 opacity-80"
                  : isSelected
                ? "border-white/40 bg-white/[0.14] text-white"
                : "border-white/10 bg-black/25 text-slate-300 hover:border-white/25 hover:bg-white/[0.075]",
            )}
            style={isCorrect ? { borderColor: color, boxShadow: `0 0 28px ${color}26` } : undefined}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center border border-white/10 bg-black/25 text-xs text-slate-400">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="break-words">{option}</span>
              </span>
              {isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color }} />}
              {isWrong && <X className="h-5 w-5 shrink-0" />}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}

function LocateGameView({
  game,
  color,
  isComplete,
  isLocked,
  onComplete,
  onMiss,
}: {
  game: LocateGame;
  color: string;
  isComplete: boolean;
  isLocked: boolean;
  onComplete: () => void;
  onMiss: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongLineIds, setWrongLineIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const isReadOnly = locked || isComplete || isLocked;

  function choose(lineId: string) {
    if (isReadOnly || wrongLineIds.includes(lineId)) {
      return;
    }

    setSelected(lineId);
    if (lineId === game.answer) {
      setLocked(true);
      onComplete();
    } else {
      setLocked(true);
      setWrongLineIds((items) => [...items, lineId]);
      onMiss();
    }
  }

  return (
    <div className="border border-white/10 bg-[#0d1117] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Bug className="h-4 w-4 text-amber-200" />
          bug_scan.py
        </div>
        <span className="border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-400">
          Scan {wrongLineIds.length}/{game.codeLines.length}
        </span>
      </div>
      <div className="space-y-2">
        {game.codeLines.map((line) => {
          const isSelected = selected === line.id;
          const isCorrect = isReadOnly && line.id === game.answer;
          const isWrong = wrongLineIds.includes(line.id);

          return (
            <button
              key={line.id}
              type="button"
              disabled={isReadOnly || isWrong}
              onClick={() => choose(line.id)}
              className={cx(
                "group flex w-full items-start gap-3 border p-3 text-left font-mono text-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed",
                isCorrect
                  ? "border-emerald-300/40 bg-emerald-300/10 text-white"
                  : isWrong
                    ? "border-rose-300/35 bg-rose-300/10 text-rose-100 opacity-80"
                    : isSelected
                      ? "border-white/35 bg-white/[0.12] text-white"
                      : "border-white/10 bg-black/25 text-slate-200 hover:border-white/25",
              )}
              style={isCorrect ? { borderColor: color, boxShadow: `0 0 28px ${color}22` } : undefined}
            >
              <span className="shrink-0 text-slate-500">{line.label}</span>
              <span className="break-words">{line.text}</span>
              <span className="ml-auto shrink-0">
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" style={{ color }} />
                ) : isWrong ? (
                  <X className="h-4 w-4" />
                ) : (
                  <MousePointer2 className="h-4 w-4 text-slate-600 opacity-0 transition group-hover:opacity-100" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OutputGameView({
  game,
  color,
  isComplete,
  isLocked,
  onComplete,
  onMiss,
}: {
  game: OutputGame;
  color: string;
  isComplete: boolean;
  isLocked: boolean;
  onComplete: () => void;
  onMiss: () => void;
}) {
  const [optionOrder] = useState(() => shuffleItems(game.options));
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const isReadOnly = locked || isComplete || isLocked;

  function choose(option: string) {
    if (isReadOnly || wrongOptions.includes(option)) {
      return;
    }

    setSelected(option);
    if (option === game.answer) {
      setLocked(true);
      onComplete();
    } else {
      setLocked(true);
      setWrongOptions((items) => [...items, option]);
      onMiss();
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="border border-white/10 bg-[#0d1117] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <TerminalSquare className="h-4 w-4 text-emerald-200" />
          output_probe.py
        </div>
        <pre className="overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">
          <code>{game.code}</code>
        </pre>
        <div className="mt-4 border border-white/10 bg-black/30 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase text-slate-500">
            <Activity className="h-3.5 w-3.5" />
            Prediksi terminal
          </div>
          <p
            className={cx(
              "min-h-8 font-mono text-sm",
              isReadOnly
                ? "text-emerald-200"
                : selected
                  ? "text-amber-100"
                  : "text-slate-500",
            )}
          >
            {selected ?? "Menunggu pilihan output..."}
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        {optionOrder.map((option) => {
          const isSelected = selected === option;
          const isCorrect = isReadOnly && option === game.answer;
          const isWrong = wrongOptions.includes(option);

          return (
            <button
              key={option}
              type="button"
              disabled={isReadOnly || isWrong}
              onClick={() => choose(option)}
              className={cx(
                "border p-3 text-left font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed",
                isCorrect
                  ? "border-emerald-300/40 bg-emerald-300/10 text-white"
                  : isWrong
                    ? "border-rose-300/35 bg-rose-300/10 text-rose-100 opacity-80"
                    : isSelected
                      ? "border-white/40 bg-white/[0.14] text-white"
                      : "border-white/10 bg-black/25 text-slate-300 hover:border-white/25 hover:bg-white/[0.075]",
              )}
              style={isCorrect ? { borderColor: color, boxShadow: `0 0 28px ${color}26` } : undefined}
            >
              <span className="flex items-center justify-between gap-3">
                {option}
                {isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color }} />}
                {isWrong && <X className="h-5 w-5 shrink-0" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LiveCodeGameView({
  game,
  color,
  isComplete,
  isLocked,
  onComplete,
  onMiss,
}: {
  game: LiveCodeGame;
  color: string;
  isComplete: boolean;
  isLocked: boolean;
  onComplete: () => void;
  onMiss: () => void;
}) {
  const [code, setCode] = useState(game.starter);
  const [attempted, setAttempted] = useState(false);
  const [locked, setLocked] = useState(false);
  const isReadOnly = locked || isComplete || isLocked;

  const checkResults = game.checks.map((check) => ({
    ...check,
    passed: new RegExp(check.pattern, check.flags).test(code),
  }));
  const allPassed = checkResults.every((check) => check.passed);
  const passedCount = checkResults.filter((check) => check.passed).length;
  const validationProgress = Math.round((passedCount / checkResults.length) * 100);
  const lineCount = code.split("\n").length;
  const charCount = code.length;

  function runValidator() {
    if (isReadOnly) {
      return;
    }

    setAttempted(true);

    if (allPassed) {
      setLocked(true);
      onComplete();
    } else {
      setLocked(true);
      onMiss();
    }
  }

  function updateCode(value: string) {
    setCode(value);
    setAttempted(false);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="border border-white/10 bg-[#0d1117]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <TerminalSquare className="h-4 w-4 text-emerald-200" />
            live_editor.py
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <Keyboard className="h-3.5 w-3.5" />
            Editor aktif
          </div>
          <button
            type="button"
            disabled={isReadOnly}
            onClick={() => {
              setCode(game.starter);
              setAttempted(false);
            }}
            className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
        <textarea
          value={code}
          disabled={isReadOnly}
          spellCheck={false}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              runValidator();
            }
          }}
          onChange={(event) => updateCode(event.target.value)}
          className="min-h-80 w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 outline-none disabled:opacity-80"
        />
        <div className="grid gap-2 border-t border-white/10 bg-black/20 p-3 text-xs text-slate-400 sm:grid-cols-3">
          <span>{lineCount} baris</span>
          <span>{charCount} karakter</span>
          <span>{passedCount}/{checkResults.length} valid</span>
        </div>
      </div>

      <div className="border border-white/10 bg-black/25 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="font-semibold text-white">Validator</h4>
          <span
            className="border px-2 py-1 text-xs font-semibold"
            style={{
              borderColor: `${color}44`,
              background: `${color}12`,
              color,
            }}
          >
            {validationProgress}%
          </span>
        </div>
        <div className="mb-3 h-1.5 bg-white/10">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${validationProgress}%`, background: color }}
          />
        </div>
        <div className="space-y-2">
          {game.requirements.map((requirement, index) => {
            const result = checkResults[index];

            return (
              <div
                key={requirement}
                className={cx(
                  "flex items-start gap-2 border p-3 text-sm transition",
                  result?.passed
                    ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-50"
                    : "border-white/10 bg-white/[0.045] text-slate-300",
                )}
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: result?.passed ? color : "#64748b" }}
                />
                <span>{requirement}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={isReadOnly}
          onClick={runValidator}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 border px-4 py-3 font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{ borderColor: color, background: color }}
        >
          <Send className="h-4 w-4" />
          Run Validator
        </button>

        <div className="mt-3 border border-white/10 bg-[#0d1117] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase text-slate-500">
            <TerminalSquare className="h-3.5 w-3.5" />
            Console
          </div>
          <p className="font-mono text-sm text-slate-300">
            {isComplete || (attempted && allPassed)
              ? game.successMessage
              : attempted
                ? "Validator menemukan syarat yang belum terpenuhi. Soal terkunci."
                : isReadOnly
                  ? "Soal terkunci karena kesempatan menjawab sudah dipakai."
                  : "Validator siap mengecek kode."}
          </p>
        </div>

        {attempted && allPassed && (
          <p className="mt-3 border border-emerald-300/25 bg-emerald-300/10 p-3 text-sm text-emerald-100">
            {game.successMessage}
          </p>
        )}
      </div>
    </div>
  );
}

function RightPanel({
  activeModule,
  completedCount,
  course,
  moduleItems,
  progress,
  onSelectModule,
}: {
  activeModule: LmsModule;
  completedCount: number;
  course: LmsCourse;
  moduleItems: LmsModule[];
  progress: ProgressMap;
  onSelectModule: (id: number) => void;
}) {
  return (
    <aside className="space-y-4">
      <section className="border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
        <div className="mb-4 flex items-center gap-2 text-white">
          <LineChart className="h-5 w-5 text-emerald-200" />
          <h3 className="text-lg font-semibold">Learning Analytics</h3>
        </div>
        <div className="grid gap-3">
          <AnalyticsRow label="Course" value={course.shortTitle} />
          <AnalyticsRow label="Modul selesai" value={`${completedCount}/${moduleItems.length}`} />
          <AnalyticsRow label="Game per modul" value={`${gamesPerModule} game`} />
          <AnalyticsRow
            label="Durasi kurikulum"
            value={`${moduleItems.reduce((total, item) => total + item.minutes, 0)} menit`}
          />
        </div>
      </section>

      <section className="border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
        <div className="space-y-2">
          {moduleItems.map((moduleItem) => {
            const isActive = moduleItem.id === activeModule.id;
            const itemProgress = progress[moduleItem.id];
            const isUnlocked = isModuleUnlocked(moduleItem.id, progress, moduleItems);

            return (
              <button
                key={moduleItem.id}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectModule(moduleItem.id)}
                className={cx(
                  "flex w-full items-center justify-between gap-3 border p-3 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed",
                  !isUnlocked
                    ? "border-white/5 bg-black/20 opacity-70"
                    : isActive
                      ? "border-white/30 bg-white/[0.12]"
                      : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[0.075]",
                )}
              >
                <div className="min-w-0">
                  <p className={cx("truncate text-sm", isUnlocked ? "text-white" : "text-slate-500")}>
                    {moduleItem.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isUnlocked
                      ? `${moduleItem.games.length} game interaktif`
                      : "Terkunci sampai modul sebelumnya selesai"}
                  </p>
                </div>
                <span
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
                  style={{ color: itemProgress?.completed ? moduleItem.color : "#94a3b8" }}
                >
                  {!isUnlocked && <Lock className="h-4 w-4" />}
                  {isUnlocked ? (itemProgress?.score ?? "--") : "--"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

    </aside>
  );
}

function StatusPill({
  icon: Icon,
  label,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  tone: "good" | "info" | "warn";
}) {
  const toneClass = {
    good: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    info: "border-sky-300/30 bg-sky-300/10 text-sky-100",
    warn: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  }[tone];

  return (
    <span className={cx("inline-flex items-center gap-2 border px-3 py-2", toneClass)}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase">{label}</span>
      </div>
      <p className="break-words text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function AnalyticsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-white/10 bg-black/20 px-3 py-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function ProgressRing({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${value * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
      }}
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#0b0d12] text-sm font-semibold text-white">
        {value}%
      </div>
    </div>
  );
}
