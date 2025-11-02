"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Info, Mail, Loader, BrainCircuit } from "lucide-react";

export default function RetrainModelPage() {
  const [loading, setLoading] = useState(false);

  const handleRetrainExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/retrain-model");
      if (!res.ok) throw new Error("Failed to generate model");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "adviser_prediction_model.pkl";
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Model retraining completed & downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to retrain/export model.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactDeveloper = () => {
    window.location.href = "mailto:villalon.andrew123@gmail.com";
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-900">
          Retrain & Export Model
        </h1>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Info Note */}
        <div className="flex items-start gap-3 bg-blue-50 w-1/2 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          <Info className="w-5 h-5 mt-0.5 text-blue-500 shrink-0" />
          <div>
            <strong>Note:</strong> This process will retrain the adviser
            recommender model and export it as a <strong>.pkl file</strong>.
            <strong> Do not switch pages or refresh the website</strong> while
            retraining—it may take a few minutes.
            <br />
            <p className="mt-2">
              <strong>Important:</strong> To update the system with the new
              model, you must <strong>contact the developer</strong>.
            </p>
          </div>
        </div>

        {/* Contact Developer */}
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

        {/* Retrain & Export Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Model Retraining & Export
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Click the button below to retrain the model and export it as a
            `.pkl` file. This may take a few minutes depending on your data.
          </p>
          <Button
            onClick={handleRetrainExport}
            disabled={loading}
            className={`${
              loading
                ? "cursor-not-allowed opacity-70"
                : "bg-black  text-white hover:bg-gray-800 flex items-center gap-2"
            }`}
          >
            {loading ? (
              <div className="space-x-2 flex items-center">
                <span>Retraining Model</span>
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                <span>Retrain Model</span>
              </div>
            )}
          </Button>
        </section>
      </div>
    </main>
  );
}
