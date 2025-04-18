import { AuthorizedUser } from "../Components/Authorize.jsx";
import NavBar from "../Components/NavBar.jsx";

function AdminDashboard() {
    return (
        <div className="min-h-screen bg-movie-bg-light dark:bg-movie-bg-dark">
            <NavBar />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-movie-dark dark:text-white mb-6">Admin Dashboard</h1>
                <div className="bg-white dark:bg-movie-dark-800 p-6 rounded-xl shadow-custom space-y-4">
                    <p className="text-lg text-movie-light dark:text-movie-light-200">
                        Welcome, <AuthorizedUser value="email" />!
                    </p>
                    <p className="text-lg text-movie-light dark:text-movie-light-200">
                        Your roles: <AuthorizedUser value="roles" />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;