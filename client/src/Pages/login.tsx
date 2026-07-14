import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import {

    FiLayers,

} from "react-icons/fi";
const API_URL = "https://learnflow-bos1.onrender.com";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();



        if (response.ok) {
            localStorage.setItem("token", data.access_token);
            alert("Login Successful!");
            navigate("/");
        } else {
            alert(data.detail);
        }
    }

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1 className="auth-title">    <FiLayers />  LearnFlow </h1>

                <p className="auth-subtitle">
                    Welcome back! Login to continue.
                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="auth-btn">
                        Login
                    </button>

                </form>

                <div className="auth-link">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Register
                    </span>
                </div>

            </div>

        </div>
    );
}

export default Login;