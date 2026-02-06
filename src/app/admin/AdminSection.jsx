import AdminNavbar from "./AdminNavbar"
import Sidebar from "./AdminSideBar"

export default ({ children }) => (  // Changed { to (
    <div>
        <AdminNavbar />
        <div className="flex">
            <Sidebar />
            <main className="flex-grow p-6">
                {children}
            </main>
        </div>
    </div>
);