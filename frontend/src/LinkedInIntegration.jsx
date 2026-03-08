import React, { useState } from 'react';
import './LinkedinIntergration.css';

const LinkedInIntegration = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggleConnection = () => {
    if (!isConnected) {
      setIsSyncing(true);
      // Simulate OAuth connection delay
      setTimeout(() => {
        setIsConnected(true);
        setIsSyncing(false);
      }, 1500);
    } else {
      setIsConnected(false);
    }
  };

  return (
    <div className="li-page-wrapper">
      <div className="li-header-nav">
        <button className="li-back-nav" onClick={onBack}>
          <span className="arrow">←</span> Back to Home
        </button>
      </div>

<div className={`li-status-banner ${isConnected ? 'connected' : ''}`}>
          {isConnected ? (
            <span>● Account Connected: <strong>LinkedIn User</strong></span>
          ) : (
            <span>Account Not Linked</span>
          )}
        </div>

        <div className="li-options-grid">
          <div className="li-option-item">
            <div className="li-info">
              <h4>Profile Auto-Sync</h4>
              <p>Keep your bio and contact info up to date.</p>
            </div>
            <label className="li-toggle">
              <input 
                type="checkbox" 
                checked={syncOptions.profile} 
                onChange={() => toggleOption('profile')} 
              />
              <span className="li-slider"></span>
            </label>
          </div>

          <div className="li-option-item">
            <div className="li-info">
              <h4>Skill Import</h4>
              <p>Add LinkedIn endorsements to your skills list.</p>
            </div>
            <label className="li-toggle">
              <input 
                type="checkbox" 
                checked={syncOptions.skills} 
                onChange={() => toggleOption('skills')} 
              />
              <span className="li-slider"></span>
            </label>
          </div>
        </div>

