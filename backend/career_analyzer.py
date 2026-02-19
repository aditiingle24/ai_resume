"""
Career Analyzer - AI-powered career analytics engine
Provides resume analysis, skill gap detection, career matching, and learning roadmaps
"""
import random
from typing import List, Dict, Optional
from models import (
    ResumeData, ResumeAnalysis, SkillGap, CareerPath,
    LearningRoadmap, LearningResource, Skill, SkillLevel
)


# Career paths database
CAREER_PATHS_DB = {
    "Full Stack Developer": {
        "description": "Build end-to-end web applications handling both frontend interfaces and backend systems. Lead architecture decisions and deliver scalable solutions.",
        "salary_range": "$85,000 - $160,000",
        "growth_outlook": "22% growth expected (Much faster than average)",
        "required_skills": ["javascript", "react", "node.js", "python", "sql", "git", "rest api", "docker", "html", "css", "typescript"],
        "keywords": ["web", "frontend", "backend", "full stack", "fullstack", "javascript", "react", "node"]
    },
    "Data Scientist": {
        "description": "Extract insights from complex datasets using statistical analysis, machine learning, and AI techniques to drive business decisions.",
        "salary_range": "$95,000 - $175,000",
        "growth_outlook": "35% growth expected (Much faster than average)",
        "required_skills": ["python", "machine learning", "statistics", "sql", "tensorflow", "pandas", "numpy", "data visualization", "r", "deep learning"],
        "keywords": ["data", "machine learning", "ml", "ai", "analytics", "statistics", "tensorflow", "pytorch"]
    },
    "ML Engineer": {
        "description": "Design, build, and deploy machine learning models at scale. Bridge the gap between data science research and production systems.",
        "salary_range": "$110,000 - $200,000",
        "growth_outlook": "40% growth expected (Explosive demand)",
        "required_skills": ["python", "tensorflow", "pytorch", "docker", "kubernetes", "machine learning", "deep learning", "aws", "mlops", "sql"],
        "keywords": ["machine learning", "ml", "deep learning", "ai", "model", "training", "tensorflow", "pytorch"]
    },
    "DevOps Engineer": {
        "description": "Automate and streamline development operations, manage CI/CD pipelines, and ensure reliable infrastructure at scale.",
        "salary_range": "$90,000 - $165,000",
        "growth_outlook": "25% growth expected (Faster than average)",
        "required_skills": ["docker", "kubernetes", "aws", "terraform", "jenkins", "ci/cd", "linux", "python", "bash", "git"],
        "keywords": ["devops", "cloud", "infrastructure", "docker", "kubernetes", "aws", "ci/cd", "deployment"]
    },
    "Cloud Architect": {
        "description": "Design and oversee cloud computing strategies, including cloud adoption plans, cloud application design, and cloud management.",
        "salary_range": "$130,000 - $220,000",
        "growth_outlook": "28% growth expected (Faster than average)",
        "required_skills": ["aws", "azure", "gcp", "terraform", "kubernetes", "microservices", "serverless", "docker", "python", "networking"],
        "keywords": ["cloud", "aws", "azure", "gcp", "architect", "infrastructure", "serverless"]
    },
    "Frontend Developer": {
        "description": "Create responsive, accessible, and performant user interfaces. Master modern JavaScript frameworks and design principles.",
        "salary_range": "$75,000 - $145,000",
        "growth_outlook": "20% growth expected (Faster than average)",
        "required_skills": ["javascript", "react", "typescript", "css", "html", "vue", "angular", "figma", "git", "rest api"],
        "keywords": ["frontend", "react", "angular", "vue", "ui", "ux", "javascript", "css", "html"]
    },
    "Backend Developer": {
        "description": "Build server-side logic, APIs, and database architectures that power applications and handle business logic at scale.",
        "salary_range": "$85,000 - $155,000",
        "growth_outlook": "21% growth expected (Faster than average)",
        "required_skills": ["python", "java", "sql", "postgresql", "rest api", "docker", "redis", "mongodb", "git", "microservices"],
        "keywords": ["backend", "api", "server", "database", "python", "java", "node.js", "sql"]
    },
    "Cybersecurity Analyst": {
        "description": "Protect organizations from cyber threats by monitoring, analyzing, and responding to security incidents and vulnerabilities.",
        "salary_range": "$80,000 - $150,000",
        "growth_outlook": "32% growth expected (Much faster than average)",
        "required_skills": ["networking", "linux", "python", "security tools", "incident response", "vulnerability assessment", "firewalls", "encryption"],
        "keywords": ["security", "cyber", "penetration", "vulnerability", "firewall", "encryption", "incident"]
    },
    "Product Manager": {
        "description": "Define product vision, strategy, and roadmap. Work cross-functionally to deliver products that solve customer problems.",
        "salary_range": "$100,000 - $180,000",
        "growth_outlook": "18% growth expected (Faster than average)",
        "required_skills": ["project management", "agile", "communication", "leadership", "data analysis", "jira", "scrum", "presentation", "problem solving"],
        "keywords": ["product", "management", "agile", "scrum", "stakeholder", "roadmap", "strategy"]
    },
    "AI/LLM Engineer": {
        "description": "Build applications powered by large language models and generative AI. Design prompt engineering systems and AI agents.",
        "salary_range": "$130,000 - $250,000",
        "growth_outlook": "50%+ growth expected (Explosive demand)",
        "required_skills": ["python", "langchain", "huggingface", "nlp", "deep learning", "machine learning", "rest api", "docker", "pytorch", "tensorflow"],
        "keywords": ["llm", "gpt", "ai", "generative", "langchain", "nlp", "transformer", "prompt engineering"]
    }
}


