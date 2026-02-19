"""
AI Orchestration Layer - Provides intelligent AI mentorship responses
"""
from typing import List, Dict, Optional
from models import ResumeData, ChatMessage


class AIMentor:
    """AI Mentor that provides career guidance based on resume data and conversation context"""

    def __init__(self):
        self.conversation_history: List[ChatMessage] = []
        self.system_prompt = """You are CareerMentor AI, an expert career advisor with deep knowledge in:
        - Resume optimization and ATS compatibility
        - Career path planning and transitions
        - Technical skill development strategies
        - Interview preparation and salary negotiation
        - Industry trends and market analysis
        
        Provide actionable, personalized advice based on the user's resume and career goals."""

    def generate_response(self, user_message: str, resume_data: Optional[ResumeData] = None, context: str = "") -> str:
        """Generate an AI mentor response based on user message and context"""
        msg_lower = user_message.lower()

        # Build context-aware response
        if resume_data:
            skills_list = [s.name for s in resume_data.skills]
            exp_list = [e.title for e in resume_data.experience]

        # Route to appropriate response generator
        if any(word in msg_lower for word in ["resume", "cv", "improve", "review", "feedback"]):
            return self._resume_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["interview", "prepare", "question"]):
            return self._interview_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["salary", "negotiate", "compensation", "pay"]):
            return self._salary_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["skill", "learn", "course", "certification", "study"]):
            return self._learning_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["career", "path", "transition", "switch", "change"]):
            return self._career_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["project", "portfolio", "github", "build"]):
            return self._project_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["job", "apply", "application", "search", "hunt"]):
            return self._job_search_advice(user_message, resume_data)
        elif any(word in msg_lower for word in ["hello", "hi", "hey", "start", "help"]):
            return self._greeting(resume_data)
        else:
            return self._general_advice(user_message, resume_data)

    def _greeting(self, resume_data: Optional[ResumeData]) -> str:
        name = resume_data.name if resume_data and resume_data.name else "there"
        skills_text = ""
        if resume_data and resume_data.skills:
            top_skills = [s.name for s in resume_data.skills[:5]]
            skills_text = f"\n\nI can see from your profile that you have experience with **{', '.join(top_skills)}**. That's a great foundation!"

        return f"""👋 **Hello {name}! Welcome to CareerMentor AI!**

I'm your personal AI career advisor, here to help you navigate your professional journey. {skills_text}

Here's what I can help you with:

🎯 **Career Strategy** — Explore career paths, plan transitions, and set goals
📄 **Resume Optimization** — Get actionable feedback to improve your resume
🎓 **Skill Development** — Personalized learning recommendations
💼 **Interview Prep** — Practice questions and strategies for your target roles
💰 **Salary Insights** — Compensation benchmarks and negotiation tips
🚀 **Project Ideas** — Portfolio projects to showcase your abilities

**What would you like to focus on today?** Just ask me anything about your career!"""

    def _resume_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        if not resume_data:
            return """📄 **Resume Improvement Tips**

I'd love to help you optimize your resume! Here are some universal best practices:

1. **Use a clean, ATS-friendly format** — Simple layouts with standard headings
2. **Lead with action verbs** — "Developed", "Architected", "Optimized", "Led"
3. **Quantify achievements** — "Increased performance by 40%" beats "Improved performance"
4. **Tailor for each role** — Match keywords from the job description
5. **Keep it concise** — 1-2 pages max, prioritize recent experience

💡 **Upload your resume** for a personalized analysis with specific recommendations!"""

        skills = [s.name for s in resume_data.skills[:8]]
        return f"""📄 **Personalized Resume Analysis for {resume_data.name or 'You'}**

Based on my review of your resume, here are my recommendations:

**✅ What's Working:**
- You have **{len(resume_data.skills)} technical skills** identified, including: {', '.join(skills)}
- Your experience section covers {len(resume_data.experience)} role(s)

**🔧 Key Improvements:**

1. **Strengthen Your Summary** — Write a compelling 2-3 line professional summary that highlights your unique value proposition and target role
   
2. **Quantify Your Impact** — Transform descriptions like "worked on projects" to "Led a team of 4 to deliver a microservices platform serving 10K+ users"

3. **Optimize for ATS** — Ensure your skills section includes exact keywords from target job descriptions

4. **Add Projects Section** — Include 2-3 standout projects with:
   - Problem you solved
   - Technologies used
   - Measurable outcomes

5. **Professional Formatting** — Use consistent formatting, clear section headers, and bullet points

Would you like me to help you craft a better summary, or dive deeper into any of these areas?"""

    def _interview_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        skills_context = ""
        if resume_data and resume_data.skills:
            top_skills = [s.name for s in resume_data.skills[:5]]
            skills_context = f"""
**🎯 Based on your skills ({', '.join(top_skills)}), prepare for:**

- **Technical Deep Dives:** Be ready to explain your experience with each technology in detail
- **System Design:** Practice designing systems using your tech stack
- **Coding Challenges:** Focus on data structures, algorithms, and {top_skills[0] if top_skills else 'your primary language'}"""

        return f"""🎤 **Interview Preparation Guide**

Here's a comprehensive prep strategy:

**📋 Common Behavioral Questions (STAR Method):**
- "Tell me about a challenging project you led"
- "Describe a time you had to learn a new technology quickly"  
- "How do you handle disagreements with team members?"
- "What's your biggest professional achievement?"
{skills_context}

**💡 Preparation Checklist:**
1. ✅ Research the company's tech stack, culture, and recent news
2. ✅ Prepare 5-7 STAR-format stories from your experience
3. ✅ Practice with mock interviews (use platforms like Pramp or interviewing.io)
4. ✅ Prepare thoughtful questions to ask the interviewer
5. ✅ Review your resume and be ready to discuss every point

**🏆 Pro Tips:**
- Start answers with the impact/result, then explain how
- Show enthusiasm for the role and company
- Ask about team culture, growth opportunities, and expectations

What specific type of interview would you like to prepare for?"""

    def _salary_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        return """💰 **Salary & Compensation Guide**

**📊 Negotiation Framework:**

1. **Research Phase:**
   - Use Levels.fyi, Glassdoor, and Blind for comp data
   - Filter by role, experience level, location, and company size
   - Understand total compensation (base + bonus + equity)

2. **Preparation:**
   - Know your minimum acceptable number
   - Prepare your value proposition with quantified achievements
   - Research the company's compensation philosophy

3. **Negotiation Tactics:**
   - Never give the first number if possible
   - Use competing offers as leverage (professionally)
   - Negotiate the entire package (PTO, remote work, signing bonus, equity)
   - Always get offers in writing

**💡 Key Phrases to Use:**
- "Based on my research and experience, I'm targeting a range of..."
- "I'm excited about this opportunity. Can we discuss the total compensation package?"
- "I have other offers I'm considering, and I want to make sure we're aligned"

**⚠️ Common Mistakes:**
- Accepting the first offer without negotiating
- Focusing only on base salary
- Not considering cost of living differences
- Being confrontational instead of collaborative

Would you like role-specific salary benchmarks based on your profile?"""

    def _learning_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        recommendations = ""
        if resume_data and resume_data.skills:
            current = [s.name for s in resume_data.skills]
            recommendations = f"""
**📊 Based on your current skills ({', '.join(current[:5])}):**

**Priority Learning Areas:**
1. 🔴 **High Priority:** Advanced topics in your strongest skills + in-demand complementary technologies
2. 🟡 **Medium Priority:** Industry certifications (AWS, Google Cloud, etc.)
3. 🟢 **Growth Areas:** System design, architecture patterns, and soft skills"""

        return f"""🎓 **Personalized Learning Strategy**
{recommendations}

**🏗️ Recommended Learning Path:**

**Month 1-2: Foundation**
- Solidify fundamentals in your primary tech stack
- Complete one certification course
- Build one project demonstrating new skills

**Month 3-4: Expansion**
- Learn complementary technologies
- Contribute to open-source projects
- Start a technical blog or YouTube channel

**Month 5-6: Mastery**
- Build a capstone project
- Get certified
- Network at virtual/in-person meetups

**📚 Top Learning Platforms:**
- **Coursera/edX** — University-level courses with certificates
- **Udemy** — Practical, project-based learning
- **freeCodeCamp** — Free, comprehensive web development
- **LeetCode/HackerRank** — Algorithm and coding practice
- **YouTube** — Free tutorials from industry experts

What specific skill would you like a detailed learning plan for?"""

    def _career_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        context = ""
        if resume_data and resume_data.skills:
            context = f"\n\nBased on your profile with skills in **{', '.join([s.name for s in resume_data.skills[:5]])}**, "
            context += "you have several exciting career paths available!"

        return f"""🎯 **Career Path Strategy**{context}

**🗺️ Career Planning Framework:**

1. **Self-Assessment:**
   - What problems do you love solving?
   - Do you prefer depth (specialist) or breadth (generalist)?
   - What's your ideal work environment?
   - What are your non-negotiables? (remote, salary, culture)

2. **Market Research:**
   - Identify roles that align with your skills and interests
   - Research growth trends and demand
   - Connect with people in target roles (LinkedIn, meetups)

3. **Gap Analysis:**
   - Compare your current skills with target role requirements
   - Identify 3-5 key skills to develop
   - Create a 6-month learning plan

4. **Strategic Positioning:**
   - Build projects that demonstrate target role skills
   - Create content (blogs, talks) in your target domain
   - Optimize LinkedIn and resume for target roles

**🔥 High-Growth Career Paths in 2025-2026:**
- AI/ML Engineering (50%+ growth)
- Cloud Architecture (28% growth)
- Cybersecurity (32% growth)
- Data Engineering (30% growth)
- Full Stack Development (22% growth)

Would you like me to do a detailed analysis of a specific career path for you?"""

    def _project_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        skills_context = ""
        if resume_data and resume_data.skills:
            top_skills = [s.name for s in resume_data.skills[:5]]
            skills_context = f" using your skills in {', '.join(top_skills)}"

        return f"""🚀 **Portfolio Project Ideas{' (' + resume_data.name + ')' if resume_data and resume_data.name else ''}**

Here are impactful projects you can build{skills_context}:

**🏆 Standout Portfolio Projects:**

1. **AI-Powered Application** 
   - Build a chatbot, recommendation system, or content generator
   - Shows: AI/ML skills, API integration, full-stack ability

2. **Real-Time Dashboard**
   - Create a live data visualization platform
   - Shows: Frontend skills, data processing, WebSockets

3. **Microservices Platform**
   - Build a scalable e-commerce or social platform
   - Shows: System design, DevOps, backend architecture

4. **Developer Tool/CLI**
   - Build a tool that solves a real developer pain point
   - Shows: Problem-solving, open-source contribution

5. **Mobile/Cross-Platform App**
   - Build a productivity or fitness tracking app
   - Shows: Mobile development, UX design

**💡 Project Best Practices:**
- Write clean, well-documented code with README
- Deploy to production (Vercel, AWS, Railway)
- Include tests and CI/CD pipeline
- Add a demo video or live preview

Which project type interests you most? I can help you plan it!"""

    def _job_search_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        return """🔍 **Job Search Strategy**

**📋 Optimized Job Search Process:**

1. **Preparation Phase (Week 1-2):**
   - Polish resume and LinkedIn profile
   - Prepare your portfolio/GitHub
   - Set up job alerts on key platforms
   - Research target companies

2. **Active Search (Ongoing):**
   - Apply to 5-10 targeted positions per week
   - Customize resume for each application
   - Write tailored cover letters for top choices
   - Track all applications in a spreadsheet

3. **Networking (Continuous):**
   - Connect with recruiters in your target industry
   - Attend virtual meetups and conferences
   - Engage on Twitter/X and LinkedIn
   - Ask for referrals from connections

**🎯 Top Job Platforms:**
- **LinkedIn** — Best for networking + job search
- **Indeed** — Largest job board
- **Wellfound** — Startup-focused
- **Dice** — Tech-specific
- **Company Websites** — Direct applications often prioritized

**⚡ Pro Tips:**
- Apply within the first 48 hours of a posting
- Follow up after 1 week if no response
- Keep a consistent daily job search routine
- Don't neglect the "hidden job market" (networking referrals)

Want me to help you create a targeted search strategy for a specific role?"""

    def _general_advice(self, message: str, resume_data: Optional[ResumeData]) -> str:
        return f"""🤖 **Great question!**

I'd be happy to help with that. Here's my perspective:

Based on current industry trends and best practices, here are some thoughts:

**Key Considerations:**
1. **Stay Current** — The tech industry evolves rapidly. Continuous learning is essential.
2. **Build in Public** — Share your journey through blogs, social media, or open-source contributions.
3. **Network Strategically** — Quality connections matter more than quantity.
4. **Focus on Impact** — Employers value results over credentials.

**I'm most helpful when you ask me about:**
- 📄 Resume reviews and optimization
- 🎯 Career path exploration
- 🎓 Skill development strategies
- 🎤 Interview preparation
- 💰 Salary negotiation
- 🚀 Project recommendations
- 🔍 Job search strategies

Feel free to ask me anything specific about your career goals! The more context you provide, the better advice I can give."""


# Singleton instance
ai_mentor = AIMentor()
