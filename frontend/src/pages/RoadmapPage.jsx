import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, BookOpen, Clock, ExternalLink, Award, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, EmptyState } from '../components/UIComponents';

export default function RoadmapPage() {
    const { dashboardData } = useApp();
    const navigate = useNavigate();

    if (!dashboardData) {
        return (
            <EmptyState icon={<Upload size={36} />} title="No Resume Uploaded"
                description="Upload your resume to get a personalized learning roadmap"
                action={<button className="btn btn-primary" onClick={() => navigate('/upload')}><Upload size={18} /> Upload Resume</button>}
            />
        );
    }

    const { learning_roadmap } = dashboardData;

    const phaseColors = ['#6366f1', '#06b6d4', '#10b981'];
    const resourceIcons = {
        course: '📚',
        certification: '🏆',
        tutorial: '📖',
        book: '📕',
        documentation: '📄',
        search: '🔍',
    };

    return (
        <div>
            <div className="page-header animate-in">
                <h1>Personalized Learning Roadmap</h1>
                <p>AI-curated learning plan to reach your career goals</p>
            </div>

            {/* Target Info */}
            <div className="card card-glow animate-in stagger-1" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                        background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white'
                    }}>
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3>Target: {learning_roadmap?.career_target}</h3>
                        <p style={{ fontSize: '0.85rem' }}>
                            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            Estimated Timeline: {learning_roadmap?.timeline}
                        </p>
                    </div>
                </div>
            </div>

            {/* Phases Timeline */}
            <div className="animate-in stagger-2">
                <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={22} color="var(--accent-primary-light)" />
                    Learning Phases
                </h2>

                {learning_roadmap?.phases?.map((phase, i) => (
                    <div key={i} className="roadmap-phase">
                        <div className="roadmap-dot" style={{
                            background: `linear-gradient(135deg, ${phaseColors[i] || phaseColors[0]}, ${phaseColors[(i + 1) % phaseColors.length]})`
                        }} />
                        <div className="roadmap-phase-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                <Badge variant={i === 0 ? 'primary' : i === 1 ? 'success' : 'warning'}>
                                    Phase {phase.phase}
                                </Badge>
                                <h3 style={{ fontSize: '1.1rem' }}>{phase.title}</h3>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{phase.duration}</span>
                            </div>
                            <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>{phase.description}</p>

                            {/* Skills */}
                            {phase.skills?.length > 0 && (
                                <div style={{ marginBottom: '14px' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Target Skills</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {phase.skills.map((s, j) => (
                                            <span key={j} className="skill-tag">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Milestones */}
                            {phase.milestones?.length > 0 && (
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Milestones</span>
                                    {phase.milestones.map((m, j) => (
                                        <div key={j} style={{
                                            display: 'flex', gap: '8px', alignItems: 'flex-start',
                                            padding: '6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)'
                                        }}>
                                            <CheckSquare size={16} color="var(--accent-primary-light)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Resources */}
            {learning_roadmap?.resources?.length > 0 && (
                <div className="animate-in stagger-3" style={{ marginTop: '32px' }}>
                    <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BookOpen size={22} color="var(--accent-secondary)" />
                        Recommended Resources
                    </h2>

                    <div className="grid-2">
                        {learning_roadmap.resources.map((r, i) => (
                            <div key={i} className="card" style={{ padding: '18px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                                        {resourceIcons[r.resource_type] || '📚'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{r.title}</h4>
                                        <p style={{ fontSize: '0.78rem', marginBottom: '8px' }}>{r.provider} • {r.duration}</p>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Badge variant="primary">{r.skill_target}</Badge>
                                            <Badge variant={r.priority === 'high' ? 'danger' : 'secondary'}>{r.priority}</Badge>
                                        </div>
                                    </div>
                                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                                        className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
