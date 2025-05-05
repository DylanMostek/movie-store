import NavBar from "../Components/NavBar.jsx";

function Cart() {
    return (
        <div className="min-h-screen bg-movie-bg-light dark:bg-movie-bg-dark">
            <NavBar />
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-movie-dark dark:text-white mb-6">Cart</h1>
                <div className="bg-white dark:bg-movie-dark-800 rounded-lg shadow-custom p-6">
                    <p className="text-movie-light dark:text-movie-light-200">
                        View your cart items (to be implemented).
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cart;