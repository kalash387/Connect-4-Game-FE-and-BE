import React from 'react';
import './BottomPanel.css';

const BottomPanel = ({ timer }) => {
    return (
        <div className="bottom-panel">
            <h2>Timer: {timer}</h2>
        </div>
    );
};

export default BottomPanel;
