
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, Inbox } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
            { title: "Total Articles", icon: FileText, value: "--", change: "+0% from last month" },
            { title: "Upcoming Events", icon: Calendar, value: "--", change: "+0 this week" },
            { title: "New Submissions", icon: Inbox, value: "--", change: "+0 since yesterday" },
            { title: "Active Users", icon: Users, value: "--", change: "Admins & Editors" }
        ].map((item, i) => (
            <Card key={i} className="bg-zinc-900/50 border-white/10 backdrop-blur-sm hover:bg-zinc-900/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <p className="text-xs text-zinc-500 mt-1">
                {item.change}
                </p>
            </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
