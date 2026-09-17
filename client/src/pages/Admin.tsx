import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, ImagePlus, KeyRound, LogIn, Plus, Save, ShieldCheck, Sparkles, Trash2, Upload } from "lucide-react";
import { ProjectRecord, supabase } from "@/lib/supabase";
import HackathonEditor from "@/components/admin/HackathonEditor";

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [reorderOpen, setReorderOpen] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState("overview");
  const dashboardSections = [
    ["overview", "Overview", "Workspace pulse", "LIVE"], ["identity", "Identity & About", "Hero, about, focus", "SOURCE"],
    ["skills", "Skills", "Tools & learning", "SOURCE"], ["projects", "Projects", "Work & galleries", "LIVE"],
    ["hackathons", "Hackathons", "Showcase stories", "LIVE"], ["journey", "Journey", "Timeline entries", "SOURCE"],
    ["certifications", "Certifications", "Proof & links", "SOURCE"], ["contact", "Contact & Links", "Social destinations", "SOURCE"],
  ];

  useEffect(() => {
    if (!supabase) { setMessage("Supabase environment variables are not configured."); setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (session) loadProjects(); }, [session]);
  async function loadProjects() {
    if (!supabase) return;
    const { data, error } = await supabase.from("portfolio_projects").select("*, portfolio_project_images(image_url, sort_order)").order("project_index");
    if (error) { setMessage(error.message); return; }
    setItems((data || []).map((item: any) => { const ordered = (item.portfolio_project_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((image: any) => image.image_url); const thumbnail = item.thumbnail_url || ordered[0] || ""; return { ...item, thumbnail_url: thumbnail, images: [thumbnail, ...ordered.filter((image: string) => image && image !== thumbnail)].filter(Boolean) }; }));
  }
  async function addProject() {
    if (!supabase) return;
    const draft = {
      slug: `new-experiment-${Date.now()}`,
      title: "New experiment",
      category: "Creative experiment",
      description: "Add a clear description of what this experiment does and what you learned while building it.",
      technologies: ["Add technology"],
      github: "",
      live: "",
      accent: "violet",
      project_index: String(items.length + 1).padStart(2, "0"),
      featured: false,
      thumbnail_url: "",
    };
    setMessage("Adding a new experiment…");
    const { data, error } = await supabase.from("portfolio_projects").insert(draft).select("*").single();
    if (error) { setMessage(`Could not add experiment: ${error.message}`); return; }
    await loadProjects();
    setMessage(`${data?.title || draft.title} added. Fill in its details, then save it.`);
  }
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); if (!supabase) return;
    setSigningIn(true); setMessage("");
    const result = isCreating ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } }) : await supabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (result.error) setMessage(result.error.message);
    else setMessage(isCreating ? "Account created. Check your email if confirmation is required, then sign in." : "");
  }
  async function resetPassword() {
    if (!supabase || !email) { setMessage("Enter your admin email first, then choose reset password."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
    setMessage(error ? error.message : "Password reset instructions sent to your email.");
  }
  function update(index: number, patch: Partial<ProjectRecord>) { setItems((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item)); }
  async function save(index: number) {
    if (!supabase) return; const item = items[index]; setMessage(`Saving ${item.title}…`);
    const { error } = await supabase.from("portfolio_projects").update({ title: item.title, category: item.category, description: item.description, technologies: item.technologies, github: item.github, live: item.live, updated_at: new Date().toISOString(), thumbnail_url: item.thumbnail_url || item.images?.[0] || "" }).eq("id", item.id);
    setMessage(error ? error.message : `${item.title} saved.`);
  }
  async function uploadImage(index: number, file?: File) {
    if (!supabase || !file || !items[index].id) return;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-"); const path = `${items[index].slug}/${Date.now()}-${safeName}`;
    setMessage("Uploading image…"); const upload = await supabase.storage.from("project-images").upload(path, file, { upsert: false });
    if (upload.error) { setMessage(upload.error.message); return; }
    const { data: publicUrl } = supabase.storage.from("project-images").getPublicUrl(path);
    const order = items[index].images?.length || 0; const insert = await supabase.from("portfolio_project_images").insert({ project_id: items[index].id, image_url: publicUrl.publicUrl, sort_order: order });
    if (insert.error) { setMessage(insert.error.message); return; }
    update(index, { images: [...(items[index].images || []), publicUrl.publicUrl] }); setMessage("Image uploaded.");
  }
  async function replaceImage(index: number, imageIndex: number, file?: File) {
    if (!supabase || !file || !items[index].id) return;
    const oldImage = items[index].images?.[imageIndex];
    if (!oldImage) return;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${items[index].slug}/${Date.now()}-replacement-${safeName}`;
    setMessage("Replacing image…");
    const upload = await supabase.storage.from("project-images").upload(path, file, { upsert: false });
    if (upload.error) { setMessage(upload.error.message); return; }
    const { data: publicUrl } = supabase.storage.from("project-images").getPublicUrl(path);
    const { error } = await supabase.from("portfolio_project_images").update({ image_url: publicUrl.publicUrl }).eq("project_id", items[index].id).eq("image_url", oldImage);
    if (error) { setMessage(error.message); return; }
    const images = [...(items[index].images || [])]; images[imageIndex] = publicUrl.publicUrl;
    const patch: Partial<ProjectRecord> = { images };
    if (items[index].thumbnail_url === oldImage) patch.thumbnail_url = publicUrl.publicUrl;
    update(index, patch);
    if (patch.thumbnail_url) await supabase.from("portfolio_projects").update({ thumbnail_url: patch.thumbnail_url, updated_at: new Date().toISOString() }).eq("id", items[index].id);
    setMessage("Image replaced.");
  }
  async function setThumbnail(index: number, image: string) {
    if (!supabase || !items[index].id) return;
    update(index, { thumbnail_url: image });
    const { error } = await supabase.from("portfolio_projects").update({ thumbnail_url: image, updated_at: new Date().toISOString() }).eq("id", items[index].id);
    if (error) setMessage(`Could not set main thumbnail: ${error.message}`); else setMessage("Main thumbnail saved. It is now the public project preview.");
  }
  async function moveImage(index: number, from: number, direction: -1 | 1) {
    if (!supabase || !items[index].id) return;
    const client = supabase;
    const current = [...(items[index].images || [])]; const to = from + direction;
    if (to < 0 || to >= current.length) return;
    [current[from], current[to]] = [current[to], current[from]]; update(index, { images: current });
    setMessage("Saving gallery order…");
    const projectId = items[index].id;
    const temporary = await Promise.all(current.map((image_url, position) => client.from("portfolio_project_images").update({ sort_order: 1000 + position }).eq("project_id", projectId).eq("image_url", image_url)));
    const temporaryError = temporary.find((result) => result.error)?.error;
    if (temporaryError) { setMessage(`Could not reorder images: ${temporaryError.message}`); return; }
    const saved = await Promise.all(current.map((image_url, sort_order) => client.from("portfolio_project_images").update({ sort_order }).eq("project_id", projectId).eq("image_url", image_url)));
    const savedError = saved.find((result) => result.error)?.error;
    setMessage(savedError ? `Could not save gallery order: ${savedError.message}` : "Gallery order saved.");
  }
  async function removeImage(index: number, imageIndex: number) {
    if (!supabase || !items[index].id) return; const image = items[index].images?.[imageIndex];
    const { error } = await supabase.from("portfolio_project_images").delete().eq("project_id", items[index].id).eq("image_url", image);
    if (error) { setMessage(error.message); return; }
    const remaining = (items[index].images || []).filter((_, i) => i !== imageIndex);
    const nextThumbnail = image === items[index].thumbnail_url ? (remaining[0] || "") : items[index].thumbnail_url;
    update(index, { images: remaining, thumbnail_url: nextThumbnail });
    if (image === items[index].thumbnail_url) await supabase.from("portfolio_projects").update({ thumbnail_url: nextThumbnail, updated_at: new Date().toISOString() }).eq("id", items[index].id);
    setMessage("Image deleted.");
  }

  if (loading) return <div className="admin-shell"><div className="admin-loading">Loading admin…</div></div>;
  if (!supabase) return <div className="admin-shell login-shell"><main className="admin-login"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><div className="login-card"><div className="login-brand"><span className="login-brand-mark"><Sparkles size={17} /></span><span>ARPIT / CONTENT STUDIO</span><span className="login-secure"><ShieldCheck size={14} /> SETUP REQUIRED</span></div><div className="login-heading"><p className="admin-kicker">SUPABASE CONNECTION MISSING</p><h1>Admin access<br /><em>is not configured.</em></h1><p>This preview cannot log you in because its Supabase environment variables are missing.</p></div><div className="login-error" role="alert">Configure <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in the preview/deployment environment, then restart the app.</div></div><p className="login-footnote">The login form is disabled until the database connection is available.</p></main></div>;
  if (!session) return <div className="admin-shell login-shell"><div className="login-orbit login-orbit-one" /><div className="login-orbit login-orbit-two" /><main className="admin-login"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><div className="login-card"><div className="login-brand"><span className="login-brand-mark"><Sparkles size={17} /></span><span>ARPIT / CONTENT STUDIO</span><span className="login-secure"><ShieldCheck size={14} /> SECURE</span></div><div className="login-heading"><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>{isCreating ? <>Create<br /><em>access.</em></> : <>Welcome<br /><em>back.</em></>}</h1><p>{isCreating ? "Create the protected editor account for your portfolio." : "Sign in to curate your projects, screenshots, and live links."}</p></div><form onSubmit={signIn}><label>Email address<div className="login-input"><KeyRound size={16} /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></div></label><label>Password<div className="login-input"><KeyRound size={16} /><input type={showPassword ? "text" : "password"} placeholder="Your secure password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label><button className="admin-save login-submit" type="submit" disabled={signingIn}><LogIn size={16} /> {signingIn ? "Opening workspace…" : isCreating ? "Create admin account" : "Continue to dashboard"}</button></form><div className="login-footer"><button type="button" onClick={() => setIsCreating((value) => !value)}>{isCreating ? "Already have an account? Sign in" : "Create first admin account"}</button>{!isCreating && <button type="button" onClick={resetPassword}>Forgot password?</button>}<span>Supabase Auth protected</span></div>{message && <div className="login-error" role="alert">{message}</div>}</div><p className="login-footnote">Your project content stays protected. Only authenticated editors can change the public portfolio.</p></main></div>;
  return <div className="admin-shell"><header className="admin-header"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><div><p className="admin-kicker">SUPABASE CONTENT STUDIO</p><h1>Portfolio admin</h1></div><button className="admin-save" onClick={() => supabase?.auth.signOut()}>Sign out</button></header><main className="admin-main"><section className="dashboard-overview" id="overview"><div className="dashboard-routebar">{dashboardSections.map(([id, label, detail, status]) => <button key={id} className={activeSection === id ? "active" : ""} onClick={() => { setActiveSection(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }}><strong>{label}</strong><small>{detail}</small><span className={status === "LIVE" ? "live-dot" : "source-dot"}>{status}</span></button>)}</div><div className="dashboard-intro"><div><p className="admin-kicker">CONTENT STUDIO / OVERVIEW</p><h2>Shape the work<br /><em>as it evolves.</em></h2></div><p>One focused control room for every part of the portfolio. Live sections write to Supabase; source sections stay clearly marked.</p></div><div className="dashboard-metrics"><article><strong>{items.length}</strong><span>Projects</span><small>database-backed</small></article><article><strong>{items.filter((item) => item.images?.length).length}</strong><span>Galleries</span><small>with preview media</small></article><article><strong>{dashboardSections.filter((item) => item[3] === "LIVE").length}</strong><span>Live areas</span><small>ready to edit</small></article><article><strong>{dashboardSections.length}</strong><span>Public parts</span><small>mapped in studio</small></article></div><div className="dashboard-source-grid">{dashboardSections.slice(1).map(([id, label, detail, status]) => <article id={id} key={id}><p className="admin-kicker">{status} / {detail}</p><h3>{label}</h3><p>{status === "LIVE" ? "Database-backed editor is available below." : "This section is centralized in client/src/data/content.ts until its database model is expanded."}</p><button onClick={() => setMessage(status === "LIVE" ? `Jumped to the ${label} editor.` : `${label} is source-backed. Edit content.ts for now.`)}>{status === "LIVE" ? "Open editor ↗" : "View source map ↗"}</button></article>)}</div></section><div className="admin-intro"><div><p className="admin-kicker">PUBLIC SECTION 05 / THINGS I HAVE BUILT</p><h2>Things I have<br /><em>Built.</em></h2></div><p>Edit project details, save them to Supabase, and upload as many preview images as each project needs.</p><button type="button" className="admin-save" onClick={addProject}><Plus size={15} /> New experiment</button></div>{message && <div className="admin-notice"><ImagePlus size={17} /><span>{message}</span></div>}<section id="hackathons"><HackathonEditor setMessage={setMessage} /></section><section id="projects" className="admin-projects">{items.map((project, index) => <article className="admin-card" key={project.id}><div className={`admin-card-visual visual-${project.accent}`}>{project.images?.[0] ? <img src={project.images[0]} alt="" /> : <span>No preview yet</span>}</div><div className="admin-card-body"><div className="admin-card-heading"><span>{project.project_index}</span><h3>{project.title}</h3></div><label>Project name<input value={project.title} onChange={(e) => update(index, { title: e.target.value })} /></label><label>Category<input value={project.category} onChange={(e) => update(index, { category: e.target.value })} /></label><label>Description<textarea rows={3} value={project.description} onChange={(e) => update(index, { description: e.target.value })} /></label><div className="admin-two"><label>GitHub URL<input value={project.github} onChange={(e) => update(index, { github: e.target.value })} /></label><label>Live demo URL<input placeholder="Leave empty for Demo coming soon" value={project.live} onChange={(e) => update(index, { live: e.target.value })} /></label></div><div className="admin-gallery"><div className="admin-gallery-head"><span>Preview gallery ({project.images?.length || 0})</span><div className="admin-gallery-actions"><button type="button" className={`reorder-toggle ${reorderOpen[project.id || ""] ? "active" : ""}`} onClick={() => setReorderOpen((current) => ({ ...current, [project.id || ""]: !current[project.id || ""] }))}>{reorderOpen[project.id || ""] ? "Done reordering" : "Reorder images"}</button><label className="upload-button"><Upload size={14} /> Upload image<input type="file" accept="image/*" onChange={(e) => uploadImage(index, e.target.files?.[0])} /></label></div></div><div className="admin-thumbs">{(project.images || []).map((image, imageIndex) => <div className={`admin-thumb ${project.thumbnail_url === image || (!project.thumbnail_url && imageIndex === 0) ? "is-thumbnail" : ""}`} key={`${image}-${imageIndex}`}><img src={image} alt={`${project.title} preview ${imageIndex + 1}`} /><div className="admin-thumb-actions"><label className="edit-image-button">Edit image<input type="file" accept="image/*" onChange={(e) => replaceImage(index, imageIndex, e.target.files?.[0])} /></label><button type="button" className="select-main-button" onClick={() => setThumbnail(index, image)}>{project.thumbnail_url === image || (!project.thumbnail_url && imageIndex === 0) ? "★ Main thumbnail" : "☆ Select as main"}</button>{reorderOpen[project.id || ""] && <><button type="button" className="move-gallery-button" onClick={() => moveImage(index, imageIndex, -1)} disabled={imageIndex === 0}><ArrowUp size={12} /> Move earlier</button><button type="button" className="move-gallery-button" onClick={() => moveImage(index, imageIndex, 1)} disabled={imageIndex === (project.images?.length || 1) - 1}><ArrowDown size={12} /> Move later</button></>}<button type="button" className="delete-image-button" onClick={() => removeImage(index, imageIndex)}><Trash2 size={12} /> Delete</button></div>{(project.thumbnail_url === image || (!project.thumbnail_url && imageIndex === 0)) && <span className="thumbnail-badge">MAIN</span>}</div>)}<span className="admin-gallery-help"><ImagePlus size={15} /> Select a main thumbnail. Use Reorder images to change sequence.</span></div></div><button className="admin-save admin-card-save" onClick={() => save(index)}><Save size={15} /> Save {project.title}</button></div></article>)}</section></main></div>;
}