LEARNING_RESOURCES_DB = {
    "python": [
        LearningResource(title="Python for Everybody Specialization", provider="Coursera", url="https://coursera.org/python", duration="8 months", skill_target="Python", priority="high", resource_type="course"),
        LearningResource(title="Automate the Boring Stuff with Python", provider="Udemy", url="https://udemy.com/automate-python", duration="10 hours", skill_target="Python", priority="medium", resource_type="course"),
    ],
    "javascript": [
        LearningResource(title="The Complete JavaScript Course", provider="Udemy", url="https://udemy.com/javascript", duration="69 hours", skill_target="JavaScript", priority="high", resource_type="course"),
        LearningResource(title="JavaScript.info", provider="Free", url="https://javascript.info", duration="Self-paced", skill_target="JavaScript", priority="medium", resource_type="tutorial"),
    ],
    "react": [
        LearningResource(title="React - The Complete Guide", provider="Udemy", url="https://udemy.com/react-complete", duration="48 hours", skill_target="React", priority="high", resource_type="course"),
        LearningResource(title="Official React Documentation", provider="Meta", url="https://react.dev", duration="Self-paced", skill_target="React", priority="high", resource_type="documentation"),
    ],
    "machine learning": [
        LearningResource(title="Machine Learning Specialization", provider="Coursera (Stanford)", url="https://coursera.org/ml", duration="3 months", skill_target="Machine Learning", priority="high", resource_type="course"),
        LearningResource(title="Hands-On ML with Scikit-Learn", provider="O'Reilly", url="https://oreilly.com/ml-book", duration="Self-paced", skill_target="Machine Learning", priority="medium", resource_type="book"),
    ],
    "docker": [
        LearningResource(title="Docker Mastery", provider="Udemy", url="https://udemy.com/docker-mastery", duration="20 hours", skill_target="Docker", priority="high", resource_type="course"),
    ],
    "aws": [
        LearningResource(title="AWS Certified Solutions Architect", provider="A Cloud Guru", url="https://acloudguru.com/aws", duration="40 hours", skill_target="AWS", priority="high", resource_type="certification"),
    ],
    "sql": [
        LearningResource(title="The Complete SQL Bootcamp", provider="Udemy", url="https://udemy.com/sql-bootcamp", duration="9 hours", skill_target="SQL", priority="high", resource_type="course"),
    ],
    "tensorflow": [
        LearningResource(title="TensorFlow Developer Certificate", provider="Coursera", url="https://coursera.org/tensorflow", duration="4 months", skill_target="TensorFlow", priority="high", resource_type="certification"),
    ],
    "kubernetes": [
        LearningResource(title="Kubernetes for Developers", provider="Linux Foundation", url="https://linuxfoundation.org/k8s", duration="30 hours", skill_target="Kubernetes", priority="high", resource_type="certification"),
    ],
    "typescript": [
        LearningResource(title="Understanding TypeScript", provider="Udemy", url="https://udemy.com/typescript", duration="15 hours", skill_target="TypeScript", priority="medium", resource_type="course"),
    ],
    "deep learning": [
        LearningResource(title="Deep Learning Specialization", provider="Coursera (DeepLearning.AI)", url="https://coursera.org/deep-learning", duration="5 months", skill_target="Deep Learning", priority="high", resource_type="course"),
    ],
}


