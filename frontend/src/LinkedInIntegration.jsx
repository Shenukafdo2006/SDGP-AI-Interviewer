import React, { useState } from 'react';
import './LinkedinIntergration.css';

const LinkedInIntegration = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncOptions, setSyncOptions] = useState({
    profile: true,
    skills: true,
    experience: false
  });

  const handleConnect = () => {
    setIsSyncing(true);
    // Simulate API call for LinkedIn OAuth
    setTimeout(() => {
      setIsConnected(true);
      setIsSyncing(false);
    }, 2000);
  };
  const toggleOption = (option) => {
    setSyncOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <div className="li-integration-container">
      <button className="li-back-btn" onClick={onBack}>← Back to Dashboard</button>
      
      <div className="li-card">
        <div className="li-header">
          <div className="li-logo">in</div>
          <h1>LinkedIn Integration</h1>
          <p>Sync your professional profile to personalize your career path.</p>
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

