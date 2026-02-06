import ProfilePage from "./ProfilePage";
import getUserProfile from "./getUserProfile";

export const metadata = {
    title: "Dashboard - Code Assesment Arena",
    description: "Your dashboard.",
};

export default async function Page({ params }) {
    const { id } = await params;
    const data = await getUserProfile(id);
    return <ProfilePage data={data} />;
}
