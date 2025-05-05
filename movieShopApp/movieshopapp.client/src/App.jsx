import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthorizeView from "./Components/Authorize.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Movies from "./pages/Movies.jsx";
import Popular from "./pages/Popular.jsx";
import NewReleases from "./pages/NewReleases.jsx";
import Offers from "./pages/Offers.jsx";
import Categories from "./pages/Categories.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Cart from "./pages/Cart.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/profile"
                    element={
                        <AuthorizeView>
                            <Profile />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <AuthorizeView>
                            <Settings />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <AuthorizeView>
                            <Cart />
                        </AuthorizeView>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AuthorizeView>
                            <AdminDashboard />
                        </AuthorizeView>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;