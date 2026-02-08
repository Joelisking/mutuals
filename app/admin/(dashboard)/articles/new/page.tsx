'use client';

import {
  ArticleForm,
  type ArticleFormValues,
} from '@/components/admin/ArticleForm';
import { usePostArticlesMutation } from '@/lib/redux/api/openapi.generated';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateArticlePage() {
  const router = useRouter();
  const [createArticle, { isLoading }] = usePostArticlesMutation();

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      const payload = {
        ...values,
        heroMediaType: 'IMAGE' as const,
        tags: [values.category],
      };

      await createArticle({ body: payload }).unwrap();
      toast.success('Article created successfully');
      router.push('/admin/articles');
    } catch (error: unknown) {
      console.error(error);
      const msg = (error as { data?: { message?: string } })?.data
        ?.message;
      toast.error(msg || 'Failed to create article');
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
