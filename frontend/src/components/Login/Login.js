import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import './Login.css'; // Ensure this CSS file is imported
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { login } from '../../services/authService'; // Import the login service

const LoginPage = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');



    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password); // Call the login service
            navigate('/game'); // Redirect to the game page after successful login
        } catch (err) {
            setError(err); // Display error message
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Connect 4 Game</h1>
                <p>Login to get started</p>
            </div>
            <form className="login-form">
                <div className="input-group">
                    <label htmlFor="username">Email or Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your email or username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type={passwordShown ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="show-password"
                        onClick={togglePassword}
                    >
                        {passwordShown ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button onClick={handleLogin} type="submit">Login</button>
                {error && <div className="error-message">{error}</div>}
            </form>
            <div className="login-footer">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
                <p><a href="/game">Continue as a guest</a></p>
            </div>
        </div>
    );
};

export default LoginPage;
