'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Inbox } from "lucide-react";
import {
  useGetArticlesQuery,
  useGetEventsQuery,
  useGetSubmissionsStatsQuery,
  useGetNewsletterStatsQuery,
} from "@/lib/redux/api/openapi.generated";

function StatCard({
  title,
  icon: Icon,
  value,
  sub,
  isLoading,
}: {
  title: string;
  icon: React.ElementType;
  value: string | number;
  sub: string;
  isLoading: boolean;
}) {
  return (
    <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm hover:bg-zinc-900/80 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-white/70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {isLoading ? (
            <span className="inline-block h-7 w-12 animate-pulse rounded bg-zinc-700" />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-zinc-500 mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: articlesData, isLoading: articlesLoading } = useGetArticlesQuery({
    limit: 1,
    status: "PUBLISHED",
  });

  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({
    limit: 1,
    status: "UPCOMING",
  });

  const { data: submissionsData, isLoading: submissionsLoading } = useGetSubmissionsStatsQuery();

  const { data: newsletterData, isLoading: newsletterLoading } = useGetNewsletterStatsQuery();

  const totalArticles = (articlesData as any)?.meta?.total ?? "--";
  const upcomingEvents = (eventsData as any)?.meta?.total ?? "--";
  const newSubmissions =
    (submissionsData as any)?.data?.new ??
    (submissionsData as any)?.data?.NEW ??
    (submissionsData as any)?.new ??
    "--";
  const newsletterSubscribers =
    (newsletterData as any)?.data?.totalActive ??
    (newsletterData as any)?.data?.total ??
    (newsletterData as any)?.total ??
    "--";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Published Articles"
          icon={FileText}
          value={totalArticles}
          sub="Total published"
          isLoading={articlesLoading}
        />
        <StatCard
          title="Upcoming Events"
          icon={Calendar}
          value={upcomingEvents}
          sub="Scheduled ahead"
          isLoading={eventsLoading}
        />
        <StatCard
          title="New Submissions"
          icon={Inbox}
          value={newSubmissions}
          sub="Awaiting review"
          isLoading={submissionsLoading}
        />
        <StatCard
          title="Newsletter Subscribers"
          icon={Users}
          value={newsletterSubscribers}
          sub="Active subscribers"
          isLoading={newsletterLoading}
        />
      </div>
    </div>
  );
}
