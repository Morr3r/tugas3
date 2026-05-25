import { notFound } from "next/navigation";
import { LmsModuleDashboard } from "@/components/LmsDashboard";
import { lmsCourses } from "@/lib/modules";

type CourseModulePageProps = {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return lmsCourses.flatMap((course) =>
    course.modules.map((moduleItem) => ({
      courseSlug: course.slug,
      moduleSlug: moduleItem.slug,
    })),
  );
}

export default async function CourseModulePage({ params }: CourseModulePageProps) {
  const { courseSlug, moduleSlug } = await params;
  const course = lmsCourses.find((courseItem) => courseItem.slug === courseSlug);
  const moduleItem = course?.modules.find((item) => item.slug === moduleSlug);

  if (!course || !moduleItem) {
    notFound();
  }

  return (
    <LmsModuleDashboard
      key={`${course.slug}-${moduleItem.slug}`}
      courseSlug={course.slug}
      initialModuleSlug={moduleItem.slug}
    />
  );
}
