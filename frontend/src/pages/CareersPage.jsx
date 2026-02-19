import { useNavigate } from 'react-router-dom';
import { Route, Upload, TrendingUp, DollarSign, BarChart3, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, EmptyState, ProgressBar } from '../components/UIComponents';

export default function CareersPage() {
    const { dashboardData } = useApp();
    const navigate = useNavigate();

    if (!dashboardData) {
        return (
            <EmptyState icon={<Upload size={36} />} title="No Resume Uploaded"
                description="Upload your resume to discover matching career paths"
                action={<button className="btn btn-primary" onClick={() => navigate('/upload')}><Upload size={18} /> Upload Resume</button>}
            />
        );
    }

    const { career_paths } = dashboardData;

    return (
        <div>
            <div className="page-header animate-in">
                <h1>Career Path Matches</h1>
                <p>AI-matched career paths based on your skills, experience, and profile</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {career_paths?.map((path, i) => (
                    <div key={i} className="career-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                            {/* Match Score */}
                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                <div className="career-match">{Math.round(path.match_score)}%</div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Match
                                </span>
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    <h3 style={{ fontSize: '1.2rem' }}>{path.title}</h3>
                                    {i === 0 && <Badge variant="success">🏆 Best Match</Badge>}
                                </div>

                                <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>{path.description}</p>

                                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <DollarSign size={16} color="var(--accent-success)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{path.salary_range}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <TrendingUp size={16} color="var(--accent-primary-light)" />
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{path.growth_outlook}</span>
                                    </div>
                                </div>

                                {/* Match Bar */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Skills Match</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                                            {path.current_match_skills?.length || 0} / {path.required_skills?.length || 0} skills
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={(path.current_match_skills?.length || 0)}
                                        max={path.required_skills?.length || 1}
                                        variant={path.match_score > 60 ? 'success' : ''}
                                    />
                                </div>

                                {/* Skills */}
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <div>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                                            ✅ Matching Skills
                                        </span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {path.current_match_skills?.map((s, j) => (
                                                <Badge key={j} variant="success">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {path.gap_skills?.length > 0 && (
                                        <div>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                                                🎯 Skills to Learn
                                            </span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {path.gap_skills?.map((s, j) => (
                                                    <Badge key={j} variant="danger">{s}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {(!career_paths || career_paths.length === 0) && (
                    <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No career paths matched. Try uploading a more detailed resume.
                    </p>
                )}
            </div>
        </div>
    );
}
