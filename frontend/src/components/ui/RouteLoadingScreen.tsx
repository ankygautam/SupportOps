import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function RouteLoadingScreen() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-10 w-80 max-w-full" />
        <SkeletonBlock className="h-5 w-[34rem] max-w-full" />
      </div>
      <div className="grid gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-40 w-full" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SkeletonBlock className="h-[24rem] w-full" />
        <SkeletonBlock className="h-[24rem] w-full" />
      </div>
    </div>
  );
}
