import { useNavigate } from 'react-router-dom';
import {
    BarChart3, Target, Route, Sparkles, Upload, TrendingUp,
    Award, Zap, ArrowRight, BrainCircuit
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreRing, StatCard, Badge, ProgressBar, EmptyState } from '../components/UIComponents';

export default function DashboardPage() {
    const { dashboardData, resumeData, loading } = useApp();
    const navigate = useNavigate();

    if (!dashboardData) {
        return (
            <EmptyState
                icon={<Upload size={36} />}
                title="No Resume Uploaded Yet"
                description="Upload your resume to unlock AI-powered career insights, skill analysis, and personalized mentorship"
                action={
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/upload')}>
                        <Upload size={18} /> Upload Resume
                    </button>
                }
            />
        );
    }

    const { analysis, skill_gaps, career_paths, resume, learning_roadmap } = dashboardData;
    const topPath = career_paths?.[0];

    return (
        <div>
            <div className="page-header animate-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1>Welcome back{resume?.name ? `, ${resume.name}` : ''}! 👋</h1>
                        <p>Here's your AI-powered career dashboard overview</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/mentor')}>
                        <BrainCircuit size={18} /> Ask AI Mentor
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid-4 animate-in stagger-1">
                <StatCard
                    icon={<Award size={20} />}
                    value={`${Math.round(analysis?.overall_score || 0)}%`}
                    label="Resume Score"
                    color="#6366f1"
                />
                <StatCard
                    icon={<Zap size={20} />}
                    value={resume?.skills?.length || 0}
                    label="Skills Detected"
                    color="#06b6d4"
                />
                <StatCard
                    icon={<Target size={20} />}
                    value={skill_gaps?.length || 0}
                    label="Skill Gaps"
                    color="#f472b6"
                />
                <StatCard
                    icon={<TrendingUp size={20} />}
                    value={career_paths?.length || 0}
                    label="Career Matches"
                    color="#10b981"
                />
            </div>

            <div className="grid-2" style={{ marginTop: '24px' }}>
                {/* Resume Analysis Summary */}
                <div className="card card-glow animate-in stagger-2">
                    <div className="card-header">
                        <div className="card-title">
                            <BarChart3 size={18} color="var(--accent-primary-light)" />
                            Resume Analysis
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/analysis')}>
                            Details <ArrowRight size={14} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <ScoreRing score={analysis?.overall_score || 0} />
                        <div style={{ flex: 1 }}>
                            {[
                                { label: 'Structure', value: analysis?.structure_score },
                                { label: 'Content', value: analysis?.content_score },
                                { label: 'Keywords', value: analysis?.keyword_score },
                                { label: 'ATS Ready', value: analysis?.ats_compatibility },
                            ].map((item, i) => (
                                <div key={i} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {Math.round(item.value || 0)}%
                                        </span>
                                    </div>
                                    <ProgressBar value={item.value || 0} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Career Match */}
                <div className="card card-glow animate-in stagger-3">
                    <div className="card-header">
                        <div className="card-title">
                            <Route size={18} color="var(--accent-secondary)" />
                            Top Career Match
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/careers')}>
                            All Paths <ArrowRight size={14} />
                        </button>
                    </div>
                    {topPath ? (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div className="career-match">{Math.round(topPath.match_score)}%</div>
                                <div>
                                    <h3 style={{ marginBottom: '4px' }}>{topPath.title}</h3>
                                    <p style={{ fontSize: '0.82rem' }}>{topPath.salary_range}</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>{topPath.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {topPath.current_match_skills?.slice(0, 6).map((skill, i) => (
                                    <Badge key={i} variant="success">{skill}</Badge>
                                ))}
                                {topPath.gap_skills?.slice(0, 3).map((skill, i) => (
                                    <Badge key={`g-${i}`} variant="danger">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>No career paths matched yet.</p>
                    )}
                </div>
            </div>

            <div className="grid-2" style={{ marginTop: '24px' }}>
                {/* Skills Overview */}
                <div className="card card-glow animate-in stagger-3">
                    <div className="card-header">
                        <div className="card-title">
                            <Target size={18} color="var(--accent-tertiary)" />
                            Your Skills
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/skills')}>
                            Gap Analysis <ArrowRight size={14} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {resume?.skills?.slice(0, 15).map((skill, i) => (
                            <span key={i} className="skill-tag">
                                {skill.name}
                                <Badge variant={
                                    skill.level === 'advanced' || skill.level === 'expert' ? 'success' :
                                        skill.level === 'beginner' ? 'warning' : 'primary'
                                }>{skill.level}</Badge>
                            </span>
                        ))}
                        {(!resume?.skills || resume.skills.length === 0) && (
                            <p style={{ fontSize: '0.85rem' }}>No skills detected. Try uploading a more detailed resume.</p>
                        )}
                    </div>
                </div>

                {/* Learning Roadmap Preview */}
                <div className="card card-glow animate-in stagger-4">
                    <div className="card-header">
                        <div className="card-title">
                            <Sparkles size={18} color="var(--accent-warning)" />
                            Learning Roadmap
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/roadmap')}>
                            Full Plan <ArrowRight size={14} />
                        </button>
                    </div>
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <Badge variant="primary">{learning_roadmap?.career_target || 'Target Career'}</Badge>
                            <span style={{ marginLeft: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                {learning_roadmap?.timeline || '6 months'} plan
                            </span>
                        </div>
                        {learning_roadmap?.phases?.slice(0, 3).map((phase, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: '12px', alignItems: 'flex-start',
                                padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none'
                            }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'var(--gradient-primary)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    fontSize: '0.75rem', fontWeight: 700, color: 'white'
                                }}>{phase.phase}</div>
                                <div>
                                    <h4 style={{ fontSize: '0.88rem', marginBottom: '2px' }}>{phase.title}</h4>
                                    <p style={{ fontSize: '0.78rem' }}>{phase.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
