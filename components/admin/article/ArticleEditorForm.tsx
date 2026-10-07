'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RichTextEditor } from './RichTextEditor';
import { BlockContentBuilder } from './BlockContentBuilder';
import {
  Article,
  ArticleBlock,
  ArticleStatus,
  ArticleCategoryItem
} from '@/types/article';
import {
  getStoredCategories,
  addCategory,
  saveArticle,
  slugifyVietnamese,
  getArticleById
} from '@/lib/article-data';
import { useApp } from '@/lib/context/AppContext';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Globe,
  User,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Trash2,
  Layers,
  Sparkles,
  X,
  FileCheck,
  Calendar,
  Clock
} from 'lucide-react';

interface ArticleEditorFormProps {
  initialArticleId?: string;
}

export const ArticleEditorForm: React.FC<ArticleEditorFormProps> = ({ initialArticleId }) => {
  const router = useRouter();
  const { user, addToast } = useApp();

  const [categories, setCategories] = useState<ArticleCategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  // Form states
  const [id, setId] = useState<string | undefined>(initialArticleId);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [blocks, setBlocks] = useState<ArticleBlock[]>([]);
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [category, setCategory] = useState('market');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'
  );

  // Author
  const [authorName, setAuthorName] = useState(user?.name || 'Ban biên tập HaNoi Realty');
  const [authorAvatar, setAuthorAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );
  const [authorRole, setAuthorRole] = useState('Super Admin');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Modals & Feedback
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [publishedArticle, setPublishedArticle] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing article if editing
  useEffect(() => {
    const loadedCategories = getStoredCategories();
    setCategories(loadedCategories);

    if (initialArticleId) {
      const existing = getArticleById(initialArticleId);
      if (existing) {
        setId(existing.id);
        setTitle(existing.title);
        setSlug(existing.slug);
        setIsSlugManual(true);
        setExcerpt(existing.excerpt);
        setContent(existing.content);
        setBlocks(existing.blocks || []);
        setStatus(existing.status);
        setCategory(existing.category);
        setFeaturedImage(existing.featuredImage);
        setAuthorName(existing.authorName);
        setAuthorAvatar(existing.authorAvatar || '');
        setAuthorRole(existing.authorRole || 'Super Admin');
        setSeoTitle(existing.seoTitle || '');
        setSeoDescription(existing.seoDescription || '');
        setSeoKeywords(existing.seoKeywords || '');
      }
    }
  }, [initialArticleId]);

  // Handle title change & auto-generate slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugifyVietnamese(val));
    }
  };

  const handleRegenerateSlug = () => {
    const newSlug = slugifyVietnamese(title);
    setSlug(newSlug);
    setIsSlugManual(false);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const added = addCategory(newCatName.trim());
    setCategories(getStoredCategories());
    setCategory(added.id);
    setNewCatName('');
    setShowAddCatModal(false);
    addToast(`Đã thêm danh mục "${added.label}"`, 'success');
  };

  const handleSave = (targetStatus: ArticleStatus) => {
    if (!title.trim()) {
      addToast('Vui lòng nhập tiêu đề bài viết', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const saved = saveArticle({
        id,
        title: title.trim(),
        slug: slug.trim() || slugifyVietnamese(title),
        excerpt: excerpt.trim(),
        content,
        blocks,
        status: targetStatus,
        category,
        featuredImage,
        authorName,
        authorAvatar,
        authorRole,
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim().slice(0, 160),
        seoKeywords: seoKeywords.trim(),
      });

      setStatus(targetStatus);
      setId(saved.id);

      if (targetStatus === 'published') {
        setPublishedArticle(saved);
        addToast('🎉 Bài viết đã được xuất bản thành công!', 'success');
      } else {
        addToast(targetStatus === 'draft' ? 'Đã lưu bản nháp thành công' : 'Đã cập nhật bài viết', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Có lỗi xảy ra khi lưu bài viết', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Google SEO Preview values
  const displaySeoTitle = seoTitle.trim() || title.trim() || 'Tiêu đề bài viết mẫu';
  const displaySeoSlug = slug.trim() || slugifyVietnamese(title) || 'duong-dan-bai-viet';
  const displaySeoDesc = seoDescription.trim() || excerpt.trim() || 'Nhập đoạn mô tả bài viết để xem trước kết quả tìm kiếm trên Google...';

  return (
    <div className="space-y-6 pb-28">
      {/* ── TOP BREADCRUMB & BACK ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách bài viết</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {initialArticleId ? 'Đang cập nhật bài viết' : 'Bài viết mới'}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
            status === 'published' ? 'bg-emerald-100 text-emerald-700' :
            status === 'pending' ? 'bg-amber-100 text-amber-700' :
            status === 'hidden' ? 'bg-slate-200 text-slate-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {status === 'published' ? 'Đã xuất bản' :
             status === 'pending' ? 'Chờ duyệt' :
             status === 'hidden' ? 'Đã ẩn' : 'Bản nháp'}
          </span>
        </div>
      </div>

      {/* ── 2 COLUMNS LAYOUT: 70% LEFT - 30% RIGHT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ════════════════ LEFT COLUMN (~70%) ════════════════ */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Thông tin bài viết */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-navy flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-orange-500" />
                Thông tin bài viết
              </h3>
              <span className="text-[11px] text-slate-400">Nội dung cơ bản và URL định danh</span>
            </div>

            {/* A. Tiêu đề bài viết * */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-navy">
                  Tiêu đề bài viết <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono ${title.length > 150 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                  {title.length} / 150 ký tự
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                maxLength={180}
                placeholder="Nhập tiêu đề bài viết (Ví dụ: Giá nhà Hà Nội năm 2026: Phân tích xu hướng và dòng tiền)..."
                className="w-full px-4 py-3 text-sm font-bold text-navy bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white placeholder:text-slate-400 placeholder:font-normal transition-all"
              />
            </div>

            {/* B. Slug (Đường dẫn tĩnh) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  Đường dẫn tĩnh (Slug)
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 transition-colors"
                  title="Tạo lại slug tự động từ tiêu đề"
                >
                  <RefreshCw className="h-3 w-3" />
                  Làm mới từ tiêu đề
                </button>
              </div>
              <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus-within:border-orange-500 focus-within:bg-white transition-all">
                <span className="text-slate-400 font-mono text-[11px] shrink-0 select-none">
                  hanoirealty.vn/news/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManual(true);
                  }}
                  placeholder="gia-nha-ha-noi-nam-2026"
                  className="w-full pl-1 bg-transparent text-navy font-semibold text-xs outline-none focus:outline-none"
                />
              </div>
            </div>

            {/* C. Mô tả ngắn (Excerpt) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-navy">Mô tả ngắn (Tóm tắt bài viết)</label>
                <span className={`text-[11px] font-mono ${excerpt.length > 300 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                  {excerpt.length} / 300 ký tự
                </span>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={350}
                rows={3}
                placeholder="Nhập đoạn mô tả ngắn cho bài viết (sẽ hiển thị ở trang danh sách tin tức và phần tóm tắt đầu bài)..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white placeholder:text-slate-400 transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* Card: Editor Nội dung bài viết */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-navy">Soạn thảo nội dung chính</h3>
                <p className="text-[11px] text-slate-400">Trình biên tập Rich Text chuyên nghiệp hỗ trợ đầy đủ công cụ định dạng</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-600 font-bold text-[10px]">
                Rich Text WYSIWYG
              </span>
            </div>

            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Nhập nội dung chi tiết bài viết, phân tích quy hoạch và dữ liệu thị trường..."
              minHeight="420px"
            />
          </div>

          {/* Card: Khối nội dung đặc biệt */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-navy flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-500" />
                  Khối nội dung đặc biệt (Content Blocks)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Chèn thêm các khối động như CTA, trích dẫn, bản đồ, quy hoạch hoặc BĐS nổi bật
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {blocks.length} khối đã thêm
              </span>
            </div>

            <BlockContentBuilder
              blocks={blocks}
              onChange={setBlocks}
            />
          </div>
        </div>

        {/* ════════════════ RIGHT COLUMN (~30%) ════════════════ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 1: Trạng thái */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-xs text-navy uppercase tracking-wider">Trạng thái bài viết</h4>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800"
              >
                <option value="draft">📝 Bản nháp (Chưa công khai)</option>
                <option value="pending">⏳ Chờ duyệt (Cần thẩm định)</option>
                <option value="published">🚀 Đã xuất bản (Công khai)</option>
                <option value="hidden">👁️ Đã ẩn (Tạm dừng hiển thị)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400">
              {status === 'published'
                ? 'Bài viết đang xuất hiện trực tiếp trên trang Tin tức công khai.'
                : status === 'draft'
                ? 'Bài viết chỉ lưu trong Admin Portal, chưa hiển thị ra ngoài website.'
                : status === 'pending'
                ? 'Bài viết ở chế độ chờ kiểm duyệt trước khi công khai.'
                : 'Bài viết đang bị ẩn khỏi website.'}
            </p>
          </div>

          {/* Section 2: Danh mục */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-navy uppercase tracking-wider">Danh mục bài viết</h4>
              <button
                type="button"
                onClick={() => setShowAddCatModal(true)}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Tạo danh mục
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                    category === cat.id
                      ? 'border-orange-500 bg-orange-50/50 font-bold text-orange-950'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category_selection"
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="accent-orange-500"
                    />
                    <span>{cat.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cat.badgeBg} ${cat.badgeText}`}>
                    {cat.id}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Ảnh đại diện (Featured Image) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-navy uppercase tracking-wider">Ảnh đại diện</h4>
              <button
                type="button"
                onClick={() => setShowImageUploadModal(true)}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700"
              >
                Thay ảnh
              </button>
            </div>

            {featuredImage ? (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                  <img
                    src={featuredImage}
                    alt={title || 'Ảnh đại diện'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageUploadModal(true)}
                      className="px-2.5 py-1 bg-white text-navy font-bold text-xs rounded-lg shadow-md"
                    >
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="p-1 bg-rose-600 text-white rounded-lg shadow-md hover:bg-rose-700"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tỷ lệ chuẩn 16:9</span>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="text-rose-500 hover:underline font-semibold"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowImageUploadModal(true)}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 flex flex-col items-center justify-center p-4 text-center group transition-colors"
              >
                <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-orange-500 mb-1.5 transition-colors" />
                <span className="text-xs font-bold text-navy">Tải ảnh đại diện</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP lên đến 5MB</span>
              </button>
            )}
          </div>

          {/* Section 4: Thông tin tác giả */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-xs text-navy uppercase tracking-wider">Thông tin tác giả</h4>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-500/20 shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Tên tác giả"
                  className="w-full text-xs font-bold text-navy bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-none"
                />
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Vai trò / Chức danh"
                  className="w-full text-[10px] font-semibold text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-none"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Mặc định hiển thị thông tin Super Admin biên tập nội dung.
            </p>
          </div>

          {/* Section 5: SEO & Google Search Preview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-navy uppercase tracking-wider flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-blue-500" />
                Tối ưu hóa SEO
              </h4>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Google Index
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <label className="font-semibold text-slate-600">SEO Title</label>
                  <span className="text-slate-400 font-mono">{seoTitle.length || title.length} / 60</span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Tiêu đề hiển thị Google'}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <label className="font-semibold text-slate-600">SEO Description</label>
                  <span className="text-slate-400 font-mono">{seoDescription.length || excerpt.length} / 160</span>
                </div>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder={excerpt || 'Đoạn tóm tắt hiển thị trên Google'}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">SEO Keywords</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="gia nha ha noi, quy hoach 2026, bat dong san"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Google Search Preview Snippet */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Xem trước trên Google:</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 select-none">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <div className="h-3.5 w-3.5 rounded-full bg-orange-500 flex items-center justify-center text-[8px] text-white font-bold">
                    H
                  </div>
                  <span className="font-medium text-slate-700">Hanoi Realty</span>
                  <span className="text-slate-400">› news › {displaySeoSlug}</span>
                </div>
                <h5 className="text-xs font-bold text-blue-700 hover:underline line-clamp-1">
                  {displaySeoTitle}
                </h5>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {displaySeoDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ STICKY BOTTOM ACTION BAR ════════════════ */}
      <div className="fixed bottom-0 left-60 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-6 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Quay lại
          </Link>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Tự động lưu cấu trúc bài viết
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 text-slate-500" />
            <span>Lưu bản nháp</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-600" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{status === 'published' ? 'Cập nhật bài viết' : 'Đăng bài'}</span>
          </button>
        </div>
      </div>

      {/* ── MODAL: TẠO DANH MỤC NHANH ── */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCategorySubmit}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                <Plus className="h-4 w-4 text-orange-500" />
                Tạo danh mục mới
              </h4>
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tên danh mục *</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ví dụ: Hạ tầng Metro, Đấu giá đất..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
              >
                Tạo danh mục
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL: THAY ẢNH ĐẠI DIỆN ── */}
      {showImageUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-orange-500" />
                Cài đặt ảnh đại diện bài viết
              </h4>
              <button
                type="button"
                onClick={() => setShowImageUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nhập liên kết ảnh (URL)</label>
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-500 mb-2">Hoặc chọn ảnh gợi ý chất lượng cao:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
                  ].map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomImageUrl(img)}
                      className="aspect-video rounded-lg overflow-hidden border hover:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageUploadModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customImageUrl.trim()) {
                    setFeaturedImage(customImageUrl.trim());
                    setShowImageUploadModal(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
              >
                Áp dụng ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: XEM TRƯỚC BÀI VIẾT (LIVE PREVIEW) ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 relative">
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-extrabold text-[10px] uppercase">
                  Bản xem trước thực tế (Live Preview)
                </span>
                <span className="text-xs text-slate-400">Giao diện độc giả HaNoi Realty</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Article Reading Content Preview */}
            <article className="p-6 sm:p-10 space-y-6 max-w-3xl mx-auto">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs uppercase tracking-wide inline-block">
                  {categories.find((c) => c.id === category)?.label || category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-navy leading-tight">
                  {title || 'Chưa có tiêu đề bài viết'}
                </h1>
                {excerpt && (
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-4 py-1 bg-orange-50/30 rounded-r-lg">
                    {excerpt}
                  </p>
                )}

                {/* Author & Meta */}
                <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
                  <img src={authorAvatar} alt={authorName} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-navy">{authorName}</p>
                    <p className="text-[11px] text-slate-400">{authorRole} · Hôm nay</p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {featuredImage && (
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <img src={featuredImage} alt={title} className="w-full h-auto object-cover max-h-96" />
                </div>
              )}

              {/* Main Content */}
              <div
                className="prose prose-slate max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-slate-400 italic">Chưa có nội dung soạn thảo...</p>' }}
              />

              {/* Special Blocks */}
              {blocks.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin mở rộng</h4>
                  {blocks.map((blk) => (
                    <div key={blk.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      {blk.type === 'quote' && (
                        <blockquote className="border-l-4 border-orange-500 pl-3 italic text-slate-700">
                          “{blk.data.quote}”
                          {blk.data.author && <span className="block not-italic font-bold text-xs text-navy mt-1">— {blk.data.author}</span>}
                        </blockquote>
                      )}
                      {blk.type === 'cta' && (
                        <div className="bg-navy text-white p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm">{blk.data.title}</p>
                            <span className="text-xs text-slate-300">Tư vấn miễn phí</span>
                          </div>
                          <span className="px-4 py-1.5 bg-orange-500 text-white font-bold rounded-xl text-xs">
                            {blk.data.btnText}
                          </span>
                        </div>
                      )}
                      {blk.type === 'planning_info' && (
                        <div className="text-emerald-900">
                          <p className="font-bold text-sm">{blk.data.zone}</p>
                          <p className="text-xs text-emerald-700 mt-1">{blk.data.note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      )}

      {/* ── MODAL THÔNG BÁO XUẤT BẢN THÀNH CÔNG ── */}
      {publishedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-navy">Bài viết đã được xuất bản!</h3>
              <p className="text-xs text-slate-500">
                Bài viết &quot;{publishedArticle.title}&quot; hiện đã công khai trên cổng tin tức Hanoi Realty.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                href="/news"
                target="_blank"
                className="flex-1 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Xem bài viết</span>
              </Link>
              <Link
                href="/admin/articles"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold transition-all flex items-center justify-center"
              >
                Quản lý bài viết
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
