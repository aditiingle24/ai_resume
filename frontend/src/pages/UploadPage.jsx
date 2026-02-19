import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { uploadResume, getDashboard } from '../api';
import { LoadingSpinner } from '../components/UIComponents';

export default function UploadPage() {
    const { setResumeId, setResumeData, setDashboardData, setLoading } = useApp();
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();

    const processFile = async (file) => {
        if (!file) return;
        setFileName(file.name);
        setUploading(true);
        setStatus(null);

        try {
            const result = await uploadResume(file);
            setResumeId(result.resume_id);
            setResumeData(result.resume);
            setStatus({ type: 'success', message: result.message });

            // Fetch full dashboard data
            setLoading(true);
            const dashboard = await getDashboard(result.resume_id);
            setDashboardData(dashboard);
            setLoading(false);

            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => setDragging(false), []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    return (
        <div>
            <div className="page-header animate-in">
                <h1>Upload Your Resume</h1>
                <p>Upload your resume to get AI-powered career insights, skill analysis, and personalized mentorship</p>
            </div>

            <div className="animate-in stagger-1">
                <div
                    className={`upload-zone ${dragging ? 'dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    {uploading ? (
                        <>
                            <div className="upload-icon">
                                <LoadingSpinner />
                            </div>
                            <h3>Analyzing your resume...</h3>
                            <p>Our AI is extracting skills, experience, and insights</p>
                        </>
                    ) : (
                        <>
                            <div className="upload-icon">
                                <Upload size={28} />
                            </div>
                            <h3>Drop your resume here or click to browse</h3>
                            <p>Supports PDF, DOCX, DOC, and TXT files • Max 10MB</p>
                            {fileName && (
                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <FileText size={16} color="var(--accent-primary-light)" />
                                    <span style={{ color: 'var(--accent-primary-light)', fontSize: '0.85rem' }}>{fileName}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {status && (
                <div className="animate-in" style={{ marginTop: '24px' }}>
                    <div
                        className="card"
                        style={{
                            borderColor: status.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        {status.type === 'success' ? (
                            <CheckCircle size={24} color="var(--accent-success)" />
                        ) : (
                            <AlertCircle size={24} color="var(--accent-danger)" />
                        )}
                        <div>
                            <h4 style={{ marginBottom: '4px', color: status.type === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                {status.type === 'success' ? 'Resume Uploaded Successfully!' : 'Upload Failed'}
                            </h4>
                            <p style={{ fontSize: '0.85rem' }}>{status.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid-3 animate-in stagger-2" style={{ marginTop: '32px' }}>
                {[
                    { icon: <Sparkles size={20} />, title: 'AI Analysis', desc: 'Get instant resume scoring and improvement suggestions' },
                    { icon: <FileText size={20} />, title: 'Skills Extraction', desc: 'Automatically identify and categorize your technical skills' },
                    { icon: <Upload size={20} />, title: 'Career Matching', desc: 'Find career paths that align with your experience' },
                ].map((item, i) => (
                    <div key={i} className="card card-glow" style={{ textAlign: 'center', padding: '28px 20px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 14px', color: 'white'
                        }}>
                            {item.icon}
                        </div>
                        <h4 style={{ marginBottom: '6px' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.82rem' }}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
