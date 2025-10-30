"use client";

import { SendHorizonal, FileText } from "lucide-react";
import { StudentRequest } from "@/types/studentRequests";
import { useState, useEffect } from "react";

interface ResendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { title: string; abstract: string; url: string }) => void;
  request?: StudentRequest | null;
  isPending?: boolean;
}

const ResendModal = ({
  isOpen,
  onClose,
  onConfirm,
  request,
  isPending = false,
}: ResendModalProps) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (request) {
      setTitle(request.title || "");
      setAbstract(request.abstract || "");
      setUrl(request.thesis_url || "");
    }
  }, [request]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm ">
      <div className="bg-white rounded-2xl p-8 max-w-2xl  w-full shadow-2xl border border-gray-200  ">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-black">Send Request Again</h3>
          <p className="text-gray-600 text-sm mt-2">
            You can update your thesis title or abstract before resending.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thesis Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
              placeholder="Enter your thesis title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abstract
            </label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={14}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black/70"
              placeholder="Enter your thesis abstract"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70"
              placeholder="Enter a URL related to your thesis (e.g., Google Drive link)"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() => onConfirm({ title, abstract, url })}
            className="flex-1 cursor-pointer px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <SendHorizonal size={18} />
                <span>Send Again</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendModal;
