
"use client";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { useGetArticlesIdByIdQuery, usePutArticlesByIdMutation } from "@/lib/redux/api/openapi.generated";
import { useRouter } from "next/navigation"; // Correct hook for app directory
import { useParams } from "next/navigation"; // For grabbing params in client component if needed
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React from 'react';

// In Next.js 13+ App Router, page props receive params directly. 
// However, since we might use this component in a client layout context where typing matches specific generated types not easily imported in plain strings,
// We will use React.use() or just standard props.
// BUT, to be safe with client components receiving params:

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap params using React.use() in React 19/Next 15+ is standard, 
  // but let's stick to simple promise resolution or just use hook if available.
  // Actually, 'params' is a promise in recent Next.js versions.
  const { id } = React.use(params);

  const { data: articleData, isLoading: isFetching } = useGetArticlesIdByIdQuery({ id });
  const [updateArticle, { isLoading: isUpdating }] = usePutArticlesByIdMutation();

  const onSubmit = async (values: any) => {
    try {
       const payload = {
          ...values,
          // Merge logic if needed
       };
      await updateArticle({ id, body: payload }).unwrap();
      toast.success("Article updated successfully");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update article");
    }
  };

  if (isFetching) {
      return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }
  
  // Handle response wrapper structure
  const article = (articleData as any)?.data || articleData;

  if (!article) {
      return <div>Article not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Article</h3>
        <p className="text-sm text-muted-foreground">
          Update article content and settings.
        </p>
      </div>
      <ArticleForm 
        initialData={article} 
        onSubmit={onSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  );
}
