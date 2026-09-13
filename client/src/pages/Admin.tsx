import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, LogIn, Save, Trash2, Upload } from "lucide-react";
import { ProjectRecord, supabase } from "@/lib/supabase";

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
    setItems((data || []).map((item: any) => ({ ...item, images: (item.portfolio_project_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((image: any) => image.image_url) })));
  }
  async function signIn(event: React.FormEvent) {
    event.preventDefault(); if (!supabase) return;
    setMessage("Signing in…"); const { error } = await supabase.auth.signInWithPassword({ email, password }); setMessage(error ? error.message : "");
  }
  function update(index: number, patch: Partial<ProjectRecord>) { setItems((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item)); }
  async function save(index: number) {
    if (!supabase) return; const item = items[index]; setMessage(`Saving ${item.title}…`);
    const { error } = await supabase.from("portfolio_projects").update({ title: item.title, category: item.category, description: item.description, technologies: item.technologies, github: item.github, live: item.live, updated_at: new Date().toISOString() }).eq("id", item.id);
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
  async function removeImage(index: number, imageIndex: number) {
    if (!supabase || !items[index].id) return; const image = items[index].images?.[imageIndex];
    const { error } = await supabase.from("portfolio_project_images").delete().eq("project_id", items[index].id).eq("image_url", image);
    if (error) { setMessage(error.message); return; } update(index, { images: (items[index].images || []).filter((_, i) => i !== imageIndex) });
  }

  if (loading) return <div className="admin-shell"><div className="admin-loading">Loading admin…</div></div>;
  if (!session) return <div className="admin-shell"><div className="admin-login"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><p className="admin-kicker">PRIVATE CONTENT STUDIO</p><h1>Sign in to edit<br /><em>your portfolio.</em></h1><p>Use the Supabase Auth user created for your portfolio admin account.</p><form onSubmit={signIn}><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button className="admin-save" type="submit"><LogIn size={16} /> Sign in</button></form>{message && <small className="admin-message">{message}</small>}</div></div>;
  return <div className="admin-shell"><header className="admin-header"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><div><p className="admin-kicker">SUPABASE CONTENT STUDIO</p><h1>Portfolio admin</h1></div><button className="admin-save" onClick={() => supabase?.auth.signOut()}>Sign out</button></header><main className="admin-main"><div className="admin-intro"><div><p className="admin-kicker">DATABASE-BACKED CONTENT</p><h2>Shape the work<br /><em>as it evolves.</em></h2></div><p>Edit project details, save them to Supabase, and upload as many preview images as each project needs.</p></div>{message && <div className="admin-notice"><ImagePlus size={17} /><span>{message}</span></div>}<section className="admin-projects">{items.map((project, index) => <article className="admin-card" key={project.id}><div className={`admin-card-visual visual-${project.accent}`}>{project.images?.[0] ? <img src={project.images[0]} alt="" /> : <span>No preview yet</span>}</div><div className="admin-card-body"><div className="admin-card-heading"><span>{project.project_index}</span><h3>{project.title}</h3></div><label>Project name<input value={project.title} onChange={(e) => update(index, { title: e.target.value })} /></label><label>Category<input value={project.category} onChange={(e) => update(index, { category: e.target.value })} /></label><label>Description<textarea rows={3} value={project.description} onChange={(e) => update(index, { description: e.target.value })} /></label><div className="admin-two"><label>GitHub URL<input value={project.github} onChange={(e) => update(index, { github: e.target.value })} /></label><label>Live demo URL<input placeholder="Leave empty for Demo coming soon" value={project.live} onChange={(e) => update(index, { live: e.target.value })} /></label></div><div className="admin-gallery"><div className="admin-gallery-head"><span>Preview gallery ({project.images?.length || 0})</span><label className="upload-button"><Upload size={14} /> Upload image<input type="file" accept="image/*" onChange={(e) => uploadImage(index, e.target.files?.[0])} /></label></div><div className="admin-thumbs">{(project.images || []).map((image, imageIndex) => <div className="admin-thumb" key={`${image}-${imageIndex}`}><img src={image} alt={`${project.title} preview ${imageIndex + 1}`} /><button type="button" onClick={() => removeImage(index, imageIndex)} aria-label="Remove image"><Trash2 size={13} /></button></div>)}<span className="admin-gallery-help"><ImagePlus size={15} /> Upload multiple screenshots</span></div></div><button className="admin-save admin-card-save" onClick={() => save(index)}><Save size={15} /> Save {project.title}</button></div></article>)}</section></main></div>;
}
