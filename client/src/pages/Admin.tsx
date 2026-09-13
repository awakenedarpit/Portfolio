import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Award, Eye, EyeOff, ImagePlus, KeyRound, LogIn, Plus, Save, ShieldCheck, Sparkles, Trash2, Upload } from "lucide-react";
import { ProjectRecord, supabase } from "@/lib/supabase";

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
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    if (!supabase) { setMessage("Supabase environment variables are not configured."); setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (session) { loadProjects(); loadCertifications(); } }, [session]);
  async function loadCertifications() {
    if (!supabase) return;
    const { data, error } = await supabase.from("portfolio_certifications").select("*").order("sort_order");
    if (error) setMessage(error.message); else setCerts(data || []);
  }
  function updateCert(index: number, patch: Record<string, string>) { setCerts((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item)); }
  async function addCertification() {
    if (!supabase) return;
    const { data, error } = await supabase.from("portfolio_certifications").insert({ title: "New certification", issuer: "Issuer", issue_date: "2026", credential_url: "", image_url: "", sort_order: certs.length }).select().single();
    if (error) setMessage(error.message); else { setCerts((current) => [...current, data]); setMessage("Certification added."); }
  }
  async function saveCertification(index: number) {
    if (!supabase) return; const item = certs[index];
    const { error } = await supabase.from("portfolio_certifications").update({ title: item.title, issuer: item.issuer, issue_date: item.issue_date, credential_url: item.credential_url, image_url: item.image_url, updated_at: new Date().toISOString() }).eq("id", item.id);
    setMessage(error ? error.message : "Certification saved.");
  }
  async function uploadCertificationProof(index: number, file?: File) {
    if (!supabase || !file || !certs[index]?.id) return;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `certifications/${certs[index].id}/${Date.now()}-${safeName}`;
    setMessage("Uploading certification proof…");
    const upload = await supabase.storage.from("project-images").upload(path, file, { upsert: false });
    if (upload.error) { setMessage(upload.error.message); return; }
    const { data: publicUrl } = supabase.storage.from("project-images").getPublicUrl(path);
    const { error } = await supabase.from("portfolio_certifications").update({ image_url: publicUrl.publicUrl, updated_at: new Date().toISOString() }).eq("id", certs[index].id);
    if (error) setMessage(error.message); else { updateCert(index, { image_url: publicUrl.publicUrl }); setMessage("Certification proof uploaded."); }
  }
  async function removeCertificationProof(index: number) {
    if (!supabase || !certs[index]?.id) return;
    const { error } = await supabase.from("portfolio_certifications").update({ image_url: "", updated_at: new Date().toISOString() }).eq("id", certs[index].id);
    if (error) setMessage(error.message); else { updateCert(index, { image_url: "" }); setMessage("Certification proof removed."); }
  }
  async function removeCertification(index: number) {
    if (!supabase) return; const item = certs[index]; const { error } = await supabase.from("portfolio_certifications").delete().eq("id", item.id);
    if (error) setMessage(error.message); else { setCerts((current) => current.filter((_, i) => i !== index)); setMessage("Certification deleted."); }
  }
  async function moveCertification(index: number, direction: -1 | 1) {
    if (!supabase) return; const to = index + direction; if (to < 0 || to >= certs.length) return;
    const next = [...certs]; [next[index], next[to]] = [next[to], next[index]]; setCerts(next);
    await Promise.all(next.map((item, sort_order) => supabase!.from("portfolio_certifications").update({ sort_order }).eq("id", item.id)));
    setMessage("Certification order saved.");
  }

  async function loadProjects() {
    if (!supabase) return;
    const { data, error } = await supabase.from("portfolio_projects").select("*, portfolio_project_images(image_url, sort_order)").order("project_index");
    if (error) { setMessage(error.message); return; }
    setItems((data || []).map((item: any) => { const ordered = (item.portfolio_project_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((image: any) => image.image_url); const thumbnail = item.thumbnail_url || ordered[0] || ""; return { ...item, thumbnail_url: thumbnail, images: [thumbnail, ...ordered.filter((image: string) => image && image !== thumbnail)].filter(Boolean) }; }));
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
  if (!session) return <div className="admin-shell login-shell"><div className="login-orbit login-orbit-one" /><div className="login-orbit login-orbit-two" /><main className="admin-login"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><div className="login-card"><div className="login-brand"><span className="login-brand-mark"><Sparkles size={17} /></span><span>ARPIT / CONTENT STUDIO</span><span className="login-secure"><ShieldCheck size={14} /> SECURE</span></div><div className="login-heading"><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>{isCreating ? <>Create<br /><em>access.</em></> : <>Welcome<br /><em>back.</em></>}</h1><p>{isCreating ? "Create the protected editor account for your portfolio." : "Sign in to curate your projects, screenshots, and live links."}</p></div><form onSubmit={signIn}><label>Email address<div className="login-input"><KeyRound size={16} /><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></div></label><label>Password<div className="login-input"><KeyRound size={16} /><input type={showPassword ? "text" : "password"} placeholder="Your secure password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label><button className="admin-save login-submit" type="submit" disabled={signingIn}><LogIn size={16} /> {signingIn ? "Opening workspace…" : isCreating ? "Create admin account" : "Continue to dashboard"}</button></form><div className="login-footer"><button type="button" onClick={() => setIsCreating((value) => !value)}>{isCreating ? "Already have an account? Sign in" : "Create first admin account"}</button>{!isCreating && <button type="button" onClick={resetPassword}>Forgot password?</button>}<span>Supabase Auth protected</span></div>{message && <div className="login-error" role="alert">{message}</div>}</div><p className="login-footnote">Your project content stays protected. Only authenticated editors can change the public portfolio.</p></main></div>;
  return <div className="admin-shell"><header className="admin-header"><a href="/" className="admin-back"><ArrowLeft size={16} /> Back to portfolio</a><div><p className="admin-kicker">SUPABASE CONTENT STUDIO</p><h1>Portfolio admin</h1></div><button className="admin-save" onClick={() => supabase?.auth.signOut()}>Sign out</button></header><main className="admin-main"><div className="admin-intro"><div><p className="admin-kicker">DATABASE-BACKED CONTENT</p><h2>Shape the work<br /><em>as it evolves.</em></h2></div><p>Edit project details, save them to Supabase, and upload as many preview images as each project needs.</p></div>{message && <div className="admin-notice"><ImagePlus size={17} /><span>{message}</span></div>}<section className="admin-certifications"><div className="admin-certifications-head"><div><p className="admin-kicker">CREDENTIALS / MILESTONES</p><h2>Certifications</h2></div><button type="button" className="admin-save" onClick={addCertification}><Plus size={15} /> Add certification</button></div><p className="admin-certifications-copy">Add the courses, programs, and achievements you want visitors to see on the public portfolio.</p>{certs.map((cert, certIndex) => <article className="admin-cert-row" key={cert.id}><div className="cert-admin-number">0{certIndex + 1}</div><div className="cert-admin-fields"><label>Certification name<input value={cert.title} onChange={(e) => updateCert(certIndex, { title: e.target.value })} /></label><label>Issuer<input value={cert.issuer} onChange={(e) => updateCert(certIndex, { issuer: e.target.value })} /></label><div className="admin-two"><label>Issue date<input value={cert.issue_date} onChange={(e) => updateCert(certIndex, { issue_date: e.target.value })} /></label><label>Credential URL<input placeholder="https://..." value={cert.credential_url} onChange={(e) => updateCert(certIndex, { credential_url: e.target.value })} /></label></div><div className="cert-proof-admin"><span>Certificate proof image</span>{cert.image_url ? <div className="cert-proof-preview"><img src={cert.image_url} alt="Certification proof" /><button type="button" onClick={() => removeCertificationProof(certIndex)}><Trash2 size={13} /> Remove proof</button></div> : <label className="upload-button cert-upload-button"><Upload size={14} /> Upload proof image<input type="file" accept="image/*" onChange={(e) => uploadCertificationProof(certIndex, e.target.files?.[0])} /></label>}</div></div><div className="cert-admin-actions"><button type="button" onClick={() => moveCertification(certIndex, -1)} disabled={certIndex === 0} aria-label="Move certification earlier"><ArrowUp size={14} /></button><button type="button" onClick={() => moveCertification(certIndex, 1)} disabled={certIndex === certs.length - 1} aria-label="Move certification later"><ArrowDown size={14} /></button><button type="button" onClick={() => saveCertification(certIndex)}><Save size={14} /> Save</button><button type="button" onClick={() => removeCertification(certIndex)} className="cert-delete"><Trash2 size={14} /></button></div></article>)}</section><section className="admin-projects">{items.map((project, index) => <article className="admin-card" key={project.id}><div className={`admin-card-visual visual-${project.accent}`}>{project.images?.[0] ? <img src={project.images[0]} alt="" /> : <span>No preview yet</span>}</div><div className="admin-card-body"><div className="admin-card-heading"><span>{project.project_index}</span><h3>{project.title}</h3></div><label>Project name<input value={project.title} onChange={(e) => update(index, { title: e.target.value })} /></label><label>Category<input value={project.category} onChange={(e) => update(index, { category: e.target.value })} /></label><label>Description<textarea rows={3} value={project.description} onChange={(e) => update(index, { description: e.target.value })} /></label><div className="admin-two"><label>GitHub URL<input value={project.github} onChange={(e) => update(index, { github: e.target.value })} /></label><label>Live demo URL<input placeholder="Leave empty for Demo coming soon" value={project.live} onChange={(e) => update(index, { live: e.target.value })} /></label></div><div className="admin-gallery"><div className="admin-gallery-head"><span>Preview gallery ({project.images?.length || 0})</span><div className="admin-gallery-actions"><button type="button" className={`reorder-toggle ${reorderOpen[project.id || ""] ? "active" : ""}`} onClick={() => setReorderOpen((current) => ({ ...current, [project.id || ""]: !current[project.id || ""] }))}>{reorderOpen[project.id || ""] ? "Done reordering" : "Reorder images"}</button><label className="upload-button"><Upload size={14} /> Upload image<input type="file" accept="image/*" onChange={(e) => uploadImage(index, e.target.files?.[0])} /></label></div></div><div className="admin-thumbs">{(project.images || []).map((image, imageIndex) => <div className={`admin-thumb ${project.thumbnail_url === image || (!project.thumbnail_url && imageIndex === 0) ? "is-thumbnail" : ""}`} key={`${image}-${imageIndex}`}><img src={image} alt={`${project.title} preview ${imageIndex + 1}`} /><div className="admin-thumb-actions"><button type="button" className="select-main-button" onClick={() => setThumbnail(index, image)}>{project.thumbnail_url === image || (!project.thumbnail_url && imageIndex === 0) ? "★ Main thumbnail" : "☆ Select as main"}</button>{reorderOpen[project.id || ""] && <><button type="button" className="move-gallery-button" onClick={() => moveImage(index, imageIndex, -1)} disabled={imageIndex === 0}><ArrowUp size={12} /> Move earlier</button><button type="button" className="move-gallery-button" onClick={() => moveImage(index, imageIndex, 1)} disabled={imageIndex === (project.images?.length || 1) - 1}><ArrowDown size={12} /> Move later</button></>}<button type="button" className="delete-image-button" onClick={() => removeImage(index, imageIndex)}><Trash2 size={12} /> Delete</button></div>{(project.thumbnail_url === image || (!project.thumbnail_url && imageIndex === 0)) && <span className="thumbnail-badge">MAIN</span>}</div>)}<span className="admin-gallery-help"><ImagePlus size={15} /> Select a main thumbnail. Use Reorder images to change sequence.</span></div></div><button className="admin-save admin-card-save" onClick={() => save(index)}><Save size={15} /> Save {project.title}</button></div></article>)}</section></main></div>;
}
