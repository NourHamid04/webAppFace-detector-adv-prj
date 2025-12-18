import VideoStage from "../components/VideoStage/VideoStage";

export default function FaceDetectionPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white-50 via-white to-white-100 text-black-900">
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-black-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[380px] h-[380px] bg-black-400/20 rounded-full blur-3xl" />
      </div>

      {/* 🔹 Page content */}
      <div className="relative px-4 sm:px-6 py-10">
        
        {/* 🔸 Header / Hero */}
        <header className="max-w-6xl mx-auto mb-12 text-center">
          <span className="inline-block mb-4 rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-xs font-medium">
            AI • Computer Vision • Web
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 ">
            Face Detector - Advacned Programming  Project
          </h1>

          <p className="text-slate-600 max-w-4xl mx-auto text-sm sm:text-base">
            Real-time face detection running entirely in your browser using
            modern web technologies. No servers, no uploads, privacy-first.
          </p>
        </header>

        {/* 🔸 Main content */}
        <main className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-slate-200 p-4 sm:p-6">

            {/* subtle border glow */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-blue-200/40 pointer-events-none" />

            <VideoStage />
          </div>

          
        </main>

        {/* 🔸 Footer */}
        <footer className="mt-20 text-center text-xs text-slate-500">
          Advanced Programming • University of Pisa
        </footer>
      </div>
    </div>
  );
}

/* 🔹 Reusable feature card */
function Feature({ title, description }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