def analyze_resume(resume: ResumeData) -> ResumeAnalysis:
    """Analyze resume quality and structure"""
    text = resume.raw_text.lower()
    skills = resume.skills
    experience = resume.experience
    education = resume.education

    # Structure score
    has_sections = 0
    sections = ["experience", "education", "skills", "summary", "projects", "certifications"]
    missing = []
    for section in sections:
        if section in text:
            has_sections += 1
        else:
            missing.append(section.title())
    structure_score = min(round((has_sections / len(sections)) * 100, 1), 100)

    # Content score
    content_factors = []
    if len(skills) >= 5:
        content_factors.append(30)
    elif len(skills) >= 3:
        content_factors.append(20)
    else:
        content_factors.append(10)

    if len(experience) >= 2:
        content_factors.append(30)
    elif len(experience) >= 1:
        content_factors.append(20)
    else:
        content_factors.append(5)

    if len(text) > 500:
        content_factors.append(20)
    elif len(text) > 200:
        content_factors.append(15)
    else:
        content_factors.append(5)

    if education:
        content_factors.append(20)
    else:
        content_factors.append(5)

    content_score = min(sum(content_factors), 100)

    # Keyword/ATS score
    action_verbs = ["developed", "managed", "implemented", "designed", "led", "created", "built", "optimized", "improved", "delivered", "architected", "launched"]
    verb_count = sum(1 for verb in action_verbs if verb in text)
    keyword_score = min(round((verb_count / len(action_verbs)) * 100, 1), 100)

    # ATS compatibility
    ats_score = round((structure_score * 0.4 + keyword_score * 0.3 + content_score * 0.3), 1)

    overall = round((structure_score + content_score + keyword_score + ats_score) / 4, 1)

    # Generate strengths
    strengths = []
    if len(skills) >= 5:
        strengths.append(f"Strong skill profile with {len(skills)} identified technical competencies")
    if verb_count >= 4:
        strengths.append("Effective use of action verbs that demonstrate impact")
    if len(experience) >= 2:
        strengths.append("Solid work experience section with multiple roles")
    if education:
        strengths.append("Education section well documented")
    if structure_score > 60:
        strengths.append("Good resume structure with clear sections")
    if not strengths:
        strengths.append("Resume uploaded successfully for analysis")

    # Generate improvements
    improvements = []
    if len(skills) < 5:
        improvements.append("Add more technical skills with proficiency levels")
    if verb_count < 4:
        improvements.append("Use more action verbs (developed, implemented, optimized) to describe achievements")
    if "projects" not in text:
        improvements.append("Add a Projects section to showcase hands-on work")
    if "certification" not in text:
        improvements.append("Consider adding relevant certifications")
    if len(text) < 500:
        improvements.append("Expand resume content with more details about responsibilities and achievements")
    improvements.append("Quantify achievements with metrics (e.g., 'increased efficiency by 30%')")

    return ResumeAnalysis(
        overall_score=overall,
        structure_score=structure_score,
        content_score=content_score,
        keyword_score=keyword_score,
        ats_compatibility=ats_score,
        strengths=strengths,
        improvements=improvements,
        missing_sections=missing
    )


def detect_skill_gaps(resume: ResumeData, target_role: str = "") -> List[SkillGap]:
    """Detect skill gaps based on resume and target role"""
    current_skills = {s.name.lower(): s for s in resume.skills}
    gaps = []

    # Find best matching career path
    target_path = None
    if target_role:
        for path_name, path_data in CAREER_PATHS_DB.items():
            if target_role.lower() in path_name.lower() or any(kw in target_role.lower() for kw in path_data["keywords"]):
                target_path = (path_name, path_data)
                break

    if not target_path:
        # Auto-detect best matching path
        best_score = 0
        for path_name, path_data in CAREER_PATHS_DB.items():
            score = sum(1 for skill in path_data["required_skills"] if skill in current_skills)
            keyword_score = sum(1 for kw in path_data["keywords"] if kw in resume.raw_text.lower())
            total = score + keyword_score
            if total > best_score:
                best_score = total
                target_path = (path_name, path_data)

    if not target_path:
        target_path = ("Full Stack Developer", CAREER_PATHS_DB["Full Stack Developer"])

    for req_skill in target_path[1]["required_skills"]:
        if req_skill not in current_skills:
            priority = "high" if req_skill in target_path[1]["required_skills"][:5] else "medium"
            gaps.append(SkillGap(
                skill=req_skill.title(),
                current_level="Not Found",
                required_level="Intermediate",
                priority=priority,
                category="technical"
            ))
        else:
            skill = current_skills[req_skill]
            if skill.level == SkillLevel.BEGINNER:
                gaps.append(SkillGap(
                    skill=req_skill.title(),
                    current_level="Beginner",
                    required_level="Advanced",
                    priority="medium",
                    category="technical"
                ))

    return gaps


