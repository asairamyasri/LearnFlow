import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";
import {

    FiLayers,

} from "react-icons/fi";
const API_URL = "https://learnflow-bos1.onrender.com";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {

            alert("Registration Successful!");
            navigate("/login");
        } else if (response.status === 422) {
            alert("Please provide all details!");
        } else {
            alert(data.detail);
        }
    }

    return (
        <div className="auth-container">

            <div className="auth-card">
                <h1 className="auth-title">    <FiLayers />  LearnFlow</h1>

                <p>Create your account to start organizing your learning.</p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

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
                        Register
                    </button>

                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </div>

            </div>

        </div>
    );
}

export default Register;