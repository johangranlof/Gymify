import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/AuthContext';
import Message from '../Message/Message';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");
    const { login } = useContext(AuthContext);

    const baseURL = process.env.REACT_APP_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessageType("error");
            setMessage('Email and Password are required');
            return;
        }
        try {
            const response = await axios.post(`${baseURL}/api/user/login`, {
                email: email,
                password: password
            });
            if (response.data.token) {
                login(response.data.token);
                navigate('/dashboard');
            } else {
                setMessageType("error");
                setMessage('Login failed: No token returned');
            }
        } catch (error) {
            setMessageType("error");
            setMessage(error.response ? error.response.data : error.message);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setMessageType("error");
            setMessage('All fields are required');
            return;
        }
        if (password.length < 8) {
            setMessageType("error");
            setMessage('Password must be at least 8 characters long');
            return;
        }

        try {
            await axios.post(`${baseURL}/api/user`, {
                name: name,
                email: email,
                password: password
            });
            setMessageType("success");
            setMessage("Account created successfully! Please log in.");
            setAction("Login");
        } catch (error) {
            setMessageType("error");
            setMessage(error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
        <Message message={message} setMessage={setMessage} type={messageType} />
        <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
            <div className="row w-100 mt-5">
                <div className="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
                    <div className="text-center mb-4">
                        <h1 className="mb-3">{action === "Login" ? "Welcome back" : "Sign Up"}</h1>
                        <p>Please enter your details to {action === "Login" ? "sign in" : "sign up"}.</p>
                    </div>

                    <form onSubmit={action === "Login" ? handleLogin : handleSignUp}>
                        {action === "Sign Up" && (
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={action === "Login" ? "current-password" : "new-password"}
                            />
                        </div>

                        <button type="submit" className="btn btn-success w-100">
                            {action === "Sign Up" ? "Sign Up" : "Sign In"}
                        </button>
                    </form>

                    <div className="text-center mt-3">
                    {action === "Login" ? (
                        <p>Don't have an account yet? <button type="button" onClick={() => setAction("Sign Up")} className="link-button">Sign Up</button></p>
                    ) : (
                        <p>Already have an account? <button type="button" onClick={() => setAction("Login")} className="link-button">Sign In</button></p>
                    )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;
