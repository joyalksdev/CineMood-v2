import React, { useEffect, useState } from "react";
import { 
  UserX, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  RefreshCcw,
  Copy,
  Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/axios";
import Tooltip from "../../components/ui/Tooltip";
import InfoTooltip from "../../components/ui/InfoTooltip";

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copied to clipboard");
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User set to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || "Role update failed");
    }
  };

  const handleWarn = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/warn`);
      toast.success("Warning issued");
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleClearWarnings = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/clear`);
      toast.success("Warnings cleared");
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const getPulseStatus = (lastActive) => {
    if (!lastActive) return { label: "Offline", color: "bg-neutral-800", text: "Never" };
    
    const lastSeen = new Date(lastActive);
    const now = new Date();
    const diffInMs = now - lastSeen;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Status Color Logic
    let color = "bg-neutral-700";
    if (diffInMins < 5) color = "bg-green-500 shadow-[0_0_8px_#22c55e]";
    else if (diffInMins < 60) color = "bg-yellow-500/50";

    // Relative Text Logic
    let lastSeenText = "";
    if (diffInMins < 1) lastSeenText = "Just now";
    else if (diffInMins < 60) lastSeenText = `${diffInMins}m ago`;
    else if (diffInHours < 24) lastSeenText = `${diffInHours}h ago`;
    else if (diffInDays < 7) lastSeenText = `${diffInDays}d ago`;
    else lastSeenText = lastSeen.toLocaleDateString();

    return { color, text: lastSeenText };
  };
  const filteredUsers = (users || []).filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              User <span className="text-[#FFC509]">Management</span>
            </h1>
            <InfoTooltip 
              title="User Control Center"
              content="Monitor your community here. You can view user activity, verify accounts, and use the warning or ban system to maintain platform safety. Deleting a user will permanently remove their profile and associated data."
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
            Control and monitor platform access
          </p>
        </div>

        {/* Other header actions like Search or Sync go here */}
      </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/5 focus:border-[#FFC509]/30 outline-none transition-all text-sm placeholder:text-neutral-700"
            />
          </div>
          <Tooltip text="Refresh List">
            <button onClick={fetchUsers} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-[#FFC509] transition-all">
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                <th className="px-8 py-5">User Profile</th>
                <th className="px-8 py-5 text-center">Role</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Warnings</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#FFC509]/20 border-t-[#FFC509] rounded-full animate-spin" />
                      <p className="text-xs text-neutral-600">Syncing database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">
                 <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center font-bold text-[#FFC509]">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        {/* Dynamic Pulse Dot */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0A] ${getPulseStatus(user.lastActive).color}`} />
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-white truncate">{user.name || "User"}</p>
                          <Tooltip text="Copy User ID">
                            <button onClick={() => copyToClipboard(user._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-600 hover:text-[#FFC509]">
                              <Copy size={12} />
                            </button>
                          </Tooltip>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-0.5">
                          <div className="flex items-center gap-1 text-neutral-500 text-[11px]">
                            <Mail size={10} />
                            <span className="truncate max-w-[150px]">{user.email}</span>
                          </div>
                          {/* New Last Seen Text */}
                          <div className="flex items-center gap-1 text-neutral-600 text-[10px] font-bold uppercase tracking-tighter">
                            <span className="w-1 h-1 rounded-full bg-neutral-800" />
                            {getPulseStatus(user.lastActive).text}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-5 text-center">
                    <Tooltip text={`Make ${user.role === 'admin' ? 'User' : 'Admin'}`}>
                      <button 
                        onClick={() => toggleRole(user._id, user.role)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          user.role === 'admin' 
                          ? 'border-[#FFC509]/30 text-[#FFC509] bg-[#FFC509]/5' 
                          : 'border-white/5 text-neutral-500 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        {user.role}
                      </button>
                    </Tooltip>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2 ${
                      user.status === 'active' ? 'text-green-500 bg-green-500/5' :
                      user.status === 'suspended' ? 'text-yellow-500 bg-yellow-500/5' :
                      'text-red-500 bg-red-500/5'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : user.status === 'suspended' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      {user.status}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 w-5 rounded-full transition-all duration-500 ${i <= user.warnings ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-neutral-800'}`} />
                      ))}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Tooltip text="Issue Warning">
                        <button onClick={() => handleWarn(user._id)} className="p-2 hover:bg-yellow-500/10 text-yellow-600 rounded-lg transition-colors">
                          <AlertTriangle size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip text="Clear All Warnings">
                        <button onClick={() => handleClearWarnings(user._id)} className="p-2 hover:bg-green-500/10 text-green-600 rounded-lg transition-colors">
                          <CheckCircle size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip text={user.status === 'banned' ? 'Restore User' : 'Ban User'}>
                        <button 
                          onClick={() => handleStatusUpdate(user._id, user.status === 'banned' ? 'active' : 'banned')}
                          className={`p-2 rounded-lg transition-colors ${user.status === 'banned' ? 'hover:bg-green-500/10 text-green-500' : 'hover:bg-red-500/10 text-red-600'}`}
                        >
                          {user.status === 'banned' ? <RefreshCcw size={16} /> : <UserX size={16} />}
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersList;