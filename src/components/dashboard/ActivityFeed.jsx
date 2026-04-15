import { Star } from "lucide-react";

function ActivitySkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-[#ece7f2] shrink-0" />
      <div className="flex-1">
        <div className="h-3.5 w-3/5 rounded bg-[#ece7f2] mb-2" />
        <div className="h-3 w-2/3 rounded bg-[#f2edf6]" />
      </div>
      <div className="h-3 w-16 rounded bg-[#f2edf6]" />
    </div>
  );
}

export default function ActivityFeed({ activities, loading }) {
  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm" data-aos="fade-up" data-aos-delay="80">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-lg sm:text-xl lg:text-2xl">Recent Activity</h2>
        <button className="text-[#500088] text-sm font-bold hover:underline">View All</button>
      </div>

      <div className="flex flex-col divide-y divide-[rgba(207,194,212,0.2)]">
        {loading && !activities.length && (
          <>
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        )}

        {!loading && activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 py-4">
            <div className="bg-[#f1ede7] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
              <Star size={18} strokeWidth={1.8} className="text-[#500088]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1c1c18] font-bold text-sm truncate">{activity.title}</p>
              <p className="text-[#4c4452] text-xs truncate">{activity.subtitle}</p>
            </div>
            <span className="text-xs text-[#4c4452] shrink-0">{new Date(activity.timestamp).toLocaleDateString()}</span>
          </div>
        ))}

        {!loading && !activities.length && (
          <p className="text-sm text-[#4c4452] py-4">No recent activity yet.</p>
        )}
      </div>
    </section>
  );
}
