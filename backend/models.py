"""
Data models for the AI Career Mentor Platform
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime
import uuid


class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Skill(BaseModel):
    name: str
    level: SkillLevel = SkillLevel.INTERMEDIATE
    category: str = "general"
    relevance_score: float = 0.0


class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: str = ""


class Education(BaseModel):
    degree: str
    institution: str
    year: str = ""
    field: str = ""


class ResumeData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    email: str = ""
    phone: str = ""
    summary: str = ""
    skills: List[Skill] = []
    experience: List[Experience] = []
    education: List[Education] = []
    raw_text: str = ""
    uploaded_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class ResumeAnalysis(BaseModel):
    overall_score: float = 0.0
    structure_score: float = 0.0
    content_score: float = 0.0
    keyword_score: float = 0.0
    ats_compatibility: float = 0.0
    strengths: List[str] = []
    improvements: List[str] = []
    missing_sections: List[str] = []


class SkillGap(BaseModel):
    skill: str
    current_level: str
    required_level: str
    priority: str = "medium"
    category: str = "technical"


class CareerPath(BaseModel):
    title: str
    match_score: float
    description: str
    salary_range: str
    growth_outlook: str
    required_skills: List[str] = []
    current_match_skills: List[str] = []
    gap_skills: List[str] = []


class LearningResource(BaseModel):
    title: str
    provider: str
    url: str
    duration: str
    skill_target: str
    priority: str = "medium"
    resource_type: str = "course"


class LearningRoadmap(BaseModel):
    career_target: str
    timeline: str
    phases: List[Dict] = []
    resources: List[LearningResource] = []


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class ChatRequest(BaseModel):
    message: str
    resume_id: Optional[str] = None
    context: Optional[str] = None


class ProfileInput(BaseModel):
    name: str = ""
    email: str = ""
    target_role: str = ""
    experience_years: int = 0
    current_role: str = ""
    interests: List[str] = []
    preferred_industry: str = ""
