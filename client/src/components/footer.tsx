const Footer = () => {
  return (
    <footer className="relative flex flex-col items-center justify-center">
      <span className="absolute inset-0 flex items-center justify-center font-panchang font-bold text-gray-300 text-9xl pointer-events-none select-none">
        MASTIK
      </span>
      <div className="relative z-10 w-full h-44 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-lg text-white px-6 py-4 text-center">
        this is a footer
      </div>
    </footer>
  );
};

export default Footer;
