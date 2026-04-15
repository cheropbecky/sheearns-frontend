import { Bot, FilePenLine, LayoutDashboard, Share2, Wallet } from "lucide-react";

const ACTIONS = [
  { icon: Wallet, label: "Log Income", priority: "primary" },
  { icon: Bot, label: "Chat with AI Coach", priority: "secondary" },
  { icon: FilePenLine, label: "Update My Services", priority: "secondary" },
  { icon: LayoutDashboard, label: "My Bookings", priority: "secondary" },
  { icon: Share2, label: "Share Profile", priority: "secondary" },
];

export default function ActionCenter({ onQuickAction, actionMessage }) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm" data-aos="fade-up">
      <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl mb-5">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const isPrimary = action.priority === "primary";

          return (
            <button
              key={action.label}
              onClick={() => onQuickAction(action.label)}
              className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-sm ${
                isPrimary
                  ? "col-span-2 bg-[#500088] hover:bg-[#5f1295] text-white"
                  : "bg-[#f7f3ed] hover:bg-[rgba(80,0,136,0.08)] text-[#1c1c18] border border-[rgba(207,194,212,0.3)]"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} className={isPrimary ? "text-white" : "text-[#500088]"} />
              <span className="text-xs font-bold text-center leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>

      {actionMessage && <p className="text-xs text-[#500088] mt-4 font-semibold">{actionMessage}</p>}
    </section>
  );
}
