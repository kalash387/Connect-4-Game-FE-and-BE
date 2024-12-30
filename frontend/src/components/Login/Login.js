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
    const [isLoading, setIsLoading] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        try {
            await login(username, password); // Call the login service
            navigate('/game'); // Redirect to the game page after successful login
        } catch (err) {
            setError(err.message || 'Login failed'); // Display error message
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="fullscreen-container">
            <div className="animated-bg">
                {[...Array(12)].map((_, i) => (
                    <div key={`coin-${i}`} className="coin" 
                         style={{left: `${(i * 8)}%`, animationDelay: `${i * 1.5}s`}}/>
                ))}
                
                {[...Array(8)].map((_, i) => (
                    <div key={`line-${i}`} className="line"
                         style={{left: `${(i * 12)}%`, animationDelay: `${i * 1.2}s`}}/>
                ))}
                
                {[...Array(15)].map((_, i) => (
                    <div key={`particle-${i}`} className="particle"
                         style={{left: `${(i * 6)}%`, animationDelay: `${i * 1.3}s`}}/>
                ))}
            </div>
            <div className="login-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-text">Logging you in...</div>
                        </div>
                    </div>
                )}
                <div className="login-header">
                    <h1>Connect 4 Game</h1>
                    <p>Login to get started</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                    {error && <div className="error-message">{error}</div>}
                </form>
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    <p><a href="/game">Continue as a guest</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
