import React from "react";
import "./AppSidebar.css";

function AppSidebar({ title, icon = "📄", items, activeId, onSelect, onBack }) {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-brand">
        <span className="app-sidebar-logo" aria-hidden="true">{icon}</span>
        <h2>{title}</h2>
      </div>

      <nav className="app-sidebar-nav" aria-label={`${title} navigation`}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`app-sidebar-feature ${activeId === item.id ? "app-sidebar-feature--active" : ""}`}
            aria-current={activeId === item.id ? "page" : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span className="app-sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="app-sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="app-sidebar-back" onClick={onBack}>
        <span aria-hidden="true">←</span>
        <span className="app-sidebar-back-label"> Back</span>
      </button>
    </aside>
  );
}

export default AppSidebar;