import Navbar from "./Navbar"
import Sidebar from "./SideBar"

export default ({ user, children }) => (  // Changed { to (
    <div>
        <Navbar user={user} />
        <div className="flex">
            <Sidebar user={user} />
            <main className="flex-1 w-full p-6">
                {children}
            </main>
        </div>
    </div>
);