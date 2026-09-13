import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { focusAreas, hackathons, journey, projects, skillGroups, social } from "@/data/content";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
}

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = -100;
    let y = -100;
    let ringX = x;
    let ringY = y;
    let frame = 0;
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const tick = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move);
    frame = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(frame); };
  }, []);
  return <><div className="cursor-dot" ref={dot} /><div className="cursor-ring" ref={ring} /></>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-25% 0px -65%", threshold: 0 },
    );
    navItems.forEach(({ href }) => { const node = document.querySelector(href); if (node) observer.observe(node); });
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);
  return (
    <header className={`site-nav ${scrolled ? "nav-scrolled" : ""}`}>
      <a className="wordmark" href="#home" aria-label="Arpit home"><span>AR</span>PIT<span className="wordmark-dot">·</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map((item) => <a key={item.href} className={active === item.href.slice(1) ? "active" : ""} href={item.href}>{item.label}</a>)}
      </nav>
      <a className="nav-contact" href="#contact">Let&apos;s talk <ArrowUpRight size={14} /></a>
      <button className="menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={16} /></a>)}</nav>}
    </header>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span className="eyebrow-line" />{children}</p>;
}

function HeroVisual() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div className="hero-visual" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPosition({ x: (event.clientX - rect.left - rect.width / 2) * 0.025, y: (event.clientY - rect.top - rect.height / 2) * 0.025 }); }} onMouseLeave={() => setPosition({ x: 0, y: 0 })} aria-label="Abstract orbital system visual" role="img">
      <div className="visual-kicker">A / 01 <span>EXPLORE THE FIELD</span></div>
      <div className="orbit orbit-one" style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(-23deg)` }} />
      <div className="orbit orbit-two" style={{ transform: `translate(${position.x * -0.8}px, ${position.y * -0.8}px) rotate(35deg)` }} />
      <div className="orbit orbit-three" style={{ transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px) rotate(68deg)` }} />
      <div className="visual-core" style={{ transform: `translate(${position.x * 0.35}px, ${position.y * 0.35}px)` }}><span>∞</span></div>
      <span className="node node-a" /><span className="node node-b" /><span className="node node-c" /><span className="node node-d" />
      <div className="visual-caption">curiosity<br /><span>in motion</span></div>
      <div className="visual-coordinates">28° 36′ N<br />77° 13′ E</div>
    </div>
  );
}

