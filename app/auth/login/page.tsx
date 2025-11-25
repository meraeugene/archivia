/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAdviserStore } from "@/store/adviserStore";
import { login } from "@/actions/auth/login";
import Link from "next/link";
import GridOverlay from "@/components/GridOverlay";

interface FormData {
  userId: string;
  password: string;
}

export default function Login() {
  const { reset } = useAdviserStore();

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

    const sanitizedUserId = formData.userId.trim();
    const sanitizedPassword = formData.password.trim();

    if (!sanitizedUserId) {
      toast.error("Username is required");
      return;
    }

    if (!sanitizedPassword) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const result = await login(sanitizedUserId, sanitizedPassword);
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
    <div className="min-h-screen flex items-center justify-center md:px-6 bg-gray-50  relative">
      <GridOverlay />

      <div className="w-full md:max-w-6xl h-screen flex flex-col   md:h-[90vh] bg-white   z-10  relative md:rounded-3xl  md:border border-gray-200 md:flex-row     overflow-hidden md:flex items-center justify-center ">
        {/* Left Side - Login */}
        <div className="flex flex-col w-full px-8  md:px-10 lg:px-20 md:py-34    md:w-1/2">
          {/* Header */}
          <div className="mb-4 ">
            <div className="flex items-center justify-center md:mb-18 mb-4">
              <img
                src="/images/logo.png"
                alt="Archivia Logo"
                className="h-13 object-cover"
              />
              <h2 className="text-4xl font-bold tracking-wide  uppercase">
                rchivia
              </h2>
            </div>
            <p className="text-gray-600 text-center">
              Sign in to your school account
            </p>
            <div className="border-b border-gray-100 mt-4" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:space-y-6 space-y-4 ">
            {/* School ID */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm text-black font-semibold mb-2"
              >
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  autoComplete="username"
                  type="text"
                  placeholder="School ID"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className=" outline-none w-full pl-10 pr-4 py-3  border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
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
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  id="password"
                  autoComplete="current-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  value={formData.password}
                  onChange={handleInputChange}
                  className=" outline-none w-full pl-10 pr-4 py-3  border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition-all duration-300 hover:border-gray-300"
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
              className="w-full mt-7 md:mt-2 text-white bg-black hover:bg-black/90 py-3 px-4 rounded-md cursor-pointer font-medium disabled:opacity-80 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6 flex flex-col gap-2 ">
            <Link
              className="text-sm text-black hover:underline font-medium"
              href="/auth/forgot-password"
            >
              Forgotten your password?
            </Link>
            <p className="text-sm text-gray-600 ">
              Need help? Contact{" "}
              <a
                href="mailto:capstone.archivia@gmail.com"
                className="text-black hover:underline font-medium"
              >
                IT Support
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden  md:flex items-center justify-center md:w-1/2 h-full   ">
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
