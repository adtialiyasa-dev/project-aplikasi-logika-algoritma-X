import React, { useState } from 'react';
import { TEACHER_GUIDE_DATA } from '../data/teacherGuideData.ts';
import { usePersistentState } from '../utils/storage.ts';
import { GraduationCap, BookOpen, Clock, FileText, CheckCircle2, Copy, Check, Printer } from 'lucide-react';

export const TeacherGuideView: React.FC = () => {
  const [selectedSectionIdx, setSelectedSectionIdx] = usePersistentState<number>(
    'informatika_teacher_guide_section_v1',
    0
  );
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  const currentSection = TEACHER_GUIDE_DATA[selectedSectionIdx] || TEACHER_GUIDE_DATA[0];

  const handleCopyContent = () => {
    navigator.clipboard.writeText(currentSection.content);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono">
              <span>PORTAL GURU INFORMATIKA SMA FASE E</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-sans">Perangkat Ajar Kurikulum Merdeka</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Panduan Guru &amp; Perangkat Pembelajaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Dokumentasi komprehensif untuk pengajar: Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), model PBL/PjBL, LKPD, kisi-kisi asesmen, serta panduan remedial dan pengayaan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyContent}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              {copiedStatus ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Dokumen</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-slate-800">
          {TEACHER_GUIDE_DATA.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSectionIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedSectionIdx === idx
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-blue-400">
              {currentSection.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {currentSection.title}
            </h2>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
          {currentSection.content}
        </div>
      </div>
    </div>
  );
};
