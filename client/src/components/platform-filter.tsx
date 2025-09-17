interface PlatformFilterProps {
  platforms: string[];
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
}

const PlatformFilter = ({
  platforms,
  selectedPlatforms,
  onPlatformToggle,
}: PlatformFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-4">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onPlatformToggle(platform)}
          className={`
            px-3 py-1 border rounded-full text-sm font-semibold
            ${
              selectedPlatforms.includes(platform)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }
          `}
        >
          {platform}
        </button>
      ))}
    </div>
  );
};

export default PlatformFilter;