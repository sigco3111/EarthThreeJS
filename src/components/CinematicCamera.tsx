export const CINEMATIC_PATHS = [
  { name: 'Orbit Earth', duration: 15 },
  { name: 'Sunrise Reveal', duration: 12 },
  { name: 'Nightside City Lights', duration: 10 },
  { name: 'Distant Approach', duration: 8 }
];

interface CinematicCameraProps {
  active: boolean;
  currentPath: string;
  onPathChange: (path: string) => void;
  onEnd: () => void;
  setDayNightProgress?: (val: number) => void;
}

// Full implementation will use useFrame to animate camera based on currentPath
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CinematicCamera({ active, currentPath, onPathChange, onEnd, setDayNightProgress }: CinematicCameraProps) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const pathIndexRef = useRef(0);
  
  useEffect(() => {
    if (active) {
      timeRef.current = 0;
      pathIndexRef.current = 0;
      onPathChange(CINEMATIC_PATHS[0].name);
    }
  }, [active, onPathChange]);

  useFrame((state, delta) => {
    if (!active) return;
    
    timeRef.current += delta;
    const currentSeq = CINEMATIC_PATHS[pathIndexRef.current];
    
    if (timeRef.current > currentSeq.duration) {
      timeRef.current = 0;
      pathIndexRef.current++;
      
      if (pathIndexRef.current >= CINEMATIC_PATHS.length) {
        onEnd();
        return;
      }
      onPathChange(CINEMATIC_PATHS[pathIndexRef.current].name);
    }
    
    const progress = timeRef.current / currentSeq.duration;
    
    // Animate based on path
    switch (currentSeq.name) {
      case 'Orbit Earth':
        camera.position.set(
          Math.sin(progress * Math.PI * 2) * 3,
          0.5 * Math.sin(progress * Math.PI * 2),
          Math.cos(progress * Math.PI * 2) * 3
        );
        camera.lookAt(0, 0, 0);
        break;
      case 'Sunrise Reveal':
        // Start behind earth, move to side as sun comes up
        camera.position.set(
          -2 + progress * 4,
          0,
          -2 + progress * 4
        );
        camera.lookAt(0, 0, 0);
        if (setDayNightProgress) setDayNightProgress(progress);
        break;
      case 'Nightside City Lights':
        camera.position.set(
          -2,
          1 * Math.sin(progress * Math.PI),
          -1
        );
        camera.lookAt(0, 0, 0);
        if (setDayNightProgress) setDayNightProgress(0.7 + progress * 0.2); // Night side
        break;
      case 'Distant Approach':
        const dist = 10 - progress * 7;
        camera.position.set(dist, dist * 0.2, dist);
        camera.lookAt(0, 0, 0);
        break;
    }
  });

  return null;
}
