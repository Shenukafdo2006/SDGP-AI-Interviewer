import React, { useState } from "react";
import "./CVMaker.css";

const CVMaker = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState("dashboard");
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [cvHealth, setCvHealth] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [coverLetter, setCoverLetter] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [cvContent, setCvContent] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [shareSettings, setShareSettings] = useState({
    privacy: "private",
    password: "",
    expiryDate: "",
    allowDownload: true,
  });
  const [collaborators, setCollaborators] = useState([]);
  const [cvVersions, setCvVersions] = useState([]);

  // Templates data with enhanced details
  const templates = [
    { 
      id: "modern", 
      name: "Modern", 
      icon: "✨", 
      color: "#667eea",
      description: "Clean and colorful design perfect for tech roles",
      bestFor: "Software Engineers, Designers"
    },
    { 
      id: "professional", 
      name: "Professional", 
      icon: "👔", 
      color: "#2c3e50",
      description: "Corporate and formal layout for traditional industries",
      bestFor: "Finance, Consulting, Management"
    },
    { 
      id: "creative", 
      name: "Creative", 
      icon: "🎨", 
      color: "#764ba2",
      description: "Design-focused with portfolio showcase sections",
      bestFor: "Designers, Artists, Marketing"
    },
    { 
      id: "minimal", 
      name: "Minimal", 
      icon: "📄", 
      color: "#4caf50",
      description: "Simple and ATS-friendly for maximum compatibility",
      bestFor: "All industries, ATS systems"
    },
    { 
      id: "academic", 
      name: "Academic", 
      icon: "🎓", 
      color: "#2196f3",
      description: "Research-focused with publications section",
      bestFor: "Researchers, Professors, PhD candidates"
    },
    { 
      id: "tech", 
      name: "Tech", 
      icon: "💻", 
      color: "#ff9800",
      description: "Optimized for technical roles with project highlights",
      bestFor: "Software Engineers, DevOps, Data Scientists"
    },
  ];
}