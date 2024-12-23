import React, { useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { FaUserCircle, FaQuestionCircle, FaTrophy } from 'react-icons/fa';
import DifficultySelector from './DifficultyLevel/DifficultyLevel';
import './TopPanel.css';
import axios from 'axios';

const TopPanel = ({ 
    profile, 
    onLogout, 
    difficulty, 
    onSelectDifficulty, 
    gameStarted, 
    onShowInstructions,
    playerScore,
    botScore 
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [lastGame, setLastGame] = React.useState(null);
    const API_URL = 'https://connect-4-backend-3uji.onrender.com/api/auth';

    // const fetchLastGame = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             console.log('No token found');
    //             return;
    //         }

    //         const response = await axios.get(`${API_URL}/last-game`, {
    //             headers: { 
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         setLastGame(response.data.lastGame);
    //     } catch (error) {
    //         console.log('Error fetching last game:', error);
    //         setLastGame(null);
    //     }
    // };

    // useEffect(() => {
    //     fetchLastGame();
    // }, []);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div className="top-panel">
            <div className="difficulty-controls">
                <DifficultySelector 
                    selectedDifficulty={difficulty} 
                    onSelect={onSelectDifficulty} 
                    gameStarted={gameStarted}
                />
            </div>
            
            <div className="score-display">
                <div className="score-item player-score">
                    <FaUserCircle className="score-icon" />
                    <div className="score-details">
                        <span className="score-label">Player</span>
                        <span className="score-value">{playerScore}</span>
                    </div>
                </div>
                <div className="score-separator">vs</div>
                <div className="score-item bot-score">
                    <span className="robot-icon">🤖</span>
                    <div className="score-details">
                        <span className="score-label">Bot</span>
                        <span className="score-value">{botScore}</span>
                    </div>
                </div>
            </div>

            <div className="right-controls">
                <div className="instructions-button" onClick={onShowInstructions}>
                    <FaQuestionCircle className="instructions-icon" />
                    <span className="instructions-text">How to Play</span>
                </div>
                
                <div className="profile" onClick={handleClick}>
                    <FaUserCircle className="profile-icon" />
                    <span className="profile-name">{profile}</span>
                </div>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {/* {lastGame && (
                    <div className="last-game-info">
                        <MenuItem disabled>
                            Last Game: {new Date(lastGame?.playedAt).toLocaleDateString()}
                        </MenuItem>
                        <MenuItem disabled>
                            Result: {lastGame?.gameStatus?.toUpperCase()} ({lastGame?.score?.player} - {lastGame?.score?.bot})
                        </MenuItem>
                        <MenuItem disabled>
                            Difficulty: {lastGame?.difficulty}
                        </MenuItem>
                        <MenuItem disabled>
                            Duration: {lastGame?.duration}s
                        </MenuItem>
                        <Divider />
                    </div>
                )} */}
                <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

export default TopPanel;
