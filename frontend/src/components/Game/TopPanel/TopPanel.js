import React from 'react';
import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import { FaUserCircle, FaQuestionCircle } from 'react-icons/fa';
import DifficultySelector from './DifficultyLevel/DifficultyLevel';
import './TopPanel.css';

const TopPanel = ({ profile, onLogout, difficulty, onSelectDifficulty, gameStarted, onShowInstructions }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div className="top-panel">
            <DifficultySelector 
                selectedDifficulty={difficulty} 
                onSelect={onSelectDifficulty} 
                gameStarted={gameStarted}
            />
            <div className="instructions-button" onClick={onShowInstructions}>
                <FaQuestionCircle className="instructions-icon" />
                <span className="instructions-text">How to Play</span>
            </div>
            <div className="profile" onClick={handleClick}>
                <FaUserCircle className="profile-icon" />
                <span className="profile-name">{profile}</span>
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
                <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

export default TopPanel;
