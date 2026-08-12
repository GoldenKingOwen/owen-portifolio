// ─────────────────────────────────────────────────────────────
// Site configuration
// ─────────────────────────────────────────────────────────────

export interface SocialLink {
    label: string;
    href: string;
    icon: "github" | "email" | "whatsapp" | "linkedin";
  }
  
  export interface SiteConfig {
    name: string;
    title: string;
    /** Roles cycled one-at-a-time in the hero (e.g. "Web Developer") */
    roles: string[];
    shortBio: string;
    location: string;
    email: string;
    whatsapp: string; // raw number used to build a wa.me link
    githubUsername: string;
    githubUrl: string;
    socials: SocialLink[];
    availableForOpportunities: boolean;
  }
  
  // ─────────────────────────────────────────────────────────────
  // Skills
  // ─────────────────────────────────────────────────────────────
  
  export type SkillLevel = "Comfortable" | "Intermediate" | "Familiar" | "Learning";
  
  export type SkillCategoryName =
    | "Programming Languages"
    | "Frontend"
    | "Backend"
    | "Mobile Development"
    | "Database"
    | "Tools & Technologies";
  
  export interface Skill {
    name: string;
    level: SkillLevel;
  }
  
  export interface SkillCategory {
    category: SkillCategoryName;
    skills: Skill[];
  }
  
  // ─────────────────────────────────────────────────────────────
  // Projects
  // ─────────────────────────────────────────────────────────────
  
  export type ProjectStatus = "Live" | "In Development" | "Completed" | "Academic";
  
  export interface ProjectLinks {
    github?: string;
    live?: string;
  }
  
  export interface ProjectDetail {
    overview: string;
    problemStatement: string;
    objectives: string[];
    features: string[];
    architecture: string;
    challenges: string[];
    solutions: string[];
    results?: string;
  }
  
  export interface Project {
    slug: string;
    name: string;
    shortDescription: string;
    problemSolved: string;
    technologies: string[];
    status: ProjectStatus;
    featured: boolean;
    image: string; // path under /public/projects
    links: ProjectLinks;
    detail: ProjectDetail;
  }
  
  // ─────────────────────────────────────────────────────────────
  // Experience
  // ─────────────────────────────────────────────────────────────
  
  export interface Experience {
    position: string;
    organization: string;
    location: string;
    startDate: string; // e.g. "2022"
    endDate: string; // e.g. "2022" or "Present"
    description: string;
    technologies: string[];
    responsibilities: string[];
  }
  
  // ─────────────────────────────────────────────────────────────
  // Education
  // ─────────────────────────────────────────────────────────────
  
  export interface EducationEntry {
    institution: string;
    program: string;
    startYear: string;
    endYear: string; // "In Progress" allowed
    relevantCoursework?: string[];
    achievements?: string[];
  }
  
  // ─────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────
  
  export interface NavItem {
    label: string;
    href: string; // section id, e.g. "#about"
  }
  
  // ─────────────────────────────────────────────────────────────
  // Contact form
  // ─────────────────────────────────────────────────────────────
  
  export interface ContactFormValues {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  
  export interface ContactFormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }