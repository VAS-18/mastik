import { useEffect, useState, useCallback } from 'react';
import { getAll, getLinkMetadata, addContent, searchContent } from '../api';
import BookmarkCard from '../components/BookmarkCard';
import { debounce } from 'lodash';

export default function Dashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);


  function handleEdit(_id: string) {
    // Placeholder for edit logic (e.g., open modal)
    setMenuOpen(null);
    alert('Edit feature coming soon!');
  }

  function handleDelete(_id: string) {
    // Placeholder for delete logic
    setMenuOpen(null);
    alert('Delete feature coming soon!');
  }

  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAllItems = useCallback(() => {
    if (!token) return;
    getAll(token)
      .then((d) => setItems(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []))
      .catch((err) => setError(err?.message || 'Failed to load items'));
  }, [token]);

  useEffect(() => {
    fetchAllItems();
  }, [fetchAllItems]);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        fetchAllItems();
        setIsSearching(false);
        return;
      }
      try {
        setIsSearching(true);
        const results = await searchContent(token, query);
        setItems(results.search || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to search');
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [token, fetchAllItems]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

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
      setItems((s) => [created.content, ...s]);
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
        <div className="w-full max-w-2xl mx-auto my-8">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {isSearching && <div className="text-gray-400 text-lg w-full text-center">Searching...</div>}
        {!isSearching && items.length === 0 && <div className="text-gray-400 text-lg w-full text-center">No bookmarks found</div>}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 w-full">
          {items.map((it) => (
            <BookmarkCard
              key={it.id || it._id}
              item={it}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
