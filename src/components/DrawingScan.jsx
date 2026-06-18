import { useMemo } from 'react';
import { drawingScanSvg } from '../lib/artwork';

export default function DrawingScan({ drawing, label = 'WORK SCAN', className = '' }) {
  const svg = useMemo(
    () => drawingScanSvg({ variant: drawing.variant, seed: drawing.id, label }),
    [drawing, label],
  );
  return (
    <div
      role="img"
      aria-label={`${drawing.title} wykonania ${drawing.author.firstName} ${drawing.author.lastName}`}
      className={className}
      style={{ width: '100%', height: '100%' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
