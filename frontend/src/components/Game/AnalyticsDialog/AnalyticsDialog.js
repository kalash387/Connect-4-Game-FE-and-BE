import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip } from '@mui/material';
import './AnalyticsDialog.css';

const AnalyticsDialog = ({ analytics, onClose }) => {
    if (!analytics) return null;

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="md"
            PaperProps={{
                style: {
                    background: 'linear-gradient(135deg, #1E1E30, #2A2A4E)',
                    border: '2px solid rgba(74, 158, 255, 0.3)',
                    borderRadius: '20px',
                    color: 'white',
                    padding: '20px',
                    minWidth: '500px',
                    fontFamily: "'Orbitron', sans-serif"
                }
            }}
        >
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    color: '#4a9eff',
                    fontFamily: "'Audiowide', sans-serif",
                    letterSpacing: '2px',
                    marginBottom: '20px'
                }}
            >
                Game Analytics
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                {/* Performance Section */}
                <div className="analytics-section performance-box">
                    <Typography variant="h6" className="section-title">
                        Performance
                    </Typography>
                    <Typography className="performance-text">
                        {analytics.performance}
                    </Typography>
                </div>

                {/* Strengths Section */}
                <div className="analytics-section strengths-box">
                    <Typography variant="h6" className="section-title">
                        Your Strengths
                    </Typography>
                    <div className="strengths-container">
                        {analytics.strengths.map((strength, index) => (
                            <Chip
                                key={index}
                                label={strength}
                                className="strength-chip"
                            />
                        ))}
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="analytics-section recommendations-box">
                    <Typography variant="h6" className="section-title">
                        Recommendations
                    </Typography>
                    <Typography className="recommendation-text">
                        {analytics.recommendation}
                    </Typography>
                    
                    <Typography variant="h6" className="section-title" sx={{ mt: 3 }}>
                        Next Steps
                    </Typography>
                    <Typography className="next-steps-text">
                        {analytics.nextSteps}
                    </Typography>
                </div>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        background: 'linear-gradient(135deg, #4a9eff, #2a7fff)',
                        color: 'white',
                        padding: '12px 30px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontFamily: "'Orbitron', sans-serif",
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2a7fff, #4a9eff)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(74, 158, 255, 0.3)',
                        }
                    }}
                >
                    Close Analytics
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AnalyticsDialog; 