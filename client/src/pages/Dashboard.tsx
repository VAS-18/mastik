import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api";

interface DashboardItem {
  _id: string;
  contentType: string;
  title: string;
  isPublic: boolean;
  platform: string;
  url: string;
  description: string;
  imageUrl: string;
  shareId: string;
  createdAt: string;
  updatedAt: string;
}

function Dashboard() {
  const [dashData, setDashData] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard(); // raw API response
        console.log("API response:", data); // inspect API response immediately

        // Normalize: ensure dashData is always an array
        const normalized = Array.isArray(data) ? data : [data];
        setDashData(normalized);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Optional: log whenever dashData actually changes (after React updates state)
  useEffect(() => {
    console.log("dashData state updated:", dashData);
  }, [dashData]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">Welcome to your dashboard!</p>

      <div>
        {dashData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashData.map((item) => (
              <a
                href={item.url}
                key={item._id}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 truncate" title={item.title}>{item.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden text-ellipsis">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-semibold capitalize bg-gray-200 px-2 py-1 rounded">{item.platform}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 border rounded bg-gray-50">
            <p className="text-gray-500">No dashboard data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
