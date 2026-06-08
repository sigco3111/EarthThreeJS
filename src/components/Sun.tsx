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
    
    // Bright white core
    float core = 1.0 - smoothstep(0.0, 0.12, dist);
    
    // Inner glow — tight falloff
    float innerGlow = exp(-dist * 5.0) * 0.9;
    
    // Outer glow — soft wide falloff
    float outerGlow = exp(-dist * 1.8) * 0.25;
    
    // Subtle corona rays
    float angle = atan(center.y, center.x);
    float rays = 0.5 + 0.5 * sin(angle * 12.0);
    rays *= exp(-dist * 2.5) * 0.1;
    
    float totalGlow = (core + innerGlow + outerGlow + rays) * uIntensity;
    
    // White core blending into warm sun color
    vec3 coreColor = vec3(1.0, 1.0, 1.0);
    vec3 finalColor = mix(uColor, coreColor, core * 0.8 + innerGlow * 0.3) * totalGlow;
    
    float alpha = clamp(totalGlow, 0.0, 1.0);
    
    // Smoothly fade to 0 before the edge of the square plane
    float edgeFade = smoothstep(1.0, 0.8, dist);
    alpha *= edgeFade;
    
    gl_FragColor = vec4(finalColor, alpha);
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
  }), []);

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
