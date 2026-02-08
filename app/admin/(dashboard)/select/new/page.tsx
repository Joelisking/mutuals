/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { SelectFeatureForm } from "@/components/admin/SelectFeatureForm";
import { usePostArticlesMutation } from "@/lib/redux/api/openapi.generated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateSelectFeaturePage() {
  const router = useRouter();
  const [createArticle, { isLoading }] = usePostArticlesMutation();

  const onSubmit = async (values: any) => {
    try {
      await createArticle({ body: values }).unwrap();
      toast.success("Select+ feature created successfully");
      router.push("/admin/select");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create feature");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Select+ Feature</h3>
        <p className="text-sm text-muted-foreground">
          Add a new creative profile to the Select+ program.
        </p>
      </div>
      <SelectFeatureForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
