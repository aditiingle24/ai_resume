import { useNavigate } from 'react-router-dom';
import { Target, Upload, ArrowUp, ArrowRight, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, EmptyState, ProgressBar } from '../components/UIComponents';

export default function SkillsPage() {
    const { dashboardData } = useApp();
    const navigate = useNavigate();

    if (!dashboardData) {
        return (
            <EmptyState icon={<Upload size={36} />} title="No Resume Uploaded"
                description="Upload your resume to see skill gap analysis"
                action={<button className="btn btn-primary" onClick={() => navigate('/upload')}><Upload size={18} /> Upload Resume</button>}
            />
        );
    }

    const { resume, skill_gaps } = dashboardData;

    const skillsByCategory = {};
    resume?.skills?.forEach(s => {
        if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
        skillsByCategory[s.category].push(s);
    });

    const categoryLabels = {
        programming: '💻 Programming Languages',
        frameworks: '🛠️ Frameworks & Libraries',
        data_science: '🧠 Data Science & AI',
        cloud: '☁️ Cloud & DevOps',
        databases: '🗄️ Databases',
        tools: '🔧 Tools & Platforms',
        soft_skills: '🤝 Soft Skills',
        general: '📋 General',
    };

    const gapsByPriority = { high: [], medium: [], low: [] };
    skill_gaps?.forEach(g => {
        const p = g.priority || 'medium';
        if (gapsByPriority[p]) gapsByPriority[p].push(g);
        else gapsByPriority.medium.push(g);
    });

    return (
        <div>
            <div className="page-header animate-in">
                <h1>Skill Gap Analysis</h1>
                <p>AI-identified skills from your resume and gaps to close for your target career</p>
            </div>

            {/* Current Skills */}
            <div className="card card-glow animate-in stagger-1">
                <div className="card-header">
                    <div className="card-title">
                        <Target size={18} color="var(--accent-primary-light)" />
                        Your Current Skills ({resume?.skills?.length || 0})
                    </div>
                </div>
                {Object.entries(skillsByCategory).map(([cat, skills]) => (
                    <div key={cat} style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '0.88rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                            {categoryLabels[cat] || cat}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {skills.map((s, i) => (
                                <span key={i} className="skill-tag">
                                    {s.name}
                                    <Badge variant={
                                        s.level === 'advanced' || s.level === 'expert' ? 'success' :
                                            s.level === 'beginner' ? 'warning' : 'primary'
                                    }>{s.level}</Badge>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                {(!resume?.skills || resume.skills.length === 0) && (
                    <p style={{ textAlign: 'center', padding: '20px' }}>No skills detected. Try uploading a more detailed resume.</p>
                )}
            </div>

            {/* Skill Gaps */}
            {skill_gaps?.length > 0 && (
                <div className="animate-in stagger-2" style={{ marginTop: '24px' }}>
                    <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ArrowUp size={22} color="var(--accent-danger)" />
                        Skills to Develop ({skill_gaps.length})
                    </h2>

                    {gapsByPriority.high.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: 'var(--accent-danger)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🔴 High Priority
                            </h4>
                            <div className="grid-2">
                                {gapsByPriority.high.map((g, i) => (
                                    <div key={i} className="card" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h4 style={{ fontSize: '0.95rem' }}>{g.skill}</h4>
                                            <Badge variant="danger">High Priority</Badge>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                            <span>{g.current_level}</span>
                                            <ArrowRight size={14} color="var(--accent-primary)" />
                                            <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>{g.required_level}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {gapsByPriority.medium.length > 0 && (
                        <div>
                            <h4 style={{ color: 'var(--accent-warning)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🟡 Medium Priority
                            </h4>
                            <div className="grid-2">
                                {gapsByPriority.medium.map((g, i) => (
                                    <div key={i} className="card" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h4 style={{ fontSize: '0.95rem' }}>{g.skill}</h4>
                                            <Badge variant="warning">Medium</Badge>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                            <span>{g.current_level}</span>
                                            <ArrowRight size={14} color="var(--accent-primary)" />
                                            <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>{g.required_level}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
