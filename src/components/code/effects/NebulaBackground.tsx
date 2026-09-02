import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// FBM - 5 octaves for richer cloud detail
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * gnoise(p);
    p *= 2.03;
    a *= 0.50;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);
  p += (u_mouse - 0.5) * 0.025;

  float t = u_time;

  // Deep space
  vec3 col = vec3(0.018, 0.015, 0.032);

  // === NEBULA CLOUDS ===
  float n1 = fbm(p * 0.7 + vec2(t * 0.02, t * 0.015));
  float n2 = fbm(p * 1.0 - vec2(t * 0.015, t * 0.025));
  float neb = n1 * 0.6 + n2 * 0.4;

  // Color variation regions
  float r1 = fbm(p * 0.4 + vec2(t * 0.01, 0.0));
  float r2 = fbm(p * 0.35 + vec2(0.0, t * 0.012));
  float r3 = fbm(p * 0.55 - vec2(t * 0.008, t * 0.006));

  // Nebula colors — vivid but controlled, no teal bleed
  vec3 c1 = vec3(0.32, 0.08, 0.55); // deep purple
  vec3 c2 = vec3(0.50, 0.06, 0.38); // magenta
  vec3 c3 = vec3(0.06, 0.12, 0.52); // deep blue (no cyan/teal)

  vec3 nebCol = mix(c1, c2, r1);
  nebCol = mix(nebCol, c3, r2 * 0.35);

  // Visible gas clouds, more intense than original but not overwhelming
  float nebMask = smoothstep(0.38, 0.58, neb) * 0.72;
  col = mix(col, nebCol, nebMask);

  // Emission glow — single layer, controlled
  float g = fbm(p * 1.3 - vec2(t * 0.015, t * 0.02));
  col += vec3(0.22, 0.05, 0.40) * smoothstep(0.52, 0.76, g) * 0.38;
  col += vec3(0.08, 0.10, 0.42) * smoothstep(0.58, 0.82, g) * 0.22;

  // Soft diffuse haze — purple only, no teal
  float haze = fbm(p * 0.3 + vec2(t * 0.005));
  col += vec3(0.14, 0.04, 0.26) * smoothstep(0.48, 0.66, haze) * 0.28;

  // === STARS ===
  // Small dim background stars
  vec2 s1 = uv * 72.0;
  float h1 = hash(floor(s1));
  float st1 = step(0.94, h1) * (0.5 + 0.5 * sin(t * 2.2 + h1 * 6.28));
  float d1 = length(fract(s1) - 0.5);
  col += vec3(0.72, 0.78, 1.0) * smoothstep(0.05, 0.0, d1) * st1 * 0.65;

  // Medium stars
  vec2 s2 = uv * 42.0;
  float h2 = hash(floor(s2) + 50.0);
  float st2 = step(0.972, h2) * (0.55 + 0.45 * sin(t * 1.6 + h2 * 8.0));
  float d2 = length(fract(s2) - 0.5);
  col += vec3(0.88, 0.88, 1.0) * smoothstep(0.07, 0.0, d2) * st2 * 1.0;

  // Bright stars with halo glow
  vec2 s3 = uv * 24.0;
  float h3 = hash(floor(s3) + 100.0);
  float st3 = step(0.988, h3) * (0.65 + 0.35 * sin(t * 1.1 + h3 * 10.0));
  float d3 = length(fract(s3) - 0.5);
  col += vec3(1.0, 0.97, 0.92) * smoothstep(0.09, 0.0, d3) * st3 * 1.5;
  // Halo bloom around bright stars
  col += vec3(0.55, 0.40, 0.90) * smoothstep(0.22, 0.0, d3) * st3 * 0.45;

  // Very rare super-bright stars
  vec2 s4 = uv * 14.0;
  float h4 = hash(floor(s4) + 200.0);
  float st4 = step(0.997, h4) * (0.8 + 0.2 * sin(t * 0.8 + h4 * 12.0));
  float d4 = length(fract(s4) - 0.5);
  col += vec3(1.0, 1.0, 1.0) * smoothstep(0.06, 0.0, d4) * st4 * 2.5;
  col += vec3(0.40, 0.30, 0.80) * smoothstep(0.30, 0.0, d4) * st4 * 0.60;

  // Vignette
  col *= 1.0 - length(vUv - 0.5) * 0.40;

  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

function NebulaMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseLerp = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    mouseLerp.current.x += (pointer.x * 0.5 + 0.5 - mouseLerp.current.x) * 0.03;
    mouseLerp.current.y += (pointer.y * 0.5 + 0.5 - mouseLerp.current.y) * 0.03;
    materialRef.current.uniforms.u_mouse.value.set(mouseLerp.current.x, mouseLerp.current.y);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function MobileNebula() {
  return (
    <>
      <style>{`
        @keyframes nebula-drift-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(3%,2%) scale(1.08); } }
        @keyframes nebula-drift-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-4%,3%) scale(1.06); } }
        @keyframes nebula-drift-3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(2%,-3%) scale(1.05); } }
      `}</style>
      <div className="fixed inset-0 z-0" style={{ background: '#050508' }}>
        <div className="absolute inset-0" style={{ animation: 'nebula-drift-1 18s ease-in-out infinite', background: 'radial-gradient(ellipse 80% 60% at 25% 40%, rgba(108,40,180,0.28) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ animation: 'nebula-drift-2 24s ease-in-out infinite', background: 'radial-gradient(ellipse 70% 55% at 75% 60%, rgba(80,15,120,0.22) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ animation: 'nebula-drift-3 20s ease-in-out infinite', background: 'radial-gradient(ellipse 60% 50% at 50% 75%, rgba(40,20,100,0.18) 0%, transparent 55%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.35) 100%)' }} />
      </div>
    </>
  );
}

export default function NebulaBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (isMobile) return <MobileNebula />;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <NebulaMesh />
      </Canvas>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.12) 0%, rgba(5,5,8,0.3) 100%)' }}
      />
    </div>
  );
}
