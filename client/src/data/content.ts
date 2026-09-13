export const social = {
  github: "https://github.com/awakenedarpit",
  linkedin: "https://www.linkedin.com/in/awakenedarpit/",
  email: "mailto:awakenedarpit@gmail.com",
  instagram: "https://www.instagram.com/awakenedarpit/",
  twitter: "https://x.com/awakenedarpit",
};

export const projects = [
  {
    title: "Quantum Flow",
    category: "Productivity / PWA",
    description: "A mobile-first personal productivity app for habits, goals, study planning, focus sessions, quotes, and progress tracking, with local persistence and a PWA foundation.",
    technologies: ["JavaScript", "PWA", "localStorage"],
    github: "https://github.com/awakenedarpit/Quantum-Flow",
    live: "https://awakenedarpit.github.io/Quantum-Flow/",
    accent: "violet",
    index: "01",
    featured: true,
    images: ["/projects/quantum-flow.webp"],
  },
  {
    title: "COSMOS",
    category: "Academic operating system",
    description: "An offline-first academic command center for schedules, tasks, syllabus progress, study sessions, goals, roadmaps, analytics, and reflection.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind"],
    github: "https://github.com/awakenedarpit/COSMOS",
    live: "https://awakenedarpit.github.io/COSMOS/",
    accent: "blue",
    index: "02",
    featured: true,
    images: [],
  },
  {
    title: "VOX",
    category: "AI / Voice assistant",
    description: "An interruptible real-time AI voice assistant prototype focused on interruption and recovery across speech recognition, AI responses, and voice output.",
    technologies: ["Python", "FastAPI", "AI", "Rime TTS"],
    github: "https://github.com/awakenedarpit/VOX",
    live: "",
    accent: "mint",
    index: "03",
    featured: false,
    images: [],
  },
  {
    title: "Final Birthday Surprise",
    category: "Interactive microsite",
    description: "A tap-through birthday experience with animated story slides, a passcode opening, wishes, music, a gift sequence, collectible letters, and a final celebration.",
    technologies: ["HTML", "CSS", "JavaScript", "EmailJS"],
    github: "https://github.com/awakenedarpit/Final-Birthday-Surprise",
    live: "https://awakenedarpit.github.io/Final-Birthday-Surprise/",
    accent: "peach",
    index: "04",
    featured: false,
    images: [],
  },
  {
    title: "Bow-and-Heart",
    category: "Creative web experience",
    description: "A lightweight browser-based interactive scene built around a playful heart-and-bow theme using pure HTML, CSS, and JavaScript.",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/awakenedarpit/Bow-and-Heart",
    live: "https://awakenedarpit.github.io/Bow-and-Heart/",
    accent: "peach",
    index: "05",
    featured: false,
    images: [],
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
  { number: "01", title: "Quantum Flow", project: "Focus, habits, momentum", detail: "A productivity system built for daily progress", color: "violet" },
  { number: "02", title: "COSMOS", project: "Academic command center", detail: "An offline-first operating system for learning", color: "blue" },
  { number: "03", title: "VOX", project: "Interruptible AI voice", detail: "A prototype focused on recovery and control", color: "mint" },
];

export const journey = [
  { year: "2025", title: "Building & experimenting", text: "A year for trying ideas in public, exploring the relationship between code and creative expression." },
  { year: "Now", title: "BTech AI / ML", text: "Learning the fundamentals while turning curiosity into small, tangible systems." },
  { year: "Next", title: "Learn → build → iterate", text: "Keep the loop close: study deeply, make deliberately, and improve through feedback." },
];
