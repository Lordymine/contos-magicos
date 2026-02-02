'use client'

import { useEffect } from 'react'
import { Bell, Check, CheckCheck, Inbox, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useNotifications } from '@/features/stories/hooks/useNotifications'

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-[#FDF8F3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
              <h1 className="text-2xl font-bold text-[#2C2416] flex items-center gap-2">
                Notificações
                {unreadCount > 0 && (
                    <span className="bg-[#2D5A4A] text-[#FDF8F3] text-xs font-semibold px-2.5 py-0.5 rounded-lg">
                    {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                    </span>
                )}
              </h1>
              <p className="text-[#8B7D6B] mt-1 text-sm">Acompanhe as interações nas suas histórias</p>
          </div>
          
          {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead} 
                className="text-[#2D5A4A] hover:text-[#1E3D32] hover:bg-[#E8F3EF] font-medium rounded-lg"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Marcar todas
              </Button>
          )}
        </div>

        <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A4A] mx-auto mb-4"></div>
                  <p className="text-[#8B7D6B] text-sm font-medium">Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <Card className="border border-dashed border-[#E8DFD4] bg-[#F5EDE4] rounded-xl py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                      <div className="bg-[#FDF8F3] p-4 rounded-xl border border-[#E8DFD4] mb-4">
                          <Inbox className="h-6 w-6 text-[#A89B8C]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#2C2416]">Nenhuma notificação</h3>
                      <p className="text-[#8B7D6B] max-w-xs mx-auto mt-1 text-sm">
                      Você não tem novas notificações no momento.
                      </p>
                  </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                      notification.read 
                          ? 'bg-[#FDF8F3] border-[#E8DFD4]' 
                          : 'bg-[#E8F3EF] border-[#2D5A4A]/20'
                    }`}
                  >
                    {!notification.read && (
                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#2D5A4A]"></div>
                    )}
                    
                    <div className="flex items-start gap-3 pr-6">
                      <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                          notification.read ? 'bg-[#F5EDE4] text-[#A89B8C]' : 'bg-[#FDF8F3] text-[#2D5A4A]'
                      }`}>
                          <Bell className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-semibold text-sm ${notification.read ? 'text-[#8B7D6B]' : 'text-[#2C2416]'}`}>
                                  {notification.title}
                              </h4>
                          </div>
                          <p className="text-sm text-[#5C4D3A] leading-relaxed mb-2">
                              {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-[#A89B8C] font-medium">
                                  <Clock className="h-3 w-3 mr-1.5" />
                                  {notification.timeAgo}
                              </div>
                              
                              {!notification.read && (
                                  <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-7 text-xs font-medium text-[#2D5A4A] hover:text-[#1E3D32] hover:bg-[#FDF8F3] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                  <Check className="h-3 w-3 mr-1.5" />
                                  Marcar como lida
                                  </Button>
                              )}
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
