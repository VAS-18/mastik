import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import AppContext from "../context/appContext";
import { Link, useNavigate } from "react-router-dom";
import { API } from "@/lib/api";
import { Squares } from "@/components/ui/squares-background";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext must be used within an AppProvider");
  const { backendUrl } = ctx;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = `${backendUrl}/auth/sign-up`;
    const signUpPromise = API.post(
      url,
      { username, email, password },
      { withCredentials: true }
    );

    toast.promise(signUpPromise, {
      loading: "Signing up...",
      success: (res) => {
        const data = res?.data;
        return data?.message || "Signed up successfully.";
      },
      error: (err) => {
        return (
          err?.response?.data?.message ||
          err?.message ||
          "Unable to sign up. Please try again."
        );
      },
    });

    try {
      const { data } = await signUpPromise;
      // If backend returns user or message you can handle it here.
      // Currently we redirect to login page after success (or still after attempt).
    } catch (err) {
      // errors already handled by toast.promise, but keep console for debug
      // eslint-disable-next-line no-console
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
      // Give user a moment to read toast then navigate to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);
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
        <div className="absolute rounded-2xl backdrop-blur-sm inset-0 -z-20 pointer-events-none [background:radial-gradient(145%_140%_at_50%_90%,rgba(0,0,0,0)_45%,#6633ee_130%)]" />
        <div className="bg-gray-700/10 rounded-2xl shadow-xl p-10 border border-gray-100/5 drop-shadow-xl">
          <h1 className="text-2xl flex justify-center font-semibold font-panchang mb-10 text-gray-300">
            Create an account
          </h1>

          <span className="text-gray-600 mb-6 flex justify-center font-cabinet font-semibold">
            Sign up with your email and password
          </span>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 font-cabinet font-bold rounded-md text-gray-300 border border-gray-800 focus:outline-none bg-gray-900/40"
              required
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 font-cabinet font-bold rounded-md text-gray-300 border border-gray-800 focus:outline-none bg-gray-900/40"
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 font-cabinet font-bold rounded-md text-gray-300 border border-gray-800 focus:outline-none pr-12 bg-gray-900/40"
                required
                aria-label="Password"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((s) => !s)}
                      className="inline-flex items-center justify-center p-1 text-gray-600 hover:text-gray-600"
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
              className="w-full flex items-center justify-center cursor-pointer bg-gray-300/5 hover:bg-gray-300/10 text-gray-300 font-cabinet font-bold py-3 rounded-md transition disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-4">
            <hr className="flex-1 border-t border-gray-700/30" />
            <span className="text-gray-600 px-2">or</span>
            <hr className="flex-1 border-t border-gray-700/30" />
          </div>

          <div className="flex gap-4">
            <Button
              className="bg-gray-300/5 flex-1 font-cabinet hover:bg-gray-300/10"
              variant={"default"}
            >
              Google
            </Button>

            <Button
              className="bg-gray-300/5 flex-1 font-cabinet hover:bg-gray-300/10"
              variant={"default"}
            >
              GitHub
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-300/60 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
