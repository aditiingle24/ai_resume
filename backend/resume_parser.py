"""
Resume Parser - Extracts structured data from uploaded resume files
"""
import re
from typing import Optional
from models import ResumeData, Skill, Experience, Education, SkillLevel


# Common tech skills database for recognition
SKILL_DATABASE = {
    "programming": ["python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "sql", "html", "css", "bash", "powershell"],
    "frameworks": ["react", "angular", "vue", "next.js", "django", "flask", "fastapi", "spring", "express", "node.js", "rails", ".net", "laravel", "svelte", "nuxt", "gatsby", "electron", "react native", "flutter"],
    "data_science": ["tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "keras", "opencv", "nltk", "spacy", "huggingface", "langchain", "machine learning", "deep learning", "nlp", "computer vision", "data analysis", "statistics", "data visualization"],
    "cloud": ["aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "devops", "microservices", "serverless", "lambda", "ec2", "s3"],
    "databases": ["mysql", "postgresql", "mongodb", "redis", "elasticsearch", "dynamodb", "cassandra", "firebase", "sqlite", "oracle", "neo4j", "graphql"],
    "tools": ["git", "github", "gitlab", "jira", "confluence", "figma", "postman", "vs code", "linux", "agile", "scrum", "rest api", "api design"],
    "soft_skills": ["leadership", "communication", "teamwork", "problem solving", "project management", "mentoring", "presentation", "analytical", "critical thinking", "time management"]
}


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file bytes"""
    try:
        from PyPDF2 import PdfReader
        import io
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX file bytes"""
    try:
        from docx import Document
        import io
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return ""


def extract_email(text: str) -> str:
    """Extract email from text"""
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(pattern, text)
    return match.group(0) if match else ""


def extract_phone(text: str) -> str:
    """Extract phone number from text"""
    pattern = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,15}'
    match = re.search(pattern, text)
    return match.group(0).strip() if match else ""


def extract_name(text: str) -> str:
    """Extract name (usually first line of resume)"""
    lines = text.strip().split('\n')
    for line in lines[:5]:
        line = line.strip()
        if line and not re.search(r'@|http|www|phone|email|address|resume|cv|curriculum', line.lower()):
            if len(line.split()) <= 5 and len(line) < 50:
                return line
    return ""


def extract_skills(text: str) -> list:
    """Extract skills from resume text"""
    found_skills = []
    text_lower = text.lower()

    for category, skills in SKILL_DATABASE.items():
        for skill in skills:
            if skill.lower() in text_lower:
                # Determine level based on context
                level = SkillLevel.INTERMEDIATE
                skill_context = text_lower[max(0, text_lower.find(skill.lower()) - 100):text_lower.find(skill.lower()) + 100]

                if any(word in skill_context for word in ["expert", "advanced", "extensive", "deep", "senior", "lead"]):
                    level = SkillLevel.ADVANCED
                elif any(word in skill_context for word in ["proficient", "strong", "experienced"]):
                    level = SkillLevel.ADVANCED
                elif any(word in skill_context for word in ["basic", "fundamental", "beginner", "learning", "familiar"]):
                    level = SkillLevel.BEGINNER

                found_skills.append(Skill(
                    name=skill.title(),
                    level=level,
                    category=category,
                    relevance_score=round(0.5 + (0.5 if level in [SkillLevel.ADVANCED, SkillLevel.EXPERT] else 0.2), 2)
                ))

    return found_skills


def extract_experience(text: str) -> list:
    """Extract work experience sections"""
    experiences = []
    # Look for experience section
    exp_pattern = r'(?:experience|work history|employment|professional background)(.*?)(?:education|skills|projects|certifications|$)'
    exp_match = re.search(exp_pattern, text, re.IGNORECASE | re.DOTALL)

    if exp_match:
        exp_text = exp_match.group(1)
        # Try to find individual roles
        role_patterns = re.findall(
            r'([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Lead|Director|Architect|Consultant|Specialist|Intern|Associate))\s*(?:at|@|-|–|,|\|)?\s*([A-Za-z\s&.]+?)(?:\d{4}|\n)',
            exp_text
        )
        for title, company in role_patterns[:5]:
            experiences.append(Experience(
                title=title.strip(),
                company=company.strip(),
                duration="",
                description=""
            ))

    if not experiences:
        experiences.append(Experience(
            title="Professional Experience Detected",
            company="See Resume",
            duration="",
            description="Experience details extracted from resume"
        ))

    return experiences


def extract_education(text: str) -> list:
    """Extract education information"""
    educations = []
    edu_pattern = r'(?:education|academic|qualification)(.*?)(?:experience|skills|projects|$)'
    edu_match = re.search(edu_pattern, text, re.IGNORECASE | re.DOTALL)

    if edu_match:
        edu_text = edu_match.group(1)
        degree_patterns = [
            r"((?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|MBA|B\.?A\.?|M\.?A\.?|Associate|Diploma)[^,\n]*)",
        ]
        for pattern in degree_patterns:
            matches = re.findall(pattern, edu_text, re.IGNORECASE)
            for match in matches[:3]:
                educations.append(Education(
                    degree=match.strip(),
                    institution="",
                    year="",
                    field=""
                ))

    return educations


def parse_resume(file_bytes: bytes, filename: str) -> ResumeData:
    """Main resume parsing function"""
    # Extract text based on file type
    if filename.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith(('.docx', '.doc')):
        text = extract_text_from_docx(file_bytes)
    elif filename.lower().endswith('.txt'):
        text = file_bytes.decode('utf-8', errors='ignore')
    else:
        text = file_bytes.decode('utf-8', errors='ignore')

    if not text:
        text = file_bytes.decode('utf-8', errors='ignore')

    # Extract components
    resume = ResumeData(
        name=extract_name(text),
        email=extract_email(text),
        phone=extract_phone(text),
        skills=extract_skills(text),
        experience=extract_experience(text),
        education=extract_education(text),
        raw_text=text[:5000],
        summary=text[:500] if text else ""
    )

    return resume
