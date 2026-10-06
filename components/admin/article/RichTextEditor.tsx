'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Sparkles,
  ExternalLink,
  X,
  Check
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Bắt đầu soạn thảo nội dung bài viết chuyên sâu...',
  minHeight = '360px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  // Dialogs
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Initial value sync without cursor jump
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!isFocused || editorRef.current.innerHTML === '') {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      checkActiveFormats();
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (typeof document === 'undefined') return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const checkActiveFormats = () => {
    if (typeof document === 'undefined') return;
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const insertHeading = (level: 'h1' | 'h2' | 'h3') => {
    executeCommand('formatBlock', `<${level}>`);
  };

  const insertBlockquote = () => {
    executeCommand('formatBlock', '<blockquote>');
  };

  const insertDivider = () => {
    executeCommand('insertHorizontalRule');
  };

  const insertTable = () => {
    const tableHtml = `
      <table class="w-full my-4 border-collapse border border-slate-300 text-xs text-left">
        <thead>
          <tr class="bg-slate-100">
            <th class="border border-slate-300 p-2 font-bold text-navy">Tiêu chí</th>
            <th class="border border-slate-300 p-2 font-bold text-navy">Khu vực Đống Đa</th>
            <th class="border border-slate-300 p-2 font-bold text-navy">Khu vực Cầu Giấy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-2">Mức giá trung bình</td>
            <td class="border border-slate-300 p-2 font-semibold text-orange-600">85 - 120 tr/m²</td>
            <td class="border border-slate-300 p-2 font-semibold text-orange-600">95 - 145 tr/m²</td>
          </tr>
          <tr>
            <td class="border border-slate-300 p-2">Tỷ suất tăng trưởng</td>
            <td class="border border-slate-300 p-2 text-emerald-600">+8.5%/năm</td>
            <td class="border border-slate-300 p-2 text-emerald-600">+11.2%/năm</td>
          </tr>
        </tbody>
      </table>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    if (linkText.trim()) {
      executeCommand('insertHTML', `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-orange-600 underline font-semibold hover:text-orange-700">${linkText}</a>`);
    } else {
      executeCommand('createLink', url);
    }
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  const handleApplyImage = () => {
    if (!imageUrl.trim()) return;
    const captionHtml = imageCaption ? `<figcaption class="text-center text-xs text-slate-500 mt-1 italic">${imageCaption}</figcaption>` : '';
    const imgHtml = `
      <figure class="my-4 text-center">
        <img src="${imageUrl}" alt="${imageCaption || 'Hình ảnh bài viết'}" class="rounded-xl shadow-md max-w-full mx-auto" />
        ${captionHtml}
      </figure>
    `;
    executeCommand('insertHTML', imgHtml);
    setImageUrl('');
    setImageCaption('');
    setShowImageModal(false);
  };

  const handleApplyVideo = () => {
    if (!videoUrl.trim()) return;
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('watch?v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const videoHtml = `
      <div class="my-4 aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200">
        <iframe src="${embedUrl}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
    executeCommand('insertHTML', videoHtml);
    setVideoUrl('');
    setShowVideoModal(false);
  };

  return (
    <div className={`rounded-2xl border transition-all bg-white overflow-hidden ${
      isFocused ? 'border-orange-500 shadow-sm ring-1 ring-orange-500/20' : 'border-slate-200'
    }`}>
      {/* ── TOOLBAR ── */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1 text-slate-700 select-none">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
            title="Hoàn tác (Undo)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
            title="Làm lại (Redo)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => insertHeading('h1')}
            className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
            title="Tiêu đề H1"
          >
            <Heading1 className="h-4 w-4" />
            <span className="hidden sm:inline">H1</span>
          </button>
          <button
            type="button"
            onClick={() => insertHeading('h2')}
            className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
            title="Tiêu đề H2"
          >
            <Heading2 className="h-4 w-4" />
            <span className="hidden sm:inline">H2</span>
          </button>
          <button
            type="button"
            onClick={() => insertHeading('h3')}
            className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
            title="Tiêu đề H3"
          >
            <Heading3 className="h-4 w-4" />
            <span className="hidden sm:inline">H3</span>
          </button>
        </div>

        {/* Text Styles */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.bold ? 'bg-orange-500 text-white font-bold' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Đậm (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.italic ? 'bg-orange-500 text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Nghiêng (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.underline ? 'bg-orange-500 text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Gạch chân (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.strikeThrough ? 'bg-orange-500 text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Gạch ngang chữ"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.insertUnorderedList ? 'bg-orange-500 text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Danh sách dấu chấm"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className={`p-1.5 rounded-lg transition-colors ${
              activeFormats.insertOrderedList ? 'bg-orange-500 text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Danh sách số thứ tự"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={insertBlockquote}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Đoạn trích dẫn (Quote)"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>

        {/* Inserts: Link, Image, Video, Table, Divider */}
        <div className="flex items-center gap-0.5 pl-2">
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Chèn liên kết"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Chèn hình ảnh"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Chèn video"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Chèn bảng so sánh số liệu"
          >
            <TableIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={insertDivider}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
            title="Đường phân cách ngang (Divider)"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── EDITOR BODY (contentEditable) ── */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => {
          setIsFocused(true);
          checkActiveFormats();
        }}
        onBlur={() => {
          setIsFocused(false);
          checkActiveFormats();
        }}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-5 text-sm text-slate-800 leading-relaxed outline-none focus:outline-none prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-navy prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:p-3 prose-blockquote:italic prose-blockquote:rounded-r-lg"
      />

      {/* ── LINK MODAL ── */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                <Link2 className="h-4 w-4 text-orange-500" />
                Chèn liên kết URL
              </h4>
              <button onClick={() => setShowLinkModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Văn bản hiển thị (Tùy chọn)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Ví dụ: Xem bản đồ quy hoạch chi tiết..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Đường dẫn URL *</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://hanoirealty.vn/planning..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
              >
                Chèn liên kết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE MODAL ── */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-orange-500" />
                Chèn hình ảnh vào bài viết
              </h4>
              <button onClick={() => setShowImageModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Đường dẫn ảnh (URL) *</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Chú thích ảnh (Caption)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Ví dụ: Phối cảnh dự án đường Vành Đai 4..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyImage}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
              >
                Chèn ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO MODAL ── */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                <Video className="h-4 w-4 text-orange-500" />
                Nhúng video YouTube
              </h4>
              <button onClick={() => setShowVideoModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Đường dẫn video YouTube</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ các định dạng youtube.com hoặc youtu.be</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyVideo}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
              >
                Nhúng video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
