import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  dismissToast 
} from '../store/slices/notificationSlice';
import { 
  Bell, 
  Check, 
  ExternalLink, 
  Mail, 
  X, 
  ShoppingBag, 
  Award, 
  Truck, 
  Info,
  CheckCheck
} from 'lucide-react';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, activeToast } = useSelector((state) => state.notifications);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Poll notifications every 12 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(fetchNotifications());
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 12000);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-dismiss floating toast after 7 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        dispatch(dismissToast());
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, dispatch]);

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    dispatch(markNotificationAsRead(id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'VENDOR_STATUS':
        return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'EVALUATION':
        return <Award className="w-4 h-4 text-indigo-400" />;
      case 'PO_STATUS':
        return <ShoppingBag className="w-4 h-4 text-sky-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        title="View Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Notifications ({notifications.length})
              </h4>
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800 text-xs">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No notifications received yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 transition-colors flex items-start space-x-3 ${
                    n.isRead ? 'bg-slate-900/40 hover:bg-slate-800/40' : 'bg-slate-850/90 hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-white text-xs truncate">{n.title}</h5>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>

                    <div className="flex items-center space-x-3 mt-2">
                      {n.emailPreviewUrl && (
                        <a
                          href={n.emailPreviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-[10px] text-sky-400 hover:text-sky-300 font-semibold"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Ethereal Email ↗</span>
                        </a>
                      )}

                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          className="text-[10px] text-slate-400 hover:text-emerald-400 font-medium ml-auto flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating In-App Toast Popup */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-sky-500/50 rounded-2xl shadow-2xl p-4 flex items-start space-x-3 backdrop-blur transform transition-all animate-in slide-in-from-bottom duration-300">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex-shrink-0">
            {getNotificationIcon(activeToast.type)}
          </div>

          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-white text-xs truncate">{activeToast.title}</h5>
              <button
                onClick={() => dispatch(dismissToast())}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-300 text-[11px] mt-1">{activeToast.message}</p>

            {activeToast.emailPreviewUrl && (
              <a
                href={activeToast.emailPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] text-sky-400 hover:text-sky-300 font-bold mt-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Ethereal Test Email ↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
