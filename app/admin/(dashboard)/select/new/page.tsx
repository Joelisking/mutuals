/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { SelectFeatureForm } from '@/components/admin/SelectFeatureForm';
import {
  useGetArticlesQuery,
  usePostArticlesMutation,
} from '@/lib/redux/api/openapi.generated';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateSelectFeaturePage() {
  const router = useRouter();
  const [createArticle, { isLoading }] = usePostArticlesMutation();

  // Fetch all Select+ articles to determine the next episode number
  const { data: selectArticlesData } = useGetArticlesQuery({
    category: 'Select+',
    limit: 1000,
  });

  const selectArticles: any[] =
    (selectArticlesData as any)?.data?.data ||
    (selectArticlesData as any)?.data ||
    [];

  const maxEpisode = selectArticles.reduce(
    (max: number, article: any) => {
      const epTag = (article.tags ?? []).find((t: string) =>
        t.startsWith('EP:'),
      );
      if (!epTag) return max;
      const num = parseInt(epTag.replace('EP:', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    },
    0,
  );

  const nextEpisodeNumber = String(maxEpisode + 1).padStart(3, '0');

  const onSubmit = async (values: any) => {
    try {
      await createArticle({ body: values }).unwrap();
      toast.success('Select+ feature created successfully');
      router.push('/admin/select');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to create feature');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          Create Select+ Feature
        </h3>
        <p className="text-sm text-muted-foreground">
          Add a new creative profile to the Select+ program.
        </p>
      </div>
      <SelectFeatureForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        nextEpisodeNumber={nextEpisodeNumber}
      />
    </div>
  );
}
