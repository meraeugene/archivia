/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { GraduationCap, User, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/auth";
import { toast } from "sonner";
import { useAdviserStore } from "@/store/adviserStore";

interface FormData {
  userId: string;
  password: string;
}

export default function GreenThemedLogin() {
  const { reset } = useAdviserStore();

  // Reset the store when the component mounts
  useEffect(() => {
    reset();
  }, [reset]);

  const [formData, setFormData] = useState<FormData>({
    userId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.userId, formData.password);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* Blurry Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 100%)",
          filter: "blur(100px)",
        }}
      />

      <div className="w-full max-w-6xl h-[90vh] bg-white/10 backdrop-blur-lg  z-10  relative rounded-3xl  border border-gray-200    overflow-hidden flex">
        {/* Left Side - Login */}
        <div className="flex flex-col px-20 py-16   w-[55%]">
          {/* Header */}
          <div className="mb-8 ">
            <div className="flex  mb-6">
              <div className="bg-black/90 p-3 rounded-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-black mb-1">Archivia</h2>
            <p className="text-gray-600">Sign in to your school account</p>
            <div className="border-b border-purple-100 mt-8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School ID */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm text-black font-semibold mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  autoComplete="username"
                  type="text"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-md focus:ring-1 focus:ring-black/80 focus:border-transparent outline-none"
                  placeholder="Enter your school ID"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  autoComplete="current-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 text-black border border-gray-300 rounded-md focus:ring-1 focus:ring-black/80 focus:border-transparent outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 text-white bg-black hover:bg-black/90 py-3 px-4 rounded-md cursor-pointer font-medium disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Need help? Contact{" "}
              <a href="#" className="text-black hover:underline font-medium">
                IT Support
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden  md:flex items-center justify-center w-[45%] ">
          <img
            src="/images/login.jpg"
            alt="Login Illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
