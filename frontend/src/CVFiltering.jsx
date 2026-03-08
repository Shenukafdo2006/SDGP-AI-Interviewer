import React, { useState, useCallback } from 'react';
import './CVFiltering.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  New: '#3b82f6',
  Viewed: '#8b5cf6',
  Shortlisted: '#10b981',
  'Interview Scheduled': '#f59e0b',
  'Interview Done': '#6366f1',
  Selected: '#059669',
  Rejected: '#ef4444',
  'On Hold': '#6b7280',
};

const SAMPLE_CVS = [
  {
    id: 1, name: 'Pavithri pabasara', position: 'Intern Software Engineer',
      education: 'IIT Sri Lanka(Undergraduate student)', location: 'Galle',
    skills: ['React', 'Python', 'Java','Docker'], noticePeriod: '30 days',
    gender: 'FeMale', status: 'Shortlisted',
    tags: [ 'Full Stack'], uploadDate: '2026-02-15',
    matchPercentage: 92, email: 'pavithripabasara@gmail.com', phone: '0765018265',
     avatar: 'PV',interviews: 3, offers: 1,
  },
  {
    id: 2, name: 'Sadewini Tharumini', position: 'Intern Product Manager',
     education: 'IIT Sri Lanaka(Undergraduate student)', location: 'Colombo',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics'], noticePeriod: '60 days',
     gender: 'Female', status: 'Interview Scheduled',
    uploadDate: '2026-01-14',
    matchPercentage: 88, email: 'sadewini@gmail.com', phone: ' 077765 4321',
     avatar: 'ST',interviews: 5, offers: 2,
  },
  {
    id: 3, name: 'Shuneka Fernando', position: 'Intern UX Designer',
     education: 'IIT Sri Lanka(Undergraduate Student)', location: 'Colombo',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'Wireframing'], noticePeriod: '15 days',
     gender: 'Male', status: 'New',
    tags: ['Creative', 'Portfolio Available'],  uploadDate: '2026-02-13',
    matchPercentage: 75, email: 'shenuaka@gmail.com', phone: '07765 43212',
    avatar: 'SF',  interviews: 2, offers: 0,
  },
  {
    id: 4, name: 'Raveen Randeniy', position: 'Intern Data Scientist',
     education: 'IIT Sri Lanka(Undergrauate Student)', location: 'Galle',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'], noticePeriod: '45 days',
     gender: 'Male', status: 'Viewed',
    tags: ['Kaggle Expert'],  uploadDate: '2026-02-12',
    matchPercentage: 95, email: 'raveen@gmail.com', phone: '+91 98765 43213',
    avatar: 'RR',  interviews: 4, offers: 1,
  },
  {
    id: 5, name: 'Saddh Jawadh', position: 'Intern DevOps Engineer',
     education: 'IIT Sri Lanka(Undergraduate Student)', location: 'Colombo',
    skills: ['Kubernetes', 'Jenkins', 'Terraform', 'AWS'], noticePeriod: '30 days',
     gender: 'Male', status: 'Shortlisted',
    tags: ['Certified Kubernetes Admin'],  uploadDate: '2026-01-11',
    matchPercentage: 82, email: 'saddh@gmail.com', phone: '07765 43214',
    avatar: 'SJ',  interviews: 3, offers: 1,
  },
  {
    id: 6, name: 'Mithusha Perera', position: 'Intern Frontend Developer',
     education: 'IIT Sri Lanka(Undergraduate Student)', location: 'Galle',
    skills: ['React', 'TypeScript', 'CSS', 'Next.js'], noticePeriod: 'Immediate',
    gender: 'Female', status: 'New',
    tags: ['Open Source Contributor'],  uploadDate: '2026-01-10',
    matchPercentage: 79, email: 'mithusha@gmail.com', phone: '07765 43215',
    avatar: 'MP',  interviews: 1, offers: 0,
  },
];

// ─── Utility Helpers ──────────────────────────────────────────────────────────

