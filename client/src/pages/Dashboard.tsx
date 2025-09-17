import { useEffect, useMemo, useState } from "react";
import { getDashboard, search } from "@/lib/api";
import BookmarkCard from "@/components/bookmark-card";
import type { DashboardItem } from "@/types";
import SearchBar from "@/components/search-bar";
import PlatformFilter from "@/components/platform-filter";

const Dashboard = () => {
  const [allItems, setAllItems] = useState<DashboardItem[]>([]);
  const [filteredData, setFilteredData] = useState<DashboardItem[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const fetchAllData = async () => {
    const res = await getDashboard();
    setAllItems(res.data);
    setFilteredData(res.data);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSearch = async (query: string) => {
    setSelectedPlatforms([]); 
    if (!query) {
      fetchAllData();
      return;
    }
    const res = await search(query);
    if (res && res.search) {
      setAllItems(res.search);
      setFilteredData(res.search);
    }
  };

  const platforms = useMemo(
    () => Array.from(new Set(allItems.map((item) => item.platform))),
    [allItems]
  );

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  useEffect(() => {
    if (selectedPlatforms.length === 0) {
      setFilteredData(allItems);
    } else {
      setFilteredData(
        allItems.filter((item) => selectedPlatforms.includes(item.platform))
      );
    }
  }, [selectedPlatforms, allItems]);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">This is the Dashboard</h1>
      <div className="flex justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>
      <PlatformFilter
        platforms={platforms}
        selectedPlatforms={selectedPlatforms}
        onPlatformToggle={handlePlatformToggle}
      />
      <section
        className="
          columns-1 sm:columns-2 md:columns-3 lg:columns-4
          m-10
        "
      >
        {filteredData.map((item) => (
          <BookmarkCard key={item._id} {...item} />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
