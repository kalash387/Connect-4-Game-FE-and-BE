import React, { useState, useEffect } from 'react';
import './BottomPanel.css';

const BottomPanel = ({ onTimerExpiry, gameOver, gameStarted, currentPlayer }) => {
    const [timer, setTimer] = useState(60);
    
    useEffect(() => {
        if (gameStarted && !gameOver) {
            setTimer(60);
        }
    }, [currentPlayer]);

    useEffect(() => {
        if (!gameOver && gameStarted) {
            const id = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer > 1) {
                        return prevTimer - 1;
                    } else {
                        clearInterval(id);
                        onTimerExpiry();
                        return 0;
                    }
                });
            }, 1000);

            return () => clearInterval(id);
        }
    }, [gameOver, gameStarted, onTimerExpiry]);

    const isLowTime = timer <= 10;
    
    return (
        <div className="bottom-panel">
            <div className={`timer-container ${isLowTime ? 'low-time' : ''}`}>
                <div className="timer-value">{timer}</div>
                <div className="timer-label">SECONDS</div>
            </div>
        </div>
    );
};

export default BottomPanel;
