import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Calendar,
  CheckCircle2,
  CornerDownRight,
  FileSpreadsheet,
  FileText,
  MessageSquarePlus,
  RotateCcw,
  Search,
  Send,
  Star,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { ProjectSettings, WeldBOMItem } from '../types/welding';
import {
  FeedbackCategory,
  FeedbackReply,
  FeedbackStatus,
  FeedbackThread,
  FeedbackType,
  getTab5DateFilterLabels,
  getTab5Translation,
} from '../i18n/tab5Translations';
import { getTechnicalTranslation } from '../i18n/wpsAndTechnicalTranslations';

interface TabCommentsQAProps {
  settings: ProjectSettings;
  bomItems: WeldBOMItem[];
}

interface SampleThreadOverride {
  status?: FeedbackStatus;
  upvotesDelta?: number;
  extraReplies?: FeedbackReply[];
  deleted?: boolean;
}

const STORAGE_KEY_USER_THREADS = 'weldcalc_pro_tab5_user_threads_v1';
const STORAGE_KEY_SAMPLE_OVERRIDES = 'weldcalc_pro_tab5_sample_overrides_v1';

type QuickFilterMode = 'all' | 'question' | 'review' | 'resolved' | 'open';
type DatePresetMode = 'all' | '7d' | '30d' | 'custom';

function formatDateYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const TabCommentsQA: React.FC<TabCommentsQAProps> = ({
  settings,
  bomItems,
}) => {
  const t5 = getTab5Translation(settings.language);
  const dateLabels = getTab5DateFilterLabels(settings.language);
  const tech = getTechnicalTranslation(settings.language);

  // User-created threads persisted in localStorage
  const [userThreads, setUserThreads] = useState<FeedbackThread[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER_THREADS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  // Overrides on localized built-in sample threads (so switching among 12 languages translates sample threads while keeping user replies/upvotes/status changes)
  const [sampleOverrides, setSampleOverrides] = useState<
    Record<string, SampleThreadOverride>
  >(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAMPLE_OVERRIDES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_USER_THREADS,
        JSON.stringify(userThreads)
      );
    } catch {
      // ignore
    }
  }, [userThreads]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SAMPLE_OVERRIDES,
        JSON.stringify(sampleOverrides)
      );
    } catch {
      // ignore
    }
  }, [sampleOverrides]);

  // Merge user-created threads + localized sample threads with overrides
  const allThreads = useMemo<FeedbackThread[]>(() => {
    const localizedSamples = t5.sampleThreads
      .filter((s) => !sampleOverrides[s.id]?.deleted)
      .map((s) => {
        const ov = sampleOverrides[s.id];
        if (!ov) return s;
        return {
          ...s,
          status: ov.status ?? s.status,
          upvotes: s.upvotes + (ov.upvotesDelta ?? 0),
          replies: [...s.replies, ...(ov.extraReplies ?? [])],
        };
      });
    return [...userThreads, ...localizedSamples];
  }, [t5.sampleThreads, userThreads, sampleOverrides]);

  // Available WPS codes from built-in localized WPS templates + any custom WPS codes in BOM
  const availableWpsCodes = useMemo(() => {
    const set = new Set<string>();
    tech.wpsTemplates.forEach((w) => set.add(w.wpsCode));
    bomItems.forEach((b) => {
      if (b.wpsNo && b.wpsNo.trim()) set.add(b.wpsNo.trim());
    });
    return Array.from(set);
  }, [tech.wpsTemplates, bomItems]);

  // Left Composer Form State
  const [postType, setPostType] = useState<FeedbackType>('question');
  const [authorName, setAuthorName] = useState<string>(
    settings.engineerName || ''
  );
  const [roleKey, setRoleKey] = useState<keyof typeof t5.roles>('welding_eng');
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<FeedbackCategory>('technical_qa');
  const [linkedWeldTag, setLinkedWeldTag] = useState<string>('');
  const [linkedWpsCode, setLinkedWpsCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [submittedBanner, setSubmittedBanner] = useState<boolean>(false);

  // Sync default author name if engineerName changes and field is untouched
  useEffect(() => {
    if (!authorName.trim() && settings.engineerName) {
      setAuthorName(settings.engineerName);
    }
  }, [settings.engineerName]);

  // Filter, Search & Date Range State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilterMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<DatePresetMode>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Apply quick date range presets (7 days, 30 days, All Time)
  const handleSelectDatePreset = (preset: 'all' | '7d' | '30d') => {
    setDatePreset(preset);
    if (preset === 'all') {
      setDateFrom('');
      setDateTo('');
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (preset === '7d' ? 7 : 30));
    setDateFrom(formatDateYMD(start));
    setDateTo(formatDateYMD(end));
  };

  // Active Reply Box State per Thread
  const [openReplyThreadId, setOpenReplyThreadId] = useState<string | null>(
    null
  );
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyAuthorName, setReplyAuthorName] = useState<string>(
    settings.engineerName || ''
  );
  const [replyRoleKey, setReplyRoleKey] =
    useState<keyof typeof t5.roles>('qa_qc');

  // Threads filtered by Date Range first (used for status tab counts & filtered view)
  const dateFilteredThreads = useMemo(() => {
    return allThreads.filter((item) => {
      const itemDate = (item.createdAt || '').slice(0, 10);
      if (dateFrom && itemDate < dateFrom) return false;
      if (dateTo && itemDate > dateTo) return false;
      return true;
    });
  }, [allThreads, dateFrom, dateTo]);

  // Filtered Threads (combining Date Range + Quick Filter + Category + Search)
  const filteredThreads = useMemo(() => {
    return dateFilteredThreads.filter((item) => {
      if (quickFilter === 'question' && item.type !== 'question') return false;
      if (quickFilter === 'review' && item.type !== 'review') return false;
      if (quickFilter === 'resolved' && item.status !== 'resolved')
        return false;
      if (quickFilter === 'open' && item.status !== 'open') return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchContent = item.content.toLowerCase().includes(q);
        const matchAuthor = item.authorName.toLowerCase().includes(q);
        const matchWeld = item.linkedWeldTag.toLowerCase().includes(q);
        const matchWps = item.linkedWpsCode.toLowerCase().includes(q);
        const matchReplies = item.replies.some(
          (r) =>
            r.content.toLowerCase().includes(q) ||
            r.authorName.toLowerCase().includes(q)
        );
        if (
          !matchTitle &&
          !matchContent &&
          !matchAuthor &&
          !matchWeld &&
          !matchWps &&
          !matchReplies
        ) {
          return false;
        }
      }

      return true;
    });
  }, [dateFilteredThreads, quickFilter, selectedCategory, searchQuery]);

  // Top 4 KPIs calculation (reflecting current date range window)
  const kpiStats = useMemo(() => {
    const total = dateFilteredThreads.length;
    const questionsCount = dateFilteredThreads.filter(
      (t) => t.type === 'question'
    ).length;
    const reviewsCount = dateFilteredThreads.filter(
      (t) => t.type === 'review'
    ).length;
    const resolvedCount = dateFilteredThreads.filter(
      (t) => t.status === 'resolved'
    ).length;
    const openCount = total - resolvedCount;
    const avgRating =
      total > 0
        ? dateFilteredThreads.reduce((sum, t) => sum + (t.rating || 5), 0) /
          total
        : 5.0;
    const linkedCount = dateFilteredThreads.filter(
      (t) => Boolean(t.linkedWeldTag) || Boolean(t.linkedWpsCode)
    ).length;
    const resolvedPct =
      total > 0 ? Math.round((resolvedCount / total) * 100) : 100;

    return {
      total,
      questionsCount,
      reviewsCount,
      resolvedCount,
      openCount,
      avgRating,
      linkedCount,
      resolvedPct,
    };
  }, [dateFilteredThreads]);

  // Submit new Question or Review
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newThread: FeedbackThread = {
      id: `qa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isSample: false,
      type: postType,
      category,
      authorName: authorName.trim() || settings.engineerName || 'Engineer',
      authorRole: t5.roles[roleKey],
      createdAt: formattedDate,
      rating,
      linkedWeldTag,
      linkedWpsCode,
      title: title.trim(),
      content: content.trim(),
      status: postType === 'review' ? 'resolved' : 'open',
      upvotes: 1,
      replies: [],
    };

    setUserThreads((prev) => [newThread, ...prev]);
    setTitle('');
    setContent('');
    setSubmittedBanner(true);
    setTimeout(() => setSubmittedBanner(false), 3500);
  };

  // Toggle Resolved / Open status
  const handleToggleStatus = (thread: FeedbackThread) => {
    const nextStatus: FeedbackStatus =
      thread.status === 'resolved' ? 'open' : 'resolved';

    if (thread.isSample) {
      setSampleOverrides((prev) => ({
        ...prev,
        [thread.id]: {
          ...prev[thread.id],
          status: nextStatus,
        },
      }));
    } else {
      setUserThreads((prev) =>
        prev.map((t) => (t.id === thread.id ? { ...t, status: nextStatus } : t))
      );
    }
  };

  // Upvote a thread
  const handleUpvote = (thread: FeedbackThread) => {
    if (thread.isSample) {
      setSampleOverrides((prev) => ({
        ...prev,
        [thread.id]: {
          ...prev[thread.id],
          upvotesDelta: (prev[thread.id]?.upvotesDelta ?? 0) + 1,
        },
      }));
    } else {
      setUserThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id ? { ...t, upvotes: t.upvotes + 1 } : t
        )
      );
    }
  };

  // Delete a thread
  const handleDeleteThread = (thread: FeedbackThread) => {
    if (thread.isSample) {
      setSampleOverrides((prev) => ({
        ...prev,
        [thread.id]: {
          ...prev[thread.id],
          deleted: true,
        },
      }));
    } else {
      setUserThreads((prev) => prev.filter((t) => t.id !== thread.id));
    }
  };

  // Add a reply to a thread
  const handleAddReply = (thread: FeedbackThread) => {
    const draft = (replyDrafts[thread.id] || '').trim();
    if (!draft) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReply: FeedbackReply = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      authorName: replyAuthorName.trim() || settings.engineerName || 'QA/QC',
      authorRole: t5.roles[replyRoleKey],
      content: draft,
      createdAt: formattedDate,
    };

    if (thread.isSample) {
      setSampleOverrides((prev) => ({
        ...prev,
        [thread.id]: {
          ...prev[thread.id],
          status: 'resolved',
          extraReplies: [...(prev[thread.id]?.extraReplies ?? []), newReply],
        },
      }));
    } else {
      setUserThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id
            ? {
                ...t,
                status: 'resolved',
                replies: [...t.replies, newReply],
              }
            : t
        )
      );
    }

    setReplyDrafts((prev) => ({ ...prev, [thread.id]: '' }));
  };

  // Reset sample threads, overrides & date filters
  const handleResetSamples = () => {
    setSampleOverrides({});
    setUserThreads([]);
    handleSelectDatePreset('all');
  };

  // Export Q&A & Review Log to Excel (.xlsx) scoped to filteredThreads & selected Date Range
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const periodText = dateLabels.exportPeriodFmt(dateFrom, dateTo);

    const mainRows = filteredThreads.map((item, idx) => ({
      '#': idx + 1,
      Period: periodText,
      ID: item.id,
      Type: item.type === 'question' ? t5.badgeQuestion : t5.badgeReview,
      Category: t5.categories[item.category],
      Status: item.status === 'resolved' ? t5.statusResolved : t5.statusOpen,
      Rating: `${item.rating}/5 ★`,
      Weld_Tag: item.linkedWeldTag || '-',
      WPS_Code: item.linkedWpsCode || '-',
      Title: item.title,
      Content: item.content,
      Author: item.authorName,
      Role: item.authorRole,
      Created_At: item.createdAt,
      Upvotes: item.upvotes,
      Replies_Count: item.replies.length,
    }));

    const wsMain = XLSX.utils.json_to_sheet(mainRows);
    wsMain['!cols'] = [
      { wch: 5 },
      { wch: 24 },
      { wch: 16 },
      { wch: 18 },
      { wch: 24 },
      { wch: 16 },
      { wch: 10 },
      { wch: 12 },
      { wch: 18 },
      { wch: 42 },
      { wch: 65 },
      { wch: 22 },
      { wch: 24 },
      { wch: 18 },
      { wch: 10 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMain, 'QA_Reviews_Log');

    const replyRows: Array<Record<string, string | number>> = [];
    filteredThreads.forEach((item) => {
      item.replies.forEach((rep, rIdx) => {
        replyRows.push({
          Period: periodText,
          Thread_ID: item.id,
          Thread_Title: item.title,
          Weld_Tag: item.linkedWeldTag || '-',
          WPS_Code: item.linkedWpsCode || '-',
          Reply_No: rIdx + 1,
          Responder: rep.authorName,
          Role: rep.authorRole,
          Reply_Content: rep.content,
          Replied_At: rep.createdAt,
        });
      });
    });

    if (replyRows.length > 0) {
      const wsReplies = XLSX.utils.json_to_sheet(replyRows);
      wsReplies['!cols'] = [
        { wch: 24 },
        { wch: 16 },
        { wch: 40 },
        { wch: 12 },
        { wch: 18 },
        { wch: 10 },
        { wch: 22 },
        { wch: 24 },
        { wch: 70 },
        { wch: 18 },
      ];
      XLSX.utils.book_append_sheet(wb, wsReplies, 'Threaded_Replies');
    }

    const safeCode = (settings.projectCode || 'PROJECT').replace(
      /[^a-zA-Z0-9_-]/g,
      '_'
    );
    const periodSlug =
      dateFrom || dateTo
        ? `_${dateFrom || 'start'}_to_${dateTo || 'end'}`
        : '';
    XLSX.writeFile(
      wb,
      `WeldCalc_QA_Review_Log_${safeCode}${periodSlug}_${settings.language}.xlsx`
    );
  };

  // Export Q&A & Review Log to Text (.txt) scoped to filteredThreads & selected Date Range
  const handleExportTxt = () => {
    const periodText = dateLabels.exportPeriodFmt(dateFrom, dateTo);
    const lines: string[] = [
      '================================================================================',
      `WELDCALC PRO - ${t5.tab5Full.toUpperCase()}`,
      `Project: ${settings.projectName} (${settings.projectCode})`,
      `Client: ${settings.clientName} | Lead Engineer: ${settings.engineerName}`,
      `${dateLabels.dateFilterLabel} ${periodText} (${filteredThreads.length} / ${allThreads.length})`,
      `Average Rating: ${kpiStats.avgRating.toFixed(1)} / 5.0 ★ | Resolved: ${kpiStats.resolvedCount}/${kpiStats.total} (${kpiStats.resolvedPct}%)`,
      '================================================================================',
      '',
    ];

    filteredThreads.forEach((item, index) => {
      const typeLabel =
        item.type === 'question' ? t5.badgeQuestion : t5.badgeReview;
      const statusLabel =
        item.status === 'resolved' ? t5.statusResolved : t5.statusOpen;
      lines.push(
        `[${index + 1}] [${typeLabel}] [${statusLabel}] ${item.title} (${item.rating}/5 ★)`
      );
      lines.push(
        `    Author: ${item.authorName} (${item.authorRole}) · Date: ${item.createdAt}`
      );
      lines.push(
        `    Category: ${t5.categories[item.category]} · Weld Tag: ${
          item.linkedWeldTag || '-'
        } · WPS: ${item.linkedWpsCode || '-'} · Helpful: ${item.upvotes}`
      );
      lines.push(`    Content: ${item.content}`);
      if (item.replies.length > 0) {
        lines.push(`    --- ${t5.repliesHeader} (${item.replies.length}) ---`);
        item.replies.forEach((rep, rIdx) => {
          lines.push(
            `      (${rIdx + 1}) ${rep.authorName} [${rep.authorRole}] (${rep.createdAt}):`
          );
          lines.push(`          ${rep.content}`);
        });
      }
      lines.push(
        '--------------------------------------------------------------------------------'
      );
    });

    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeCode = (settings.projectCode || 'PROJECT').replace(
      /[^a-zA-Z0-9_-]/g,
      '_'
    );
    const periodSlug =
      dateFrom || dateTo
        ? `_${dateFrom || 'start'}_to_${dateTo || 'end'}`
        : '';
    a.href = url;
    a.download = `WeldCalc_QA_Review_Log_${safeCode}${periodSlug}_${settings.language}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Row 1: 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Average Star Rating */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500">
            {t5.kpiAvgRatingTitle}
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {kpiStats.avgRating.toFixed(1)} / 5.0
            </span>
            <div
              className="flex items-center gap-0.5 text-amber-500"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-3.5 h-3.5 ${
                    starIdx <= Math.round(kpiStats.avgRating)
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t5.kpiAvgRatingSub}
          </div>
        </div>

        {/* KPI 2: Total Threads */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500">
            {t5.kpiTotalThreadsTitle}
          </div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {kpiStats.total}
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {t5.kpiTotalThreadsSubFmt(
              kpiStats.questionsCount,
              kpiStats.reviewsCount
            )}
          </div>
        </div>

        {/* KPI 3: Technical Query Resolution Rate */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500">
            {t5.kpiResolvedTitle}
          </div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {kpiStats.resolvedPct}%
          </div>
          <div className="mt-1 text-xs text-slate-500 tabular-nums">
            {t5.kpiResolvedSubFmt(kpiStats.resolvedCount, kpiStats.openCount)}
          </div>
        </div>

        {/* KPI 4: Linked Weld Tags & WPS Count */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-medium text-slate-500">
            {t5.kpiLinkedTitle}
          </div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-orange-600">
            {kpiStats.linkedCount} / {kpiStats.total}
          </div>
          <div className="mt-1 text-xs text-slate-500">{t5.kpiLinkedSub}</div>
        </div>
      </div>

      {/* Row 2: 12-Column Split Workspace — Left Composer (4 Cols) + Right Interactive Thread Feed (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (4 Cols): Post Question / Star Review Form */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{t5.formHeaderTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">{t5.formHeaderSub}</p>
          </div>

          {/* Mode Toggle: Question vs Review */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setPostType('question')}
              className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                postType === 'question'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t5.modeQuestionBtn}
            </button>
            <button
              type="button"
              onClick={() => setPostType('review')}
              className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                postType === 'review'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t5.modeReviewBtn}
            </button>
          </div>

          <form onSubmit={handleCreateThread} className="space-y-3.5">
            {/* Author Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t5.authorNameLabel}
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={t5.authorNamePlaceholder}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t5.authorRoleLabel}
                </label>
                <select
                  value={roleKey}
                  onChange={(e) =>
                    setRoleKey(e.target.value as keyof typeof t5.roles)
                  }
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-slate-900"
                >
                  <option value="welding_eng">{t5.roles.welding_eng}</option>
                  <option value="qa_qc">{t5.roles.qa_qc}</option>
                  <option value="estimator">{t5.roles.estimator}</option>
                  <option value="client_pm">{t5.roles.client_pm}</option>
                </select>
              </div>
            </div>

            {/* Interactive 1-5 Star Rating Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t5.ratingLabel}
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-0.5 cursor-pointer focus:outline-none"
                      title={`${starVal} / 5`}
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          starVal <= rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                  {rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t5.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as FeedbackCategory)
                }
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-slate-900"
              >
                <option value="technical_qa">
                  {t5.categories.technical_qa}
                </option>
                <option value="wps_review">{t5.categories.wps_review}</option>
                <option value="cost_bom">{t5.categories.cost_bom}</option>
                <option value="general">{t5.categories.general}</option>
              </select>
            </div>

            {/* Link BOM Weld Tag & WPS Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t5.linkWeldTagLabel}
                </label>
                <select
                  value={linkedWeldTag}
                  onChange={(e) => setLinkedWeldTag(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-md bg-white focus:outline-none focus:border-slate-900"
                >
                  <option value="">{t5.linkNoneOption}</option>
                  {bomItems.map((item) => (
                    <option key={item.id} value={item.weldTag}>
                      {item.weldTag} — {item.structuralMember.slice(0, 24)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t5.linkWpsLabel}
                </label>
                <select
                  value={linkedWpsCode}
                  onChange={(e) => setLinkedWpsCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-md bg-white focus:outline-none focus:border-slate-900"
                >
                  <option value="">{t5.linkNoneOption}</option>
                  {availableWpsCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject / Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t5.titleLabel}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t5.titlePlaceholder}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
              />
            </div>

            {/* Detailed Content */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t5.contentLabel}
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t5.contentPlaceholder}
                className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t5.submitBtn}</span>
            </button>

            {submittedBanner && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 font-medium">
                {t5.submittedToast}
              </div>
            )}
          </form>
        </div>

        {/* Right Column (8 Cols): Filter/Export Toolbar + Discussion Thread Feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Feed Header & Filter/Export Toolbar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {t5.feedTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{t5.feedSub}</p>
              </div>

              {/* Action Buttons: Export Excel, Export TXT, Reset Sample */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{t5.exportXlsxBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportTxt}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t5.exportTxtBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSamples}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title={t5.resetSampleBtn}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t5.resetSampleBtn}</span>
                </button>
              </div>
            </div>

            {/* Date Range Filter Bar: Quick Presets (7d, 30d, All) + From Date - To Date */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>{dateLabels.dateFilterLabel}</span>
                </span>

                {/* Quick Range Preset Buttons */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectDatePreset('all')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      datePreset === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dateLabels.presetAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDatePreset('7d')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      datePreset === '7d'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dateLabels.preset7Days}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDatePreset('30d')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      datePreset === '30d'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dateLabels.preset30Days}
                  </button>
                </div>
              </div>

              {/* From Date - To Date Inputs + Matched Count */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <label className="flex items-center gap-1.5 text-slate-600">
                  <span className="font-medium">{dateLabels.fromDateLabel}:</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setDatePreset('custom');
                    }}
                    className="px-2 py-1 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                  />
                </label>

                <label className="flex items-center gap-1.5 text-slate-600">
                  <span className="font-medium">{dateLabels.toDateLabel}:</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setDatePreset('custom');
                    }}
                    className="px-2 py-1 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                  />
                </label>

                <span className="text-xs font-mono tabular-nums text-slate-600 pl-1">
                  ·{' '}
                  <strong className="text-slate-900">
                    {dateLabels.matchedCountFmt(
                      filteredThreads.length,
                      allThreads.length
                    )}
                  </strong>
                </span>
              </div>
            </div>

            {/* Search Input + Category Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-0.5">
              <div className="md:col-span-6 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t5.searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-6">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-slate-900"
                >
                  <option value="all">{t5.allCategoriesOption}</option>
                  <option value="technical_qa">
                    {t5.categories.technical_qa}
                  </option>
                  <option value="wps_review">{t5.categories.wps_review}</option>
                  <option value="cost_bom">{t5.categories.cost_bom}</option>
                  <option value="general">{t5.categories.general}</option>
                </select>
              </div>
            </div>

            {/* Segmented Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {(
                [
                  { id: 'all', label: `${t5.filterAll} (${kpiStats.total})` },
                  {
                    id: 'question',
                    label: `${t5.filterQuestions} (${kpiStats.questionsCount})`,
                  },
                  {
                    id: 'review',
                    label: `${t5.filterReviews} (${kpiStats.reviewsCount})`,
                  },
                  {
                    id: 'resolved',
                    label: `${t5.filterResolved} (${kpiStats.resolvedCount})`,
                  },
                  {
                    id: 'open',
                    label: `${t5.filterOpen} (${kpiStats.openCount})`,
                  },
                ] as Array<{ id: QuickFilterMode; label: string }>
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuickFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer tabular-nums ${
                    quickFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thread Cards List */}
          {filteredThreads.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
              {t5.emptyStateText}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredThreads.map((thread) => {
                const isReplyBoxOpen = openReplyThreadId === thread.id;
                return (
                  <article
                    key={thread.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
                  >
                    {/* Top Unboxed Metadata Row with Middle-Dot Separators */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span
                          className={`font-semibold ${
                            thread.type === 'question'
                              ? 'text-orange-700'
                              : 'text-slate-900'
                          }`}
                        >
                          {thread.type === 'question'
                            ? t5.badgeQuestion
                            : t5.badgeReview}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-slate-800">
                          {t5.categories[thread.category]}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            thread.status === 'resolved'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {thread.status === 'resolved'
                            ? t5.statusResolved
                            : t5.statusOpen}
                        </span>
                        {(thread.linkedWeldTag || thread.linkedWpsCode) && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-slate-800 font-semibold">
                              {[thread.linkedWeldTag, thread.linkedWpsCode]
                                .filter(Boolean)
                                .join(' / ')}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Star Rating + Timestamp */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= thread.rating
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span>·</span>
                        <span>{thread.createdAt}</span>
                      </div>
                    </div>

                    {/* Title & Content */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {thread.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-1.5 leading-relaxed whitespace-pre-line">
                        {thread.content}
                      </p>
                    </div>

                    {/* Author & Interactive Actions Bar */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-slate-500">
                        <strong className="text-slate-800 font-semibold">
                          {thread.authorName}
                        </strong>{' '}
                        <span>· {thread.authorRole}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Helpful / Upvote */}
                        <button
                          type="button"
                          onClick={() => handleUpvote(thread)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer tabular-nums"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-600" />
                          <span>
                            {t5.helpfulBtn} ({thread.upvotes})
                          </span>
                        </button>

                        {/* Toggle Reply Form */}
                        <button
                          type="button"
                          onClick={() =>
                            setOpenReplyThreadId(
                              isReplyBoxOpen ? null : thread.id
                            )
                          }
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer tabular-nums"
                        >
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-600" />
                          <span>
                            {t5.replyBtn} ({thread.replies.length})
                          </span>
                        </button>

                        {/* Toggle Resolved / Reopen */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(thread)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                            thread.status === 'resolved'
                              ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                              : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {thread.status === 'resolved'
                              ? t5.reopenBtn
                              : t5.markResolvedBtn}
                          </span>
                        </button>

                        {/* Delete Thread */}
                        <button
                          type="button"
                          onClick={() => handleDeleteThread(thread)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Threaded Replies List */}
                    {thread.replies.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2.5">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {t5.repliesHeader} ({thread.replies.length})
                        </div>
                        <div className="space-y-2">
                          {thread.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className="bg-white border border-slate-200 rounded-md p-2.5 text-xs space-y-1"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
                                <div>
                                  <strong className="text-slate-900 font-semibold">
                                    {rep.authorName}
                                  </strong>{' '}
                                  <span>· {rep.authorRole}</span>
                                </div>
                                <span className="font-mono tabular-nums">
                                  {rep.createdAt}
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">
                                {rep.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline Reply Composer */}
                    {isReplyBoxOpen && (
                      <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={replyAuthorName}
                            onChange={(e) => setReplyAuthorName(e.target.value)}
                            placeholder={t5.authorNamePlaceholder}
                            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                          />
                          <select
                            value={replyRoleKey}
                            onChange={(e) =>
                              setReplyRoleKey(
                                e.target.value as keyof typeof t5.roles
                              )
                            }
                            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                          >
                            <option value="qa_qc">{t5.roles.qa_qc}</option>
                            <option value="welding_eng">
                              {t5.roles.welding_eng}
                            </option>
                            <option value="estimator">
                              {t5.roles.estimator}
                            </option>
                            <option value="client_pm">
                              {t5.roles.client_pm}
                            </option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={replyDrafts[thread.id] || ''}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({
                                ...prev,
                                [thread.id]: e.target.value,
                              }))
                            }
                            placeholder={t5.replyPlaceholder}
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddReply(thread);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReply(thread)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {t5.replySubmitBtn}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
