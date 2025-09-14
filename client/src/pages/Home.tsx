
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>This is home route</h1>
      <nav>
        <Link to="/login">Login</Link>
        <br />
        <Link to="/signup">Sign Up</Link>
      </nav>
    </div>
  );
}

export default Home;
