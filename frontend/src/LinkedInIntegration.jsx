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