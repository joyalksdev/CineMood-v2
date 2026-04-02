import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import {
  ShieldAlert,
  Search,
  UserCheck,
  Activity,
  RefreshCcw,
  Clock,
  Filter,
  Mail,
} from "lucide-react";
import InfoTooltip from "../../components/ui/InfoTooltip";
import Tooltip from "../../components/ui/Tooltip";
import toast from "react-hot-toast";
import { getDashboardLogs } from "../../services/adminService";

const AdminLogs = () => {
  // state for logs
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // fetch data from api
  const fetchLogs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getDashboardLogs();
      setLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      // get error message
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch logs";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchLogs();
  }, []);

  // handle filtering logic
  useEffect(() => {
    setFilteredLogs(
      filter === "all" ? logs : logs.filter((log) => log.type === filter),
    );
  }, [filter, logs]);

  // dynamic styles for log types
  const getLogStyle = (type) => {
    switch (type) {
      case "admin":
        return "font-mono border-rose-900/30 hover:border-rose-500/50 bg-[#0D0202] text-rose-500 shadow-[inset_0_0_10px_rgba(225,29,72,0.1)] uppercase tracking-tighter transition-all duration-300";

      case "search":
        return "font-mono border-[#FFC509]/10 hover:border-[#FFC509]/40 bg-[#FFC509]/5 text-[#FFC509] shadow-[0_0_15px_rgba(255,197,9,0.05)] uppercase tracking-tighter";

      case "auth":
        return "font-mono border-emerald-500/10 hover:border-emerald-500/40 bg-emerald-500/5 text-green-400 shadow-[0_0_15px_rgba(52,211,153,0.05)] uppercase tracking-tighter";

      case "ai":
        return "font-mono border-violet-500/20 hover:border-violet-400 bg-violet-500/10 text-violet-300 animate-pulse-subtle shadow-[0_0_20px_rgba(139,92,246,0.1)] uppercase tracking-tighter";

      default:
        return "font-mono border-white/5 hover:border-white/20 bg-white/[0.02] text-neutral-400 uppercase tracking-tighter";
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#050505] text-white animate-in fade-in duration-700">
      {/* header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              System <span className="text-[#FFC509]">Logs</span>
            </h1>
            <InfoTooltip
              title="Activity Stream"
              content="Track every major event on the platform. Use the filters to narrow down security alerts, user logins, or search trends."
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
            Audit Trail & Security Monitoring
          </p>
        </div>

        <Tooltip text="Refresh List">
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchLogs(true);
            }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-[#FFC509] transition-all flex items-center gap-2 text-xs font-bold active:scale-95"
          >
            <RefreshCcw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Sync Data
          </button>
        </Tooltip>
      </div>

      {/* filter buttons */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {["all", "admin", "auth", "ai", "search"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
              filter === type
                ? "bg-[#FFC509] border-[#FFC509] text-black shadow-lg shadow-yellow-900/10"
                : "bg-[#0A0A0A] border-white/5 text-neutral-500 hover:border-white/20"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* log display section */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-[#FFC509]/20 border-t-[#FFC509] rounded-full animate-spin" />
          <p className="text-xs font-medium text-neutral-600">
            Loading registry...
          </p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-20 text-center bg-[#0A0A0A] border border-white/5 rounded-3xl">
          <Activity className="mx-auto text-neutral-800 mb-4" size={48} />
          <p className="text-neutral-500 text-sm font-medium">
            No activity found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLogs.map((log) => {
            const styles = getLogStyle(log.type);
            return (
              <div
                key={log._id}
                className={`group bg-[#0A0A0A] border rounded-3xl p-5 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 ${styles}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* icon indicator */}
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-inherit">
                    {log.type === "admin" && <ShieldAlert size={20} />}
                    {log.type === "search" && <Search size={20} />}
                    {log.type === "auth" && <UserCheck size={20} />}
                    {!["admin", "search", "auth"].includes(log.type) && (
                      <Activity size={20} />
                    )}
                  </div>

                  {/* log info */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white group-hover:text-inherit tracking-wide transition-colors truncate">
                      {log.user?.name || "System"}
                      <span className="ml-2 font-medium text-neutral-400 italic text-[13px] opacity-80 group-hover:opacity-100 uppercase tracking-tight">
                        — {log.action}
                      </span>
                    </h4>
                    <div className="flex items-center gap-1.5 text-[12px] tracking-wide lowercase text-neutral-600 font-medium">
                      <Mail size={10} />
                      <span className="truncate">
                        {log.user?.email || "system_internal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* timestamp and tag */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
                    <Clock size={12} className="text-neutral-600" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[8px] font-black uppercase tracking-widest text-neutral-500">
                    {log.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;