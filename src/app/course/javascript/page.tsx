import { redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/modules";

export default function JavaScriptPage() {
  const course = getCourseBySlug("javascript");
  redirect(`/course/${course.slug}/${course.modules[0].slug}`);
}
