'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ArticleEditorForm } from '@/components/admin/article/ArticleEditorForm';

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params?.id as string;

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader
        title="Chỉnh sửa bài viết"
        breadcrumb={`Bài viết / ${articleId || 'Chỉnh sửa'}`}
      />

      <main className="p-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-navy">Chỉnh sửa bài viết</h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý nội dung tin tức, thị trường và kiến thức bất động sản.
          </p>
        </div>

        <ArticleEditorForm initialArticleId={articleId} />
      </main>
    </div>
  );
}
