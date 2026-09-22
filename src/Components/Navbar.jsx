import Link from "next/link"

export default ({user}) => {
    let title = "UGV Portal";
    let home = "/";
    if (user?.user_type?.toLowerCase() === "admin") {
        title = "Admin Portal";
        home = "/admin";
    } else if (user?.user_type?.toLowerCase() === "exam") {
        title = "Exam Controller Portal";
        home = "/exam";
    } else if (user?.user_type?.toLowerCase() === "teacher") {
        title = "Teacher Portal";
        home = "/teacher";
    } else if (user?.user_type?.toLowerCase() === "student") {
        title = "Student Portal";
        home = "/student";
    } else if (user?.user_type?.toLowerCase() === "admission") {
        title = "Admission Portal";
        home = "/admission";
    } else if (user?.user_type?.toLowerCase() === "accountant") {
        title = "Accounts Portal";
        home = "/accountant";
    } 
    return <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href={home} className="flex items-center gap-3">
                <img
                    src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                    alt="UGV Logo"
                    className="h-10 w-auto"
                />
                <div>
                    <h1 className="text-xl font-bold text-slate-800 leading-tight">{title}</h1>
                    <p className="text-xs text-purple-600 font-medium">University of Global Village</p>
                </div>
            </Link>
            <form action="/logout" method="POST">
                <button
                    className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                >
                    Logout
                </button>
            </form>

        </div>
    </header>
}
