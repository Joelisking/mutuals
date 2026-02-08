/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { SelectFeatureForm } from "@/components/admin/SelectFeatureForm";
import { useGetArticlesIdByIdQuery, usePutArticlesByIdMutation } from "@/lib/redux/api/openapi.generated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React from "react";

export default function EditSelectFeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const { data: articleData, isLoading: isFetching } = useGetArticlesIdByIdQuery({ id });
  const [updateArticle, { isLoading: isUpdating }] = usePutArticlesByIdMutation();

  const onSubmit = async (values: any) => {
    try {
      await updateArticle({ id, body: values }).unwrap();
      toast.success("Select+ feature updated successfully");
      router.push("/admin/select");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update feature");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const article = (articleData as any)?.data || articleData;

  if (!article) {
    return <div>Feature not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Select+ Feature</h3>
        <p className="text-sm text-muted-foreground">
          Update this creative profile and feature article.
        </p>
      </div>
      <SelectFeatureForm
        initialData={article}
        onSubmit={onSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
