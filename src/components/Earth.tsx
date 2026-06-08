import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthProps {
  sunDirection: THREE.Vector3;
  sunIntensity: number;
  sunColor: string;
}

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const earthFragmentShader = `
  uniform sampler2D tDay;
  uniform sampler2D tNight;
  uniform sampler2D tSpecular;
  uniform sampler2D tNormal;
  uniform vec3 uSunDir;
  uniform float uSunIntensity;
  uniform vec3 uSunColor;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  // Tangent-space normal mapping
  vec3 perturbNormal(vec3 N, vec3 V) {
    vec3 map = texture2D(tNormal, vUv).xyz * 2.0 - 1.0;
    map.xy *= 0.6;
    
    vec3 q0 = dFdx(vPositionW);
    vec3 q1 = dFdy(vPositionW);
    vec2 st0 = dFdx(vUv);
    vec2 st1 = dFdy(vUv);
    vec3 T = normalize(q0 * st1.t - q1 * st0.t);
    vec3 B = normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);
    return normalize(TBN * map);
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vPositionW);
    N = perturbNormal(N, V);

    vec3 L = normalize(uSunDir);
    float NdotL = dot(N, L);

    // Day/night blend based on sun angle
    float dayFactor = smoothstep(-0.15, 0.25, NdotL);

    vec3 dayColor = texture2D(tDay, vUv).rgb;
    vec3 nightColor = texture2D(tNight, vUv).rgb;

    // Boost city lights for cinematic look
    nightColor *= vec3(1.2, 0.95, 0.7) * 1.8;

    // Diffuse lighting on the day side — scaled by sun intensity and color
    float diffuse = max(NdotL, 0.0);
    vec3 litDay = dayColor * (0.06 + diffuse * uSunIntensity) * uSunColor;

    // Specular (ocean glint) — also scaled by sun intensity and color
    float spec = texture2D(tSpecular, vUv).r;
    vec3 H = normalize(L + V);
    float specAngle = max(dot(N, H), 0.0);
    float specular = pow(specAngle, 64.0) * spec * 1.2 * uSunIntensity;

    // Final compositing
    vec3 finalColor = mix(nightColor, litDay, dayFactor);
    finalColor += uSunColor * specular * dayFactor;

    // Slight ambient so dark side isn't pure black
    finalColor += dayColor * 0.012;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function Earth({ sunDirection, sunIntensity, sunColor }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const [dayMap, nightMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
    '/8k_earth_daymap.jpg',
    '/8k_earth_nightmap.jpg',
    '/8k_earth_normal_map.jpg',
    '/8k_earth_specular_map.jpg',
  ]);

  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
  }, [dayMap, nightMap]);

  const uniforms = useMemo(() => ({
    tDay: { value: dayMap },
    tNight: { value: nightMap },
    tNormal: { value: normalMap },
    tSpecular: { value: specularMap },
    uSunDir: { value: sunDirection.clone().normalize() },
    uSunIntensity: { value: sunIntensity },
    uSunColor: { value: new THREE.Color(sunColor) },
  }), [dayMap, nightMap, normalMap, specularMap, sunDirection, sunIntensity, sunColor]);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uSunDir.value.copy(sunDirection).normalize();
      matRef.current.uniforms.uSunIntensity.value = sunIntensity;
      matRef.current.uniforms.uSunColor.value.set(sunColor);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}
        uniforms={uniforms}
        extensions={{ derivatives: true }}
      />
    </mesh>
  );
}
