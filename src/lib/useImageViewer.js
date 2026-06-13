// Imperative pan/zoom/rotate controller for an image viewer.
// Supports: wheel zoom, drag-to-pan, pinch zoom (touch), and rotation.
//
// State is kept in refs + a counter so re-renders are cheap — only the
// transform string re-renders on each interaction, the underlying <img>
// stays mounted.

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
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0, rot: 0 });
  const [_, force] = useState(0);
  const rerender = () => force((n) => n + 1);

  // Working state held in refs so event handlers don't capture stale values.
  const stateRef = useRef({ scale: 1, x: 0, y: 0, rot: 0 });
  const containerRef = useRef(null);
  const pointersRef = useRef(new Map()); // pointerId -> {x, y}
  const pinchStartRef = useRef(null); // {dist, scale}
  const panStartRef = useRef(null); // {x, y, startX, startY}

  const commit = useCallback(() => {
    setTransform({ ...stateRef.current });
  }, []);

  const setScaleAround = useCallback(
    (newScale, originX, originY) => {
      const s = stateRef.current;
      const clamped = clamp(newScale, MIN_SCALE, MAX_SCALE);
      if (clamped === s.scale) return;
      // Keep the point under the cursor stationary while zooming.
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        s.scale = clamped;
        commit();
        return;
      }
      const cx = originX ?? rect.width / 2;
      const cy = originY ?? rect.height / 2;
      const ratio = clamped / s.scale;
      s.x = cx - (cx - s.x) * ratio;
      s.y = cy - (cy - s.y) * ratio;
      s.scale = clamped;
      commit();
    },
    [commit],
  );

  const reset = useCallback(() => {
    stateRef.current = { scale: 1, x: 0, y: 0, rot: 0 };
    commit();
  }, [commit]);

  const zoomIn = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    setScaleAround(stateRef.current.scale + ZOOM_STEP, rect?.width / 2, rect?.height / 2);
  }, [setScaleAround]);

  const zoomOut = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    setScaleAround(stateRef.current.scale - ZOOM_STEP, rect?.width / 2, rect?.height / 2);
  }, [setScaleAround]);

  const rotate = useCallback(() => {
    stateRef.current.rot = (stateRef.current.rot + 90) % 360;
    commit();
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
    } else if (pointersRef.current.size === 1 && stateRef.current.scale > 1) {
      // Pan with single pointer only when zoomed in.
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
        const newScale = pinchStartRef.current.scale * (d / pinchStartRef.current.dist);
        // Pinch zooms about the midpoint of the two fingers.
        setScaleAround(
          newScale,
          (a.x + b.x) / 2 - containerRef.current.getBoundingClientRect().left,
          (a.y + b.y) / 2 - containerRef.current.getBoundingClientRect().top,
        );
      } else if (
        pointersRef.current.size === 1 &&
        panStartRef.current &&
        stateRef.current.scale > 1
      ) {
        const p = pointersRef.current.get(e.pointerId);
        const s = stateRef.current;
        s.x = panStartRef.current.startTx + (p.x - panStartRef.current.startX);
        s.y = panStartRef.current.startTy + (p.y - panStartRef.current.startY);
        rerender();
      }
    },
    [setScaleAround],
  );

  const onPointerUp = useCallback((e) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) panStartRef.current = null;
  }, []);

  // ------- Wheel zoom (desktop) -------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const delta = -e.deltaY * 0.0015;
      setScaleAround(stateRef.current.scale * (1 + delta), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [setScaleAround]);

  const cursor =
    stateRef.current.scale > 1 ? (panStartRef.current ? 'grabbing' : 'grab') : 'zoom-in';

  return {
    transform,
    stateRef,
    containerRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    cursor,
    actions: { zoomIn, zoomOut, rotate, reset },
  };
}
