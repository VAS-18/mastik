import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type BookmarkCardProps = {
  title: string;
  platform: string;
  url: string;
  description?: string;
  createdAt: string;
  imageUrl?: string;
};

const BookmarkCard = ({
  title,
  platform,
  url,
  description,
  createdAt,
  imageUrl,
}: BookmarkCardProps) => {
  return (
    <motion.div
      whileHover="hover"
      className="relative w-full rounded-2xl overflow-hidden shadow-md mt-10 cursor-pointer group"
    >
      <motion.div
        variants={{
          hover: { filter: "blur(6px)", scale: 1.05 },
        }}
        transition={{ duration: 0.3 }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="bookmark-image"
            className="w-full h-64 object-cover"
          />
        )}

        <div className="absolute bottom-0 w-full bg-white/30 backdrop-blur-md px-4 py-3">
          <div className="flex gap-2 items-center">
            <img
              src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url}`}
              alt={`${platform} icon`}
              className="w-6 h-6"
            />
            <h2 className="font-bold text-black">{title}</h2>
          </div>
          {description && (
            <p className="text-sm mt-2 truncate text-gray-800">{description}</p>
          )}
        </div>
      </motion.div>

      <motion.a
        href={url}
        target="_blank"
        rel="noreferrer"
        variants={{
          hover: { opacity: 1, scale: 1 },
        }}
        initial={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center bg-white/10"
      >
        <ArrowUpRight className="w-10 h-10 text-white" strokeWidth={2.5} />
      </motion.a>
    </motion.div>
  );
};

export default BookmarkCard;
