export default function PerformancePanel({ stats }) {
  return (
    <div
    className="
        absolute
        top-2 left-2
        sm:top-3 sm:left-3
        bg-black/90 text-white
        text-[14px] sm:text-xs
        rounded-md
        px-2.5 py-2 sm:px-3
        space-y-1
        max-w-[70vw] sm:max-w-none
    "
    >
      <div>FPS: <span className="font-semibold">{stats.fps}</span></div>
      <div>
        Avg detection:{" "}
        <span className="font-semibold">
          {stats.avgDetectionTime} ms
        </span>
      </div>
    </div>
  );
}
