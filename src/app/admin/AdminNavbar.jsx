export default () => {
    return <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img
                    src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                    alt="UGV Logo"
                    className="h-10 w-auto"
                />
                <div>
                    <h1 className="text-xl font-bold text-slate-800 leading-tight">Admin Portal</h1>
                    <p className="text-xs text-purple-600 font-medium">University of Global Village</p>
                </div>
            </div>
            <button
                onClick={() => window.location.href = '/logout'}
                className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
                Logout
            </button>
        </div>
    </header>
}
