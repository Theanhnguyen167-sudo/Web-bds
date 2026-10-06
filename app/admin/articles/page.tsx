'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Article, ArticleStatus } from '@/types/article';
import {
  getStoredArticles,
  getStoredCategories,
  deleteArticle,
  duplicateArticle,
  toggleArticleStatus,
} from '@/lib/article-data';
import { useApp } from '@/lib/context/AppContext';
import {
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
  EyeOff,
  Calendar,
  Clock,
  User,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export default function AdminArticlesPage() {
  const router = useRouter();
  const { addToast } = useApp();

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Dropdown "+ Đăng tin mới" state
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const loadData = () => {
    setArticles(getStoredArticles());
    setCategories(getStoredCategories());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('articles_updated', handleUpdate);
    return () => window.removeEventListener('articles_updated', handleUpdate);
  }, []);

  // Summary counts
  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((a) => a.status === 'published').length;
    const draft = articles.filter((a) => a.status === 'draft').length;
    const pending = articles.filter((a) => a.status === 'pending').length;
    const hidden = articles.filter((a) => a.status === 'hidden').length;
    return { total, published, draft, pending, hidden };
  }, [articles]);

  // Filtering
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (activeTab !== 'all' && a.status !== activeTab) return false;
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      if (
        searchQuery.trim() &&
        !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [articles, activeTab, selectedCategory, searchQuery]);

  const handleDelete = (id: string) => {
    deleteArticle(id);
    loadData();
    setDeleteConfirmId(null);
    addToast('Đã xóa bài viết thành công', 'success');
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateArticle(id);
    if (duplicated) {
      loadData();
      addToast(`Đã tạo bản sao: "${duplicated.title}"`, 'success');
    }
  };

  const handleToggleHide = (article: Article) => {
    const nextStatus: ArticleStatus = article.status === 'hidden' ? 'published' : 'hidden';
    toggleArticleStatus(article.id, nextStatus);
    loadData();
    addToast(
      nextStatus === 'hidden' ? `Đã ẩn bài viết: "${article.title}"` : `Đã hiển thị lại bài viết: "${article.title}"`,
      'info'
    );
  };

  return (
    <div className="flex-1 flex flex-col relative select-none">
      <AdminHeader title="Quản lý Bài viết" breadcrumb="Bài viết" />

      <main className="p-6 space-y-6 max-w-7xl">
        {/* ── HEADER ROW & DROPDOWN + ĐĂNG TIN MỚI ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-navy">
              Quản lý bài viết ({articles.length})
            </h2>
            <p className="text-xs text-slate-500">
              Quản lý nội dung tin tức, thị trường và kiến thức bất động sản.
            </p>
          </div>

          <div className="flex items-center gap-2 relative">
            <Link
              href="/admin/articles/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Tạo bài viết mới</span>
            </Link>

            {/* Dropdown Menu Chooser */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
                title="Tùy chọn tạo nội dung"
              >
                <span>+ Đăng tin mới</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showCreateDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCreateDropdown && (
                <div className="absolute right-0 top-full mt-2 z-40 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in zoom-in-95">
                  <Link
                    href="/admin/listings/create"
                    onClick={() => setShowCreateDropdown(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50/60 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy group-hover:text-orange-600">
                        + Đăng tin bất động sản
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Quy trình chuẩn 6 bước: Vị trí, hình ảnh, thông số & bản đồ
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/admin/articles/new"
                    onClick={() => setShowCreateDropdown(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy group-hover:text-blue-600">
                        + Tạo bài viết / tin tức
                      </p>
                      <p className="text-[10px] text-slate-400">
                        CMS chuyên nghiệp, Rich Text Editor & khối nội dung
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── STATS SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tổng bài viết</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-navy">{stats.total}</span>
              <span className="text-[10px] text-slate-400 font-semibold">Tất cả danh mục</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Đã xuất bản</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-600">{stats.published}</span>
              <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Public</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Bản nháp</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-blue-600">{stats.draft}</span>
              <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Chưa đăng</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Chờ duyệt</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-600">{stats.pending}</span>
              <span className="text-[10px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded font-bold">Đang xét</span>
            </div>
          </div>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `Tất cả (${stats.total})` },
            { id: 'published', label: `Đã xuất bản (${stats.published})` },
            { id: 'draft', label: `Bản nháp (${stats.draft})` },
            { id: 'pending', label: `Chờ duyệt (${stats.pending})` },
            { id: 'hidden', label: `Đã ẩn (${stats.hidden})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-navy text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── SEARCH & CATEGORY FILTER BAR ── */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả, tóm tắt..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả danh mục ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── MODERN ARTICLE LIST / CARD LAYOUT ── */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-sm text-navy">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-xs text-slate-400">Thử thay đổi bộ lọc tìm kiếm hoặc tạo một bài viết mới.</p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Tạo bài viết mới</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => {
              const statusColors = {
                published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                draft: 'bg-blue-50 text-blue-700 border-blue-200',
                pending: 'bg-amber-50 text-amber-700 border-amber-200',
                hidden: 'bg-slate-100 text-slate-600 border-slate-200',
              };

              const statusLabels = {
                published: 'Đã xuất bản',
                draft: 'Bản nháp',
                pending: 'Chờ duyệt',
                hidden: 'Đã ẩn',
              };

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-18 w-28 rounded-xl object-cover shrink-0 bg-slate-100 ring-1 ring-slate-200 group-hover:scale-102 transition-transform duration-200"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-orange-50 text-orange-600 border border-orange-100">
                          {article.categoryLabel || article.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusColors[article.status]}`}>
                          {statusLabels[article.status]}
                        </span>
                        {article.blocks && article.blocks.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {article.blocks.length} blocks
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-bold text-sm text-navy hover:text-orange-500 transition-colors line-clamp-1 block"
                      >
                        {article.title}
                      </Link>

                      {/* Meta: Tác giả, Ngày, Lượt xem */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                        <div className="flex items-center gap-1 text-slate-600 font-medium">
                          {article.authorAvatar ? (
                            <img src={article.authorAvatar} alt="" className="h-4 w-4 rounded-full object-cover" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span>{article.authorName}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(article.updatedAt || article.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-slate-600 font-semibold">
                          <Eye className="h-3 w-3 text-slate-400" />
                          <span>{article.views.toLocaleString()} lượt xem</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Xem, Chỉnh sửa, Nhân bản, Ẩn, Xóa) */}
                  <div className="flex items-center gap-1 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setPreviewArticle(article)}
                      className="p-2 rounded-xl text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors"
                      title="Xem trước bài viết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-2 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      title="Chỉnh sửa bài viết"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(article.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Nhân bản bài viết"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleHide(article)}
                      className={`p-2 rounded-xl transition-colors ${
                        article.status === 'hidden'
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                      title={article.status === 'hidden' ? 'Hiện bài viết' : 'Ẩn bài viết'}
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(article.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── MODAL XÁC NHẬN XÓA ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50">
                <Trash2 className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-navy text-sm">Xác nhận xóa bài viết?</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thao tác này sẽ xóa vĩnh viễn bài viết khỏi hệ thống quản lý và không thể khôi phục.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL QUICK PREVIEW ── */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 relative">
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-extrabold text-[10px] uppercase">
                {previewArticle.categoryLabel || previewArticle.category}
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <article className="p-6 sm:p-8 space-y-5">
              <h1 className="text-xl sm:text-2xl font-black text-navy leading-tight">
                {previewArticle.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400 border-b border-slate-100 pb-3">
                <span className="font-semibold text-navy">{previewArticle.authorName}</span>
                <span>•</span>
                <span>{previewArticle.readTime || '5 phút đọc'}</span>
                <span>•</span>
                <span>{previewArticle.views} lượt xem</span>
              </div>

              {previewArticle.featuredImage && (
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <img src={previewArticle.featuredImage} alt="" className="w-full h-auto max-h-80 object-cover" />
                </div>
              )}

              {previewArticle.excerpt && (
                <p className="text-xs text-slate-600 italic bg-orange-50/50 p-3 rounded-xl border-l-4 border-orange-500">
                  {previewArticle.excerpt}
                </p>
              )}

              <div
                className="prose prose-slate max-w-none text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewArticle.content }}
              />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
