import { useEffect, useState } from 'react';
import { getAll, getLinkMetadata, addContent } from '../api';

export default function Dashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<any | null>(null);

  useEffect(() => {
    if (!token) return;
    getAll(token).then((d) => setItems(d || [])).catch(console.error);
  }, [token]);

  async function preview() {
    try {
      const m = await getLinkMetadata(url);
      setMeta(m);
    } catch (err) {
      console.error(err);
    }
  }

  async function add() {
    if (!meta) return;
    try {
      const created = await addContent(token, { type: 'link', ...meta });
      setItems((s) => [created, ...s]);
      setUrl('');
      setMeta(null);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={onSignOut} className="px-3 py-1 bg-gray-200 rounded">Sign out</button>
      </div>

      <div className="mb-4 max-w-lg">
        <div className="flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Paste url to preview" />
          <button onClick={preview} className="px-3 py-1 bg-blue-600 text-white rounded">Preview</button>
        </div>
        {meta && (
          <div className="mt-3 p-3 border rounded bg-white">
            <div className="font-semibold">{meta.title}</div>
            <div className="text-sm text-gray-600">{meta.description}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={add} className="px-2 py-1 bg-green-600 text-white rounded">Add</button>
            </div>
          </div>
        )}
      </div>

      <div>
        {items.length === 0 && <div className="text-gray-500">No items yet</div>}
        {items.map((it) => (
          <div key={it.id || it._id} className="p-3 mb-2 border rounded bg-white">
            <div className="font-semibold">{it.title || it.name}</div>
            <div className="text-sm text-gray-600">{it.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
