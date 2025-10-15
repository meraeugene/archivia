import { create } from "zustand";
import { persist } from "zustand/middleware";
import CryptoJS from "crypto-js";
import { Adviser, StudentData } from "@/types/advisers";

const SECRET_KEY = process.env.NEXT_PUBLIC_ZUSTAND_SECRET_KEY!;

interface AdviserState {
  studentData: StudentData;
  recommendations: Adviser[];
  setStudentData: (data: StudentData) => void;
  setRecommendations: (recs: Adviser[]) => void;
  reset: () => void;
}

export const useAdviserStore = create<AdviserState>()(
  persist(
    (set) => ({
      studentData: { title: "", abstract: "" },
      recommendations: [],
      setStudentData: (data) => set({ studentData: data }),
      setRecommendations: (recs) => set({ recommendations: recs }),
      reset: () => {
        set({ studentData: { title: "", abstract: "" }, recommendations: [] });
        // also clear localStorage entry
        localStorage.removeItem("adviser-storage");
      },
    }),
    {
      name: "adviser-storage",
      storage: {
        getItem: (name) => {
          try {
            const encrypted = localStorage.getItem(name);
            if (!encrypted) return null;

            // Decrypt and decode
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            // Handle invalid decryption
            if (!decrypted) {
              console.warn("Decryption failed: possibly invalid key or data.");
              localStorage.removeItem(name);
              return null;
            }

            return JSON.parse(decrypted);
          } catch (e) {
            console.error("Failed to decrypt persisted data", e);
            localStorage.removeItem(name); // prevent recurring errors
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const stringified = JSON.stringify(value);
            const encrypted = CryptoJS.AES.encrypt(
              stringified,
              SECRET_KEY
            ).toString();
            localStorage.setItem(name, encrypted);
          } catch (e) {
            console.error("Failed to encrypt persisted data", e);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
