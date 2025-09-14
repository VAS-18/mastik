
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <title>404 Not Found</title>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg">Oops! Page not found.</p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
