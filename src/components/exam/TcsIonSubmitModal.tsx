"use client";

import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

export interface SectionSummaryStat {
  sectionName: string;
  total: number;
  answered: number;
  notAnswered: number;
  markedForReview: number;
  answeredAndMarkedForReview: number;
  notVisited: number;
}

interface TcsIonSubmitModalProps {
  isOpen: boolean;
  isAutoSubmit?: boolean;
  stats: SectionSummaryStat[];
  onConfirm: () => void;
  onCancel: () => void;
  submitting?: boolean;
}

export function TcsIonSubmitModal({
  isOpen,
  isAutoSubmit = false,
  stats,
  onConfirm,
  onCancel,
  submitting = false,
}: TcsIonSubmitModalProps) {
  if (!isOpen) return null;

  const totalQuestions = stats.reduce((acc, s) => acc + s.total, 0);
  const totalAnswered = stats.reduce((acc, s) => acc + s.answered, 0);
  const totalNotAnswered = stats.reduce((acc, s) => acc + s.notAnswered, 0);
  const totalMarked = stats.reduce((acc, s) => acc + s.markedForReview, 0);
  const totalAnsMarked = stats.reduce((acc, s) => acc + s.answeredAndMarkedForReview, 0);
  const totalNotVisited = stats.reduce((acc, s) => acc + s.notVisited, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-gray-300 animate-in zoom-in-95 duration-150">
        <div className="flex items-center space-x-3 mb-4 border-b border-gray-200 pb-3">
          {isAutoSubmit ? (
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          ) : (
            <CheckCircle className="w-7 h-7 text-blue-600" />
          )}
          <h2 className="text-xl font-bold text-gray-800">
            {isAutoSubmit ? "Time Is Up! Submitting Exam..." : "Exam Submission Summary"}
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {isAutoSubmit
            ? "Your examination time has expired. Please review your attempt summary below before final submission."
            : "Review your attempt summary across all sections. Once submitted, you cannot change your responses."}
        </p>

        {/* Section Matrix Table */}
        <div className="overflow-x-auto border border-gray-300 rounded mb-6">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead className="bg-[#1e3a8a] text-white font-semibold">
              <tr>
                <th className="p-2.5 border-r border-blue-800">Section Name</th>
                <th className="p-2.5 border-r border-blue-800 text-center">No. of Questions</th>
                <th className="p-2.5 border-r border-blue-800 text-center bg-green-700">Answered</th>
                <th className="p-2.5 border-r border-blue-800 text-center bg-red-700">Not Answered</th>
                <th className="p-2.5 border-r border-blue-800 text-center bg-purple-700">Marked for Review</th>
                <th className="p-2.5 border-r border-blue-800 text-center bg-purple-900">
                  Ans & Marked (Evaluated)
                </th>
                <th className="p-2.5 text-center bg-gray-600">Not Visited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {stats.map((s) => (
                <tr key={s.sectionName} className="hover:bg-gray-50">
                  <td className="p-2.5 font-bold border-r border-gray-200">{s.sectionName}</td>
                  <td className="p-2.5 text-center border-r border-gray-200 font-semibold">{s.total}</td>
                  <td className="p-2.5 text-center border-r border-gray-200 font-bold text-green-700">
                    {s.answered}
                  </td>
                  <td className="p-2.5 text-center border-r border-gray-200 font-bold text-red-600">
                    {s.notAnswered}
                  </td>
                  <td className="p-2.5 text-center border-r border-gray-200 font-bold text-purple-700">
                    {s.markedForReview}
                  </td>
                  <td className="p-2.5 text-center border-r border-gray-200 font-bold text-purple-900">
                    {s.answeredAndMarkedForReview}
                  </td>
                  <td className="p-2.5 text-center font-bold text-gray-500">{s.notVisited}</td>
                </tr>
              ))}
              {/* Total Summary Row */}
              <tr className="bg-gray-100 font-extrabold text-gray-900 border-t-2 border-gray-300">
                <td className="p-2.5 border-r border-gray-200">TOTAL</td>
                <td className="p-2.5 text-center border-r border-gray-200">{totalQuestions}</td>
                <td className="p-2.5 text-center border-r border-gray-200 text-green-700">{totalAnswered}</td>
                <td className="p-2.5 text-center border-r border-gray-200 text-red-600">{totalNotAnswered}</td>
                <td className="p-2.5 text-center border-r border-gray-200 text-purple-700">{totalMarked}</td>
                <td className="p-2.5 text-center border-r border-gray-200 text-purple-900">{totalAnsMarked}</td>
                <td className="p-2.5 text-center text-gray-600">{totalNotVisited}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800 mb-6">
          <strong>Note:</strong> Questions marked as <em>&quot;Answered and Marked for Review&quot;</em> WILL be evaluated and
          awarded marks according to the JEE Main marking scheme (+4 / -1).
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-2">
          {!isAutoSubmit && (
            <button
              onClick={onCancel}
              disabled={submitting}
              className="py-2.5 px-6 rounded font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              No, Resume Test
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="py-2.5 px-8 rounded font-bold text-sm bg-green-600 hover:bg-green-700 text-white shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Submitting & Scoring...</span>
            ) : (
              <span>Yes, Submit Examination</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
