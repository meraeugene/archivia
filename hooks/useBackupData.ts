"use client";

import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";

type BackupData = Record<string, unknown[]>;

const TABLES = [
  "adviser_current_leaders",
  "bookmarks",
  "student_requests",
  "theses",
  "thesis_submissions",
  "user_profiles",
  "users",
];

export function useBackupData() {
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // --- BACKUP ALL TABLES ---
  const handleBackup = async (): Promise<void> => {
    setLoading(true);
    try {
      const backupData: BackupData = {};

      for (const table of TABLES) {
        const {
          data,
          error,
        }: { data: unknown[] | null; error: PostgrestError | null } =
          await supabase.from(table).select("*");

        if (error)
          toast.error(`Failed to fetch table ${table}: ${error.message}`);

        backupData[table] = data ?? [];
      }

      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `supabase-backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Backup downloaded successfully!");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Backup failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- RESTORE FROM FILE ---
  const handleRestore = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const text = await file.text();
      const jsonData: BackupData = JSON.parse(text);

      for (const table of TABLES) {
        const tableData = jsonData[table];
        if (!Array.isArray(tableData) || tableData.length === 0) continue;

        const { error }: { error: PostgrestError | null } = await supabase
          .from(table)
          .insert(tableData);

        if (error) {
          toast.warning(`⚠️ Skipping table ${table}: ${error.message}`);
          continue;
        }
      }

      toast.success("Backup restored successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore backup file.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // --- CONTACT DEVELOPER ---
  const handleContactDeveloper = (): void => {
    window.location.href = "mailto:villalon.andrew123@gmail.com";
  };

  return {
    loading,
    handleBackup,
    handleRestore,
    handleContactDeveloper,
  };
}
