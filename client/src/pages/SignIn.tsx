import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import AppContext from "../context/appContext";
import { Link, useNavigate } from "react-router-dom";
import { API } from "@/lib/api";
import { Squares } from "@/components/ui/squares-background";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext must be used within an AppProvider");
  const { setUser, setIsLoggedIn, backendUrl } = ctx;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = `${backendUrl}/auth/sign-in`;
    const loginPromise = API.post(
      url,
      { email, password },
      { withCredentials: true }
    );

    toast.promise(loginPromise, {
      loading: "Signing in...",
      success: (res) => {
        const data = res?.data;
        return data?.user
          ? `Welcome back, ${data.user.username}!`
          : data?.message || "Signed in (no user info returned).";
      },
      error: (err) => {
        return (
          err?.response?.data?.message || err?.message ||
          "Unable to sign in. Please try again."
        );
      },
    });

    try {
      const { data } = await loginPromise;

      if (data?.user) {
        setUser(data.user.username);
        setIsLoggedIn(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        const msg = data?.message || "Signed in but no user info returned.";
        setError(msg);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Squares
        direction="up"
        speed={0.1}
        squareSize={50}
        borderColor="#333"
        hoverFillColor="#2222"
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-extrabold mb-4 text-gray-900">
            Welcome Back
          </h1>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="something@justlike.this"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <label className="text-sm font-medium">Password</label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
                required
                aria-label="Password"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((s) => !s)}
                      className="inline-flex items-center justify-center p-1 text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {showPassword ? "Hide password" : "Show password"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Button
              type="submit"
              variant={"default"}
              className="w-full flex items-center justify-center cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
