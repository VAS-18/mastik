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

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext must be used within an AppProvider");
  const { setUser, setIsLoggedIn, backendUrl } = ctx;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          err?.response?.data?.message ||
          err?.message ||
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
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Something went wrong.";
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
        <div className="absolute rounded-2xl backdrop-blur-sm inset-0 -z-20 pointer-events-none [background:radial-gradient(145%_140%_at_50%_90%,rgba(0,0,0,0)_45%,#6633ee_130%)]" />
        <div className="bg-gray-700/10  rounded-2xl shadow-xl p-10 border border-gray-100/5 drop-shadow-xl">
          <h1 className="text-2xl flex justify-center font-semibold font-panchang mb-10 text-gray-300">
            Welcome back
          </h1>

          <span className=" text-gray-600 mb-6 flex justify-center font-cabinet font-semibold">
            Login with your email and password
          </span>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <label className="text-sm font-semibold font-cabinet text-gray-300">Email</label> */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 py-3 font-cabinet font-bold rounded-md text-gray-300 border border-gray-800 focus:outline-none bg-gray-900/40"
              required
            />

            {/* <label className="text-sm text-gray-300 font-cabinet font-semibold">Password</label> */}

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
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-4">
            <hr className="flex-1 border-t border-gray-700/30" />
            <span className="text-gray-600 px-2">or</span>
            <hr className="flex-1 border-t border-gray-700/30" />
          </div>

          <div className="flex gap-4">
            <Button
              className="bg-gray-300/5 flex-1 font-cabinet hover:bg-gray-300/10 "
              variant={"default"}
            >
              Google
            </Button>

            <Button
              className="bg-gray-300/5 flex-1 font-cabinet hover:bg-gray-300/10"
              variant={"default"}
            >
              Google
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-300/60 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
