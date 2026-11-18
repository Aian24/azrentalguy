import { redirect } from "next/navigation";

export default async function BookNowPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const eq = params.equipment;
  if (eq && typeof eq === "string") {
    redirect(`/?equipment=${encodeURIComponent(eq)}#Booknow`);
  }
  redirect("/#Booknow");
}
