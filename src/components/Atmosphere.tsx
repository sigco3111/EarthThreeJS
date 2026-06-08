import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereProps {
  opacity: number;
  darkOpacity: number;
  fresnelPower: number;
  intensity: number;
  color: string;
  sunDirection: THREE.Vector3;
}

const atmosVertex = `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDirW = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const atmosFragment = `
  uniform float uOpacity;
  uniform float uDarkOpacity;
  uniform float uFresnelPower;
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform vec3 uSunDir;

  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  void main() {
    // Correct world-space fresnel calculation for perfect rim
    float fresnel = 1.0 - max(dot(normalize(vNormalW), normalize(vViewDirW)), 0.0);
    fresnel = pow(fresnel, uFresnelPower);

    // Sun-facing factor
    float sunFacing = dot(normalize(vNormalW), normalize(uSunDir));
    // Smooth transition across the terminator line
    float litFactor = smoothstep(-0.2, 0.2, sunFacing);

    // Blend opacity between dark and lit sides
    float sideOpacity = mix(uDarkOpacity, uOpacity, litFactor);

    vec3 glow = uColor * uIntensity;
    float alpha = fresnel * sideOpacity;

    gl_FragColor = vec4(glow, alpha);
  }
`;

export function Atmosphere({ opacity, darkOpacity, fresnelPower, intensity, color, sunDirection }: AtmosphereProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const atmosColor = useMemo(() => new THREE.Color(color), [color]);

  const uniforms = useMemo(() => ({
    uOpacity: { value: opacity },
    uDarkOpacity: { value: darkOpacity },
    uFresnelPower: { value: fresnelPower },
    uIntensity: { value: intensity },
    uColor: { value: atmosColor },
    uSunDir: { value: sunDirection.clone().normalize() },
  }), []);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uOpacity.value = opacity;
      matRef.current.uniforms.uDarkOpacity.value = darkOpacity;
      matRef.current.uniforms.uFresnelPower.value = fresnelPower;
      matRef.current.uniforms.uIntensity.value = intensity;
      matRef.current.uniforms.uColor.value.set(color);
      matRef.current.uniforms.uSunDir.value.copy(sunDirection).normalize();
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
