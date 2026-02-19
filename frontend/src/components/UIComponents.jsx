export function ScoreRing({ score, size = 120, strokeWidth = 8, color = 'url(#gradient)', label = 'Score' }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="score-ring" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
                <circle className="score-ring-bg" cx={size / 2} cy={size / 2} r={radius} />
                <circle
                    className="score-ring-fill"
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="score-ring-text">
                <span className="score-value" style={{
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {Math.round(score)}
                </span>
                <span className="score-label">{label}</span>
            </div>
        </div>
    );
}

export function ProgressBar({ value, max = 100, variant = '' }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="progress-bar">
            <div className={`progress-fill ${variant}`} style={{ width: `${pct}%` }} />
        </div>
    );
}

export function Badge({ children, variant = 'primary' }) {
    return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function StatCard({ icon, value, label, color }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: `${color}20`, color }}>
                {icon}
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export function LoadingSpinner() {
    return <div className="loading-spinner" />;
}

export function LoadingDots() {
    return (
        <div className="loading-dots">
            <span></span><span></span><span></span>
        </div>
    );
}

export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="empty-state animate-in">
            <div className="empty-state-icon">{icon}</div>
            <h3 style={{ marginBottom: '8px' }}>{title}</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 20px' }}>{description}</p>
            {action}
        </div>
    );
}
