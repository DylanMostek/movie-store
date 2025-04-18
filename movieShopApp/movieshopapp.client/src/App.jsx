import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthorizeView from "./Components/Authorize.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import Movies from "./Pages/Movies.jsx";
import Popular from "./Pages/Popular.jsx";
import NewReleases from "./Pages/NewReleases.jsx";
import Offers from "./Pages/Offers.jsx";
import Categories from "./Pages/Categories.jsx";
import Profile from "./Pages/Profile.jsx";
import Settings from "./Pages/Settings.jsx";
import Cart from "./Pages/Cart.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <AuthorizeView>
                            <Home />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/movies"
                    element={
                        <AuthorizeView>
                            <Movies />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/popular"
                    element={
                        <AuthorizeView>
                            <Popular />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/new-releases"
                    element={
                        <AuthorizeView>
                            <NewReleases />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/offers"
                    element={
                        <AuthorizeView>
                            <Offers />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/categories"
                    element={
                        <AuthorizeView>
                            <Categories />
                        </AuthorizeView>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin"
                    element={
                        <AuthorizeView requireAuth={true}>
                            <AdminDashboard />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <AuthorizeView requireAuth={true}>
                            <Profile />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <AuthorizeView requireAuth={true}>
                            <Settings />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <AuthorizeView requireAuth={true}>
                            <Cart />
                        </AuthorizeView>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;