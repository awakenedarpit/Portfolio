import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { getFallbackHackathons, HackathonRecord, supabase } from "@/lib/supabase";

type Props = { setMessage: (message: string) => void };

export default function HackathonEditor({ setMessage }: Props) {
  const [items, setItems] = useState<HackathonRecord[]>(getFallbackHackathons());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from("portfolio_hackathons").select("id,number,title,project,detail,description,color,sort_order").order("sort_order", { ascending: true }).then(({ data, error }) => {
      if (error) { setMessage(`Showcase editor needs its database table: ${error.message}`); setLoading(false); return; }
      if (data?.length) setItems(data as HackathonRecord[]);
      setLoading(false);
    });
  }, [setMessage]);

  function update(index: number, patch: Partial<HackathonRecord>) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  async function save(index: number) {
    if (!supabase) return;
    const item = items[index];
    setMessage(`Saving ${item.title}…`);
    const payload = { number: item.number, title: item.title, project: item.project, detail: item.detail, description: item.description, color: item.color, sort_order: index, updated_at: new Date().toISOString() };
    const result = item.id ? await supabase.from("portfolio_hackathons").update(payload).eq("id", item.id).select("*").single() : await supabase.from("portfolio_hackathons").insert(payload).select("*").single();
    if (result.error) { setMessage(result.error.message); return; }
    if (result.data) update(index, result.data as HackathonRecord);
    setMessage(`${item.title} saved. Tap its row on the public page to view the description.`);
  }

  async function addItem() {
    if (!supabase) return;
    const draft: HackathonRecord = { number: String(items.length + 1).padStart(2, "0"), title: "New project", project: "Short project subtitle", detail: "One-line project summary", description: "Add the longer project description that visitors will see when they tap this row.", color: "violet", sort_order: items.length };
    const { data, error } = await supabase.from("portfolio_hackathons").insert(draft).select("*").single();
    if (error) { setMessage(error.message); return; }
    setItems((current) => [...current, (data || draft) as HackathonRecord]);
    setMessage("New showcase row added.");
  }

  async function remove(index: number) {
    const item = items[index];
    if (!supabase || !item.id) return;
    const { error } = await supabase.from("portfolio_hackathons").delete().eq("id", item.id);
    if (error) { setMessage(error.message); return; }
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setMessage(`${item.title} deleted.`);
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (!supabase || target < 0 || target >= items.length) return;
    const client = supabase;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    const results = await Promise.all(next.map((item, sort_order) => client.from("portfolio_hackathons").update({ sort_order }).eq("id", item.id)));
    const error = results.find((result) => result.error)?.error;
    setMessage(error ? error.message : "Showcase order saved.");
  }

  if (loading) return <section className="admin-showcase"><p className="admin-showcase-loading">Loading showcase editor…</p></section>;
  return <section className="admin-showcase" id="showcase-editor"><div className="admin-showcase-head"><div><p className="admin-kicker">PUBLIC SECTION 06</p><h2>Short loops.<br /><em>Big energy.</em></h2></div><button type="button" className="admin-save" onClick={addItem}><Plus size={15} /> Add row</button></div><p className="admin-showcase-copy">Edit the rows shown in the public Hackathons section. Visitors can tap any row—Quantum Flow, COSMOS, or VOX—to read its longer description.</p><div className="admin-showcase-list">{items.map((item, index) => <article className="admin-showcase-row" key={item.id || `${item.number}-${index}`}><div className={`admin-showcase-mark mark-${item.color}`}>{item.number}</div><div className="admin-showcase-fields"><div className="admin-two"><label>Label<input value={item.title} onChange={(event) => update(index, { title: event.target.value })} /></label><label>Accent<select value={item.color} onChange={(event) => update(index, { color: event.target.value })}><option value="violet">Violet</option><option value="blue">Blue</option><option value="mint">Mint</option></select></label></div><label>Project title<input value={item.project} onChange={(event) => update(index, { project: event.target.value })} /></label><label>Short summary<input value={item.detail} onChange={(event) => update(index, { detail: event.target.value })} /></label><label>Tap-to-open description<textarea rows={4} value={item.description} onChange={(event) => update(index, { description: event.target.value })} /></label><div className="admin-showcase-actions"><button type="button" className="admin-save" onClick={() => save(index)}><Save size={14} /> Save row</button><button type="button" className="showcase-move" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={14} /> Earlier</button><button type="button" className="showcase-move" onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown size={14} /> Later</button><button type="button" className="showcase-delete" onClick={() => remove(index)}><Trash2 size={14} /> Delete</button></div></div></article>)}</div></section>;
}
