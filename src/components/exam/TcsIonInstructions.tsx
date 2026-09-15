"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Home, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

interface TcsIonInstructionsProps {
  testTitle: string;
  durationMinutes: number;
  totalQuestions: number;
  candidateName?: string;
  onProceed: () => void;
}

export function TcsIonInstructions({
  testTitle,
  durationMinutes,
  totalQuestions,
  candidateName = "Candidate",
  onProceed,
}: TcsIonInstructionsProps) {
  const [agreed, setAgreed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleProceedClick = () => {
    if (!agreed) {
      setShowWarning(true);
    } else {
      onProceed();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-300 shadow-xs px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/exam"
            className="flex items-center space-x-1 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home (/)</span>
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">
            NTA / StudyFAM Online Assessment
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <span className="text-gray-600 hidden sm:inline">Choose Your Default Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-xs sm:text-sm font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <div className="flex items-center space-x-1.5 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            <User className="w-3.5 h-3.5 text-gray-500" />
            <span>{candidateName}</span>
          </div>
        </div>
      </header>

      {/* Main Instructions Content */}
      <main className="max-w-5xl mx-auto w-full bg-white my-6 p-6 sm:p-10 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 tracking-wide uppercase border-b pb-4 mb-6">
          GENERAL INSTRUCTIONS
        </h1>

        <div className="text-center mb-6">
          <span className="inline-block font-bold text-base sm:text-lg text-gray-900 border-b-2 border-blue-600 pb-1">
            Please read the instructions carefully
          </span>
        </div>

        <div className="space-y-6 text-sm sm:text-[15px] leading-relaxed text-gray-800">
          <div>
            <h2 className="font-bold text-base text-gray-900 underline mb-2">General Instructions:</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                Total duration of <strong className="text-blue-900">{testTitle}</strong> is{" "}
                <strong>{durationMinutes} min</strong> ({totalQuestions} questions).
              </li>
              <li>
                The clock will be set at the server. The countdown timer in the top right corner of screen will display
                the remaining time available for you to complete the examination. When the timer reaches zero, the
                examination will end by itself. You will not be required to end or submit your examination.
              </li>
              <li>
                The Questions Palette displayed on the right side of screen will show the status of each question using
                one of the following symbols:
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 ml-2">
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="w-8 h-8 rounded bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-xs shadow-xs">
                      1
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      You have not visited the question yet.
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200">
                    <span
                      className="w-8 h-8 text-white font-bold flex items-center justify-center text-xs shadow-xs"
                      style={{
                        backgroundColor: "#e11d48",
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
                      }}
                    >
                      2
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      You have not answered the question.
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200">
                    <span
                      className="w-8 h-8 text-white font-bold flex items-center justify-center text-xs shadow-xs"
                      style={{
                        backgroundColor: "#16a34a",
                        clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
                      }}
                    >
                      3
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      You have answered the question.
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="w-8 h-8 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      4
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      You have NOT answered the question, but have marked the question for review.
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200 sm:col-span-2">
                    <span className="relative w-8 h-8 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                      5
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      The question(s) <strong>&quot;Answered and Marked for Review&quot;</strong> will be considered for evaluation.
                    </span>
                  </div>
                </div>
              </li>
              <li>
                You can click on the <strong>&quot;&gt;&quot;</strong> arrow which appears to the left of question palette to
                collapse the question palette thereby maximizing the question window. To view the question palette again,
                you can click on <strong>&quot;&lt;&quot;</strong> which appears on the right side of question window.
              </li>
              <li>
                You can click on your &quot;Profile&quot; image on top right corner of your screen to change the language
                during the exam for entire question paper.
              </li>
              <li className="flex items-center gap-2">
                <span>You can click on</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white">
                  <ArrowDown className="w-3.5 h-3.5" />
                </span>
                <span>to navigate to the bottom and</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white">
                  <ArrowUp className="w-3.5 h-3.5" />
                </span>
                <span>to navigate to top of the question area, without scrolling.</span>
              </li>
            </ol>
          </div>

          <div>
            <h2 className="font-bold text-base text-gray-900 underline mb-2">Navigating to a Question:</h2>
            <ol className="list-none space-y-2 pl-2" type="a">
              <li>
                <strong>a.</strong> Click on the question number in the Question Palette at the right of your screen to go
                to that numbered question directly. Note that using this option does <em>NOT</em> save your answer to the
                current question.
              </li>
              <li>
                <strong>b.</strong> Click on <strong>Save & Next</strong> to save your answer for the current question and
                then go to the next question.
              </li>
              <li>
                <strong>c.</strong> Click on <strong>Mark for Review & Next</strong> to save your answer for the current
                question, mark it for review, and then go to the next question.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="font-bold text-base text-gray-900 underline mb-2">Answering a Question:</h2>
            <ol className="list-none space-y-2 pl-2" type="a">
              <li>
                <strong>a.</strong> To select your answer, click on the button of one of the options.
              </li>
              <li>
                <strong>b.</strong> To deselect your chosen answer, click on the button of the chosen option again or
                click on the <strong>Clear Response</strong> button.
              </li>
              <li>
                <strong>c.</strong> To change your chosen answer, click on the button of another option.
              </li>
              <li>
                <strong>d.</strong> To save your answer, you <strong>MUST</strong> click on the <strong>Save & Next</strong>{" "}
                button.
              </li>
              <li>
                <strong>e.</strong> To mark the question for review, click on the <strong>Mark for Review & Next</strong>{" "}
                button.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="font-bold text-base text-gray-900 underline mb-2">Navigating through sections:</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Sections in this question paper are displayed on the top bar of the screen. Questions in a section can
                be viewed by clicking on the section name. The section you are currently viewing is highlighted.
              </li>
              <li>
                After clicking the <strong>Save & Next</strong> button on the last question for a section, you will
                automatically be taken to the first question of the next section.
              </li>
              <li>
                You can shuffle between sections and questions anytime during the examination as per your convenience
                only during the time stipulated.
              </li>
              <li>
                Candidate can view the corresponding section summary as part of the legend that appears in every section
                above the question palette.
              </li>
            </ol>
          </div>

          <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded border border-amber-200">
            Please note all questions will appear in your default language ({selectedLanguage}). This language can be
            changed for a particular question later on.
          </p>
        </div>

        {/* Terms and Proceed Box */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <label className="flex items-start space-x-3 cursor-pointer select-none bg-blue-50/50 p-4 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-gray-700 leading-normal">
              I have read and understood the instructions. All computer hardware allotted to me are in proper working
              condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget
              like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I
              agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test
              and/or to disciplinary action, which may include ban from future Tests / Examinations.
            </span>
          </label>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleProceedClick}
              className="w-full sm:w-72 py-3 px-6 text-center font-bold text-sm tracking-wider uppercase rounded border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-98"
            >
              PROCEED
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
          &copy; All Rights Reserved - National Testing Agency & StudyFAM Exam Engine
        </footer>
      </main>

      {/* TCS iON Authentic Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center border border-gray-200 animate-in zoom-in-95 duration-150">
            {/* Warning Circle Icon matching tcs ion warning.png */}
            <div className="w-20 h-20 rounded-full border-4 border-[#f6c278] flex items-center justify-center mb-5 text-[#f59e0b]">
              <span className="text-4xl font-light select-none">!</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Warning!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Please accept terms and conditions before proceeding.
            </p>

            <button
              onClick={() => setShowWarning(false)}
              className="w-28 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm rounded shadow-sm transition-colors cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
