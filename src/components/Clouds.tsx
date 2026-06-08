import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudsProps {
  speed: number;
  opacity: number;
}

const cloudVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragment = `
  uniform sampler2D tClouds;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    float cloudAlpha = texture2D(tClouds, vUv).r;
    // Use cloud brightness as alpha mask - black = transparent, white = opaque
    gl_FragColor = vec4(1.0, 1.0, 1.0, cloudAlpha * uOpacity);
  }
`;

export function Clouds({ speed, opacity }: CloudsProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const cloudsMap = useLoader(THREE.TextureLoader, '/8k_earth_clouds.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
    if (matRef.current) {
      matRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.005, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={cloudVertex}
        fragmentShader={cloudFragment}
        uniforms={{
          tClouds: { value: cloudsMap },
          uOpacity: { value: opacity },
        }}
        transparent={true}
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
