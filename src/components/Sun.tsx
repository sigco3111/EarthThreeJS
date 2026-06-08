import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
  sunDirection: THREE.Vector3;
  intensity: number;
  color: string;
  size: number;
}

const sunGlowVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunGlowFragment = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center) * 2.0;
    
    // Bright white core - much sharper for a realistic vacuum sun
    float core = 1.0 - smoothstep(0.0, 0.05, dist);
    
    // Tight inner glow just to soften the edge slightly for the Bloom pass
    float innerGlow = exp(-dist * 8.0) * 0.5;
    
    float totalGlow = (core + innerGlow) * uIntensity;
    
    // White core blending into the chosen sun color
    vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), clamp(core * 2.0, 0.0, 1.0));
    
    // We let the post-processing Bloom handle the wide soft glow, avoiding any 8-bit banding rings
    float alpha = clamp(totalGlow, 0.0, 1.0);
    float edgeFade = smoothstep(1.0, 0.6, dist); // Smoothly fade any remaining pixels before the square edge
    
    gl_FragColor = vec4(finalColor, alpha * edgeFade);
  }
`;

export function Sun({ sunDirection, intensity, color, size }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const distance = 80;

  const sunColor = useMemo(() => new THREE.Color(color), [color]);

  const uniforms = useMemo(() => ({
    uColor: { value: sunColor },
    uIntensity: { value: intensity },
  }), [sunColor, intensity]);

  // Face the camera every frame & update uniforms
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.set(
        sunDirection.x * distance,
        sunDirection.y * distance,
        sunDirection.z * distance,
      );
      meshRef.current.quaternion.copy(camera.quaternion);
    }
    if (matRef.current) {
      matRef.current.uniforms.uColor.value.set(color);
      matRef.current.uniforms.uIntensity.value = intensity;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={sunGlowVertex}
        fragmentShader={sunGlowFragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
