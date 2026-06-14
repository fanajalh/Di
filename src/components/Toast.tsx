import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, Loader2, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, 0 = persistent (for loading)
}

// ─── Hook for toast management ───
let globalAddToast: ((toast: Omit<ToastItem, 'id'>) => string) | null = null;
let globalDismissToast: ((id: string) => void) | null = null;
let globalUpdateToast: ((id: string, updates: Partial<Omit<ToastItem, 'id'>>) => void) | null = null;

export function toast(message: string, type: ToastType = 'info', duration?: number): string {
  if (!globalAddToast) return '';
  return globalAddToast({ message, type, duration });
}

export function toast_dismiss(id: string) {
  globalDismissToast?.(id);
}

export function toast_update(id: string, updates: Partial<Omit<ToastItem, 'id'>>) {
  globalUpdateToast?.(id, updates);
}

// Convenience wrappers
toast.success = (msg: string, duration = 4000) => toast(msg, 'success', duration);
toast.error = (msg: string, duration = 5000) => toast(msg, 'error', duration);
toast.loading = (msg: string) => toast(msg, 'loading', 0);
toast.info = (msg: string, duration = 4000) => toast(msg, 'info', duration);
toast.dismiss = toast_dismiss;
toast.update = toast_update;

// ─── Toast icons/colors per type ───
const TOAST_CONFIG: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-[#0A1A0A]',
    border: 'border-emerald-900/50',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: XCircle,
    bg: 'bg-[#1A0A0A]',
    border: 'border-red-900/50',
    iconColor: 'text-red-400',
  },
  loading: {
    icon: Loader2,
    bg: 'bg-[#0A0A14]',
    border: 'border-blue-900/50',
    iconColor: 'text-blue-400',
  },
  info: {
    icon: Info,
    bg: 'bg-[#141414]',
    border: 'border-[#3A3A3A]',
    iconColor: 'text-[#8A8A8A]',
  },
};

// ─── Toast Container Component ───
export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((t: Omit<ToastItem, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { ...t, id }]);

    const dur = t.duration ?? (t.type === 'loading' ? 0 : 4000);
    if (dur > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== id));
      }, dur);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Omit<ToastItem, 'id'>>) => {
    setToasts(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates };
        // If updating to non-loading with auto-dismiss
        if (updates.type && updates.type !== 'loading') {
          const dur = updates.duration ?? (updates.type === 'error' ? 5000 : 4000);
          if (dur > 0) {
            setTimeout(() => {
              setToasts(p => p.filter(x => x.id !== id));
            }, dur);
          }
        }
        return updated;
      })
    );
  }, []);

  // Register globals
  useEffect(() => {
    globalAddToast = addToast;
    globalDismissToast = dismissToast;
    globalUpdateToast = updateToast;
    return () => {
      globalAddToast = null;
      globalDismissToast = null;
      globalUpdateToast = null;
    };
  }, [addToast, dismissToast, updateToast]);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const config = TOAST_CONFIG[t.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className={`pointer-events-auto ${config.bg} border ${config.border} rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xl shadow-black/60 backdrop-blur-md`}
            >
              <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
                <Icon className={`w-[18px] h-[18px] ${t.type === 'loading' ? 'animate-spin' : ''}`} />
              </div>
              <p className="text-[13px] text-white/90 font-medium leading-snug flex-1 font-sans">
                {t.message}
              </p>
              {t.type !== 'loading' && (
                <button
                  onClick={() => dismissToast(t.id)}
                  className="shrink-0 text-white/30 hover:text-white/70 transition-colors cursor-pointer mt-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
