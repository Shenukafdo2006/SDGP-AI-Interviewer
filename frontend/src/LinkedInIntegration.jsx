import React, { useState } from 'react';
import './LinkedinIntergration.css';

const LinkedInIntegration = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggleConnection = () => {
    if (!isConnected) {
      setIsSyncing(true);
      // Simulate a connection delay
      setTimeout(() => {
        setIsConnected(true);
        setIsSyncing(false);
      }, 1500);
    } else {
      setIsConnected(false);
    }
  };

  return (
    <div className="linkedin-integration-page">
      <header className="li-page-header">
        <button className="li-back-btn" onClick={onBack}>
          <span className="back-icon">←</span> Back to Dashboard
        </button>
      </header>

      <div className="li-main-container">
        <div className="li-glass-card">
          <div className="li-branding">
            <div className="li-icon-square">in</div>
            <h1>LinkedIn Integration</h1>
            <p className="li-subtitle">
              Connect your professional identity to unlock AI-powered career insights.
            </p>
          </div>

          <div className={`li-status-indicator ${isConnected ? 'active' : 'inactive'}`}>
            <div className="status-dot"></div>
            <span>{isConnected ? "Account Connected" : "Not Connected"}</span>
          </div>

          <div className="li-sync-settings">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Profile Auto-Sync</h4>
                <p>Update your CV details when you change LinkedIn</p>
              </div>
              <label className="li-switch">
                <input type="checkbox" checked={isConnected} disabled={!isConnected} readOnly />
                <span className="li-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Skill Import</h4>
                <p>Automatically pull endorsed skills into your profile</p>
              </div>
              <label className="li-switch">
                <input type="checkbox" checked={isConnected} disabled={!isConnected} readOnly />
                <span className="li-slider"></span>
              </label>
            </div>
          </div>

          <button 
            className={`li-primary-btn ${isConnected ? 'btn-disconnect' : 'btn-connect'} ${isSyncing ? 'loading' : ''}`}
            onClick={handleToggleConnection}
            disabled={isSyncing}
          >
            {isSyncing ? "Connecting..." : isConnected ? "Disconnect LinkedIn" : "Connect with LinkedIn"}
          </button>

          {isConnected && (
            <p className="li-last-sync">Last synced: Just now</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntegration;