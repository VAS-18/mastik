import { useState } from "react";
import { Input } from "./ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center mb-6 justify-center"
    >
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="relative border rounded-l-md p-2 text-white focus:outline-none bg-gray-900/40 w-80 border-gray-700/10"
      />
    </form>
  );
};

export default SearchBar;
