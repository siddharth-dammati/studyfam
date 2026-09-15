"use client";

import React from "react";
import { X, FileText } from "lucide-react";
import { TestSection } from "@/lib/examDb";

interface TcsIonQuestionPaperModalProps {
  isOpen: boolean;
  sections: TestSection[];
  onClose: () => void;
}

export function TcsIonQuestionPaperModal({
  isOpen,
  sections,
  onClose,
}: TcsIonQuestionPaperModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col border border-gray-300 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white px-6 py-3 rounded-t-lg flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2 font-bold text-base sm:text-lg">
            <FileText className="w-5 h-5 text-blue-200" />
            <span>Complete Question Paper</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-blue-800 rounded-full transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50 text-gray-800">
          {sections.map((sec, secIdx) => (
            <div key={sec.name} className="space-y-6">
              <div className="sticky top-0 z-10 bg-[#e2e8f0] border-y border-gray-300 px-4 py-2 font-extrabold text-sm sm:text-base text-blue-900 uppercase tracking-wide">
                Section {secIdx + 1}: {sec.name} ({sec.questions.length} Questions)
              </div>

              <div className="space-y-6">
                {sec.questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2 text-xs font-bold text-gray-500">
                      <span>Question No. {qIdx + 1}</span>
                      <span>Subject: {q.subject}</span>
                    </div>

                    {/* Question Text */}
                    <div className="text-sm sm:text-[15px] font-medium leading-relaxed whitespace-pre-line text-gray-900">
                      {q.question_text}
                    </div>

                    {/* Images if any */}
                    {q.image_paths && q.image_paths.length > 0 && (
                      <div className="flex flex-wrap gap-3 my-3">
                        {q.image_paths.map((imgUrl, idx) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt={`Diagram ${idx + 1}`}
                            className="max-h-64 max-w-full rounded border border-gray-200 object-contain bg-white"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}

                    {/* Options */}
                    {(q.option_a || q.option_b || q.option_c || q.option_d) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-xs sm:text-sm">
                        {q.option_a && (
                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex items-start space-x-2">
                            <span className="font-bold text-blue-700">(A)</span>
                            <span className="whitespace-pre-line">{q.option_a}</span>
                          </div>
                        )}
                        {q.option_b && (
                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex items-start space-x-2">
                            <span className="font-bold text-blue-700">(B)</span>
                            <span className="whitespace-pre-line">{q.option_b}</span>
                          </div>
                        )}
                        {q.option_c && (
                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex items-start space-x-2">
                            <span className="font-bold text-blue-700">(C)</span>
                            <span className="whitespace-pre-line">{q.option_c}</span>
                          </div>
                        )}
                        {q.option_d && (
                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex items-start space-x-2">
                            <span className="font-bold text-blue-700">(D)</span>
                            <span className="whitespace-pre-line">{q.option_d}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-300 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
