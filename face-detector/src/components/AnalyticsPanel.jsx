export default function AnalyticsPanel({ analytics }) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="rounded-xl bg-white/80 backdrop-blur-md shadow-lg ring-1 ring-slate-200 px-4 py-3 min-w-[180px]">
        <h3 className="text-xs font-semibold text-slate-700 mb-2">
          Face Analytics
        </h3>

        <div className="space-y-1.5 text-x text-slate-600">
          <Row
            label="Faces (now)"
            value={analytics.faceCount}
          />
          <Row
            label="Avg face size"
            value={`${(analytics.avgFaceSize * 100).toFixed(2)}%`}
          />
          <Row
            label="Faces / sec"
            value={analytics.avgFacesOverTime}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}
