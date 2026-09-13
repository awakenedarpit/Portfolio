import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
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

export type CertificationRecord = {
  id?: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image_url: string;
  sort_order: number;
};

export async function fetchPortfolioCertifications(): Promise<CertificationRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio_certifications").select("id,title,issuer,issue_date,credential_url,image_url,sort_order").order("sort_order", { ascending: true });
  if (error) { console.warn("Could not load certifications", error.message); return null; }
  return (data || []) as CertificationRecord[];
}

export function toProjectRecord(project: any): ProjectRecord {
  return { slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), title: project.title, category: project.category, description: project.description, technologies: project.technologies, github: project.github, live: project.live, accent: project.accent, project_index: project.index, featured: project.featured, thumbnail_url: project.thumbnail_url || project.images?.[0] || "", images: project.images || [] };
}
