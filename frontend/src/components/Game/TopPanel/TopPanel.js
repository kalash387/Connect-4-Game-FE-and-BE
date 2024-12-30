import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from '../../../store/gameSlice';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DifficultyLevel from './DifficultyLevel/DifficultyLevel';
import './TopPanel.css';

const TopPanel = ({ 
    profile, 
    onLogout, 
    difficulty, 
    onSelectDifficulty, 
    onShowInstructions,
    playerScore,
    botScore,
    gameStarted 
}) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        onLogout();
    };

    return (
        <div className="top-panel">
            <div className="left-section">
                <DifficultyLevel 
                    selectedDifficulty={difficulty}
                    onSelect={onSelectDifficulty}
                    gameStarted={gameStarted}
                />
            </div>

            <div className="center-section">
                <div className="score-container">
                    <div className="score-box player-score">
                        <div className="score-icon">👤</div>
                        <div className="score-details">
                            <span className="score-label">YOU</span>
                            <span className="score-value">{playerScore}</span>
                        </div>
                    </div>
                    <div className="score-separator">VS</div>
                    <div className="score-box bot-score">
                        <div className="score-icon">🤖</div>
                        <div className="score-details">
                            <span className="score-label">BOT</span>
                            <span className="score-value">{botScore}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-section">
                <button 
                    className="instructions-button"
                    onClick={onShowInstructions}
                >
                    <HelpOutlineIcon className="instructions-icon" />
                    <span className="instructions-text">How to Play</span>
                </button>

                <div 
                    className="profile-container"
                    onClick={handleProfileClick}
                >
                    <div className="profile-info">
                        <PersonIcon className="profile-icon" />
                        <span className="profile-name">{profile}</span>
                    </div>
                    <KeyboardArrowDownIcon className="profile-arrow" />
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    className="profile-menu"
                >
                    <MenuItem onClick={handleLogout} className="profile-menu-item">
                        <LogoutIcon className="menu-icon" />
                        <span>Logout</span>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default TopPanel;
