import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import { Users, Activity, ShieldAlert, Zap, TrendingUp } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import InfoTooltip from "../../components/ui/InfoTooltip";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    threatLevel: 0,
    aiRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  /**
   * processChartData
   * Generates a continuous 7-day array and populates it with 
   * request counts from the raw log data provided by the backend.
   */
  const processChartData = (rawLogs = []) => {
    // 1. Generate the last 7 days (including today)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return { 
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: d.toISOString().split('T')[0],
        requests: 0 
      };
    }).reverse();

    // 2. Map logs to their respective days
    rawLogs.forEach(log => {
      if (!log.timestamp) return; 
      
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      const dayEntry = last7Days.find(d => d.fullDate === logDate);
      
      if (dayEntry) {
        dayEntry.requests++;
      }
    });

    return last7Days;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/admin/dashboard-data");
        setStats(data.stats || stats);

        if (data.chartDataRaw) {
          const combinedChart = processChartData(data.chartDataRaw);
          setChartData(combinedChart);
        }
      } catch (err) {
        console.error("Dashboard sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const cardData = [
    { 
      label: "Total Signatures", 
      value: stats.totalUsers, 
      icon: Users, 
      color: "text-blue-400", 
      bg: "bg-blue-500/5",
      border: "border-blue-500/20"
    },
    { 
      label: "Active Pulse (24h)", 
      value: stats.activeToday, 
      icon: Activity, 
      color: "text-green-400", 
      bg: "bg-green-500/5",
      border: "border-green-500/20"
    },
    { 
      label: "AI Neural Requests", 
      value: stats.aiRequests, 
      icon: Zap, 
      color: "text-[#FFC509]", 
      bg: "bg-[#FFC509]/5",
      border: "border-[#FFC509]/20"
    },
    { 
      label: "Threat Detection", 
      value: stats.threatLevel, 
      icon: ShieldAlert, 
      color: "text-red-500", 
      bg: "bg-red-500/5",
      border: "border-red-500/20"
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            System <span className="text-[#FFC509]">Dashboard</span>
          </h1>
          <InfoTooltip 
            title="Live Metrics"
            content="Real-time analytics covering user growth, AI utilization, and system security status." 
          />
        </div>
        <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
          Real-time platform overview
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-3xl border ${card.border} ${card.bg} backdrop-blur-sm group hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-black/50 border border-white/5 ${card.color}`}>
                <card.icon size={22} />
              </div>
              <TrendingUp size={14} className="text-neutral-700 group-hover:text-white transition-colors" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold tracking-tighter mb-1">
                {loading ? "---" : card.value}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Chart & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Traffic Flow Chart */}
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-sm">
            <h2 className="text-sm font-bold mb-6 opacity-50 uppercase tracking-widest">Traffic Flow (7D)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC509" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFC509" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#444', fontSize: 10}} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#FFC509', fontWeight: 'bold' }}
                    cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#FFC509" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRequests)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Health Section */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
             <div>
                <h2 className="text-sm font-bold mb-6 opacity-50 uppercase tracking-widest">System Health</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-neutral-400">Database Engine</span>
                            <span className="text-green-500">OPTIMAL</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 w-[98%] h-full shadow-[0_0_10px_#22c55e80]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-neutral-400">Neural Response Time</span>
                            <span className="text-blue-400">24ms</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-400 w-[85%] h-full shadow-[0_0_10px_#60a5fa80]" />
                        </div>
                    </div>
                </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] text-neutral-600 italic">
                  * All systems operational. Monitoring incoming AI nodes.
                </p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;