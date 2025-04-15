import AuthorizeView, { AuthorizedUser } from "../Components/Authorize.jsx";
import NavBar from "../Components/NavBar.jsx";

function AdminDashboard() {
    return (
        <AuthorizeView>
            <div className="min-h-screen bg-gradient-to-br from-movie-dark to-indigo-900">
                <NavBar />
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-white mb-6">Admin Dashboard</h1>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                        <p className="text-lg text-movie-light">
                            Welcome, <AuthorizedUser value="email" />!
                        </p>
                        <p className="text-lg text-movie-light">
                            Your roles: <AuthorizedUser value="roles" />
                        </p>
                    </div>
                </div>
            </div>
        </AuthorizeView>
    );
}

export default AdminDashboard;