function Hero() {
  return <section id="home" className="hero section-pad"><div className="container hero-grid"><div className="hero-copy"><div className="hero-meta reveal"><span className="status-dot" />Available for good ideas <span className="meta-year">/ 2026</span></div><h1 className="hero-title"><span className="reveal delay-1">Building ideas</span><span className="reveal delay-2 title-indent">into <em>experiences.</em></span></h1><p className="hero-description reveal delay-3">I&apos;m Arpit — a BTech AI/ML student, developer, and builder exploring the space where artificial intelligence meets thoughtful digital design.</p><div className="hero-actions reveal delay-4"><a className="button button-primary" href="#projects">View my work <ArrowDownRight size={17} /></a><a className="button button-quiet" href={social.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a></div></div><div className="hero-art reveal delay-2"><HeroVisual /></div></div><div className="hero-bottom container"><span>SCROLL TO EXPLORE</span><span className="hero-line" /><span>01 — 09</span></div></section>;
}

function SectionHeader({ index, title, copy, light = false }: { index: string; title: React.ReactNode; copy?: string; light?: boolean }) {
  return <div className={`section-header reveal ${light ? "section-header-light" : ""}`}><div className="section-index">{index} <span>—</span></div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function About() {
  return <section id="about" className="section section-light section-pad"><div className="container"><SectionHeader index="02" title="A little about the builder" copy="Not a straight line. More like a constellation of questions, prototypes, and things worth making." light /><div className="about-grid"><div className="about-statement reveal"><span>01</span><p>Learning the rules<br />to make <i>new ones.</i></p></div><div className="about-copy reveal delay-1"><p className="large-copy">I like the part before the answer — when a vague idea starts taking shape through code, sketches, and a little stubbornness.</p><p>I&apos;m currently building my foundations in AI/ML and web development, while looking for the details that make an experience feel clear, human, and worth returning to.</p><div className="about-tags">{["AI/ML", "Development", "Learning", "Building", "Experimenting"].map((tag) => <span key={tag}>{tag}</span>)}</div></div></div></div></section>;
}

function CurrentlyBuilding() {
  return <section id="building" className="section section-dark section-pad"><div className="container"><SectionHeader index="03" title="Currently building" copy="A live snapshot of the questions I&apos;m spending time with." /><div className="focus-grid">{focusAreas.map((item, i) => <article className={`focus-card reveal delay-${(i % 4) + 1}`} key={item.number}><span className="card-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRight className="card-arrow" size={22} /></article>)}</div><div className="building-note reveal"><Sparkles size={16} /><span>The through-line: <strong>learn something → make something → learn again.</strong></span></div></div></section>;
}

function Skills() {
  const [selected, setSelected] = useState(0);
  const group = skillGroups[selected];
  return <section id="skills" className="section section-slate section-pad"><div className="container"><SectionHeader index="04" title="Tools for the journey" copy="A growing toolkit, not a list of claims. Each one is an invitation to go deeper." light /><div className="skills-layout"><div className="skill-tabs" role="tablist" aria-label="Skill categories">{skillGroups.map((item, i) => <button className={selected === i ? "selected" : ""} key={item.title} onClick={() => setSelected(i)} role="tab" aria-selected={selected === i}><span>{item.label}</span>{item.title}<ArrowUpRight size={15} /></button>)}</div><div className="skill-display reveal" role="tabpanel"><div className="skill-orb"><span>{group.label}</span></div><div><p className="display-label">Now exploring</p><h3>{group.title}</h3><div className="skill-list">{group.items.map((item) => <span key={item}><Check size={13} />{item}</span>)}</div></div></div></div></div></section>;
}

function ProjectVisual({ accent, index }: { accent: string; index: string }) {
  return <div className={`project-visual visual-${accent}`}><span className="project-index">{index}</span><div className="visual-grid-lines" /><div className="project-shape"><div /><div /><div /></div><span className="visual-label">PROJECT / {index}</span></div>;
}

function Projects() {
  return <section id="projects" className="section section-dark section-pad projects-section"><div className="container"><SectionHeader index="05" title="Selected experiments" copy="A few places where ideas get a surface to live on. Details stay editable until they&apos;re verified." /><div className="projects-grid">{projects.map((project) => <article className={`project-card ${project.featured ? "project-featured" : ""} reveal`} key={project.title}><ProjectVisual accent={project.accent} index={project.index} /><div className="project-info"><div><p className="project-category">{project.category}</p><h3>{project.title}</h3></div><ArrowUpRight className="project-arrow" size={25} /><p className="project-description">{project.description}</p><div className="project-footer"><div className="tech-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><a href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>GitHub <MoveUpRight size={13} /></a></div></div></article>)}</div></div></section>;
}

function Hackathons() {
  return <section id="hackathons" className="section section-light section-pad"><div className="container"><SectionHeader index="06" title="Short loops. Big energy." copy="Hackathons are where the distance between a thought and a prototype gets delightfully small." light /><div className="hackathon-list">{hackathons.map((item, i) => <article className="hackathon-row reveal" key={item.number}><div className={`hackathon-mark mark-${item.color}`}><span>{item.number}</span><span className="mark-line" /></div><div className="hackathon-main"><p>{item.title}</p><h3>{item.project}</h3></div><p className="hackathon-detail">{item.detail}</p><ArrowUpRight size={19} /></article>)}</div></div></section>;
}

function Journey() {
  return <section id="journey" className="section section-violet section-pad"><div className="container"><SectionHeader index="07" title="The journey is the project" copy="No finish line yet. Just a useful direction and a habit of showing up." /><div className="journey-list">{journey.map((item, i) => <article className="journey-item reveal" key={item.year}><div className="journey-year">{item.year}</div><div className="journey-point"><span /><div /></div><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="journey-number">0{i + 1}</span></article>)}</div></div></section>;
}

function GithubCTA() {
  return <section className="github-section section-pad"><div className="container github-cta reveal"><div><Eyebrow light>08 — OPEN SOURCE / PUBLIC WORK</Eyebrow><h2>See what&apos;s<br /><em>in progress.</em></h2></div><a className="github-circle" href={social.github} target="_blank" rel="noreferrer" aria-label="Explore Arpit on GitHub"><Github size={31} /><span>Explore<br />GitHub</span><ArrowUpRight size={18} /></a><div className="github-grid-mark" aria-hidden="true" /></div></section>;
}

function Contact() {
  return <section id="contact" className="section contact-section section-pad"><div className="container contact-grid"><div><SectionHeader index="09" title={<>Let&apos;s build something<br /><em>interesting.</em></>} copy="Have an idea, project, collaboration, or simply want to connect? The best way to start is usually a good question." /><div className="contact-availability"><span className="status-dot" />Currently open to conversations around learning, building, and creative experiments.</div></div><div className="contact-links reveal delay-2"><a className="contact-link" href={social.github} target="_blank" rel="noreferrer"><span><Github size={18} />GitHub</span><ArrowUpRight size={18} /></a><div className="contact-link disabled"><span><Linkedin size={18} />LinkedIn</span><small>TODO: add URL</small></div><div className="contact-link disabled"><span><Mail size={18} />Email</span><small>TODO: add address</small></div></div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-top"><a className="wordmark footer-mark" href="#home">AR<span>PIT</span><b>·</b></a><p>AI/ML Student<br />Developer · Builder</p><div className="footer-links"><a href={social.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><span>LinkedIn — TODO</span></div></div><div className="container footer-bottom"><span>© 2026 Arpit</span><span>Made with curiosity &amp; code</span><a href="#home">Back to top <ChevronDown size={14} className="rotate-up" /></a></div></footer>;
}

export default function Home() {
  useReveal();
  return <><ScrollProgress /><CustomCursor /><Navbar /><main><Hero /><About /><CurrentlyBuilding /><Skills /><Projects /><Hackathons /><Journey /><GithubCTA /><Contact /></main><Footer /></>;
}
