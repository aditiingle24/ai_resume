import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Upload, BarChart3, Target, Route,
    MessageSquare, Sparkles, BrainCircuit
} from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/upload', icon: <Upload size={20} />, label: 'Upload Resume' },
        { to: '/analysis', icon: <BarChart3 size={20} />, label: 'Resume Analysis' },
        { to: '/skills', icon: <Target size={20} />, label: 'Skill Gap Analysis' },
        { to: '/careers', icon: <Route size={20} />, label: 'Career Paths' },
        { to: '/roadmap', icon: <Sparkles size={20} />, label: 'Learning Roadmap' },
        { to: '/mentor', icon: <MessageSquare size={20} />, label: 'AI Mentor Chat' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <BrainCircuit size={22} />
                </div>
                <div>
                    <h2>CareerMentor</h2>
                    <span>AI-Powered Guidance</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <div className="nav-section-label">Main Menu</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.to === '/'}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
                <div className="card" style={{ padding: '16px', background: 'var(--gradient-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Sparkles size={16} color="var(--accent-primary-light)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary-light)' }}>
                            AI Powered
                        </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
                        Get personalized career insights powered by advanced AI analysis
                    </p>
                </div>
            </div>
        </aside>
    );
}
