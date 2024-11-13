import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { styled } from '@mui/system';

const InstructionCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#2e2e2e',
  color: 'white',
  maxWidth: 400,
  margin: 'auto',
  borderRadius: 10,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
}));

const InstructionsCard = ({ onClose }) => {
  return (
    <InstructionCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          How to Play Connect 4
        </Typography>
        <Typography variant="body1" paragraph>
          1. The game is played on a grid that's 7 columns by 6 rows.
        </Typography>
        <Typography variant="body1" paragraph>
          2. Players take turns dropping one of their discs from the top into any of the columns.
        </Typography>
        <Typography variant="body1" paragraph>
          3. The first player to get four of their discs in a row (vertically, horizontally, or diagonally) wins.
        </Typography>
        <Typography variant="body1" paragraph>
          4. If the board fills up before either player achieves four in a row, the game is a draw.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onClose}>
          Close
        </Button>
      </CardActions>
    </InstructionCard>
  );
};

export default InstructionsCard;
