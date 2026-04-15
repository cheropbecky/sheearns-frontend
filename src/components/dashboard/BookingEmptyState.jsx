export default function BookingEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(80,0,136,0.25)] bg-[#fcf9ff] p-6 text-center">
      <div className="mx-auto mb-3 w-24 h-24">
        <svg viewBox="0 0 120 120" className="w-full h-full" role="img" aria-label="No bookings illustration">
          <rect x="20" y="24" width="80" height="72" rx="12" fill="#f1e8fb" stroke="#d7c0ec" />
          <rect x="30" y="36" width="60" height="10" rx="5" fill="#c79de9" />
          <rect x="30" y="54" width="46" height="8" rx="4" fill="#e4d2f3" />
          <rect x="30" y="68" width="34" height="8" rx="4" fill="#eadcf7" />
          <circle cx="85" cy="75" r="14" fill="#fea619" opacity="0.3" />
          <path d="M80 75h10M85 70v10" stroke="#855300" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-base">No bookings yet</p>
      <p className="text-[#4c4452] text-sm mt-1">When clients book your services, they will appear here for quick action.</p>
    </div>
  );
}
