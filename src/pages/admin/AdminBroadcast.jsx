import React, { useState, useEffect } from "react";
import {
  Send,
  Users,
  User,
  RefreshCcw,
  LayoutList,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AdminNotificationDrawer from "../../components/notification/AdminNotificationDrawer";
import {
  getNotifications,
  sendNotification,
  deleteNotification,
  updateNotification,
} from "../../services/adminService";
import InfoTooltip from "../../components/ui/InfoTooltip";

const AdminBroadcast = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    title: "",
    message: "",
    type: "info",
    scheduledAt: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    if (isDrawerOpen) fetchNotifications();
  }, [isDrawerOpen]);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted successfully");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateNotification(id, updatedData);
      toast.success("Notification updated");
      fetchNotifications();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleReset = () => {
    setFormData({
      recipient: "",
      title: "",
      message: "",
      type: "info",
      scheduledAt: "",
    });
    setIsScheduled(false);
    toast.success("Form cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const recipientId = formData.recipient.trim();
    
    // Payload construction
    const payload = {
      title: formData.title,
      message: formData.message,
      type: formData.type,
      recipient: recipientId === "" ? null : recipientId,
      scheduledAt: isScheduled && formData.scheduledAt
        ? new Date(formData.scheduledAt).toISOString()
        : null,
    };

    try {
      await sendNotification(payload);
      toast.success(
        recipientId ? `Notification sent to ${recipientId}` : "Global broadcast sent"
      );
      handleReset();
    } catch (err) {
      toast.error("Failed to dispatch notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-[#050505] min-h-screen text-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-12">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Push <span className="text-[#FFC509]">Broadcast</span>
            </h1>
            <InfoTooltip
              title="Global Messaging"
              content="Send real-time alerts to users. Once sent, these appear instantly in the user's notification feed."
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-semibold uppercase tracking-widest">
            Dispatch system-wide alerts
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 sm:flex-none p-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:border-[#FFC509]/50 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider"
          >
            <LayoutList size={14} /> 
            <span>View History</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-500 hover:text-red-500 transition-all"
            title="Reset Form"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Targeting & Category */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Targeting</h2>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, recipient: "" })}
                className={`w-full py-4 rounded-2xl border transition-all flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest ${!formData.recipient ? "bg-[#FFC509] text-black border-[#FFC509]" : "bg-black border-white/5 text-white hover:bg-white/5"}`}
              >
                <Users size={14} /> All Users
              </button>

              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${formData.recipient ? "text-[#FFC509]" : "text-neutral-600"}`} size={16} />
                <input
                  type="text"
                  placeholder="SPECIFIC USER ID"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-2xl outline-none focus:border-[#FFC509]/30 text-white text-xs font-bold transition-all placeholder:text-neutral-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Category</h2>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-black px-5 py-4 border border-white/5 rounded-2xl outline-none text-xs font-bold appearance-none cursor-pointer text-white"
              >
                <option value="info">General Info</option>
                <option value="system">System Update</option>
                <option value="maintenance">Maintenance</option>
                <option value="warning">Warning</option>
                <option value="alert">Critical Alert</option>
              </select>
              <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-neutral-600 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Column: Composer */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 p-6 md:p-10 rounded-[2.5rem] flex flex-col">
          <div className="space-y-8 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Title</label>
              <input
                type="text"
                required
                placeholder="NOTIFICATION HEADLINE"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-transparent border-b border-white/5 py-4 text-xl md:text-2xl font-bold text-white outline-none focus:border-[#FFC509] transition-all placeholder:text-neutral-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Content</label>
              <textarea
                required
                rows="5"
                placeholder="Enter the message body here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent py-4 text-neutral-400 outline-none resize-none text-base md:text-lg leading-relaxed placeholder:text-neutral-800"
              />
            </div>

            {/* Scheduling UI */}
            <div className={`p-5 md:p-6 rounded-3xl border transition-all ${isScheduled ? "bg-[#FFC509]/5 border-[#FFC509]/20" : "bg-black border-white/5"}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isScheduled ? "bg-[#FFC509] text-black" : "bg-white/5 text-neutral-500"}`}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-wider">Schedule Send</span>
                    <span className="text-[10px] text-neutral-600 font-medium">Delay notification delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {isScheduled && (
                    <input
                      type="datetime-local"
                      required
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="flex-1 sm:flex-none bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none text-white focus:border-[#FFC509]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isScheduled ? "bg-red-500/10 text-red-500" : "bg-white/10 text-white"}`}
                  >
                    {isScheduled ? "Cancel" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="mt-8 md:mt-12 w-full py-5 md:py-6 bg-[#FFC509] text-black rounded-2xl md:rounded-[1.5rem] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[11px] md:text-[12px] flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? "DISPATCHING..." : (
              <>
                {isScheduled ? "SCHEDULE NOTIFICATION" : "SEND NOTIFICATION"} <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      <AdminNotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        fetchNotifications={fetchNotifications}
      />
    </div>
  );
};

export default AdminBroadcast;