import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudsProps {
  speed: number;
  opacity: number;
  darkOpacity: number;
  sunDirection: THREE.Vector3;
}

const cloudVertex = `
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragment = `
  uniform sampler2D tClouds;
  uniform float uOpacity;
  uniform float uDarkOpacity;
  uniform vec3 uSunDir;

  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    float cloudAlpha = texture2D(tClouds, vUv).r;

    // Sun-facing factor: 1 on lit side, 0 on dark side
    float sunFacing = dot(normalize(vNormalW), normalize(uSunDir));
    float litFactor = smoothstep(-0.2, 0.3, sunFacing);

    // Blend between dark opacity and full opacity based on lit side
    float finalOpacity = mix(uDarkOpacity, uOpacity, litFactor);

    gl_FragColor = vec4(1.0, 1.0, 1.0, cloudAlpha * finalOpacity);
  }
`;

export function Clouds({ speed, opacity, darkOpacity, sunDirection }: CloudsProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const cloudsMap = useLoader(THREE.TextureLoader, '/8k_earth_clouds.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
    if (matRef.current) {
      matRef.current.uniforms.uOpacity.value = opacity;
      matRef.current.uniforms.uDarkOpacity.value = darkOpacity;
      matRef.current.uniforms.uSunDir.value.copy(sunDirection).normalize();
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
          uDarkOpacity: { value: darkOpacity },
          uSunDir: { value: sunDirection.clone().normalize() },
        }}
        transparent={true}
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
