import { redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/modules";

export default function PemrogramanWebPage() {
  const course = getCourseBySlug("pemrograman-web");
  redirect(`/course/${course.slug}/${course.modules[0].slug}`);
}
