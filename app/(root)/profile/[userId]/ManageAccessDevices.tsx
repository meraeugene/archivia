"use client";

// import { removeSession, signOutAllDevices } from "@/actions/auth/sessions";
import { UserSession } from "@/types/userSession";
import {
  //   AlertTriangle,
  //   LogOut,
  Clock,
  MapPin,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
// import { useState, useTransition } from "react";

const ManageAccessDevices = ({ sessions }: { sessions: UserSession[] }) => {
  //   const [showSignOutAll, setShowSignOutAll] = useState(false);
  //   const [isPending, startTransition] = useTransition();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-5 h-5" />;
      case "tablet":
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };
  const getTimeAgo = (date: string | number | Date) => {
    const now = new Date().getTime();
    const past = new Date(date).getTime();

    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  //   const handleRemoveSession = (id: string, current: boolean) => {
  //     startTransition(async () => {
  //       await removeSession(id, current);
  //     });
  //   };

  //   const handleSignOutAll = () => {
  //     startTransition(async () => {
  //       await signOutAllDevices();
  //       setShowSignOutAll(false);
  //     });
  //   };

  return (
    <div className="md:mt-16 mt-12 ">
      <div className="mb-12">
        <h1 className="text-2xl uppercase md:text-4xl font-black tracking-tight  text-white mb-3">
          View Accessed Devices
        </h1>
        <p className="text-slate-400">
          View devices that have accessed your account.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="border border-slate-700/50 p-4 md:p-6  hover:border-slate-600/50 transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
              {/* Device Info */}
              <div className="flex items-start  gap-4 flex-1">
                <div className="p-3 bg-slate-700/50 rounded-sm text-slate-300 flex-shrink-0">
                  {getDeviceIcon(s.device_type ?? "desktop")}
                </div>

                <div className="flex-1">
                  {/*  Device Name and Logged in Track */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h3 className="text-white font-semibold break-words">
                      {s.device}
                    </h3>

                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border w-fit ${
                        s.logged_in
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {s.logged_in ? "Logged In" : "Logged Out"}
                    </span>
                  </div>

                  {/* Location and Last Active */}
                  <div className="space-y-1.5 text-sm text-slate-400 flex flex-col ">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      {s.location && (
                        <span className="truncate">{s.location}</span>
                      )}
                    </div>
                    <div className="flex md:items-center gap-2 flex-col md:flex-row">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Active{" "}
                          {s.last_active
                            ? getTimeAgo(s.last_active)
                            : "Unknown"}
                        </span>
                      </div>
                      <span className="text-slate-500 hidden sm:inline">•</span>
                      <span className="text-slate-500 truncate">
                        {s.last_active
                          ? new Date(s.last_active).toLocaleString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              {/* {!s.is_current && (
                <button
                  className="mt-3 md:mt-0 flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/20 bg-red-500/10 cursor-pointer rounded transition-colors duration-200"
                  onClick={() => handleRemoveSession(s.id, s.is_current)}
                  disabled={isPending}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing out...</span>
                      </div>
                    ) : (
                      "Sign Out"
                    )}
                  </span>
                </button>
              )} */}
            </div>
          </div>
        ))}
      </div>

      {/* {sessions.length > 1 && (
        <div className="border border-slate-700/50  p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                Sign Out All Other Devices
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                This will sign you out from all devices except your current
                session. You&rsquo;ll need to sign in again on those devices.
              </p>
              {!showSignOutAll ? (
                <button
                  onClick={() => setShowSignOutAll(true)}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded font-medium  cursor-pointer transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out All Devices
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSignOutAll}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-700 rounded text-white font-medium cursor-pointer transition-colors duration-200"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing out...</span>
                      </div>
                    ) : (
                      "Confirm Sign Out"
                    )}
                  </button>
                  <button
                    onClick={() => setShowSignOutAll(false)}
                    className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded text-white cursor-pointer font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ManageAccessDevices;
