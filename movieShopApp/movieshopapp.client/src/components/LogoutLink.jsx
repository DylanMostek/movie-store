import { useNavigate } from "react-router-dom";

function LogoutLink(props) {
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault(); 
        fetch("https://localhost:7131/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    navigate("/login");
                } else {
                    throw new Error("Logout failed");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <a
            href="#"
            onClick={handleLogout}
            className={props.className} 
        >
            {props.children}
        </a>
    );
}

export default LogoutLink;