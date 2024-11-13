import React from 'react';
import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import './TopPanel.css';
import DifficultySelector from './DifficultyLevel/DifficultyLevel';

const DropdownMenu = ({ anchorEl, open, handleClose, onLogout, profile }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
                style: {
                    borderRadius: 8,
                    padding: 10,
                    backgroundColor: '#333', // Slightly lighter dark background
                    color: '#f0f0f0', // Light text color
                },
            }}
        >
            <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
    );
};

const TopPanel = ({ score, profile, onLogout, difficulty, onSelectDifficulty, gameStarted }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Box className="top-panel">
            {/* <Typography variant="h6">Your Score: {score}</Typography> */}
            <DifficultySelector selectedDifficulty={difficulty} onSelect={onSelectDifficulty} gameStarted={gameStarted} />
            <div className="profile">
                <IconButton onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FaUserCircle size={30} />
                    <Typography variant="body1" sx={{ marginLeft: 1 }}>{profile}</Typography>
                </IconButton>
                <DropdownMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    handleClose={handleClose}
                    onLogout={onLogout}
                    profile={profile}
                />
            </div>
        </Box>
    );
};

export default TopPanel;
