"""
FastAPI Backend - AI Career Mentor Platform
Main application with all API endpoints
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict
import uuid

from models import (
    ResumeData, ResumeAnalysis, ChatRequest, ChatMessage,
    ProfileInput, CareerPath, SkillGap, LearningRoadmap
)
from resume_parser import parse_resume
from career_analyzer import (
    analyze_resume, detect_skill_gaps,
    match_career_paths, generate_learning_roadmap
)
from ai_engine import ai_mentor

app = FastAPI(
    title="AI Career Mentor Platform",
    description="AI-powered career guidance and resume analysis platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
resumes_store: Dict[str, ResumeData] = {}
profiles_store: Dict[str, ProfileInput] = {}


@app.get("/")
async def root():
    return {"message": "AI Career Mentor Platform API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse a resume file"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    allowed_extensions = ['.pdf', '.docx', '.doc', '.txt']
    file_ext = '.' + file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )

    try:
        file_bytes = await file.read()
        resume_data = parse_resume(file_bytes, file.filename)
        resumes_store[resume_data.id] = resume_data

        return {
            "success": True,
            "resume_id": resume_data.id,
            "resume": resume_data.dict(),
            "message": f"Resume parsed successfully. Found {len(resume_data.skills)} skills and {len(resume_data.experience)} experience entries."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


@app.post("/api/profile")
async def save_profile(profile: ProfileInput):
    """Save user profile data"""
    profile_id = str(uuid.uuid4())
    profiles_store[profile_id] = profile
    return {"success": True, "profile_id": profile_id, "profile": profile.dict()}


@app.get("/api/resume/{resume_id}")
async def get_resume(resume_id: str):
    """Get parsed resume data"""
    if resume_id not in resumes_store:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resumes_store[resume_id].dict()


@app.get("/api/analyze/{resume_id}")
async def analyze(resume_id: str):
    """Analyze resume quality and structure"""
    if resume_id not in resumes_store:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume = resumes_store[resume_id]
    analysis = analyze_resume(resume)
    return analysis.dict()


@app.get("/api/skill-gaps/{resume_id}")
async def get_skill_gaps(resume_id: str, target_role: Optional[str] = None):
    """Detect skill gaps for target role"""
    if resume_id not in resumes_store:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume = resumes_store[resume_id]
    gaps = detect_skill_gaps(resume, target_role or "")
    return {"gaps": [g.dict() for g in gaps], "total": len(gaps)}


@app.get("/api/career-paths/{resume_id}")
async def get_career_paths(resume_id: str):
    """Get matched career paths"""
    if resume_id not in resumes_store:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume = resumes_store[resume_id]
    paths = match_career_paths(resume)
    return {"paths": [p.dict() for p in paths]}


@app.get("/api/learning-roadmap/{resume_id}")
async def get_learning_roadmap(resume_id: str, target_career: Optional[str] = None):
    """Generate personalized learning roadmap"""
    if resume_id not in resumes_store:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume = resumes_store[resume_id]
    roadmap = generate_learning_roadmap(resume, target_career or "")
    return roadmap.dict()


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Interactive AI mentorship chat"""
    resume_data = None
    if request.resume_id and request.resume_id in resumes_store:
        resume_data = resumes_store[request.resume_id]

    response = ai_mentor.generate_response(
        user_message=request.message,
        resume_data=resume_data,
        context=request.context or ""
    )

    return {
        "response": response,
        "timestamp": ChatMessage(role="assistant", content=response).timestamp
    }


@app.get("/api/dashboard/{resume_id}")
async def get_dashboard(resume_id: str):
    """Get complete dashboard data"""
    if resume_id not in resumes_store:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume = resumes_store[resume_id]
    analysis = analyze_resume(resume)
    gaps = detect_skill_gaps(resume)
    paths = match_career_paths(resume)
    roadmap = generate_learning_roadmap(resume)

    return {
        "resume": resume.dict(),
        "analysis": analysis.dict(),
        "skill_gaps": [g.dict() for g in gaps],
        "career_paths": [p.dict() for p in paths],
        "learning_roadmap": roadmap.dict()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
