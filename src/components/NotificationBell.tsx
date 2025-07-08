import { useNotificationsByUser, useMarkAsRead, useDeleteNotification } from "../hooks/useNotifications";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { format } from "date-fns";
import { Bell, Trash2, Check } from "lucide-react";

function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: notifications = [], refetch } = useNotificationsByUser(user?.id || "");
  const markAsRead = useMarkAsRead();
  const deleteNotif = useDeleteNotification();

  const unreadCount = notifications.filter((n) => !n.was_read).length;

  const handleMarkRead = (id: string) => {
    markAsRead.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  const handleDelete = (id: string) => {
    deleteNotif.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white hover:text-yellow-300 transition duration-200 select-none cursor-pointer"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-auto border">
          <div className="p-3 font-semibold text-sm bg-[#005766] text-white rounded-t">
            Notificaciones
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm text-center">
              Sin notificaciones
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 border-b text-sm ${
                  notif.was_read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div className="font-semibold text-gray-800">{notif.name}</div>
                <div className="text-gray-600">{notif.description}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {format(new Date(notif.created_at), "PPpp")}
                </div>

                <div className="flex justify-end gap-2">
                  {!notif.was_read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-xs select-none cursor-pointer"
                    >
                      <Check size={14} />
                      Leída
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition text-xs select-none cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
