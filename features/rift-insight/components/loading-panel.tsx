import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionLabel } from "@/features/rift-insight/components/section-label";

export function LoadingPanel({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <SectionLabel>{title}</SectionLabel>
        <CardTitle className="text-xl text-white">Fetching live Riot data</CardTitle>
        <CardDescription className="max-w-3xl leading-6 text-slate-300">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-3">
            <Skeleton className="h-28 rounded-3xl bg-white/8" />
            <Skeleton className="h-10 rounded-2xl bg-white/8" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-2xl bg-white/8" />
            <Skeleton className="h-10 rounded-2xl bg-white/8" />
            <Skeleton className="h-10 rounded-2xl bg-white/8" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-24 rounded-2xl bg-white/8" />
              <Skeleton className="h-24 rounded-2xl bg-white/8" />
              <Skeleton className="h-24 rounded-2xl bg-white/8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
