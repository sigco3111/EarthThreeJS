import { Suspense, useMemo } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { Earth } from './Earth';
import { Clouds } from './Clouds';
import { Atmosphere } from './Atmosphere';
import { Sun } from './Sun';
import { CinematicCamera } from './CinematicCamera';

interface EarthSceneProps {
  cloudSpeed: number;
  cloudOpacity: number;
  cloudDarkOpacity: number;
  atmosphereOpacity: number;
  atmosphereDarkOpacity: number;
  atmosphereFresnel: number;
  atmosphereIntensity: number;
  atmosphereColor: string;
  dayNightProgress: number;
  sunIntensity: number;
  sunColor: string;
  sunSize: number;
  earthDarkSideBrightness: number;
  earthNightLights: number;
  earthSpeed: number;
  starsCount: number;
  bloomIntensity: number;
  bloomThreshold: number;
  bloomRadius: number;
  chromaticAberration: number;
  vignetteIntensity: number;
  cinematicMode: boolean;
  onPathChange: (path: string) => void;
  onCinematicEnd: () => void;
  setDayNightProgress: (val: number) => void;
}

export function EarthScene(props: EarthSceneProps) {
  const sunDirection = useMemo(() => {
    const angle = props.dayNightProgress * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle), 0.15, Math.sin(angle)).normalize();
  }, [props.dayNightProgress]);

  return (
    <Suspense fallback={null}>
      {/* Very dim ambient so the dark side isn't completely invisible */}
      <ambientLight intensity={0.02} color="#1a1a3a" />

      <Sun
        sunDirection={sunDirection}
        intensity={props.sunIntensity}
        color={props.sunColor}
        size={props.sunSize}
      />

      {/* Layer 1: Earth surface (day map + emissive night lights + normal + specular) */}
      <Earth 
        sunDirection={sunDirection} 
        sunIntensity={props.sunIntensity} 
        sunColor={props.sunColor}
        darkSideBrightness={props.earthDarkSideBrightness}
        nightLightsIntensity={props.earthNightLights}
        rotationSpeed={props.earthSpeed}
      />

      {/* Layer 2: Cloud layer (cloud texture as opacity mask on separate sphere) */}
      <Clouds 
        speed={props.cloudSpeed} 
        opacity={props.cloudOpacity} 
        darkOpacity={props.cloudDarkOpacity}
        sunDirection={sunDirection}
      />

      {/* Layer 3: Ozone / atmosphere glow (fresnel rim glow) */}
      <Atmosphere
        opacity={props.atmosphereOpacity}
        darkOpacity={props.atmosphereDarkOpacity}
        fresnelPower={props.atmosphereFresnel}
        intensity={props.atmosphereIntensity}
        color={props.atmosphereColor}
        sunDirection={sunDirection}
      />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={props.starsCount} factor={4} saturation={0} fade speed={0.5} />

      {/* Camera controls - disabled during cinematic mode */}
      {!props.cinematicMode && (
        <OrbitControls
          enablePan={false}
          minDistance={1.2}
          maxDistance={10}
          zoomSpeed={0.5}
          rotateSpeed={0.4}
          enableDamping={true}
          dampingFactor={0.05}
        />
      )}

      <CinematicCamera
        active={props.cinematicMode}
        currentPath=""
        onPathChange={props.onPathChange}
        onEnd={props.onCinematicEnd}
        setDayNightProgress={props.setDayNightProgress}
      />

      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom
          intensity={props.bloomIntensity}
          luminanceThreshold={props.bloomThreshold}
          luminanceSmoothing={props.bloomRadius}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(props.chromaticAberration, props.chromaticAberration)}
          blendFunction={BlendFunction.NORMAL}
        />
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={props.vignetteIntensity}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Suspense>
  );
}