const getStatusColor = (status) => STATUS_COLORS[status] || '#6b7280';

const getRatingStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
};

const formatFileSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

// ─── Sub-components ───────────────────────────────────────────────────────────

const Notification = ({ notifications }) => (
  <div className="cvf-notification-stack">
    {notifications.map(n => (
      <div key={n.id} className={`cvf-notification cvf-notification--${n.type}`}>
        <span className="cvf-notification__icon">
          {n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : '!'}
        </span>
        <span>{n.message}</span>
      </div>
    ))}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className="cvf-status-badge"
    style={{ background: getStatusColor(status) + '18', color: getStatusColor(status) }}
  >
    {status}
  </span>
);

const SkillTag = ({ skill, size = '' }) => (
  <span className={`cvf-skill-tag ${size ? 'cvf-skill-tag--' + size : ''}`}>{skill}</span>
);

const MatchBar = ({ pct }) => (
  <div className="cvf-match-bar">
    <div className="cvf-match-bar__track">
      <div className="cvf-match-bar__fill" style={{ width: `${pct}%` }} />
    </div>
    <span className="cvf-match-bar__label">{pct}% match</span>
  </div>
);

const AvatarCircle = ({ initials, status, size = 'md' }) => (
  <div
    className={`cvf-avatar cvf-avatar--${size}`}
    style={{ background: getStatusColor(status) + '22', color: getStatusColor(status) }}
  >
    {initials}
  </div>
);

// ─── Upload Tab ───────────────────────────────────────────────────────────────

