import { useEffect, useMemo, useState } from "react";
import { getDashboard, search } from "@/lib/api";
import BookmarkCard from "@/components/bookmark-card";
import type { DashboardItem } from "@/types";
import SearchBar from "@/components/search-bar";
import PlatformFilter from "@/components/platform-filter";
import { Separator } from "@radix-ui/react-separator";

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
    // Full-screen layout: prevent body scroll; internal section scrolls
    <main className="h-screen overflow-hidden flex flex-col bg-black">
      {/* Top (static) area - stays visible while scrolling */}
      <header className="sticky top-0 w-full px-24 py-10 z-20 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <h1 className="text-2xl font-bold font-panchang text-gray-300 mb-6">
          VALUT
        </h1>

        <div className="flex justify-center mb-6 gap-10">
          <SearchBar onSearch={handleSearch} />
          <PlatformFilter
          platforms={platforms}
          selectedPlatforms={selectedPlatforms}
          onPlatformToggle={handlePlatformToggle}
        />
        </div>

      </header>

      {/* Scrollable bookmark area */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <section
          className="
            columns-1 sm:columns-2 md:columns-3 lg:columns-4
            p-10
            bg-black
            min-h-[200px]
          "
        >
          {filteredData.map((item) => (
            <BookmarkCard key={item._id} {...item} />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
