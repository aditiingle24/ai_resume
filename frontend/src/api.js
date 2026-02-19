const API_BASE = 'http://localhost:8000';

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload-resume`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function getResumeAnalysis(resumeId) {
  const res = await fetch(`${API_BASE}/api/analyze/${resumeId}`);
  if (!res.ok) throw new Error('Failed to analyze resume');
  return res.json();
}

export async function getSkillGaps(resumeId, targetRole = '') {
  const url = targetRole
    ? `${API_BASE}/api/skill-gaps/${resumeId}?target_role=${encodeURIComponent(targetRole)}`
    : `${API_BASE}/api/skill-gaps/${resumeId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to get skill gaps');
  return res.json();
}

export async function getCareerPaths(resumeId) {
  const res = await fetch(`${API_BASE}/api/career-paths/${resumeId}`);
  if (!res.ok) throw new Error('Failed to get career paths');
  return res.json();
}

export async function getLearningRoadmap(resumeId, targetCareer = '') {
  const url = targetCareer
    ? `${API_BASE}/api/learning-roadmap/${resumeId}?target_career=${encodeURIComponent(targetCareer)}`
    : `${API_BASE}/api/learning-roadmap/${resumeId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to get learning roadmap');
  return res.json();
}

export async function getDashboard(resumeId) {
  const res = await fetch(`${API_BASE}/api/dashboard/${resumeId}`);
  if (!res.ok) throw new Error('Failed to get dashboard');
  return res.json();
}

export async function sendChatMessage(message, resumeId = null) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, resume_id: resumeId }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}