const UploadTab = ({ cvData, uploadedFiles, uploadProgress, onUpload, onDrop }) => {
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="cvf-tab-content cvf-upload">
      <div className="cvf-section-title">
        <h2>Upload Resumes</h2>
        <p>Drag & drop or browse to upload multiple CVs at once</p>
      </div>

      <div
        className="cvf-dropzone"
        onDragOver={handleDragOver}
        onDrop={onDrop}
        onClick={() => document.getElementById('cvf-file-input').click()}
      >
        <input
          id="cvf-file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={onUpload}
          style={{ display: 'none' }}
        />
        <div className="cvf-dropzone__icon">
          <span>📁</span>
          <div className="cvf-dropzone__ring" />
        </div>
        <h3>Drag & Drop CVs Here</h3>
        <p>or <span className="cvf-link">browse files</span></p>
        <p className="cvf-dropzone__hint">Supports: PDF, DOCX, DOC, TXT · Max 8MB per file</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="cvf-upload-progress">
          <div className="cvf-row-between cvf-mb-16">
            <h3>Upload Progress</h3>
            <span className="cvf-chip">{uploadedFiles.length} files</span>
          </div>
          {uploadedFiles.map(file => (
            <div key={file.id} className="cvf-progress-item">
              <div className="cvf-progress-item__header">
                <span className="cvf-file-icon">{file.type.includes('pdf') ? '📄' : '📝'}</span>
                <div className="cvf-progress-item__info">
                  <span className="cvf-progress-item__name">{file.name}</span>
                  <span className="cvf-progress-item__size">{formatFileSize(file.size)}</span>
                </div>
                <span className={`cvf-progress-item__status cvf-progress-item__status--${file.status}`}>
                  {file.status === 'completed' ? '✓' : '⟳'}
                </span>
              </div>
              <div className="cvf-progress-track">
                <div className="cvf-progress-fill" style={{ width: `${uploadProgress[file.id] || 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cvf-recent-uploads">
        <div className="cvf-row-between cvf-mb-16">
          <h3>Recent Uploads</h3>
          <button className="cvf-btn-ghost">View All</button>
        </div>
        <div className="cvf-recent-grid">
          {cvData.slice(0, 3).map(cv => (
            <div key={cv.id} className="cvf-recent-card">
              <div className="cvf-recent-card__header">
                <AvatarCircle initials={cv.avatar} status={cv.status} />
                <div className="cvf-recent-card__info">
                  <strong>{cv.name}</strong>
                  <span>{cv.position}</span>
                </div>
                <span className="cvf-text-muted cvf-text-sm">2h ago</span>
              </div>
              <div className="cvf-recent-card__footer">
                <StatusBadge status={cv.status} />
                <button className="cvf-icon-btn" title="Preview">👁️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CV Card (Grid) ───────────────────────────────────────────────────────────

const CVCardGrid = ({ cv, selected, onSelect, onClick }) => (
  <div
    className={`cvf-cv-card cvf-cv-card--grid ${selected ? 'cvf-cv-card--selected' : ''}`}
    onClick={() => onClick(cv)}
  >
    <div className="cvf-cv-card__top">
      <AvatarCircle initials={cv.avatar} status={cv.status} size="lg" />
      <input
        type="checkbox"
        checked={selected}
        onClick={e => e.stopPropagation()}
        onChange={e => { e.stopPropagation(); onSelect(cv.id); }}
        className="cvf-checkbox"
      />
    </div>

    <h3 className="cvf-cv-card__name">{cv.name}</h3>
    <p className="cvf-cv-card__role">{cv.position}</p>

    <MatchBar pct={cv.matchPercentage} />

    <div className="cvf-cv-card__meta">
      <span>💼 {cv.experience}</span>
      <span>🎓 {cv.education}</span>
      <span>📍 {cv.location}</span>
    </div>

    <div className="cvf-skills-row">
      {cv.skills.slice(0, 3).map((s, i) => <SkillTag key={i} skill={s} />)}
      {cv.skills.length > 3 && <span className="cvf-skill-tag cvf-skill-tag--more">+{cv.skills.length - 3}</span>}
    </div>

    <div className="cvf-cv-card__rating">
      <span className="cvf-stars">{getRatingStars(cv.rating)}</span>
      <span className="cvf-text-muted">{cv.rating}</span>
    </div>

    <div className="cvf-cv-card__footer">
      <StatusBadge status={cv.status} />
      <div className="cvf-action-row">
        <button className="cvf-icon-btn" title="Star" onClick={e => e.stopPropagation()}>⭐</button>
        <button className="cvf-icon-btn" title="More" onClick={e => e.stopPropagation()}>⋯</button>
      </div>
    </div>
  </div>
);

// ─── CV Card (List) ───────────────────────────────────────────────────────────

const CVCardList = ({ cv, selected, onSelect, onClick }) => (
  <div
    className={`cvf-cv-card cvf-cv-card--list ${selected ? 'cvf-cv-card--selected' : ''}`}
    onClick={() => onClick(cv)}
  >
    <div className="cvf-cv-list__left">
      <input
        type="checkbox"
        checked={selected}
        onClick={e => e.stopPropagation()}
        onChange={e => { e.stopPropagation(); onSelect(cv.id); }}
        className="cvf-checkbox"
      />
      <AvatarCircle initials={cv.avatar} status={cv.status} />
      <div className="cvf-cv-list__info">
        <strong>{cv.name}</strong>
        <span className="cvf-text-muted">{cv.position} · {cv.experience} · {cv.location}</span>
        <div className="cvf-skills-row cvf-skills-row--sm">
          {cv.skills.slice(0, 4).map((s, i) => <SkillTag key={i} skill={s} size="sm" />)}
        </div>
      </div>
    </div>
    <div className="cvf-cv-list__right">
      <div
        className="cvf-match-ring"
        style={{
          background: `conic-gradient(#10b981 0% ${cv.matchPercentage}%, #e5e7eb ${cv.matchPercentage}% 100%)`
        }}
      >
        <span>{cv.matchPercentage}%</span>
      </div>
      <div className="cvf-cv-list__status">
        <span className="cvf-status-dot" style={{ background: getStatusColor(cv.status) }} />
        <span className="cvf-text-muted cvf-text-sm">{cv.status}</span>
      </div>
      <button className="cvf-icon-btn">👁️</button>
    </div>
  </div>
);

// ─── Filter Tab ───────────────────────────────────────────────────────────────

const FilterTab = ({
  cvData, filters, onFilterChange, onApply, onClearFilters,
  viewMode, setViewMode, sortBy, setSortBy,
  selectedCVs, onToggleSelect,
  onOpenCV,
  onBulkAction,
  filterResults,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const displayCVs = (() => {
    let list = filterResults.length > 0 ? filterResults : cvData;
    switch (sortBy) {
      case 'match':     list.sort((a, b) => b.matchPercentage - a.matchPercentage); break;
      case 'exp-high':  list.sort((a, b) => parseInt(b.experience) - parseInt(a.experience)); break;
      case 'exp-low':   list.sort((a, b) => parseInt(a.experience) - parseInt(b.experience)); break;
      case 'rating':    list.sort((a, b) => b.rating - a.rating); break;
      case 'name':      list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:          list.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }
    return [...list];
  })();

  const FilterInput = ({ label, name, type = 'select', options = [], placeholder = '' }) => (
    <div className="cvf-filter-group">
      <label>{label}</label>
      {type === 'select' ? (
        <select name={name} value={filters[name] || ''} onChange={onFilterChange}>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input type="text" name={name} placeholder={placeholder} value={filters[name] || ''} onChange={onFilterChange} />
      )}
    </div>
  );

  return (
    <div className="cvf-tab-content cvf-filter-layout">
      {/* Sidebar */}
      <aside className={`cvf-sidebar ${sidebarOpen ? '' : 'cvf-sidebar--collapsed'}`}>
        <button className="cvf-sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {sidebarOpen && (
          <>
            <div className="cvf-row-between cvf-mb-16">
              <h3>Filters</h3>
              <button className="cvf-btn-ghost" onClick={onClearFilters}>Clear all</button>
            </div>

                        <FilterInput label="Position" name="position" options={[
              { value: '', label: 'All Positions' },
              { value: 'Intern Software Engineer', label: 'Intern Software Engineer' },
              { value: 'Intern Product Manager', label: 'Intern Product Manager' },
              { value: 'Intern UX Designer', label: 'Intern UX Designer' },
              { value: 'Intern Data Scientist', label: 'Intern Data Scientist' },
              { value: 'Intern DevOps Engineer', label: 'Intern DevOps Engineer' },
              { value: 'Intern Frontend Developer', label: 'Intern Frontend Developer' },
            ]} />

            <FilterInput label="Location" name="location" type="text" placeholder="e.g. Colombo" />
            <FilterInput label="Skills" name="skills" type="text" placeholder="e.g. Java, Python" />

            <FilterInput label="Notice Period" name="noticePeriod" options={[
              { value: '', label: 'Any' },
              { value: 'Immediate', label: 'Immediate' },
              { value: '15 days', label: '15 days' },
              { value: '30 days', label: '30 days' },
              { value: '60 days', label: '60 days' },
            ]} />

            <FilterInput label="Status" name="currentStatus" options={[
              { value: '', label: 'Any Status' },
              { value: 'New', label: 'New' },
              { value: 'Shortlisted', label: 'Shortlisted' },
              { value: 'Interview Scheduled', label: 'Interview Scheduled' },
              { value: 'Selected', label: 'Selected' },
              { value: 'Rejected', label: 'Rejected' },
            ]} />

            <button className="cvf-btn-primary cvf-btn-full" onClick={onApply}>
              Apply Filters
            </button>
          </>
        )}
      </aside>

      {/* Results */}
      <div className="cvf-results">
        <div className="cvf-results__header">
          <div className="cvf-row-gap">
            <h2>Candidates</h2>
            <span className="cvf-chip">{displayCVs.length} results</span>
          </div>
          <div className="cvf-results__controls">
            <div className="cvf-view-toggle">
              {['grid', 'list'].map(m => (
                <button
                  key={m}
                  className={`cvf-view-btn ${viewMode === m ? 'cvf-view-btn--active' : ''}`}
                  onClick={() => setViewMode(m)}
                  title={m + ' view'}
                >
                  {m === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
            <select className="cvf-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="match">Best Match</option>
              <option value="rating">Top Rated</option>
              <option value="exp-high">Experience ↑</option>
              <option value="exp-low">Experience ↓</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className={`cvf-cv-grid ${viewMode === 'list' ? 'cvf-cv-grid--list' : 'cvf-cv-grid--grid'}`}>
          {displayCVs.map(cv =>
            viewMode === 'grid' ? (
              <CVCardGrid
                key={cv.id} cv={cv}
                selected={selectedCVs.includes(cv.id)}
                onSelect={onToggleSelect}
                onClick={onOpenCV}
              />
            ) : (
              <CVCardList
                key={cv.id} cv={cv}
                selected={selectedCVs.includes(cv.id)}
                onSelect={onToggleSelect}
                onClick={onOpenCV}
              />
            )
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedCVs.length > 0 && (
        <div className="cvf-bulk-bar">
          <div className="cvf-bulk-bar__info">
            <span className="cvf-bulk-bar__count">{selectedCVs.length}</span>
            <span>selected</span>
          </div>
          <div className="cvf-bulk-bar__actions">
            {[
              { label: 'Shortlist', icon: '✅', action: 'shortlist' },
              { label: 'Download', icon: '📥', action: 'download' },
              { label: 'Email', icon: '📧', action: 'email' },
              { label: 'Export', icon: '📊', action: 'export' },
            ].map(b => (
              <button key={b.action} className="cvf-bulk-btn" onClick={() => onBulkAction(b.action)}>
                <span>{b.icon}</span> {b.label}
              </button>
            ))}
            <button className="cvf-bulk-btn cvf-bulk-btn--danger" onClick={() => onBulkAction('delete')}>
              <span>🗑️</span> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Advanced Search Tab ──────────────────────────────────────────────────────

const AdvancedTab = ({ searchQuery, setSearchQuery, searchType, setSearchType, onSearch, cvData }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 1) {
      const s = [...new Set(cvData.flatMap(c => c.skills))]
        .filter(sk => sk.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      setSuggestions(s);
    } else {
      setSuggestions([]);
    }
  };

  const SEARCH_TYPES = ['Basic', 'Boolean', 'Fuzzy', 'Phrase'];

  const TIPS = [
    { icon: '🔤', title: 'Boolean Search', code: 'React AND Python NOT Java' },
    { icon: '"', title: 'Phrase Search', code: '"machine learning"' },
    { icon: '*', title: 'Wildcard', code: 'dev* → developer, development' },
    { icon: '🎯', title: 'Field Search', code: 'skills:React education:IIT' },
  ];

  return (
    <div className="cvf-tab-content cvf-advanced">
      <div className="cvf-section-title cvf-section-title--center">
        <h2>Advanced Search</h2>
        <p>Use powerful search operators to find exactly what you need</p>
      </div>

      <div className="cvf-advanced__card">
        <div className="cvf-type-row">
          {SEARCH_TYPES.map(t => (
            <button
              key={t}
              className={`cvf-type-btn ${searchType === t.toLowerCase() ? 'cvf-type-btn--active' : ''}`}
              onClick={() => setSearchType(t.toLowerCase())}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="cvf-search-box">
          <span className="cvf-search-box__icon">🔍</span>
          <input
            type="text"
            className="cvf-search-input"
            value={searchQuery}
            onChange={handleChange}
            placeholder={
              searchType === 'boolean' ? 'Example: React AND Python NOT Java' :
              searchType === 'fuzzy'   ? 'Search with misspellings...' :
              searchType === 'phrase'  ? 'Enter exact phrase in quotes...' :
              'Search skills, experience, location...'
            }
          />
          {searchQuery && (
            <button className="cvf-search-box__clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
          {suggestions.length > 0 && (
            <div className="cvf-suggestions">
              {suggestions.map((s, i) => (
                <div key={i} className="cvf-suggestion" onClick={() => { setSearchQuery(s); setSuggestions([]); }}>
                  🔍 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="cvf-btn-primary cvf-btn-full" onClick={onSearch}>
          Search Candidates
        </button>
      </div>

      <div className="cvf-tips">
        <h4>Search Tips</h4>
        <div className="cvf-tips-grid">
          {TIPS.map(t => (
            <div key={t.title} className="cvf-tip-card">
              <div className="cvf-tip-card__icon">{t.icon}</div>
              <div>
                <strong>{t.title}</strong>
                <code>{t.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Saved Filters Tab ────────────────────────────────────────────────────────

const SavedTab = ({ savedFilters, onSaveFilter, onDeleteFilter }) => {
  const RECENT_SEARCHES = [
    { query: 'React developers Bangalore', time: '2 hours ago' },
    { query: 'Python 5+ years experience', time: '5 hours ago' },
    { query: 'Product Managers IIM', time: '1 day ago' },
  ];

  return (
    <div className="cvf-tab-content cvf-saved">
      <div className="cvf-row-between cvf-mb-24">
        <h2>Saved Filters</h2>
        <button className="cvf-btn-primary" onClick={onSaveFilter}>
          <span>+</span> New Filter
        </button>
      </div>

      {savedFilters.length === 0 ? (
        <div className="cvf-empty-state">
          <div className="cvf-empty-state__icon">💾</div>
          <h3>No saved filters yet</h3>
          <p>Save your filter combinations for quick access later</p>
          <button className="cvf-btn-primary" onClick={onSaveFilter}>Save Current Filter</button>
        </div>
      ) : (
        <div className="cvf-saved-grid">
          {savedFilters.map(f => (
            <div key={f.id} className="cvf-saved-card">
              <div className="cvf-row-between cvf-mb-12">
                <h4>{f.name}</h4>
                <div className="cvf-action-row">
                  <button className="cvf-icon-btn" title="Apply">▶</button>
                  <button className="cvf-icon-btn" title="Share">📤</button>
                  <button className="cvf-icon-btn" title="Delete" onClick={() => onDeleteFilter(f.id)}>🗑️</button>
                </div>
              </div>
              <div className="cvf-skills-row cvf-mb-12">
                {Object.entries(f.filters).filter(([, v]) => v).map(([k, v]) => (
                  <span key={k} className="cvf-chip">{k}: {v}</span>
                ))}
              </div>
              <div className="cvf-saved-card__footer">
                <span className="cvf-text-muted cvf-text-sm">Last used: 2 days ago</span>
                <span className="cvf-text-success cvf-text-sm">24 results</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cvf-recent-searches">
        <h3 className="cvf-mb-16">Recent Searches</h3>
        <div className="cvf-recent-list">
          {RECENT_SEARCHES.map((r, i) => (
            <div key={i} className="cvf-recent-item">
              <span>🕐 {r.query}</span>
              <span className="cvf-text-muted cvf-text-sm">{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CV Preview Modal ─────────────────────────────────────────────────────────

const CVModal = ({ cv, onClose }) => {
  if (!cv) return null;

  return (
    <div className="cvf-modal-overlay" onClick={onClose}>
      <div className="cvf-modal" onClick={e => e.stopPropagation()}>
        <button className="cvf-modal__close" onClick={onClose}>✕</button>

        <div className="cvf-modal__header">
          <AvatarCircle initials={cv.avatar} status={cv.status} size="xl" />
          <div className="cvf-modal__title">
            <h2>{cv.name}</h2>
            <p className="cvf-text-muted">{cv.position}</p>
          </div>
          <StatusBadge status={cv.status} />
        </div>

        <div className="cvf-modal__body">
          <div className="cvf-modal__section">
            <h4>Contact Information</h4>
            <div className="cvf-contact-grid">
              <span>📧 {cv.email}</span>
              <span>📞 {cv.phone}</span>
              <span>📍 {cv.location}</span>
            </div>
          </div>

          <div className="cvf-modal__section">
            <h4>Professional Summary</h4>
            <div className="cvf-summary-grid">
              {[
                { label: 'Experience', val: cv.experience },
                { label: 'Education', val: cv.education },
                { label: 'University', val: cv.university },
                { label: 'Graduation Year', val: cv.graduationYear },
                { label: 'Notice Period', val: cv.noticePeriod },
                { label: 'Expected Salary', val: cv.salary },
              ].map(item => (
                <div key={item.label} className="cvf-summary-item">
                  <span className="cvf-text-muted cvf-text-sm">{item.label}</span>
                  <strong>{item.val}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="cvf-modal__section">
            <h4>Skills</h4>
            <div className="cvf-skills-row">
              {cv.skills.map((s, i) => <SkillTag key={i} skill={s} size="lg" />)}
            </div>
          </div>

          <div className="cvf-modal__section">
            <h4>Tags</h4>
            <div className="cvf-skills-row cvf-mb-12">
              {cv.tags.map((t, i) => (
                <span key={i} className="cvf-tag">{t}</span>
              ))}
              <button className="cvf-tag cvf-tag--add">+ Add Tag</button>
            </div>
            <textarea
              className="cvf-notes"
              placeholder="Add notes about this candidate..."
              rows="3"
            />
          </div>
        </div>

        <div className="cvf-modal__footer">
          <button className="cvf-btn-primary">Shortlist</button>
          <button className="cvf-btn-outline">Schedule Interview</button>
          <button className="cvf-btn-outline">Download CV</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CVFiltering = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [theme, setTheme] = useState('light');

  const [cvData] = useState(SAMPLE_CVS);
  const [filterResults, setFilterResults] = useState([]);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const [filters, setFilters] = useState({
    position: '', experience: '', education: '', location: '',
    skills: '', noticePeriod: '', salaryRange: '', gender: '', currentStatus: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('basic');
  const [savedFilters, setSavedFilters] = useState([]);

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // ── Notifications ─────────────────────────────────────────────────────────

  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  }, []);

  // ── Upload Logic ──────────────────────────────────────────────────────────

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 8 * 1024 * 1024) {
        addNotification('error', `${file.name} exceeds 8MB limit`);
        return;
      }
      const id = Date.now() + file.name;
      setUploadedFiles(prev => [...prev, { id, name: file.name, size: file.size, type: file.type, status: 'uploading' }]);
      let progress = 0;
      const iv = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [id]: progress }));
        if (progress >= 100) {
          clearInterval(iv);
          setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'completed' } : f));
          addNotification('success', `${file.name} uploaded successfully`);
        }
      }, 300);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleUpload({ target: { files: Array.from(e.dataTransfer.files) } });
  };

  // ── Filter Logic ──────────────────────────────────────────────────────────

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let result = [...cvData];
    Object.entries(filters).forEach(([key, val]) => {
      if (val) {
        result = result.filter(cv => {
          const field = cv[key];
          if (Array.isArray(field)) return field.some(f => f.toLowerCase().includes(val.toLowerCase()));
          return String(field || '').toLowerCase().includes(val.toLowerCase());
        });
      }
    });
    if (searchQuery) {
      result = result.filter(cv => JSON.stringify(cv).toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilterResults(result);
    addNotification('success', `Found ${result.length} matching CVs`);
  };

  // ── Selection Logic ───────────────────────────────────────────────────────

  const toggleSelect = (id) =>
    setSelectedCVs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── Saved Filters ─────────────────────────────────────────────────────────

  const saveFilter = () => {
    const name = prompt('Enter filter name:');
    if (name) {
      setSavedFilters(prev => [...prev, { id: Date.now(), name, filters: { ...filters }, searchQuery, searchType }]);
      addNotification('success', 'Filter saved!');
    }
  };

  const deleteFilter = (id) => setSavedFilters(prev => prev.filter(f => f.id !== id));

  // ── Bulk Actions ──────────────────────────────────────────────────────────

  const handleBulkAction = (action) => {
    const msgs = {
      shortlist: `${selectedCVs.length} candidates shortlisted`,
      download: `Downloading ${selectedCVs.length} CVs`,
      email: `Email sent to ${selectedCVs.length} candidates`,
      export: `Exported ${selectedCVs.length} records`,
      delete: `${selectedCVs.length} CVs removed`,
    };
    addNotification('success', msgs[action] || 'Done');
    if (action === 'delete') setSelectedCVs([]);
  };

  // ── Tabs Config ───────────────────────────────────────────────────────────

  const TABS = [
    { id: 'upload',   icon: '📤', label: 'Upload' },
    { id: 'filter',   icon: '🔍', label: 'Filter' },
    { id: 'advanced', icon: '🎯', label: 'Advanced' },
    { id: 'saved',    icon: '💾', label: 'Saved' },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div 
      className={`cvf-root cvf-root--${theme}`} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'scroll',
        overflowX: 'hidden',
        zIndex: 9999,
        backgroundColor: theme === 'dark' ? '#0f1117' : '#f4f5f9'
      }}
    >
      <div className="cvf-bg" aria-hidden>
        <div className="cvf-orb cvf-orb--1" />
        <div className="cvf-orb cvf-orb--2" />
        <div className="cvf-orb cvf-orb--3" />
      </div>

      <Notification notifications={notifications} />

      <div className="cvf-shell" style={{ paddingBottom: '60px' }}>
        {/* Header */}
        <header className="cvf-header">
          <div className="cvf-header__left">
            {onBack && (
              <button className="cvf-back-btn" onClick={onBack} title="Back to Dashboard">
                ← Back
              </button>
            )}
            <div className="cvf-header__brand">
              <h1>CV Filtering <span className="cvf-badge">v2.0</span></h1>
            </div>
            <div className="cvf-header__stats">
              <div className="cvf-hstat"><strong>{cvData.length}</strong><span>Total CVs</span></div>
              <div className="cvf-hstat"><strong>92%</strong><span>Parsed</span></div>
              <div className="cvf-hstat"><strong>24</strong><span>New Today</span></div>
            </div>
          </div>

          <div className="cvf-header__right">
            <button className="cvf-icon-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="cvf-icon-btn cvf-icon-btn--notif">
              🔔 <span className="cvf-notif-dot">3</span>
            </button>
            <div className="cvf-user">
              <div className="cvf-user__avatar">JD</div>
              <div className="cvf-user__info">
                <span>John Doe</span>
                <span className="cvf-text-muted cvf-text-sm">Recruiter</span>
              </div>
            </div>
          </div>
        </header>

        {/* Nav Tabs */}
        <nav className="cvf-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`cvf-nav__tab ${activeTab === tab.id ? 'cvf-nav__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="cvf-main">
          {activeTab === 'upload' && (
            <UploadTab
              cvData={cvData}
              uploadedFiles={uploadedFiles}
              uploadProgress={uploadProgress}
              onUpload={handleUpload}
              onDrop={handleDrop}
            />
          )}

          {activeTab === 'filter' && (
            <FilterTab
              cvData={cvData}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={applyFilters}
              onClearFilters={() => setFilters({})}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedCVs={selectedCVs}
              onToggleSelect={toggleSelect}
              onOpenCV={setSelectedCV}
              onBulkAction={handleBulkAction}
              filterResults={filterResults}
            />
          )}

          {activeTab === 'advanced' && (
            <AdvancedTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchType={searchType}
              setSearchType={setSearchType}
              onSearch={applyFilters}
              cvData={cvData}
            />
          )}

          {activeTab === 'saved' && (
            <SavedTab
              savedFilters={savedFilters}
              onSaveFilter={saveFilter}
              onDeleteFilter={deleteFilter}
            />
          )}
        </main>
      </div>

      {selectedCV && <CVModal cv={selectedCV} onClose={() => setSelectedCV(null)} />}
    </div>
  );
};

export default CVFiltering;