def match_career_paths(resume: ResumeData) -> List[CareerPath]:
    """Match user with suitable career paths"""
    current_skills = {s.name.lower() for s in resume.skills}
    text_lower = resume.raw_text.lower()
    matches = []

    for path_name, path_data in CAREER_PATHS_DB.items():
        # Skills match
        matching_skills = [s for s in path_data["required_skills"] if s in current_skills]
        # Keyword match
        keyword_matches = sum(1 for kw in path_data["keywords"] if kw in text_lower)

        skill_score = (len(matching_skills) / max(len(path_data["required_skills"]), 1)) * 70
        keyword_score = min(keyword_matches * 5, 30)
        total_score = round(min(skill_score + keyword_score, 98), 1)

        if total_score > 15:
            gap_skills = [s.title() for s in path_data["required_skills"] if s not in current_skills]
            matches.append(CareerPath(
                title=path_name,
                match_score=total_score,
                description=path_data["description"],
                salary_range=path_data["salary_range"],
                growth_outlook=path_data["growth_outlook"],
                required_skills=[s.title() for s in path_data["required_skills"]],
                current_match_skills=[s.title() for s in matching_skills],
                gap_skills=gap_skills[:5]
            ))

    matches.sort(key=lambda x: x.match_score, reverse=True)
    return matches[:6]


def generate_learning_roadmap(resume: ResumeData, target_career: str = "") -> LearningRoadmap:
    """Generate personalized learning roadmap"""
    gaps = detect_skill_gaps(resume, target_career)
    current_skills = {s.name.lower() for s in resume.skills}

    # Determine target
    if not target_career:
        paths = match_career_paths(resume)
        target_career = paths[0].title if paths else "Full Stack Developer"

    # Build phases
    phases = []
    resources = []

    # Phase 1: Foundation (Month 1-2)
    phase1_skills = [g for g in gaps if g.priority == "high"][:3]
    phase1 = {
        "phase": 1,
        "title": "Foundation Building",
        "duration": "Month 1-2",
        "description": "Master the fundamental skills required for your target role",
        "skills": [g.skill for g in phase1_skills],
        "milestones": [
            f"Complete foundational course in {phase1_skills[0].skill}" if phase1_skills else "Identify core skills",
            "Build a portfolio project demonstrating new skills",
            "Join relevant professional communities"
        ]
    }
    phases.append(phase1)

    # Phase 2: Intermediate (Month 3-4)
    phase2_skills = [g for g in gaps if g.priority == "medium"][:3]
    phase2 = {
        "phase": 2,
        "title": "Skill Deepening",
        "duration": "Month 3-4",
        "description": "Deepen expertise and build intermediate-level proficiency",
        "skills": [g.skill for g in phase2_skills],
        "milestones": [
            "Complete intermediate projects",
            "Contribute to open-source projects",
            "Start building a professional portfolio"
        ]
    }
    phases.append(phase2)

    # Phase 3: Advanced (Month 5-6)
    phase3 = {
        "phase": 3,
        "title": "Advanced Practice & Portfolio",
        "duration": "Month 5-6",
        "description": "Build advanced projects and prepare for your career transition",
        "skills": [g.skill for g in gaps[:4]],
        "milestones": [
            "Complete a capstone project",
            "Earn a relevant certification",
            "Update resume and LinkedIn profile",
            "Begin targeted job applications"
        ]
    }
    phases.append(phase3)

    # Gather learning resources
    for gap in gaps:
        skill_key = gap.skill.lower()
        if skill_key in LEARNING_RESOURCES_DB:
            resources.extend(LEARNING_RESOURCES_DB[skill_key])
        else:
            resources.append(LearningResource(
                title=f"Learn {gap.skill} - Comprehensive Guide",
                provider="Multiple Platforms",
                url=f"https://www.google.com/search?q=learn+{gap.skill.replace(' ', '+')}",
                duration="Self-paced",
                skill_target=gap.skill,
                priority=gap.priority,
                resource_type="search"
            ))

    return LearningRoadmap(
        career_target=target_career,
        timeline="6 months",
        phases=phases,
        resources=resources[:12]
    )
