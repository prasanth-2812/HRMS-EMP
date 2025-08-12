import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import '../RecruitmentShared.css';

const SkillZone: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="skill-zone-page">
      <Sidebar />
      <div className={`main-content ${isCollapsed ? 'main-content--collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="content">
          <div className="content-container">
            {/* Header */}
            <div className="header">
              <div className="header__left">
                <h1>Skill Zone</h1>
                <p>Manage skills database and assessment tools</p>
              </div>
              <div className="header__actions">
                <button className="btn btn--secondary">
                  <span>Import Skills</span>
                </button>
                <button className="btn btn--primary">
                  <span>Create Assessment</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="filters">
              <div className="search">
                <input 
                  type="text" 
                  placeholder="Search skills, categories..." 
                  className="search-input"
                />
              </div>
              <div className="filter-buttons">
                <button className="filter-btn filter-btn--active">All Skills</button>
                <button className="filter-btn">Technical</button>
                <button className="filter-btn">Soft Skills</button>
                <button className="filter-btn">Industry</button>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="skills-grid">
              <div className="skill-category">
                <div className="category-header">
                  <h3>Programming Languages</h3>
                  <span className="category-count">12 skills</span>
                </div>
                <div className="skills-list">
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">Java</span>
                  <span className="skill-tag">TypeScript</span>
                  <span className="skill-tag">C#</span>
                  <span className="skill-tag">Go</span>
                  <span className="skill-tag">Rust</span>
                  <span className="skill-tag">PHP</span>
                </div>
              </div>

              <div className="skill-category">
                <div className="category-header">
                  <h3>Frontend Technologies</h3>
                  <span className="category-count">8 skills</span>
                </div>
                <div className="skills-list">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">Vue.js</span>
                  <span className="skill-tag">Angular</span>
                  <span className="skill-tag">HTML/CSS</span>
                  <span className="skill-tag">Sass</span>
                  <span className="skill-tag">Webpack</span>
                </div>
              </div>

              <div className="skill-category">
                <div className="category-header">
                  <h3>Backend Technologies</h3>
                  <span className="category-count">10 skills</span>
                </div>
                <div className="skills-list">
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">Express</span>
                  <span className="skill-tag">Django</span>
                  <span className="skill-tag">Spring Boot</span>
                  <span className="skill-tag">Flask</span>
                  <span className="skill-tag">FastAPI</span>
                </div>
              </div>

              <div className="skill-category">
                <div className="category-header">
                  <h3>Databases</h3>
                  <span className="category-count">6 skills</span>
                </div>
                <div className="skills-list">
                  <span className="skill-tag">PostgreSQL</span>
                  <span className="skill-tag">MySQL</span>
                  <span className="skill-tag">MongoDB</span>
                  <span className="skill-tag">Redis</span>
                  <span className="skill-tag">ElasticSearch</span>
                </div>
              </div>

              <div className="skill-category">
                <div className="category-header">
                  <h3>Cloud & DevOps</h3>
                  <span className="category-count">9 skills</span>
                </div>
                <div className="skills-list">
                  <span className="skill-tag">AWS</span>
                  <span className="skill-tag">Docker</span>
                  <span className="skill-tag">Kubernetes</span>
                  <span className="skill-tag">Jenkins</span>
                  <span className="skill-tag">Terraform</span>
                  <span className="skill-tag">Git</span>
                </div>
              </div>

              <div className="skill-category">
                <div className="category-header">
                  <h3>Soft Skills</h3>
                  <span className="category-count">7 skills</span>
                </div>
                <div className="skills-list">
                  <span className="skill-tag">Communication</span>
                  <span className="skill-tag">Leadership</span>
                  <span className="skill-tag">Problem Solving</span>
                  <span className="skill-tag">Teamwork</span>
                  <span className="skill-tag">Time Management</span>
                </div>
              </div>
            </div>

            {/* Skill Assessments */}
            <div className="skill-assessments">
              <h3>Recent Assessments</h3>
              <div className="assessments-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>React.js Fundamentals</h4>
                    <p>Component lifecycle, hooks, state management</p>
                  </div>
                  <div className="assessment-stats">
                    <span className="assessment-score">85%</span>
                    <span className="assessment-candidates">45 candidates</span>
                  </div>
                </div>

                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Node.js Backend Development</h4>
                    <p>Express, APIs, database integration</p>
                  </div>
                  <div className="assessment-stats">
                    <span className="assessment-score">78%</span>
                    <span className="assessment-candidates">32 candidates</span>
                  </div>
                </div>

                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>System Design Interview</h4>
                    <p>Scalability, architecture, trade-offs</p>
                  </div>
                  <div className="assessment-stats">
                    <span className="assessment-score">72%</span>
                    <span className="assessment-candidates">28 candidates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <QuickAccess />
    </div>
  );
};

export default SkillZone;
