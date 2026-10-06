'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ArticleEditorForm } from '@/components/admin/article/ArticleEditorForm';

function NewArticleContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id') || undefined;

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader
        title={editId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        breadcrumb={editId ? 'Bài viết / Chỉnh sửa' : 'Bài viết / Tạo mới'}
      />

      <main className="p-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-navy">
            {editId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý nội dung tin tức, thị trường và kiến thức bất động sản.
          </p>
        </div>

        <ArticleEditorForm initialArticleId={editId} />
      </main>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs">
          Đang nạp trình soạn thảo bài viết...
        </div>
      }
    >
      <NewArticleContent />
    </Suspense>
  );
}
