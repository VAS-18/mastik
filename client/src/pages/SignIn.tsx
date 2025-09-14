import { Button } from "@/components/ui/button";
import AppContext from "../context/appContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "@/lib/api";

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext must be used within an AppProvider");
  const { setUser, setIsLoggedIn, backendUrl } = ctx;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${backendUrl}/auth/sign-in`;

      const { data } = await API.post(
        url,
        { email, password },
        { withCredentials: true }
      );

      if (data?.user) {
        setUser(data.user.username);
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        setError(data?.message || "Signed in but no user info returned.");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || `Error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="bg-red-500 font-extrabold">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant={"ghost"} type="submit">
          Sign in
        </Button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;
