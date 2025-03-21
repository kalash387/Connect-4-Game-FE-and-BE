// src/pages/Register.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import './Login.css'; // Ensure this CSS file is imported
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService'; // Import the register service

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const toggleConfirmPassword = () => {
        setConfirmPasswordShown(!confirmPasswordShown);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setIsLoading(true); // Start loading
        try {
            await register(username, password);
            // Simulate a minimum loading time for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="fullscreen-container">
            <div className="login-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-text">Creating your account...</div>
                        </div>
                    </div>
                )}
                <div className="login-header">
                    <h1>Connect 4 Game</h1>
                    <p>Register to create an account</p>
                </div>
                <form className="login-form" onSubmit={handleRegister}>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder="Choose a username" 
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
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type={confirmPasswordShown ? 'text' : 'password'} 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            placeholder="Confirm your password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button 
                            type="button" 
                            className="show-password" 
                            onClick={toggleConfirmPassword}
                        >
                            {confirmPasswordShown ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button type="submit">Register</button>
                </form>
                <div className="login-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
