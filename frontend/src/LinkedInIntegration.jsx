import React, { useMemo, useState } from "react";
import "./LinkedInIntegration.css";

const LinkedInIntegration = () => {
  // Demo data (replace later with real LinkedIn/Firebase data)
  const userProfile = useMemo(
    () => ({
      name: "Alex Johnson",
      title: "Software Engineer | React & TypeScript Enthusiast",
      location: "San Francisco, CA",
      connections: 847,
      followers: 1243,
      profileViews: 342,
      searchAppearances: 89,
      profileLink: "https://linkedin.com/in/alexjohnson",
    }),
    []
  );

  const profileStrength = useMemo(
    () => ({
      percent: 75,
      checklist: [
        { label: "Add a profile photo", done: true },
        { label: "Add your work experience", done: true },
        { label: "Add 5+ skills", done: true },
        { label: "Get 3 recommendations", done: true },
        { label: "Add certifications", done: false },
        { label: "Write a detailed summary", done: false },
      ],
    }),
    []
  );

  const peopleSuggestions = useMemo(
    () => [
      { initials: "SA", name: "Sarah Chen", title: "Senior Frontend Developer at Google", mutual: 23 },
      { initials: "MI", name: "Michael Rodriguez", title: "Tech Lead at Microsoft", mutual: 15 },
      { initials: "EM", name: "Emily Davis", title: "Product Manager at Amazon", mutual: 31 },
      { initials: "JA", name: "James Wilson", title: "Full Stack Developer at Meta", mutual: 12 },
    ],
    []
  );

  const [update, setUpdate] = useState("");
  const [shared, setShared] = useState(false);
  const [connected, setConnected] = useState(Array(peopleSuggestions.length).fill(false));

  const initials = useMemo(() => {
    const parts = userProfile.name.split(" ").filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  }, [userProfile.name]);

  const handleShare = () => {
    if (!update.trim()) return;
    setShared(true);
    setTimeout(() => setShared(false), 2000);
    setUpdate("");
  };

  const handleConnect = (idx) => {
    setConnected((prev) => prev.map((c, i) => (i === idx ? true : c)));
  };

  return (
    <div className="li-page">
      <div className="li-header">
        <div>
          <h1 className="li-title">LinkedIn Integration</h1>
          <p className="li-subtitle">Track profile strength, share updates, and grow connections.</p>
        </div>
      </div>

      <div className="li-grid">
        {/* LEFT */}
        <div className="li-col li-col--main">
          {/* Profile Card */}
          <section className="li-card">
            <div className="li-profile">
              <div className="li-avatar" aria-label="User avatar">
                {initials}
              </div>

              <div className="li-profileMeta">
                <div className="li-name">{userProfile.name}</div>
                <div className="li-role">{userProfile.title}</div>
                <div className="li-location">{userProfile.location}</div>
              </div>

              <a
                className="li-link"
                href={userProfile.profileLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn btn--ghost" type="button">
                  View on LinkedIn
                </button>
              </a>
            </div>

            <div className="li-stats">
              <div className="li-stat">
                <div className="li-statValue">{userProfile.profileViews}</div>
                <div className="li-statLabel">Profile views (30 days)</div>
              </div>
              <div className="li-stat">
                <div className="li-statValue">{userProfile.searchAppearances}</div>
                <div className="li-statLabel">Search appearances</div>
              </div>
            </div>

            <div className="li-footnote">
              <span className="li-footnoteStrong">{userProfile.connections}</span> connections
              <span className="li-dot">•</span>
              <span className="li-footnoteStrong">{userProfile.followers}</span> followers
            </div>
          </section>

          {/* Share Update */}
          <section className="li-card li-card--tint">
            <div className="li-cardHeader">
              <h2 className="li-cardTitle">Share an update</h2>
              <p className="li-cardDesc">Post a short update (demo UI only).</p>
            </div>

            <textarea
              className="li-textarea"
              value={update}
              onChange={(e) => setUpdate(e.target.value)}
              placeholder="What do you want to share?"
              maxLength={500}
            />

            <div className="li-actions">
              <div className="li-hint">{update.length}/500</div>

              <button className="btn btn--primary" type="button" onClick={handleShare}>
                Share
              </button>
            </div>

            {shared && <div className="li-toast">Update shared!</div>}
          </section>
        </div>

        {/* RIGHT */}
        <div className="li-col li-col--side">
          {/* Profile Strength */}
          <section className="li-card">
            <div className="li-cardHeader">
              <h2 className="li-cardTitle">Profile strength</h2>
              <p className="li-cardDesc">Checklist to improve LinkedIn impact.</p>
            </div>

            <div className="li-progressRow">
              <div className="li-progressLabel">Progress</div>
              <div className="li-progressValue">{profileStrength.percent}%</div>
            </div>

            <div className="li-progressBar" aria-label="Profile strength progress bar">
              <div
                className="li-progressFill"
                style={{ width: `${profileStrength.percent}%` }}
              />
            </div>

            <ul className="li-checklist">
              {profileStrength.checklist.map((item, idx) => (
                <li
                  key={idx}
                  className={`li-checkItem ${item.done ? "is-done" : ""}`}
                >
                  <span className={`li-checkDot ${item.done ? "is-done" : ""}`} />
                  <span className="li-checkText">{item.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* People You May Know */}
          <section className="li-card">
            <div className="li-cardHeader">
              <h2 className="li-cardTitle">People you may know</h2>
              <p className="li-cardDesc">Grow your network (demo UI only).</p>
            </div>

            <div className="li-people">
              {peopleSuggestions.map((p, idx) => (
                <div key={idx} className="li-person">
                  <div className="li-miniAvatar">{p.initials}</div>

                  <div className="li-personMeta">
                    <div className="li-personName">{p.name}</div>
                    <div className="li-personTitle">{p.title}</div>
                    <div className="li-personMutual">{p.mutual} mutual connections</div>
                  </div>

                  <button
                    className={`btn ${connected[idx] ? "btn--disabled" : "btn--primary"}`}
                    type="button"
                    onClick={() => handleConnect(idx)}
                    disabled={connected[idx]}
                  >
                    {connected[idx] ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntegration;