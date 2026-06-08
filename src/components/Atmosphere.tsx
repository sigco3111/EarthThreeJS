import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereProps {
  opacity: number;
  fresnelPower: number;
  intensity: number;
  color: string;
}

const atmosVertex = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const atmosFragment = `
  uniform float uOpacity;
  uniform float uFresnelPower;
  uniform float uIntensity;
  uniform vec3 uColor;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = 1.0 - dot(vNormal, vViewDir);
    fresnel = clamp(fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, uFresnelPower);

    vec3 glow = uColor * fresnel * uIntensity;
    float alpha = fresnel * uOpacity;

    gl_FragColor = vec4(glow, alpha);
  }
`;

export function Atmosphere({ opacity, fresnelPower, intensity, color }: AtmosphereProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const atmosColor = useMemo(() => new THREE.Color(color), [color]);

  const uniforms = useMemo(() => ({
    uOpacity: { value: opacity },
    uFresnelPower: { value: fresnelPower },
    uIntensity: { value: intensity },
    uColor: { value: atmosColor },
  }), []);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uOpacity.value = opacity;
      matRef.current.uniforms.uFresnelPower.value = fresnelPower;
      matRef.current.uniforms.uIntensity.value = intensity;
      matRef.current.uniforms.uColor.value.set(color);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.025, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={atmosVertex}
        fragmentShader={atmosFragment}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}
