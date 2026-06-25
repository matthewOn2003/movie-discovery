import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a Sheet provider');
  }
  return context;
}

interface SheetProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  function setOpen(newOpen: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  }

  // Prevent scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SheetTrigger({ children, className }: SheetTriggerProps) {
  const { setOpen } = useSheet();
  return (
    <button
      id="sheet-trigger-btn"
      onClick={() => setOpen(true)}
      className={className}
    >
      {children}
    </button>
  );
}

interface SheetContentProps {
  children: ReactNode;
  side?: 'bottom' | 'right' | 'left' | 'top';
  className?: string;
}

export function SheetContent({ children, side = 'bottom', className = '' }: SheetContentProps) {
  const { open, setOpen } = useSheet();

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 0.5 },
  };

  const panelVariants = {
    closed: {
      y: side === 'bottom' ? '100%' : 0,
      x: side === 'right' ? '100%' : side === 'left' ? '-100%' : 0,
    },
    open: {
      y: 0,
      x: 0,
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sliding Content */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`relative z-50 w-full max-h-[85vh] overflow-y-auto bg-slate-900 border-t border-slate-800 rounded-t-2xl p-6 shadow-2xl flex flex-col ${className}`}
          >
            {/* Drawer Drag Indicator */}
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-slate-700" />

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              aria-label="Close sheet"
            >
              <X size={18} />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export function SheetHeader({ children, className = '' }: HeaderProps) {
  return <div className={`mb-4 flex flex-col space-y-1.5 text-left ${className}`}>{children}</div>;
}

export function SheetTitle({ children, className = '' }: HeaderProps) {
  return <h2 className={`text-lg font-semibold text-slate-100 ${className}`}>{children}</h2>;
}

export function SheetDescription({ children, className = '' }: HeaderProps) {
  return <p className={`text-sm text-slate-400 ${className}`}>{children}</p>;
}
