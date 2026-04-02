import React, { useEffect, useState } from "react";
import { 
  UserX, AlertTriangle, CheckCircle, Search, 
  RefreshCcw, Copy, Mail 
} from "lucide-react";
import { toast } from "react-hot-toast";

// service imports for user management
import { 
  getUsers, 
  clearWarnings, 
  updateUserRole, 
  updateUserStatus, 
  warnUser 
} from "../../services/adminService"; 

// UI components
import Tooltip from "../../components/ui/Tooltip";
import InfoTooltip from "../../components/ui/InfoTooltip";
import ActionModal from "../../components/modals/ActionModal"; 
import { useUser } from "../../context/UserContext";

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useUser();

  // modal configuration state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    variant: 'danger',
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {}
  });

  // fetch all users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers(); 
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  // modal open/close helpers
  const openModal = (config) => setModalConfig({ ...config, isOpen: true });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // update user status (active/banned)
  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      // update state locally for instant feedback
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User is now ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // toggle between admin and user roles
  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Role update failed");
    }
  };

  // increment user warnings
  const handleWarn = async (userId) => {
    try {
      await warnUser(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, warnings: Math.min((u.warnings || 0) + 1, 3) } : u));
      toast.success("Warning issued");
    } catch (err) { 
      toast.error("Action failed"); 
    }
  };

  // reset user warnings to zero
  const handleClearWarnings = async (userId) => {
    try {
      await clearWarnings(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, warnings: 0 } : u));
      toast.success("Warnings cleared");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  // trigger ban confirmation modal
  const handleBanClick = (user) => {
    if (user.status === 'banned') {
      handleStatusUpdate(user._id, 'active');
      return;
    }
    openModal({
      variant: 'danger',
      title: `Ban ${user.name}?`,
      message: "This user will lose all platform access immediately.",
      confirmText: "Confirm Ban",
      onConfirm: () => handleStatusUpdate(user._id, 'banned')
    });
  };

  // trigger role change modal
  const handleRoleClick = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    openModal({
      variant: 'warning',
      title: "Change Role?",
      message: `Are you sure you want to make ${user.name} a ${newRole}?`,
      confirmText: `Make ${newRole}`,
      onConfirm: () => toggleRole(user._id, user.role)
    });
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copied to clipboard");
  };

  // calculate relative time and pulse color for "Last Active" status
  const getPulseStatus = (lastActive) => {
    if (!lastActive) return { label: "Offline", color: "bg-neutral-800", text: "Never" };
    
    const lastSeen = new Date(lastActive);
    const now = new Date();
    const diffInMs = now - lastSeen;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    let color = "bg-neutral-700";
    if (diffInMins < 5) color = "bg-green-500 shadow-[0_0_8px_#22c55e]";
    else if (diffInMins < 60) color = "bg-yellow-500/50";

    let lastSeenText = "";
    if (diffInMins < 1) lastSeenText = "Just now";
    else if (diffInMins < 60) lastSeenText = `${diffInMins}m ago`;
    else if (diffInHours < 24) lastSeenText = `${diffInHours}h ago`;
    else if (diffInDays < 7) lastSeenText = `${diffInDays}d ago`;
    else lastSeenText = lastSeen.toLocaleDateString();

    return { color, text: lastSeenText };
  };

  // search and sort logic
  const filteredUsers = (users || [])
    .filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u._id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const isAMe = String(a._id) === String(currentUser?._id || currentUser?.id);
      const isBMe = String(b._id) === String(currentUser?._id || currentUser?.id);
      if (isAMe) return -1;
      if (isBMe) return 1;
      return 0;
    });

  return (
    <div className="p-6 md:p-10 bg-[#050505] min-h-screen text-white animate-in fade-in duration-700">
      
      {/* header and search area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              User <span className="text-[#FFC509]">Management</span>
            </h1>
            <InfoTooltip 
              title="User Control Center"
              content="Monitor your community here. You can view user activity, verify accounts, and use the warning or ban system to maintain platform safety."
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
            Control and monitor platform access
          </p>
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

      {/* users table container */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table data-lenis-prevent className="w-full text-left min-w-[800px]">
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-neutral-500 text-sm">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              ) : filteredUsers.map((user) => {
                const isMe = String(user._id) === String(currentUser?._id || currentUser?.id);
                return (
                  <tr key={user._id} className={`transition-colors group ${ isMe ? 'bg-[#FFC509]/[0.02] hover:bg-[#FFC509]/[0.06]' : 'hover:bg-white/[0.01]'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center font-bold text-[#FFC509]">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0A] ${getPulseStatus(user.lastActive).color}`} />
                        </div>
                        
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-white truncate">{user.name || "User"}</p>
                            {isMe && (
                              <span className="text-[10px] bg-[#FFC509]/10 text-[#FFC509] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                You
                              </span>
                            )}
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
                          onClick={() => handleRoleClick(user)}
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
                        <Tooltip text={isMe ? "Cannot warn yourself" : "Issue Warning"}>
                          <button 
                            onClick={() => handleWarn(user._id)} 
                            disabled={isMe}
                            className={`p-2 rounded-lg transition-colors ${isMe ? 'opacity-20 cursor-not-allowed' : 'hover:bg-yellow-500/10 text-yellow-600'}`}
                          >
                            <AlertTriangle size={16} />
                          </button>
                        </Tooltip>

                        <Tooltip text={isMe ? "No warnings to clear" : "Clear All Warnings"}>
                          <button 
                            disabled={isMe}
                            onClick={() => handleClearWarnings(user._id)} 
                            className={`p-2 rounded-lg transition-colors ${isMe ? 'opacity-20 cursor-not-allowed' : 'hover:bg-green-500/10 text-green-600'}`}
                          >
                            <CheckCircle size={16} />
                          </button>
                        </Tooltip>
                        
                        <Tooltip text={isMe ? "Cannot ban yourself" : (user.status === 'banned' ? 'Restore User' : 'Ban User')}>
                          <button 
                            onClick={() => handleBanClick(user)}
                            disabled={isMe}
                            className={`p-2 rounded-lg transition-colors ${
                              isMe 
                                ? 'opacity-20 cursor-not-allowed text-neutral-500' 
                                : user.status === 'banned' 
                                  ? 'hover:bg-green-500/10 text-green-600' 
                                  : 'hover:bg-red-500/10 text-red-600'
                            }`}
                          >
                            {user.status === 'banned' ? <RefreshCcw size={16} /> : <UserX size={16} />}
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* common action modal */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        onCancel={closeModal}
        variant={modalConfig.variant}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        onConfirm={() => {
          modalConfig.onConfirm();
          closeModal();
        }}
      />
    </div>
  );
};

export default AdminUsersList;