export const social = {
  github: "https://github.com/awakenedarpit",
  linkedin: "",
  email: "",
};

export const projects = [
  {
    title: "Campus Grid",
    category: "Web / Campus systems",
    description: "A project entry for a campus-focused digital experience. Repository details are kept intentionally open until they can be confirmed.",
    technologies: ["Web", "Product thinking"],
    github: social.github,
    live: "",
    accent: "violet",
    index: "01",
    featured: true,
  },
  {
    title: "Prism",
    category: "Information / Interface",
    description: "An exploratory concept around filtering signal from information overload, presented here as an editable project placeholder.",
    technologies: ["UX", "Experiment"],
    github: social.github,
    live: "",
    accent: "peach",
    index: "02",
    featured: true,
  },
  {
    title: "Vox",
    category: "AI / Voice",
    description: "An interactive AI voice project entry. Add the confirmed repository description, screenshots, and demo URL when available.",
    technologies: ["AI / ML", "Interaction"],
    github: social.github,
    live: "",
    accent: "mint",
    index: "03",
    featured: false,
  },
  {
    title: "COSMOS",
    category: "Creative development",
    description: "A space reserved for a confirmed creative-tech build and its story. The visual language stays intentionally abstract until then.",
    technologies: ["Creative code", "Prototype"],
    github: social.github,
    live: "",
    accent: "blue",
    index: "04",
    featured: false,
  },
];

export const skillGroups = [
  { label: "01", title: "Programming", items: ["Python", "C", "C++", "JavaScript", "TypeScript"] },
  { label: "02", title: "Web", items: ["HTML", "CSS", "React", "Next.js"] },
  { label: "03", title: "AI / ML", items: ["Python", "Machine learning", "AI concepts", "Data handling"] },
  { label: "04", title: "Tools", items: ["Git", "GitHub", "VS Code", "Cursor", "Supabase", "Vercel"] },
];

export const focusAreas = [
  { number: "01", title: "AI / ML", text: "Understanding the ideas behind intelligent systems and turning them into useful experiments." },
  { number: "02", title: "Web development", text: "Building clear, expressive interfaces that make technical ideas easier to experience." },
  { number: "03", title: "DSA", text: "Sharpening fundamentals through deliberate practice, one problem and one pattern at a time." },
  { number: "04", title: "Hackathons", text: "Working in short loops: frame the idea, test the edge, and ship the most honest version." },
];

export const hackathons = [
  { number: "01", title: "Tech Nova", project: "Campus Grid", detail: "Event / project details to be confirmed", color: "violet" },
  { number: "02", title: "Prism", project: "Signal in the noise", detail: "Concept details to be confirmed", color: "peach" },
  { number: "03", title: "Vox", project: "Interactive AI voice", detail: "Project details to be confirmed", color: "mint" },
];

export const journey = [
  { year: "2025", title: "Building & experimenting", text: "A year for trying ideas in public, exploring the relationship between code and creative expression." },
  { year: "Now", title: "BTech AI / ML", text: "Learning the fundamentals while turning curiosity into small, tangible systems." },
  { year: "Next", title: "Learn → build → iterate", text: "Keep the loop close: study deeply, make deliberately, and improve through feedback." },
];
