// Imperative pan/zoom/rotate controller for an image viewer.
// Supports: wheel zoom, drag-to-pan, pinch zoom (touch), and rotation.
//
// The wheel listener is attached via a callback ref so it binds at the
// exact moment the viewer element mounts. The pointer listeners live on
// React props so they re-attach on every render automatically.

import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const ZOOM_STEP = 0.25;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function distance(a, b) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

export function useImageViewer() {
  // Single source of truth: React state. We render directly from it.
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0,
    rot: 0,
  });

  // Mirror in a ref so event handlers always read the latest values
  // without re-binding on every render.
  const stateRef = useRef({ scale: 1, x: 0, y: 0, rot: 0 });
  useEffect(() => {
    stateRef.current = transform;
  }, [transform]);

  const containerRef = useRef(null);
  const pointersRef = useRef(new Map()); // pointerId -> {x, y}
  const pinchStartRef = useRef(null); // {dist, scale}
  const panStartRef = useRef(null); // {startX, startY, startTx, startTy}

  const commit = useCallback((patch = {}) => {
    setTransform((prev) => ({ ...prev, ...patch }));
  }, []);

  const setScaleAround = useCallback(
    (newScale, originX, originY) => {
      const s = stateRef.current;
      const clamped = clamp(newScale, MIN_SCALE, MAX_SCALE);
      if (clamped === s.scale) return;
      const el = containerRef.current;
      if (!el) {
        commit({ scale: clamped });
        return;
      }
      const rect = el.getBoundingClientRect();
      const cx = originX ?? rect.width / 2;
      const cy = originY ?? rect.height / 2;
      const ratio = clamped / s.scale;
      const nx = cx - (cx - s.x) * ratio;
      const ny = cy - (cy - s.y) * ratio;
      commit({ scale: clamped, x: nx, y: ny });
    },
    [commit],
  );

  const reset = useCallback(() => {
    commit({ scale: 1, x: 0, y: 0, rot: 0 });
  }, [commit]);

  const zoomIn = useCallback(() => {
    const el = containerRef.current;
    const rect = el?.getBoundingClientRect();
    setScaleAround(
      stateRef.current.scale + ZOOM_STEP,
      rect ? rect.width / 2 : undefined,
      rect ? rect.height / 2 : undefined,
    );
  }, [setScaleAround]);

  const zoomOut = useCallback(() => {
    const el = containerRef.current;
    const rect = el?.getBoundingClientRect();
    setScaleAround(
      stateRef.current.scale - ZOOM_STEP,
      rect ? rect.width / 2 : undefined,
      rect ? rect.height / 2 : undefined,
    );
  }, [setScaleAround]);

  const rotate = useCallback(() => {
    commit({ rot: (stateRef.current.rot + 90) % 360 });
  }, [commit]);

  // ------- Pointer / mouse handlers -------
  const onPointerDown = useCallback((e) => {
    containerRef.current?.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchStartRef.current = {
        dist: distance(a, b),
        scale: stateRef.current.scale,
      };
      panStartRef.current = null;
    } else if (pointersRef.current.size === 1) {
      // Pan is allowed at any zoom level — lets the user slide the work
      // around the frame even before committing to a magnification.
      const p = pointersRef.current.get(e.pointerId);
      panStartRef.current = {
        startX: p.x,
        startY: p.y,
        startTx: stateRef.current.x,
        startTy: stateRef.current.y,
      };
    }
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const [a, b] = [...pointersRef.current.values()];
        const d = distance(a, b);
        const newScale =
          pinchStartRef.current.scale * (d / pinchStartRef.current.dist);
        const el = containerRef.current;
        const rect = el?.getBoundingClientRect();
        setScaleAround(
          newScale,
          rect ? (a.x + b.x) / 2 - rect.left : undefined,
          rect ? (a.y + b.y) / 2 - rect.top : undefined,
        );
      } else if (pointersRef.current.size === 1 && panStartRef.current) {
        const p = pointersRef.current.get(e.pointerId);
        commit({
          x: panStartRef.current.startTx + (p.x - panStartRef.current.startX),
          y: panStartRef.current.startTy + (p.y - panStartRef.current.startY),
        });
      }
    },
    [commit, setScaleAround],
  );

  const onPointerUp = useCallback((e) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) panStartRef.current = null;
  }, []);

  // ------- Wheel zoom (desktop) -------
  // Callback ref guarantees the listener is attached exactly when the
  // viewer element mounts — no race with the modal's conditional render.
  const containerCallbackRef = useCallback(
    (el) => {
      // Tear down the previous binding (if any) so re-mounts don't leak.
      if (containerRef.current && containerRef.current._wheelHandler) {
        containerRef.current.removeEventListener(
          'wheel',
          containerRef.current._wheelHandler,
        );
      }
      containerRef.current = el;
      if (!el) return;
      const onWheel = (e) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const delta = -e.deltaY * 0.0015;
        setScaleAround(
          stateRef.current.scale * (1 + delta),
          e.clientX - rect.left,
          e.clientY - rect.top,
        );
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      el._wheelHandler = onWheel;
    },
    [setScaleAround],
  );

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      const el = containerRef.current;
      if (el && el._wheelHandler) {
        el.removeEventListener('wheel', el._wheelHandler);
      }
    };
  }, []);

  // Always grabbable so the affordance is visible from the start.
  const cursor = panStartRef.current ? 'grabbing' : 'grab';

  return {
    transform,
    containerCallbackRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
    cursor,
    actions: { zoomIn, zoomOut, rotate, reset },
  };
}
