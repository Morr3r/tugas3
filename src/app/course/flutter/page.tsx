import { redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/modules";

export default function FlutterPage() {
  const course = getCourseBySlug("flutter");
  redirect(`/course/${course.slug}/${course.modules[0].slug}`);
}
