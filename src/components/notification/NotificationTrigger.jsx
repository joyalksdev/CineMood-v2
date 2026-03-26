import { Bell } from "lucide-react";

const NotificationTrigger = ({ onClick, unreadCount, isDrawerOpen }) => {
  // We only want to ping if there are unreads AND the drawer isn't currently open
  const shouldPing = unreadCount > 0 && !isDrawerOpen;

  return (
    <button 
      onClick={onClick}
      className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FFC509]/50 hover:bg-white/10 transition-all group"
    >
      <Bell 
        size={20} 
        className={`transition-colors ${unreadCount > 0 ? 'text-[#FFC509]' : 'text-neutral-400 group-hover:text-white'}`} 
      />
      
      {unreadCount > 0 && (
        <>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC509] text-[10px] font-black text-black shadow-[0_0_15px_#FFC509]">
            {unreadCount}
          </span>
          {/* Animated Ping: Only shows if drawer hasn't been opened yet */}
          {shouldPing && (
            <span className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-[#FFC509] opacity-75" />
          )}
        </>
      )}
    </button>
  );
};

export default NotificationTrigger