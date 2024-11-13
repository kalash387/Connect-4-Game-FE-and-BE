import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';

const DifficultySelector = ({ selectedDifficulty, onSelect, gameStarted }) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(()=> {
    if(!gameStarted) {
      setShowWarning(false)
    }
  }, [gameStarted])

  const setDifficultyLevel = (level) => {
    if (!gameStarted) {
      onSelect(level);
      setShowWarning(false);
    } else {
      setShowWarning(true);  // Show warning if game has started
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" color="white">Difficulty:</Typography>
        {['easy', 'medium', 'hard'].map(level => (
          <Button
            key={level}
            variant={selectedDifficulty === level ? 'contained' : 'outlined'}
            onClick={() => setDifficultyLevel(level)}
            sx={{
              color: selectedDifficulty === level ? 'black' : 'white',
              backgroundColor: selectedDifficulty === level ? 'white' : 'transparent',
              borderColor: 'white',
              '&:hover': {
                backgroundColor: selectedDifficulty === level ? '#f5f5f5' : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Button>
        ))}
      </Box>
      {showWarning && (
        <Alert severity="warning">
          Difficulty level cannot be changed when the game is in progress.
        </Alert>
      )}
    </Box>
  );
};

export default DifficultySelector;
