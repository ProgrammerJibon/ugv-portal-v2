import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import { redirect } from "next/navigation";

export default async ({ params }) => {
    const { subjectId } = await params;
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "teacher") {
            redirect(`/teacher/subjects/${subjectId}/materials`);
        }
    }
    redirect("/");
};
