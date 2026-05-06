'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  /** DOMRect of the trigger element. Panel positions itself near this rect. */
  anchorRect: DOMRect | null;
  onClose: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
  /** Max width in px. Default 340. */
  maxWidth?: number;
}

interface Pos {
  top: number;
  left: number;
  width: number;
  placement: 'below' | 'above';
  arrowLeft: number;
}

export default function AnchoredPanel({
  open,
  anchorRect,
  onClose,
  ariaLabel,
  children,
  maxWidth = 340,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  useLayoutEffect(() => {
    if (!open || !anchorRect) {
      setPos(null);
      return;
    }
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 10;
      const panel = panelRef.current;
      const panelHeight = panel?.offsetHeight ?? 280;
      const panelWidth = Math.min(maxWidth, vw - margin * 2);

      const spaceBelow = vh - anchorRect.bottom;
      const spaceAbove = anchorRect.top;
      const placement: 'below' | 'above' =
        spaceBelow >= panelHeight + margin || spaceBelow >= spaceAbove ? 'below' : 'above';

      let top =
        placement === 'below'
          ? anchorRect.bottom + margin
          : anchorRect.top - panelHeight - margin;
      if (top + panelHeight > vh - margin) top = vh - panelHeight - margin;
      if (top < margin) top = margin;

      const anchorCenterX = anchorRect.left + anchorRect.width / 2;
      let left = anchorCenterX - panelWidth / 2;
      if (left < margin) left = margin;
      if (left + panelWidth > vw - margin) left = vw - margin - panelWidth;

      const arrowLeft = Math.max(14, Math.min(panelWidth - 14, anchorCenterX - left));
      setPos({ top, left, width: panelWidth, placement, arrowLeft });
    };
    compute();
    const id = requestAnimationFrame(compute);
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [open, anchorRect, maxWidth]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  const panelBg = 'var(--canvas, #0E1320)';
  const panelBorder = '1px solid rgba(255,255,255,0.08)';

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(7,11,20,0.32)',
      }}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: pos?.top ?? -9999,
          left: pos?.left ?? -9999,
          width: pos?.width ?? maxWidth,
          background: panelBg,
          border: panelBorder,
          borderRadius: 14,
          padding: 14,
          boxShadow: '0 14px 32px rgba(0,0,0,0.5)',
          maxHeight: '70vh',
          overflowY: 'auto',
          opacity: pos ? 1 : 0,
          transition: 'opacity 120ms ease',
        }}
      >
        {pos && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: pos.arrowLeft - 6,
              top: pos.placement === 'below' ? -6 : undefined,
              bottom: pos.placement === 'above' ? -6 : undefined,
              width: 11,
              height: 11,
              transform: 'rotate(45deg)',
              background: panelBg,
              borderTop: pos.placement === 'below' ? panelBorder : 'none',
              borderLeft: pos.placement === 'below' ? panelBorder : 'none',
              borderBottom: pos.placement === 'above' ? panelBorder : 'none',
              borderRight: pos.placement === 'above' ? panelBorder : 'none',
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}
