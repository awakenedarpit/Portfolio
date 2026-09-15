import { createClient } from "@supabase/supabase-js";

const publicSupabaseUrl = "https://toqxzvwdrlcnziehrpcz.supabase.co";
const publicSupabaseAnonKey = "sb_publishable_pXjsTrvwzlCMBp50lcWSLg_0hekxxWi";
export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || publicSupabaseUrl) as string;
export const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || publicSupabaseAnonKey) as string;
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type ProjectRecord = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  github: string;
  live: string;
  accent: string;
  project_index: string;
  featured: boolean;
  thumbnail_url: string;
  images?: string[];
};

export async function fetchPortfolioProjects(): Promise<ProjectRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio_projects").select("*, portfolio_project_images(image_url, sort_order)").order("project_index");
  if (error || !data) return null;
  return data.map((project: any) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    technologies: project.technologies || [],
    github: project.github,
    live: project.live,
    accent: project.accent,
    project_index: project.project_index,
    featured: project.featured,
    thumbnail_url: project.thumbnail_url || "",
    images: [project.thumbnail_url, ...(project.portfolio_project_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((image: any) => image.image_url).filter((url: string) => url && url !== project.thumbnail_url)].filter(Boolean),
  }));
}

export type HackathonRecord = {
  id?: string;
  number: string;
  title: string;
  project: string;
  detail: string;
  description: string;
  color: string;
  sort_order: number;
};

export type JournalRecord = {
  id?: string;
  title: string;
  excerpt: string;
  body: string;
  published_at: string;
  read_time: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
};

export type SiteContentRecord = { key: string; label: string; value: string };

export async function fetchPortfolioSiteContent(): Promise<Record<string, any> | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio_site_content").select("key,value");
  if (error) { console.warn("Could not load live site content", error.message); return null; }
  return Object.fromEntries((data || []).map((item: any) => [item.key, item.value]));
}

export function getFallbackSiteContent(): SiteContentRecord[] {
  return [
    { key: "identity", label: "Identity & About", value: JSON.stringify({ hero: "Building ideas into experiences.", bio: "I am Arpit Raj — a BTech AI/ML student, developer, and builder.", tags: ["AI/ML", "Development", "Learning", "Building"] }, null, 2) },
    { key: "skills", label: "Skills", value: JSON.stringify({ groups: [{ label: "01", title: "Programming", items: ["Python", "C", "C++", "JavaScript", "TypeScript"] }] }, null, 2) },
    { key: "journey", label: "Journey", value: JSON.stringify({ entries: [{ year: "2025", title: "Building & experimenting", text: "Trying ideas in public." }, { year: "Now", title: "BTech AI / ML", text: "Learning fundamentals and building systems." }] }, null, 2) },
    { key: "certifications", label: "Certifications", value: JSON.stringify({ entries: [] }, null, 2) },
    { key: "contact", label: "Contact & Links", value: JSON.stringify({ github: "https://github.com/awakenedarpit", linkedin: "https://www.linkedin.com/in/awakenedarpit/", email: "mailto:awakenedarpit@gmail.com", instagram: "https://www.instagram.com/awakenedarpit/", twitter: "https://x.com/awakenedarpit" }, null, 2) },
  ];
}

export async function fetchPortfolioJournal(): Promise<JournalRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio_journal").select("*").order("sort_order", { ascending: true });
  if (error) { console.warn("Could not load journal", error.message); return null; }
  return (data || []) as JournalRecord[];
}

export async function fetchPortfolioHackathons(): Promise<HackathonRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio_hackathons").select("id,number,title,project,detail,description,color,sort_order").order("sort_order", { ascending: true });
  if (error) {
    console.warn("Could not load showcase rows", error.message);
    return null;
  }
  return (data || []) as HackathonRecord[];
}

export type CertificationRecord = {
  id?: string;
  title: string;
  caption?: string;
  linkedin_url?: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image_url: string;
  sort_order: number;
};

export async function fetchPortfolioCertifications(): Promise<CertificationRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio_certifications").select("id,title,caption,linkedin_url,issuer,issue_date,credential_url,image_url,sort_order").order("sort_order", { ascending: true });
  if (error) { console.warn("Could not load certifications", error.message); return null; }
  return (data || []) as CertificationRecord[];
}

export function toProjectRecord(project: any): ProjectRecord {
  return { slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), title: project.title, category: project.category, description: project.description, technologies: project.technologies, github: project.github, live: project.live, accent: project.accent, project_index: project.index, featured: project.featured, thumbnail_url: project.thumbnail_url || project.images?.[0] || "", images: project.images || [] };
}

export function getFallbackHackathons(): HackathonRecord[] {
  return [
    { number: "01", title: "Quantum Flow", project: "Focus, habits, momentum", detail: "A productivity system built for daily progress", description: "Quantum Flow is a mobile-first personal productivity system for habits, goals, study planning, focus sessions, quotes, and progress tracking, with local persistence and a PWA foundation.", color: "violet", sort_order: 0 },
    { number: "02", title: "COSMOS", project: "Academic command center", detail: "An offline-first operating system for learning", description: "COSMOS is an offline-first academic command center for schedules, tasks, syllabus progress, study sessions, goals, roadmaps, analytics, and reflection.", color: "blue", sort_order: 1 },
    { number: "03", title: "VOX", project: "Interruptible AI voice", detail: "A prototype focused on recovery and control", description: "VOX is an interruptible real-time AI voice assistant prototype focused on interruption and recovery across speech recognition, AI responses, and voice output.", color: "mint", sort_order: 2 },
  ];
}

export function getFallbackJournal(): JournalRecord[] {
  return [
    { title: "Building in public, one experiment at a time", excerpt: "Notes on learning, shipping, and keeping the loop close.", body: "This is a place for longer notes about the ideas behind the work.", published_at: "2026-01-01", read_time: "3 min read", tags: ["Building", "Learning"], featured: true, sort_order: 0 },
  ];
}
