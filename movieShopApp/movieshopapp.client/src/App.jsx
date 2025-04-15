import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import Movies from "./Pages/Movies.jsx";
import Popular from "./Pages/Popular.jsx";
import NewReleases from "./Pages/NewReleases.jsx";
import Offers from "./Pages/Offers.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;