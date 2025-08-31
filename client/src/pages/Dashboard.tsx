import { useEffect, useState } from 'react';
import { getAll, getLinkMetadata, addContent } from '../api';
import { PLATFORM_LOGOS, getPlatform, getFavicon } from '../utils/platformLogos';

function formatDateTime(dt?: string | Date) {
  if (!dt) return '';
  return new Date(dt).toLocaleString();
}

export default function Dashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getAll(token)
      .then((d) => setItems(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []))
      .catch((err) => setError(err?.message || 'Failed to load items'));
  }, [token]);

  async function preview() {
    try {
      const m = await getLinkMetadata(url);
      setMeta(m?.data || m);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch metadata');
    }
  }

  async function add() {
    if (!meta) return;
    try {
      const created = await addContent(token, {
        contentType: 'Link',
        url: meta.url,
      });
      setItems((s) => [created, ...s]);
      setUrl('');
      setMeta(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to add content');
    }
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Bookmark Archive</h1>
        <button onClick={onSignOut} className="px-4 py-2 bg-gray-100 rounded-lg text-base shadow hover:bg-gray-200 transition">Sign out</button>
      </header>
      {/* Add Bookmark Section */}
      <section className="w-full px-8 py-8 border-b border-gray-100">
        <div className="flex gap-4 w-full max-w-2xl mx-auto">
          <input value={url} onChange={e => setUrl(e.target.value)} className="flex-1 p-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Paste url to preview" />
          <button onClick={preview} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition">Preview</button>
        </div>
        {meta && (
          <div className="mt-6 p-6 rounded-xl bg-white shadow w-full max-w-2xl mx-auto">
            {meta.image && <img src={meta.image} alt={meta.title || 'preview'} className="w-full max-h-64 object-cover rounded mb-4" />}
            <div className="font-bold text-xl mb-2 text-gray-900">{meta.title}</div>
            <div className="text-base text-gray-700 mb-3">{meta.description}</div>
            <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Add</button>
          </div>
        )}
      </section>
      {/* Main Content */}
      <main className="w-full px-8 pb-12">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {items.length === 0 && <div className="text-gray-400 text-lg">No bookmarks yet</div>}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 w-full">
          {items.map((it) => {
            const platform = getPlatform(it.url);
            const logo = platform && PLATFORM_LOGOS[platform] ? PLATFORM_LOGOS[platform] : it.url && getFavicon(it.url) ? getFavicon(it.url) : undefined;
            return (
              <a
                key={it.id || it._id}
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col p-5 rounded-xl shadow bg-white hover:shadow-md gap-3 transition cursor-pointer card mb-8 break-inside-avoid border border-gray-100"
              >
                <div className="flex items-center justify-center w-full">
                  {it.imageUrl || it.image ? (
                    <img src={it.imageUrl || it.image} alt={it.title || it.name} className="w-full object-cover rounded-lg mb-2" />
                  ) : null}
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="font-semibold text-base break-words mb-2 text-gray-900">{it.title || it.name}</div>
                  <div className="text-sm text-gray-600 break-words mb-2 line-clamp-2 max-h-12 overflow-hidden">{it.description}</div>
                  {(it.createdAt || it.updatedAt) && (
                    <div className="mt-auto text-right">
                      <span className="font-medium text-xs text-gray-400">{formatDateTime(it.createdAt || it.updatedAt)}</span>
                    </div>
                  )}
                </div>
                {logo && (
                  <img
                    src={logo}
                    alt={platform || 'favicon'}
                    className="absolute bottom-4 left-4 w-7 h-7 object-contain z-10"
                    title={platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Site favicon'}
                  />
                )}
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
