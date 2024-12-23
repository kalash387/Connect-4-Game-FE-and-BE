import React, { useEffect, useState } from 'react';

const DifficultySelector = ({ selectedDifficulty, onSelect, gameStarted }) => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (!gameStarted) {
            setShowWarning(false);
        } 
    }, [gameStarted]);

    const handleDifficultyChange = (level) => {
        if (!gameStarted) {
            onSelect(level);
        } else {
            setShowWarning(true);
            setTimeout(() => {
                setShowWarning(false);
            }, 3000);
        }
    };

    return (
        <div className="difficulty-controls">
            <span className="difficulty-label">Difficulty</span>
            <div className="difficulty-buttons">
                {['easy', 'medium', 'hard'].map(level => (
                    <button
                        key={level}
                        className={`difficulty-button ${selectedDifficulty === level ? 'active' : ''}`}
                        onClick={() => handleDifficultyChange(level)}
                    >
                        {level?.charAt(0)?.toUpperCase() + level?.slice(1)}
                    </button>
                ))}
            </div>
            {showWarning && (
                <div className="difficulty-warning">
                    Cannot change difficulty during gameplay
                </div>
            )}
        </div>
    );
};

export default DifficultySelector;
