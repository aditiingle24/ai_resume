import { useNavigate } from 'react-router-dom';
import { BarChart3, CheckCircle, AlertTriangle, Upload, TrendingUp, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScoreRing, ProgressBar, Badge, EmptyState } from '../components/UIComponents';

export default function AnalysisPage() {
    const { dashboardData } = useApp();
    const navigate = useNavigate();

    if (!dashboardData) {
        return (
            <EmptyState icon={<Upload size={36} />} title="No Resume to Analyze"
                description="Upload your resume first to get a detailed analysis"
                action={<button className="btn btn-primary" onClick={() => navigate('/upload')}><Upload size={18} /> Upload Resume</button>}
            />
        );
    }

    const { analysis } = dashboardData;

    const scores = [
        { label: 'Structure', value: analysis.structure_score, icon: <BarChart3 size={16} />, color: '#6366f1', desc: 'How well your resume is organized with clear sections' },
        { label: 'Content Quality', value: analysis.content_score, icon: <TrendingUp size={16} />, color: '#06b6d4', desc: 'Depth and relevance of your experience and skills' },
        { label: 'Keywords & Impact', value: analysis.keyword_score, icon: <CheckCircle size={16} />, color: '#10b981', desc: 'Use of action verbs and impactful language' },
        { label: 'ATS Compatibility', value: analysis.ats_compatibility, icon: <Shield size={16} />, color: '#f472b6', desc: 'How well your resume passes automated screening systems' },
    ];

    return (
        <div>
            <div className="page-header animate-in">
                <h1>Resume Analysis</h1>
                <p>Detailed AI-powered breakdown of your resume's strengths and areas for improvement</p>
            </div>

            {/* Overall Score */}
            <div className="card card-glow animate-in stagger-1" style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Overall Resume Score</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ScoreRing score={analysis.overall_score} size={160} strokeWidth={10} />
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem' }}>
                    {analysis.overall_score >= 70 ? '🎉 Great resume! A few tweaks could make it even better.' :
                        analysis.overall_score >= 50 ? '👍 Good foundation. Follow the recommendations below to improve.' :
                            '💪 Your resume has potential. Let\'s work on the areas below.'}
                </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid-2 animate-in stagger-2" style={{ marginTop: '24px' }}>
                {scores.map((s, i) => (
                    <div key={i} className="card card-glow">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                                background: `${s.color}20`, color: s.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {s.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</span>
                                    <span style={{ fontWeight: 700, color: s.color }}>{Math.round(s.value)}%</span>
                                </div>
                            </div>
                        </div>
                        <ProgressBar value={s.value} />
                        <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>{s.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginTop: '24px' }}>
                {/* Strengths */}
                <div className="card card-glow animate-in stagger-3">
                    <div className="card-header">
                        <div className="card-title">
                            <CheckCircle size={18} color="var(--accent-success)" />
                            Strengths
                        </div>
                        <Badge variant="success">{analysis.strengths?.length || 0}</Badge>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {analysis.strengths?.map((s, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: '10px', alignItems: 'flex-start',
                                padding: '10px 14px', background: 'rgba(16,185,129,0.05)',
                                borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.1)',
                            }}>
                                <CheckCircle size={16} color="var(--accent-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Improvements */}
                <div className="card card-glow animate-in stagger-4">
                    <div className="card-header">
                        <div className="card-title">
                            <AlertTriangle size={18} color="var(--accent-warning)" />
                            Improvements
                        </div>
                        <Badge variant="warning">{analysis.improvements?.length || 0}</Badge>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {analysis.improvements?.map((s, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: '10px', alignItems: 'flex-start',
                                padding: '10px 14px', background: 'rgba(245,158,11,0.05)',
                                borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.1)',
                            }}>
                                <AlertTriangle size={16} color="var(--accent-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Missing Sections */}
            {analysis.missing_sections?.length > 0 && (
                <div className="card card-glow animate-in stagger-4" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <AlertTriangle size={18} color="var(--accent-danger)" />
                            Missing Sections
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {analysis.missing_sections.map((s, i) => (
                            <Badge key={i} variant="danger">{s}</Badge>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.82rem', marginTop: '12px' }}>
                        Adding these sections can significantly improve your resume's ATS score and recruiter appeal.
                    </p>
                </div>
            )}
        </div>
    );
}
