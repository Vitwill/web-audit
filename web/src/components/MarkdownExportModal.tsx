import React, { useState } from 'react';
import { Language } from '../types/seo';
import { TRANSLATIONS } from '../data/translations';
import { X, Copy, Check, Download, Printer, FileText } from 'lucide-react';

interface MarkdownExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  url?: string;
  language?: Language;
}

export const MarkdownExportModal: React.FC<MarkdownExportModalProps> = ({
  isOpen,
  onClose,
  markdown,
  url,
  language = 'ru',
}) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let hostname = 'report';
    try {
      if (url) hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      // ignore
    }
    const filename = `seo-audit-${hostname}-${new Date().toISOString().slice(0, 10)}.md`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#ded7cb] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ece7de] bg-[#fbf9f5]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#2d2822] text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">
                {t.modals.markdownTitle}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {url || 'https://example.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2d2822] hover:bg-[#1a1714] text-white transition cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.beforeAfter.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.modals.markdownCopy}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#ded7cb] text-stone-800 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.modals.markdownDownload}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
              title="Печать отчета"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Markdown Content Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#faf8f5]">
          <pre className="text-xs sm:text-sm font-mono text-stone-800 whitespace-pre-wrap leading-relaxed select-all bg-white p-5 rounded-xl border border-[#ded7cb] shadow-2xs">
            {markdown}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#ece7de] bg-white flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Сайты для бизнеса | AI и задачи • <a href="https://t.me/sites_ai_tasks" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">@sites_ai_tasks</a></span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg font-bold bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#ded7cb] text-stone-700 text-xs transition cursor-pointer"
          >
            {t.modals.close}
          </button>
        </div>
      </div>
    </div>
  );
};
