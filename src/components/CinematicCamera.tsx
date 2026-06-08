export const CINEMATIC_PATHS = [
  { name: 'Orbit Earth', duration: 30 },
  { name: 'Sunrise Reveal', duration: 15 },
  { name: 'Nightside City Lights', duration: 12 },
  { name: 'Distant Approach', duration: 10 }
];

interface CinematicCameraProps {
  active: boolean;
  currentPath: string;
  onPathChange: (path: string) => void;
  onEnd: () => void;
  setDayNightProgress?: (val: number) => void;
}

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export function CinematicCamera({ active, currentPath, onPathChange, onEnd, setDayNightProgress }: CinematicCameraProps) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const pathIndexRef = useRef(0);
  
  // Transition state
  const isFadingOutRef = useRef(false);

  useEffect(() => {
    if (active) {
      timeRef.current = 0;
      pathIndexRef.current = 0;
      isFadingOutRef.current = false;
      onPathChange(CINEMATIC_PATHS[0].name);
      
      // Fade in from black at the start of cinematic mode
      gsap.fromTo('#cinematic-fade-overlay', 
        { opacity: 1 }, 
        { opacity: 0, duration: 1.5, ease: 'power2.out' }
      );
    }
  }, [active, onPathChange]);

  useFrame((state, delta) => {
    if (!active) return;
    
    timeRef.current += delta;
    const currentSeq = CINEMATIC_PATHS[pathIndexRef.current];
    
    // Start fading out 1 second before the sequence ends
    if (timeRef.current > currentSeq.duration - 1.0 && !isFadingOutRef.current) {
      isFadingOutRef.current = true;
      gsap.to('#cinematic-fade-overlay', {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.inOut'
      });
    }
    
    // Switch sequence when duration is hit
    if (timeRef.current > currentSeq.duration) {
      timeRef.current = 0;
      pathIndexRef.current++;
      isFadingOutRef.current = false;
      
      if (pathIndexRef.current >= CINEMATIC_PATHS.length) {
        onEnd();
        gsap.to('#cinematic-fade-overlay', { opacity: 0, duration: 1.0 });
        return;
      }
      
      onPathChange(CINEMATIC_PATHS[pathIndexRef.current].name);
      
      // Fade back in for the new sequence
      gsap.to('#cinematic-fade-overlay', {
        opacity: 0,
        duration: 1.0,
        ease: 'power2.inOut'
      });
    }
    
    const progress = timeRef.current / currentSeq.duration;
    
    // Calculate ideal position based on path
    switch (currentSeq.name) {
      case 'Orbit Earth':
        camera.position.set(
          Math.sin(progress * Math.PI * 2) * 3,
          0.5 * Math.sin(progress * Math.PI * 2),
          Math.cos(progress * Math.PI * 2) * 3
        );
        break;
      case 'Sunrise Reveal':
        const srAngle = Math.PI * 1.2 - progress * Math.PI * 0.5;
        const srDist = 2.2 - progress * 0.4;
        camera.position.set(
          Math.sin(srAngle) * srDist,
          -0.5 + progress,
          Math.cos(srAngle) * srDist
        );
        if (setDayNightProgress) setDayNightProgress(0.4 + progress * 0.2);
        break;
      case 'Nightside City Lights':
        camera.position.set(
          -2,
          1 * Math.sin(progress * Math.PI),
          -1
        );
        if (setDayNightProgress) setDayNightProgress(0.7 + progress * 0.2);
        break;
      case 'Distant Approach':
        const dist = 10 - progress * 7;
        camera.position.set(dist, dist * 0.2, dist);
        break;
    }
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}
