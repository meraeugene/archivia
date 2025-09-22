import { Camera, Lock, Shield, User } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <main className="max-w-4xl flex-1 ">
      <div className="flex items-center justify-between px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-8 p-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg  border-gray-900 border-l-4 shadow-sm border  overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Update your personal information and profile picture.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <button className="absolute -bottom-1 -right-1 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Profile Picture</h4>
                <p className="text-sm text-gray-500">
                  JPG, GIF or PNG. 1MB max.
                </p>
                <button className="text-sm text-gray-900 font-medium mt-2 hover:underline">
                  Upload new picture
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Anderson"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="john.anderson@university.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={3}
                  defaultValue="Professor of Computer Science with expertise in Machine Learning and Artificial Intelligence. Research focus on deep learning applications in medical imaging."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg border-gray-900 border-l-4  shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Privacy
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account security settings.
            </p>
          </div>

          <div className="p-6 space-y-4">
            <Link
              href="/change-password"
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-500">
                  Update your account password
                </p>
              </div>
              <Lock className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end space-x-3">
          <button className="px-6 cursor-pointer py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 cursor-pointer py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
};

export default page;
