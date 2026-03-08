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

      <div className="li-content-center">
        <div className="li-main-card">
          <div className="li-card-glow"></div>
          
          <div className="li-branding-section">
            <div className="li-logo-box">in</div>
            <h1 className="li-title">LinkedIn Integration</h1>
            <p className="li-desc">
              Connect your professional profile to sync skills and achievements with your REVOLVE dashboard.
            </p>
          </div>

          <div className={`li-status-tag ${isConnected ? 'active' : 'inactive'}`}>
            <span className="dot"></span>
            {isConnected ? "Account Linked: Professional User" : "Account Not Linked"}
          </div>

          <div className="li-sync-controls">
            <div className="sync-row">
              <div className="sync-text">
                <span className="sync-label">Profile Auto-Sync</span>
                <span className="sync-sub">Keep your bio and headline updated</span>
              </div>
              <label className="li-toggle">
                <input type="checkbox" checked={isConnected} disabled={!isConnected} readOnly />
                <span className="li-slider"></span>
              </label>
            </div>

            <div className="sync-row">
              <div className="sync-text">
                <span className="sync-label">Skill Import</span>
                <span className="sync-sub">Automatically import endorsed skills</span>
              </div>
              <label className="li-toggle">
                <input type="checkbox" checked={isConnected} disabled={!isConnected} readOnly />
                <span className="li-slider"></span>
              </label>
            </div>
          </div>

          <button 
            className={`li-action-btn ${isConnected ? 'disconnect' : 'connect'} ${isSyncing ? 'loading' : ''}`}
            onClick={handleToggleConnection}
            disabled={isSyncing}
          >
            {isSyncing ? "Connecting..." : isConnected ? "Disconnect Account" : "Connect with LinkedIn"}
          </button>

          {isConnected && <p className="li-timestamp">Last updated: Just now</p>}
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntegration;