"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Save,
  RotateCcw,
  ExternalLink,
  Search,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Lock,
  ArrowLeft,
  X,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Eye,
  Filter,
  Check,
  ChevronDown,
  CheckSquare,
  Square,
  Sliders,
  Award,
  Zap,
} from "lucide-react";
import { TestDetail, QuestionRecord, TestSummary } from "@/lib/examDb";
import { formatQuestionText, formatOptionText, formatSolutionText } from "@/lib/questionFormatter";
import { MathRenderer } from "@/components/exam/MathRenderer";

interface FilterMetadata {
  subjects: string[];
  chapters: Record<string, string[]>;
  difficulties: string[];
  questionTypes: string[];
  stats?: {
    total: number;
    physics_count: number;
    chemistry_count: number;
    math_count: number;
    mcq_count: number;
    numerical_count: number;
    with_images_count: number;
  };
}

export interface AdminExamManagerProps {
  embedded?: boolean;
  externalPasscode?: string;
  initialTestId?: string;
  onNavigateHome?: () => void;
}

export default function AdminExamManagerPage({
  embedded = false,
  externalPasscode,
  initialTestId,
  onNavigateHome,
}: AdminExamManagerProps = {}) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Available Tests State
  const [activePaperSummary, setActivePaperSummary] = useState<any>(null);
  const [mftSuite, setMftSuite] = useState<any[]>([]);
  const [customMocks, setCustomMocks] = useState<TestSummary[]>([]);
  const [fullMocks, setFullMocks] = useState<TestSummary[]>([]);
  const [chapterTests, setChapterTests] = useState<TestSummary[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId || "active");

  // Loaded Test Detail
  const [currentTest, setCurrentTest] = useState<TestDetail | null>(null);
  const [isTestSelectorModalOpen, setIsTestSelectorModalOpen] = useState(false);
  const [testSearchFilter, setTestSearchFilter] = useState("");

  // Filter Metadata from 9,395 questions bank
  const [filterMeta, setFilterMeta] = useState<FilterMetadata>({
    subjects: ["Physics", "Chemistry", "Mathematics"],
    chapters: { Physics: [], Chemistry: [], Mathematics: [] },
    difficulties: ["Easy", "Medium", "Hard"],
    questionTypes: ["MCQ", "NUMERICAL"],
  });

  // Active View Subject & Section filters
  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [activeSectionFilter, setActiveSectionFilter] = useState<"ALL" | "MCQ" | "NUMERICAL">("ALL");

  // Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState<{
    question: QuestionRecord;
    sectionName: string;
    index: number;
  } | null>(null);

  // Database Question Bank Selector State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<{ sectionName: string; index: number; question: QuestionRecord } | null>(null);
  const [bankSubject, setBankSubject] = useState<string>("Physics");
  const [bankChapter, setBankChapter] = useState<string>("ALL");
  const [bankType, setBankType] = useState<string>("ALL");
  const [bankDifficulty, setBankDifficulty] = useState<string>("ALL");
  const [bankHasImage, setBankHasImage] = useState<boolean | null>(null);
  const [bankQuery, setBankQuery] = useState<string>("");
  const [bankResults, setBankResults] = useState<any[]>([]);
  const [bankTotal, setBankTotal] = useState<number>(0);
  const [isSearchingBank, setIsSearchingBank] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string>>(new Set());

  // Create New Mock Test Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestCode, setNewTestCode] = useState("");
  const [newTestDuration, setNewTestDuration] = useState(180);
  const [newTestPreset, setNewTestPreset] = useState<"NTA_75" | "EMPTY" | "CLONE_ACTIVE">("NTA_75");

  // Mount: Check saved passcode or externalPasscode
  useEffect(() => {
    const saved = externalPasscode || sessionStorage.getItem("sf_admin_passcode");
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
  }, [externalPasscode]);

  // Handle external test selection change
  useEffect(() => {
    if (initialTestId && initialTestId !== selectedTestId && isAuthenticated) {
      loadSpecificTest(initialTestId);
    }
  }, [initialTestId, isAuthenticated]);

  const verifyAndLoad = async (codeToTest: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      // 1. Check access & load filter metadata
      const filterRes = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": codeToTest,
        },
        body: JSON.stringify({ action: "get_filters" }),
      });
      const filterData = await filterRes.json();
      if (!filterData.success) {
        setIsAuthenticated(false);
        setStatusMessage({ type: "error", text: filterData.error || "Incorrect admin passcode." });
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("sf_admin_passcode", codeToTest);
      setFilterMeta({
        subjects: filterData.subjects || ["Physics", "Chemistry", "Mathematics"],
        chapters: filterData.chapters || {},
        difficulties: filterData.difficulties || ["Easy", "Medium", "Hard"],
        questionTypes: filterData.questionTypes || ["MCQ", "NUMERICAL"],
        stats: filterData.stats,
      });

      // 2. Load test catalog
      await refreshTestsList(codeToTest);

      // 3. Load active or requested initial test
      const testToLoad = initialTestId || "active";
      await loadSpecificTest(testToLoad, codeToTest);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to connect to admin API" });
    } finally {
      setLoading(false);
    }
  };

  const refreshTestsList = async (code = passcode) => {
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": code,
        },
        body: JSON.stringify({ action: "list_tests" }),
      });
      const data = await res.json();
      if (data.success) {
        setActivePaperSummary(data.activePaper);
        setMftSuite(data.mftSuite || []);
        setCustomMocks(data.customMocks || []);
        setFullMocks(data.fullMocks || []);
        setChapterTests(data.chapterTests || []);
      }
    } catch (e) {
      console.error("Error refreshing tests list:", e);
    }
  };

  const loadSpecificTest = async (testId: string, code = passcode) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": code,
        },
        body: JSON.stringify({ action: "get_test", id: testId }),
      });
      const data = await res.json();
      if (data.success && data.test) {
        setCurrentTest(data.test);
        setSelectedTestId(testId);
        // Default active subject to first section name
        if (data.test.sections?.length > 0) {
          const firstSec = data.test.sections[0].name;
          if (["Physics", "Chemistry", "Mathematics"].includes(firstSec)) {
            setActiveSubject(firstSec as any);
          }
        }
      } else {
        setStatusMessage({ type: "error", text: data.error || `Failed to load test ${testId}` });
      }
    } catch (e: any) {
      setStatusMessage({ type: "error", text: e.message || "Failed to load test" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyAndLoad(passcode.trim());
  };

  // Save current test
  const handleSaveTest = async (makeActive = false) => {
    if (!currentTest) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          action: "save_test",
          test: currentTest,
          makeActive: makeActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: makeActive
            ? `Successfully saved and set '${currentTest.title}' as the LIVE ACTIVE exam!`
            : `Successfully saved '${currentTest.title}' (${currentTest.total_questions} questions)!`,
        });
        await refreshTestsList();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save test" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error while saving" });
    } finally {
      setSaving(false);
    }
  };

  // Set any test as Active Exam
  const handleSetActiveExam = async (testId: string) => {
    if (!confirm(`Are you sure you want to set this test as the active mock test for all students?`)) {
      return;
    }
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          action: "set_active",
          id: testId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: data.message });
        await refreshTestsList();
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to activate test" });
      }
    } catch (e: any) {
      setStatusMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Delete Custom Test
  const handleDeleteTest = async (testId: string) => {
    if (!confirm(`Are you sure you want to permanently delete custom test '${testId}'?`)) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          action: "delete_test",
          id: testId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: "Custom test deleted." });
        await refreshTestsList();
        if (selectedTestId === testId) {
          await loadSpecificTest("active");
        }
      }
    } catch (e: any) {
      setStatusMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Create New Mock Test
  const handleCreateTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    const testId = `custom_mock_${newTestTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .slice(0, 30)}_${Date.now().toString().slice(-4)}`;

    let baseSections: any[] = [];

    if (newTestPreset === "CLONE_ACTIVE" && currentTest) {
      baseSections = JSON.parse(JSON.stringify(currentTest.sections));
    } else {
      // Create standard 3 sections: Physics, Chemistry, Mathematics
      const subjs = ["Physics", "Chemistry", "Mathematics"];
      baseSections = subjs.map((s) => ({
        name: s,
        questions: [],
      }));

      if (newTestPreset === "NTA_75") {
        // Clone from current active test or fill 25 template slots
        if (activePaperSummary) {
          try {
            const activeDataRes = await fetch("/api/admin/exam", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
              body: JSON.stringify({ action: "get_test", id: "active" }),
            });
            const activeData = await activeDataRes.json();
            if (activeData.success && activeData.test?.sections) {
              baseSections = activeData.test.sections;
            }
          } catch {}
        }
      }
    }

    const totalQ = baseSections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

    const newTest: TestDetail = {
      id: testId,
      title: newTestTitle.trim(),
      source_file: testId,
      total_questions: totalQ,
      duration_minutes: newTestDuration || 180,
      marks_per_question: 4,
      negative_marks: 1,
      sections: baseSections,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
        body: JSON.stringify({ action: "save_test", test: newTest }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setNewTestTitle("");
        setNewTestCode("");
        await refreshTestsList();
        await loadSpecificTest(testId);
        setStatusMessage({ type: "success", text: `Created test '${newTest.title}'! Now you can curate questions.` });
      }
    } catch (e: any) {
      setStatusMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Search Question Bank (with 4-way Subject, Type, Difficulty, Chapter filtering)
  const searchQuestionBank = async (overrideParams?: {
    subject?: string;
    chapter?: string;
    questionType?: string;
    difficulty?: string;
    hasImage?: boolean | null;
    q?: string;
  }) => {
    setIsSearchingBank(true);
    const subj = overrideParams?.subject !== undefined ? overrideParams.subject : bankSubject;
    const chap = overrideParams?.chapter !== undefined ? overrideParams.chapter : bankChapter;
    const qType = overrideParams?.questionType !== undefined ? overrideParams.questionType : bankType;
    const diff = overrideParams?.difficulty !== undefined ? overrideParams.difficulty : bankDifficulty;
    const imgFilter = overrideParams?.hasImage !== undefined ? overrideParams.hasImage : bankHasImage;
    const queryStr = overrideParams?.q !== undefined ? overrideParams.q : bankQuery;

    try {
      const res = await fetch("/api/admin/exam/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          subject: subj === "ALL" ? "" : subj,
          chapter: chap === "ALL" ? "" : chap,
          questionType: qType,
          difficulty: diff,
          hasImage: imgFilter,
          q: queryStr,
          limit: 30,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setBankResults(data.questions);
        setBankTotal(data.total || data.questions.length);
      } else {
        setBankResults([]);
        setBankTotal(0);
      }
    } catch (e) {
      console.error("Error searching question bank:", e);
      setBankResults([]);
      setBankTotal(0);
    } finally {
      setIsSearchingBank(false);
    }
  };

  // Open Bank Selector targeting a slot replacement
  const handleOpenBankForSlot = (secName: string, index: number, question: QuestionRecord) => {
    setTargetSlot({ sectionName: secName, index, question });
    setSelectedBatchIds(new Set());
    const initialSubj = question.subject || secName || "Physics";
    setBankSubject(initialSubj);
    setBankChapter(question.chapter || "ALL");
    setBankType(question.option_a ? "MCQ" : "NUMERICAL");
    setBankDifficulty("ALL");
    setBankHasImage(null);
    setBankQuery("");
    setIsBankModalOpen(true);
    searchQuestionBank({
      subject: initialSubj,
      chapter: question.chapter || "ALL",
      questionType: question.option_a ? "MCQ" : "NUMERICAL",
      difficulty: "ALL",
      hasImage: null,
      q: "",
    });
  };

  // Open Bank Selector for browsing & batch addition
  const handleOpenBankForBrowsing = () => {
    setTargetSlot(null);
    setSelectedBatchIds(new Set());
    setBankSubject(activeSubject);
    setBankChapter("ALL");
    setBankType("ALL");
    setBankDifficulty("ALL");
    setBankHasImage(null);
    setBankQuery("");
    setIsBankModalOpen(true);
    searchQuestionBank({
      subject: activeSubject,
      chapter: "ALL",
      questionType: "ALL",
      difficulty: "ALL",
      hasImage: null,
      q: "",
    });
  };

  // Canonical Answer Normalizer to guarantee clean 'A' | 'B' | 'C' | 'D'
  const normalizeCorrectAnswer = (
    rawAns: any,
    isMcq: boolean,
    optA?: string | null,
    optB?: string | null,
    optC?: string | null,
    optD?: string | null
  ): string => {
    if (!rawAns) return isMcq ? "A" : "0";
    const str = String(rawAns).trim();
    if (!isMcq) {
      if (!str || str === "—" || str === "----") return "0";
      return str;
    }
    const upper = str.toUpperCase();
    if (["A", "B", "C", "D"].includes(upper)) return upper;
    if (upper === "1" || upper === "(A)" || upper === "OPTION A" || upper === "OPTION 1") return "A";
    if (upper === "2" || upper === "(B)" || upper === "OPTION B" || upper === "OPTION 2") return "B";
    if (upper === "3" || upper === "(C)" || upper === "OPTION C" || upper === "OPTION 3") return "C";
    if (upper === "4" || upper === "(D)" || upper === "OPTION D" || upper === "OPTION 4") return "D";

    // Text match with options
    const norm = str.toLowerCase();
    const opts = [optA, optB, optC, optD].map((o) => (o || "").toLowerCase().trim());
    const matchIdx = opts.findIndex((o) => o && (o === norm || o.includes(norm) || norm.includes(o)));
    if (matchIdx >= 0) {
      return ["A", "B", "C", "D"][matchIdx];
    }
    return "A";
  };

  // Reset Current Test (either active default or MFT to original source)
  const handleResetCurrentTest = async () => {
    const isMft = selectedTestId.startsWith("MFT-");
    const promptText = isMft
      ? `Are you sure you want to reset '${currentTest?.title}' to its original source PDF questions? Any customizations you saved will be cleared.`
      : `Are you sure you want to reset this test back to the default questions?`;
    if (!confirm(promptText)) return;

    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          action: "reset",
          id: selectedTestId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: data.message || "Test reset to original version." });
        await refreshTestsList();
        await loadSpecificTest(selectedTestId);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to reset test." });
      }
    } catch (e: any) {
      setStatusMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Apply Question from Bank into Target Slot
  const handleApplyBankQuestionToSlot = (dbQ: any) => {
    if (!currentTest || !targetSlot) return;

    const isMcq = dbQ.type === "MCQ" || Boolean((dbQ.optionA && dbQ.optionA.length > 0) || (dbQ.option_a && dbQ.option_a.length > 0));
    const optA = dbQ.optionA || dbQ.option_a;
    const optB = dbQ.optionB || dbQ.option_b;
    const optC = dbQ.optionC || dbQ.option_c;
    const optD = dbQ.optionD || dbQ.option_d;
    const cleanAnswer = normalizeCorrectAnswer(
      dbQ.correctAnswer || dbQ.correct_answer,
      isMcq,
      optA,
      optB,
      optC,
      optD
    );

    const newSections = currentTest.sections.map((sec) => {
      if (sec.name !== targetSlot.sectionName) return sec;

      const updatedQuestions = sec.questions.map((q, idx) => {
        if (idx !== targetSlot.index) return q;

        return {
          ...q,
          id: dbQ.id || q.id,
          chapter: dbQ.chapter || q.chapter,
          unit_name: dbQ.unit_name || q.unit_name,
          question_text: dbQ.questionText || dbQ.question_text || q.question_text,
          option_a: isMcq ? optA || "Option A" : null,
          option_b: isMcq ? optB || "Option B" : null,
          option_c: isMcq ? optC || "Option C" : null,
          option_d: isMcq ? optD || "Option D" : null,
          correct_answer: cleanAnswer,
          solution: dbQ.solution || q.solution,
          difficulty: dbQ.difficulty || q.difficulty,
          has_image: (dbQ.imagePaths?.length || dbQ.image_paths?.length) > 0 ? 1 : 0,
          image_paths: dbQ.imagePaths || dbQ.image_paths || [],
        };
      });

      return { ...sec, questions: updatedQuestions };
    });

    setCurrentTest({ ...currentTest, sections: newSections });
    setIsBankModalOpen(false);
    setTargetSlot(null);
    setStatusMessage({
      type: "success",
      text: `Replaced Q.${targetSlot.index + 1} (${targetSlot.sectionName}) with selected question [Answer: ${cleanAnswer}]. Click 'Save Test' to commit.`,
    });
  };

  // Batch Add Questions from Bank
  const handleBatchAddQuestions = () => {
    if (!currentTest || selectedBatchIds.size === 0) return;

    const questionsToAdd = bankResults.filter((q) => selectedBatchIds.has(q.id));
    if (questionsToAdd.length === 0) return;

    const newSections = currentTest.sections.map((sec) => {
      if (sec.name !== activeSubject) return sec;

      const existingCount = sec.questions.length;
      const formattedNew: QuestionRecord[] = questionsToAdd.map((dbQ, i) => {
        const isMcq = dbQ.type === "MCQ" || Boolean((dbQ.optionA && dbQ.optionA.length > 0) || (dbQ.option_a && dbQ.option_a.length > 0));
        const optA = dbQ.optionA || dbQ.option_a;
        const optB = dbQ.optionB || dbQ.option_b;
        const optC = dbQ.optionC || dbQ.option_c;
        const optD = dbQ.optionD || dbQ.option_d;
        const cleanAnswer = normalizeCorrectAnswer(
          dbQ.correctAnswer || dbQ.correct_answer,
          isMcq,
          optA,
          optB,
          optC,
          optD
        );

        return {
          id: dbQ.id || `q_${Date.now()}_${i}`,
          subject: activeSubject,
          unit_id: dbQ.unit_id || "",
          unit_name: dbQ.unit_name || "",
          chapter: dbQ.chapter || `${activeSubject} Topic`,
          source_file: currentTest.source_file,
          question_number: existingCount + i + 1,
          question_text: dbQ.questionText || dbQ.question_text || "",
          option_a: isMcq ? optA || "Option A" : null,
          option_b: isMcq ? optB || "Option B" : null,
          option_c: isMcq ? optC || "Option C" : null,
          option_d: isMcq ? optD || "Option D" : null,
          correct_answer: cleanAnswer,
          solution: dbQ.solution || "Step-by-step solution from database.",
          difficulty: dbQ.difficulty || "Medium",
          has_image: (dbQ.imagePaths?.length || dbQ.image_paths?.length) > 0 ? 1 : 0,
          image_paths: dbQ.imagePaths || dbQ.image_paths || [],
        };
      });

      return {
        ...sec,
        questions: [...sec.questions, ...formattedNew],
      };
    });

    const newTotal = newSections.reduce((acc, s) => acc + s.questions.length, 0);
    setCurrentTest({ ...currentTest, total_questions: newTotal, sections: newSections });
    setIsBankModalOpen(false);
    setSelectedBatchIds(new Set());
    setStatusMessage({
      type: "success",
      text: `Added ${questionsToAdd.length} curated questions to ${activeSubject}! Click 'Save Test' to commit.`,
    });
  };

  // Delete Question from Current Test
  const handleDeleteQuestion = (secName: string, index: number) => {
    if (!currentTest) return;
    if (!confirm(`Delete Question ${index + 1} from ${secName}?`)) return;

    const newSections = currentTest.sections.map((sec) => {
      if (sec.name !== secName) return sec;
      const filtered = sec.questions.filter((_, idx) => idx !== index);
      // Renumber
      const renumbered = filtered.map((q, idx) => ({ ...q, question_number: idx + 1 }));
      return { ...sec, questions: renumbered };
    });

    const newTotal = newSections.reduce((acc, s) => acc + s.questions.length, 0);
    setCurrentTest({ ...currentTest, total_questions: newTotal, sections: newSections });
    setStatusMessage({ type: "success", text: `Deleted question. Renumbered remaining questions.` });
  };

  // Save changes from Modal 1 (Question Editor)
  const handleSaveEditedQuestion = (updatedQ: QuestionRecord) => {
    if (!currentTest || !editingQuestion) return;

    const newSections = currentTest.sections.map((sec) => {
      if (sec.name !== editingQuestion.sectionName) return sec;
      const updated = sec.questions.map((q, idx) => (idx === editingQuestion.index ? updatedQ : q));
      return { ...sec, questions: updated };
    });

    setCurrentTest({ ...currentTest, sections: newSections });
    setEditingQuestion(null);
    setStatusMessage({
      type: "success",
      text: `Updated Question ${editingQuestion.index + 1} (${editingQuestion.sectionName}). Click 'Save Test' to commit.`,
    });
  };

  // Current Subject and displayed questions
  const currentSection = currentTest?.sections?.find((s) => s.name === activeSubject);
  const displayedQuestions = (currentSection?.questions || []).filter((q) => {
    const isNum = !q.option_a && !q.option_b;
    if (activeSectionFilter === "MCQ") return !isNum;
    if (activeSectionFilter === "NUMERICAL") return isNum;
    return true;
  });

  // Filtered available tests list for the Switcher modal
  const filteredTests = useMemo(() => {
    const q = testSearchFilter.toLowerCase().trim();
    if (!q) {
      return {
        custom: customMocks,
        full: fullMocks,
        chapter: chapterTests.slice(0, 40),
      };
    }
    return {
      custom: customMocks.filter((t) => t.title.toLowerCase().includes(q)),
      full: fullMocks.filter((t) => t.title.toLowerCase().includes(q)),
      chapter: chapterTests.filter((t) => t.title.toLowerCase().includes(q) || (t.chapter || "").toLowerCase().includes(q)),
    };
  }, [customMocks, fullMocks, chapterTests, testSearchFilter]);

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Mock Test Studio &amp; Question Bank</h1>
            <p className="text-xs text-slate-400">
              Enter admin passcode to customize mock tests, curate questions from our 9,395 questions database, and build tests.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {statusMessage && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs text-center">
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-98 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Unlock Mock Test Studio"}
            </button>
          </form>

          {!embedded && (
            <div className="text-center">
              <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300">
                ← Return to Main Admin Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Authenticated Mock Test Studio Console
  return (
    <div className={embedded ? "space-y-4 pb-12" : "min-h-screen bg-[#0a0d14] text-slate-100 font-sans pb-24"}>
      {/* Top Header */}
      <header className={embedded ? "bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg" : "border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4"}>
        <div className="flex items-center space-x-3">
          {!embedded && (
            <>
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
              <span className="text-slate-700">|</span>
            </>
          )}
          {embedded && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
              MTS
            </div>
          )}
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center space-x-2">
              <span>Mock Test Studio &amp; Question Bank</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                9,395 Questions Bank
              </span>
            </h1>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Dense / Compact View Toggle */}
          <button
            onClick={() => setIsCompactView(!isCompactView)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border cursor-pointer transition-colors ${
              isCompactView
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="Toggle dense compact card view"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isCompactView ? "Dense View: ON" : "Dense View"}</span>
          </button>

          {/* Switch / Select Test Button */}
          <button
            onClick={() => setIsTestSelectorModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-slate-700 cursor-pointer shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>All Tests Catalog</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Create New Test Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Mock Test</span>
          </button>

          {/* Test in Player */}
          <Link
            href={`/exam/player?id=${encodeURIComponent(selectedTestId)}`}
            target="_blank"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Test in Player</span>
          </Link>

          {/* Set as Active Live Test */}
          {selectedTestId !== "active" && (
            <button
              onClick={() => handleSetActiveExam(selectedTestId)}
              disabled={saving}
              className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
              title="Set this test as the active live test that students take for the mock exam"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Make Live Active</span>
            </button>
          )}

          {/* Reset Current Test */}
          <button
            onClick={handleResetCurrentTest}
            disabled={saving}
            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Reset this test back to its original questions"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          {/* Save Test Changes */}
          <button
            onClick={() => handleSaveTest(false)}
            disabled={saving}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Test"}</span>
          </button>
        </div>
      </header>

      {/* Prominent Mock Suite Switcher Ribbon: All India + MFT-01 to MFT-10 */}
      <div className={`border-b border-slate-800/80 px-4 sm:px-8 py-3 bg-[#0a0f1d] ${
        embedded ? "rounded-2xl border shadow-md my-2" : "sticky top-[57px] z-20 backdrop-blur-md"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Select Mock Test to Customize:
            </span>
            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
              11 Full 75-Q Papers
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {/* All India Active Mock */}
            <button
              onClick={() => loadSpecificTest("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                selectedTestId === "active"
                  ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-blue-600/30 scale-102"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>All India Live Mock</span>
              <span className="text-[10px] font-mono opacity-80">(75 Qs)</span>
            </button>

            <div className="h-5 w-px bg-slate-800 shrink-0 mx-1" />

            {/* MFT-01 to MFT-10 Buttons */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const code = `MFT-${num < 10 ? "0" + num : num}`;
              const mftFileId = `MFT-${num}.pdf`;
              const isSelected =
                selectedTestId === mftFileId ||
                selectedTestId === `MFT-${num}` ||
                selectedTestId === code;
              const isCustomized = customMocks.some(
                (c) =>
                  c.source_file === mftFileId ||
                  c.id === mftFileId ||
                  c.id === `MFT-${num}` ||
                  c.id === code
              );

              return (
                <button
                  key={num}
                  onClick={() => loadSpecificTest(mftFileId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isSelected
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-indigo-600/30 scale-102"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-indigo-400"}`} />
                  <span>{code}</span>
                  <span className="text-[10px] font-mono opacity-70">75Q</span>
                  {isCustomized && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded font-mono font-bold">
                      Custom
                    </span>
                  )}
                </button>
              );
            })}

            <div className="h-5 w-px bg-slate-800 shrink-0 mx-1" />

            {/* All Tests Catalog */}
            <button
              onClick={() => setIsTestSelectorModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center gap-1"
            >
              <span>More Tests...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-md ${
              statusMessage.type === "success"
                ? "bg-emerald-950/80 border-emerald-700 text-emerald-200"
                : "bg-rose-950/80 border-rose-700 text-rose-200"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="cursor-pointer text-slate-400 hover:text-white font-bold ml-2">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Current Test Banner & Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-gradient-to-r from-[#0f172a] via-[#131c33] to-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedTestId === "active"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : selectedTestId.startsWith("MFT-")
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}>
                  {selectedTestId === "active"
                    ? "🌟 All-India Live National Mock Paper"
                    : selectedTestId.startsWith("MFT-")
                    ? "🎯 Official Major Full Test (MFT)"
                    : selectedTestId.startsWith("custom_")
                    ? "🛠️ Custom Mock Test"
                    : "📖 Chapter Test"}
                </span>

                {customMocks.some((c) => c.source_file === selectedTestId || c.id === selectedTestId) ? (
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Customized Override Active</span>
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Official Default 75 Questions
                  </span>
                )}

                <h2 className="text-lg sm:text-xl font-black text-white">{currentTest?.title || "Mock Test"}</h2>
              </div>
              <p className="text-xs text-slate-300">
                {currentTest?.duration_minutes} Minutes Duration · +{currentTest?.marks_per_question} / -{currentTest?.negative_marks} Marking · Total {currentTest?.total_questions} Questions (25 Physics, 25 Chemistry, 25 Mathematics)
              </p>
            </div>

            {/* Quick breakdown badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              {currentTest?.sections.map((sec) => (
                <div key={sec.name} className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-xs">
                  <span className="text-slate-400">{sec.name}: </span>
                  <span className="text-blue-400 font-bold">{sec.questions.length} Qs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Toolbar for This Test */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleOpenBankForBrowsing}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Curate from 9,395 Questions Bank</span>
              </button>

              <Link
                href={`/exam/player?id=${encodeURIComponent(selectedTestId)}`}
                target="_blank"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                title="Launch this mock test in student CBT exam player"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Test in CBT Player ↗</span>
              </Link>

              {selectedTestId !== "active" && (
                <button
                  onClick={() => handleSetActiveExam(selectedTestId)}
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                  title="Promote this test to the nationwide live active exam paper"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Set as Live Active Mock</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCurrentTest}
                disabled={saving}
                className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Clear all customizations and reset back to original source questions"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset to Default</span>
              </button>

              <button
                onClick={() => handleSaveTest(false)}
                disabled={saving}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Test Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navigation & Section Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-3">
          {/* Subject Tabs */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(currentTest?.sections || []).map((sec) => (
              <button
                key={sec.name}
                onClick={() => setActiveSubject(sec.name as any)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubject === sec.name ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>{sec.name}</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300 font-mono">
                  {sec.questions.length}
                </span>
              </button>
            ))}
          </div>

          {/* Section Filter (All / MCQ / Numerical) + Add Question */}
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSectionFilter("ALL")}
                className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                  activeSectionFilter === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All ({currentSection?.questions.length || 0})
              </button>
              <button
                onClick={() => setActiveSectionFilter("MCQ")}
                className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                  activeSectionFilter === "MCQ" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                MCQs ({currentSection?.questions.filter((q) => q.option_a).length || 0})
              </button>
              <button
                onClick={() => setActiveSectionFilter("NUMERICAL")}
                className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                  activeSectionFilter === "NUMERICAL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Numericals ({currentSection?.questions.filter((q) => !q.option_a).length || 0})
              </button>
            </div>

            {/* Add Question to Subject */}
            <button
              onClick={handleOpenBankForBrowsing}
              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {displayedQuestions.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
              <p className="text-sm text-slate-400">No questions found in this section.</p>
              <button
                onClick={handleOpenBankForBrowsing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                Curate Questions from 9,395 Bank
              </button>
            </div>
          )}

          {displayedQuestions.map((q, idx) => {
            const isNum = !q.option_a && !q.option_b;
            const diffColor =
              q.difficulty === "Easy"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : q.difficulty === "Hard"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30";

            return (
              <div
                key={q.id || idx}
                className={`bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-md ${
                  isCompactView ? "p-3 space-y-2.5" : "p-5 space-y-4"
                }`}
              >
                {/* Header Row */}
                <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 ${isCompactView ? "pb-2" : "pb-3"}`}>
                  <div className="flex items-center space-x-2.5">
                    <span className={`rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-extrabold flex items-center justify-center ${
                      isCompactView ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
                    }`}>
                      {q.question_number || idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">
                        {q.subject} {q.chapter && <span className="text-slate-400 ml-1">· {q.chapter}</span>}
                      </span>
                      {!isCompactView && q.unit_name && <span className="text-[11px] text-slate-500 block">{q.unit_name}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Difficulty Badge */}
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${diffColor}`}>
                      {q.difficulty || "Medium"}
                    </span>

                    {/* Question Type Badge */}
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        isNum
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isNum ? "Numerical" : "MCQ"}
                    </span>

                    {/* Replace from Bank */}
                    <button
                      onClick={() => handleOpenBankForSlot(activeSubject, idx, q)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer border border-slate-700"
                      title="Replace this question from 9,395 questions database"
                    >
                      <Search className="w-3 h-3 text-blue-400" />
                      <span>Replace</span>
                    </button>

                    {/* Edit Question */}
                    <button
                      onClick={() =>
                        setEditingQuestion({
                          question: { ...q },
                          sectionName: activeSubject,
                          index: idx,
                        })
                      }
                      className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Question */}
                    <button
                      onClick={() => handleDeleteQuestion(activeSubject, idx)}
                      className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                      title="Delete question from test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className={isCompactView ? "text-xs font-medium leading-snug line-clamp-3 hover:line-clamp-none transition-all text-slate-200" : "text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-200"}>
                  <MathRenderer text={formatQuestionText(q.question_text)} />
                </div>

                {/* Question Diagrams / Images */}
                {q.image_paths && q.image_paths.length > 0 && (
                  <div className="flex flex-wrap gap-2 py-1">
                    {q.image_paths.map((url, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={url}
                        alt="Question Diagram"
                        className={`max-w-full rounded border border-slate-700 bg-white object-contain ${
                          isCompactView ? "max-h-28" : "max-h-48"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Options / Answer Preview */}
                {!isNum ? (
                  <div className={`grid ${isCompactView ? "grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]" : "grid-cols-1 sm:grid-cols-2 gap-2 text-xs"} pt-1`}>
                    {[
                      { key: "A", val: q.option_a },
                      { key: "B", val: q.option_b },
                      { key: "C", val: q.option_c },
                      { key: "D", val: q.option_d },
                    ].map((opt) => {
                      const isCorrect = (q.correct_answer || "").trim().toUpperCase() === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`rounded-lg border flex items-start space-x-1.5 transition-colors ${
                            isCompactView ? "p-1.5 text-[11px]" : "p-2.5 text-xs"
                          } ${
                            isCorrect
                              ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300 font-semibold"
                              : "bg-slate-800/40 border-slate-800 text-slate-300"
                          }`}
                        >
                          <span className="font-bold shrink-0">({opt.key})</span>
                          <span className="flex-1 break-words whitespace-normal leading-relaxed">
                            <MathRenderer inline text={formatOptionText(opt.val) || `Option ${opt.key}`} />
                          </span>
                          {isCorrect && (
                            <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`bg-purple-950/30 border border-purple-800/40 rounded-lg flex items-center justify-between ${
                    isCompactView ? "p-2 text-xs" : "p-3 text-xs"
                  }`}>
                    <div>
                      <span className="text-slate-400">Correct Numerical Value: </span>
                      <span className="font-mono font-extrabold text-purple-300 text-sm">{q.correct_answer}</span>
                    </div>
                    <span className="text-[11px] text-purple-400 italic">Virtual Keypad</span>
                  </div>
                )}

                {/* Solution Preview */}
                {q.solution && (
                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 space-y-1">
                    <span className="font-bold text-slate-300 block">Explanation / Solution:</span>
                    <p className="whitespace-pre-wrap leading-relaxed font-mono">{formatSolutionText(q.solution)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL 1: Edit Question & Options */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  Edit Question {editingQuestion.index + 1} ({editingQuestion.sectionName})
                </h3>
                <p className="text-xs text-slate-400">Customize statement, options, correct answer, and explanation.</p>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Statement</label>
                <textarea
                  rows={4}
                  value={editingQuestion.question.question_text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, question_text: e.target.value },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-xs font-sans focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chapter / Topic</label>
                  <input
                    type="text"
                    value={editingQuestion.question.chapter || ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, chapter: e.target.value },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Question Type</label>
                  <select
                    value={editingQuestion.question.option_a ? "MCQ" : "NUMERICAL"}
                    onChange={(e) => {
                      const isMcq = e.target.value === "MCQ";
                      setEditingQuestion({
                        ...editingQuestion,
                        question: {
                          ...editingQuestion.question,
                          option_a: isMcq ? editingQuestion.question.option_a || "Option A" : null,
                          option_b: isMcq ? editingQuestion.question.option_b || "Option B" : null,
                          option_c: isMcq ? editingQuestion.question.option_c || "Option C" : null,
                          option_d: isMcq ? editingQuestion.question.option_d || "Option D" : null,
                        },
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="MCQ">Section A: MCQ Single Choice</option>
                    <option value="NUMERICAL">Section B: Numerical Value</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={editingQuestion.question.difficulty || "Medium"}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, difficulty: e.target.value },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Easy">Easy (Single-step formula / recall)</option>
                    <option value="Medium">Medium (Standard 2-step JEE Main)</option>
                    <option value="Hard">Hard (Multi-concept / lengthy derivation)</option>
                  </select>
                </div>
              </div>

              {/* Options for MCQ */}
              {editingQuestion.question.option_a !== null ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="block text-slate-300 font-semibold">Options &amp; Correct Answer</span>
                    <span className="text-[11px] text-slate-400">Click the letter to set correct answer</span>
                  </div>
                  {(["A", "B", "C", "D"] as const).map((optKey) => {
                    const optField = `option_${optKey.toLowerCase()}` as "option_a" | "option_b" | "option_c" | "option_d";
                    const isCorrect = (editingQuestion.question.correct_answer || "").toUpperCase() === optKey;

                    return (
                      <div key={optKey} className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingQuestion({
                              ...editingQuestion,
                              question: { ...editingQuestion.question, correct_answer: optKey },
                            })
                          }
                          className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                            isCorrect ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                          title={isCorrect ? "Correct Option" : "Click to mark as correct option"}
                        >
                          {optKey}
                        </button>
                        <input
                          type="text"
                          value={editingQuestion.question[optField] || ""}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              question: { ...editingQuestion.question, [optField]: e.target.value },
                            })
                          }
                          placeholder={`Text for option ${optKey}`}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Correct Numerical Value (e.g. 4, 15, 2.5, -3)
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.question.correct_answer}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: { ...editingQuestion.question, correct_answer: e.target.value },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Solution / Explanation */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Step-by-Step Solution / Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  value={editingQuestion.question.solution || ""}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: { ...editingQuestion.question, solution: e.target.value },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEditedQuestion(editingQuestion.question)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Curate Questions from 9,395 Questions Database */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    {targetSlot
                      ? `Select Question for Q.${targetSlot.index + 1} (${targetSlot.sectionName})`
                      : `Curate Questions for ${activeSubject}`}
                  </h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                    9,395 Available
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter questions Subject-wise, Question Type-wise, Difficulty-wise, and Chapter-wise.
                </p>
              </div>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4-Way Multi-Dimensional Filters Bar (Subject, Type, Difficulty, Chapter) */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Subject-Wise Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Subject
                  </label>
                  <select
                    value={bankSubject}
                    onChange={(e) => {
                      const newSubj = e.target.value;
                      setBankSubject(newSubj);
                      setBankChapter("ALL");
                      searchQuestionBank({ subject: newSubj, chapter: "ALL" });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="ALL">All Subjects</option>
                    <option value="Physics">Physics (3,235)</option>
                    <option value="Chemistry">Chemistry (2,855)</option>
                    <option value="Mathematics">Mathematics (3,305)</option>
                  </select>
                </div>

                {/* 2. Question Type-Wise Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Question Type
                  </label>
                  <select
                    value={bankType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setBankType(newType);
                      searchQuestionBank({ questionType: newType });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="ALL">All Types</option>
                    <option value="MCQ">Section A: MCQ (Single Choice)</option>
                    <option value="NUMERICAL">Section B: Numerical Value</option>
                  </select>
                </div>

                {/* 3. Difficulty-Wise Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={bankDifficulty}
                    onChange={(e) => {
                      const newDiff = e.target.value;
                      setBankDifficulty(newDiff);
                      searchQuestionBank({ difficulty: newDiff });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="Easy">Easy (Formula / Recall)</option>
                    <option value="Medium">Medium (Standard JEE)</option>
                    <option value="Hard">Hard (Multi-Concept)</option>
                  </select>
                </div>

                {/* 4. Chapter-Wise Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Chapter / Unit
                  </label>
                  <select
                    value={bankChapter}
                    onChange={(e) => {
                      const newChap = e.target.value;
                      setBankChapter(newChap);
                      searchQuestionBank({ chapter: newChap });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold truncate"
                  >
                    <option value="ALL">All Chapters ({bankSubject})</option>
                    {(filterMeta.chapters[bankSubject] || []).map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keyword Search & Diagram Toggle Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by topic, formula, or question keyword..."
                    value={bankQuery}
                    onChange={(e) => setBankQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchQuestionBank()}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Has Diagram Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = bankHasImage === true ? null : true;
                    setBankHasImage(nextVal);
                    searchQuestionBank({ hasImage: nextVal });
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                    bankHasImage === true
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Has Diagram</span>
                </button>

                {/* Reset Filters */}
                <button
                  type="button"
                  onClick={() => {
                    setBankSubject("Physics");
                    setBankChapter("ALL");
                    setBankType("ALL");
                    setBankDifficulty("ALL");
                    setBankHasImage(null);
                    setBankQuery("");
                    searchQuestionBank({
                      subject: "Physics",
                      chapter: "ALL",
                      questionType: "ALL",
                      difficulty: "ALL",
                      hasImage: null,
                      q: "",
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer border border-slate-700"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => searchQuestionBank()}
                  disabled={isSearchingBank}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {isSearchingBank ? "Searching..." : "Apply Filters"}
                </button>
              </div>

              {/* Status & Batch Action Banner */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-mono text-[11px]">
                  Found <strong className="text-blue-400">{bankTotal}</strong> matching questions in database
                </span>

                {!targetSlot && selectedBatchIds.size > 0 && (
                  <button
                    onClick={handleBatchAddQuestions}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Selected ({selectedBatchIds.size}) to {activeSubject}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {isSearchingBank && (
                <div className="text-center py-16 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  Searching 9,395 questions...
                </div>
              )}

              {!isSearchingBank && bankResults.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <p className="text-slate-400">No questions found matching your filter combination.</p>
                  <button
                    onClick={() => {
                      setBankChapter("ALL");
                      setBankType("ALL");
                      setBankDifficulty("ALL");
                      setBankHasImage(null);
                      setBankQuery("");
                      searchQuestionBank({
                        chapter: "ALL",
                        questionType: "ALL",
                        difficulty: "ALL",
                        hasImage: null,
                        q: "",
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                  >
                    View All {bankSubject} Questions
                  </button>
                </div>
              )}

              {!isSearchingBank &&
                bankResults.map((q) => {
                  const isSelected = selectedBatchIds.has(q.id);
                  const isMcq = q.type === "MCQ" || Boolean(q.optionA);
                  const diffColor =
                    q.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : q.difficulty === "Hard"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30";

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        isSelected
                          ? "bg-blue-950/40 border-blue-600/80"
                          : "bg-slate-800/40 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {/* Top Badges & Action */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          {!targetSlot && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextSet = new Set(selectedBatchIds);
                                if (nextSet.has(q.id)) nextSet.delete(q.id);
                                else nextSet.add(q.id);
                                setSelectedBatchIds(nextSet);
                              }}
                              className="text-slate-400 hover:text-white cursor-pointer mr-1"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500" />
                              )}
                            </button>
                          )}

                          <span className="font-bold text-white text-xs">{q.subject}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-blue-400 font-semibold text-xs">{q.chapter}</span>

                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${diffColor}`}>
                            {q.difficulty || "Medium"}
                          </span>

                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              isMcq
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            }`}
                          >
                            {isMcq ? "MCQ" : "Numerical"}
                          </span>

                          {q.hasImage && (
                            <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                              <Eye className="w-2.5 h-2.5" />
                              <span>Diagram</span>
                            </span>
                          )}
                        </div>

                        <div>
                          {targetSlot ? (
                            <button
                              onClick={() => handleApplyBankQuestionToSlot(q)}
                              className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                            >
                              Use for Q.{targetSlot.index + 1}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const nextSet = new Set(selectedBatchIds);
                                if (nextSet.has(q.id)) nextSet.delete(q.id);
                                else nextSet.add(q.id);
                                setSelectedBatchIds(nextSet);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
                        <MathRenderer text={formatQuestionText(q.questionText)} />
                      </div>

                      {/* Diagram preview */}
                      {q.imagePaths && q.imagePaths.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {q.imagePaths.map((url: string, i: number) => (
                            <img
                              key={i}
                              src={url}
                              alt="Diagram"
                              className="max-h-36 max-w-full rounded border border-slate-700 bg-white object-contain"
                            />
                          ))}
                        </div>
                      )}

                      {/* Options preview */}
                      {isMcq && (q.optionA || q.optionB) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                          {[
                            { k: "A", v: q.optionA },
                            { k: "B", v: q.optionB },
                            { k: "C", v: q.optionC },
                            { k: "D", v: q.optionD },
                          ].map((opt) => {
                            const isCorrect = (q.correctAnswer || "").trim().toUpperCase() === opt.k;
                            return (
                              <div
                                key={opt.k}
                                className={`p-2 rounded border text-[11px] flex items-start justify-between gap-1.5 ${
                                  isCorrect
                                    ? "bg-emerald-950/40 border-emerald-700 text-emerald-300 font-semibold"
                                    : "bg-slate-900/40 border-slate-800 text-slate-300"
                                }`}
                              >
                                <span className="flex-1 break-words whitespace-normal leading-relaxed">
                                  <strong className="font-bold mr-1">({opt.k})</strong>
                                  <MathRenderer inline text={formatOptionText(opt.v)} />
                                </span>
                                {isCorrect && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Solution preview */}
                      {q.solution && (
                        <p className="text-[10px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800 line-clamp-2">
                          <strong className="text-slate-300">Solution: </strong>
                          {formatSolutionText(q.solution)}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Switch Test / Select Mock Test */}
      {isTestSelectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white">Select Mock Test to Customize</h3>
                <p className="text-xs text-slate-400">Choose from active exam, official MFT mocks, chapter tests, or your custom tests.</p>
              </div>
              <button
                onClick={() => setIsTestSelectorModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter input */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/40">
              <input
                type="text"
                placeholder="Search tests by title or chapter..."
                value={testSearchFilter}
                onChange={(e) => setTestSearchFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Active Exam Option */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Active Mock Test</span>
                <div
                  onClick={() => {
                    loadSpecificTest("active");
                    setIsTestSelectorModalOpen(false);
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedTestId === "active"
                      ? "bg-blue-950/50 border-blue-500 text-white shadow-xs"
                      : "bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                      LIVE
                    </span>
                    <div>
                      <div className="font-bold text-xs">{activePaperSummary?.title || "Active 75-Question Test Paper"}</div>
                      <span className="text-[11px] text-slate-400">Official TCS iON 75-Q Mock Exam</span>
                    </div>
                  </div>
                  <span className="text-blue-400 font-bold text-xs">Select →</span>
                </div>
              </div>

              {/* Custom Mock Tests created by Admin */}
              {filteredTests.custom.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                    My Custom Curated Mock Tests ({filteredTests.custom.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredTests.custom.map((t) => (
                      <div
                        key={t.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          selectedTestId === t.id
                            ? "bg-purple-950/50 border-purple-500 text-white"
                            : "bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-200"
                        }`}
                      >
                        <div
                          onClick={() => {
                            loadSpecificTest(t.id);
                            setIsTestSelectorModalOpen(false);
                          }}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-bold text-xs">{t.title}</div>
                          <span className="text-[11px] text-slate-400">
                            {t.question_count} Questions · {t.duration_minutes} Mins
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              loadSpecificTest(t.id);
                              setIsTestSelectorModalOpen(false);
                            }}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTest(t.id)}
                            className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                            title="Delete custom test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10 Major Mocks (MFT) */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Official Full Mock Tests (MFT-1 to MFT-10)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredTests.full.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        loadSpecificTest(t.source_file);
                        setIsTestSelectorModalOpen(false);
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedTestId === t.source_file
                          ? "bg-blue-950/50 border-blue-500 text-white"
                          : "bg-slate-800/30 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{t.title}</div>
                      <span className="text-[10px] text-slate-500">{t.question_count} Questions</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapter-Wise Tests */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Chapter-Wise Tests ({chapterTests.length} Total)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredTests.chapter.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        loadSpecificTest(t.source_file);
                        setIsTestSelectorModalOpen(false);
                      }}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        selectedTestId === t.source_file
                          ? "bg-blue-950/50 border-blue-500 text-white"
                          : "bg-slate-800/20 border-slate-800/80 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-xs truncate">{t.title}</div>
                      <span className="text-[10px] text-slate-500">{t.subject} · {t.question_count} Qs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Create New Mock Test */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Create New Mock Test</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mock Test Title</label>
                <input
                  type="text"
                  placeholder="e.g. All India Major Mock 2026 - Shift 1"
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(Number(e.target.value) || 180)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Template</label>
                  <select
                    value={newTestPreset}
                    onChange={(e) => setNewTestPreset(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="NTA_75">Official 75-Q Template (25 Phy, 25 Chem, 25 Math)</option>
                    <option value="CLONE_ACTIVE">Clone Currently Loaded Test</option>
                    <option value="EMPTY">Empty Template (Curate From Scratch)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Curating Questions:</p>
                <p>After creating, you can customize every question, option, answer, and explanation, or pick curated questions from the 9,395 questions database.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !newTestTitle.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  {saving ? "Creating..." : "Create & Start Curating"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
