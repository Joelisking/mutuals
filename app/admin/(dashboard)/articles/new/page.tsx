
"use client";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { usePostArticlesMutation } from "@/lib/redux/api/openapi.generated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateArticlePage() {
  const router = useRouter();
  const [createArticle, { isLoading }] = usePostArticlesMutation();

  const onSubmit = async (values: any) => {
    try {
      // API expects certain fields.
      const payload = {
          ...values,
          heroMediaType: "IMAGE", // Default for now
          tags: [values.category] // Default tag based on category
      };
      
      await createArticle({ body: payload }).unwrap();
      toast.success("Article created successfully");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create article");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Article</h3>
        <p className="text-sm text-muted-foreground">
          Add a new article to the editorial collection.
        </p>
      </div>
      <ArticleForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
