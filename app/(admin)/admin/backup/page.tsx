"use client";

import { Button } from "@/components/ui/button";
import { useBackupData } from "@/hooks/useBackupData";
import { AlertTriangle, Lock, Mail } from "lucide-react";

export default function Page() {
  const { handleBackup, handleRestore, handleContactDeveloper, loading } =
    useBackupData();

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-900">Backup & Recovery</h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/*  Warning Note */}
        <div className="flex items-start gap-3 bg-yellow-50 w-1/2 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-sm">
          <AlertTriangle className="w-5 h-5 mt-0.5 text-yellow-500 shrink-0" />
          <div>
            <strong>Important Note:</strong> Restoring data will directly insert
            records into your database and{" "}
            <strong>may overwrite existing or conflicting entries</strong>. Only
            perform restoration with a valid and verified backup file. If
            unsure, contact the developer for assistance.
          </div>
        </div>

        {/*  Contact Developer */}
        <div>
          <Button
            variant="outline"
            onClick={handleContactDeveloper}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Developer
          </Button>
        </div>

        {/* Backup Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Database Backup
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Download all data from your key tables as a JSON file.
          </p>
          <Button
            onClick={handleBackup}
            disabled={loading}
            className="bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Backing up..." : "Download Full Backup"}
          </Button>
        </section>

        {/* Restore Section */}
        <section className="pt-6 border-t opacity-60 cursor-not-allowed select-none">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Database Recovery
            </h2>
            <Lock className="w-5 h-5 text-gray-500" />
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Recovery is currently <strong>locked</strong> to prevent accidental
            data loss. Only the developer can enable this feature for safety
            reasons.
          </p>

          <div className="flex flex-col gap-2 max-w-sm">
            <input
              type="file"
              disabled
              onChange={handleRestore}
              className="border rounded p-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
            />
            <Button
              disabled
              className="bg-gray-300 text-gray-600 cursor-not-allowed flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Locked
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
