import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Star vertex: animated orbit + mouse parallax ──────────────────────────────
const vertStar = /* glsl */`
  attribute float aRadius;
  attribute float aInitAngle;
  attribute float aHeight;
  attribute float aSpeed;
  attribute float aSize;

  uniform float u_time;
  uniform vec2  u_mouse;

  varying vec3 vColor;

  void main() {
    float angle = aInitAngle + aSpeed * u_time;
    vec3 pos = vec3(
      cos(angle) * aRadius,
      aHeight,
      sin(angle) * aRadius
    );

    // Mouse parallax — subtle per-star shimmer
    vec2 mw  = u_mouse * 3.5;
    vec2 dv  = pos.xz - mw;
    float ld = max(length(dv), 0.01);
    float inf = exp(-ld * ld * 0.45) * 0.28;
    pos.xz += (dv / ld) * inf;
    pos.y  += inf * 0.10;

    vColor = color;
    vec4 mvp = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp(aSize * (18.0 / -mvp.z), 0.5, 14.0);
    gl_Position  = projectionMatrix * mvp;
  }
`;

// ── Star fragment: gaussian core + wide atmospheric glow ─────────────────────
const fragStar = /* glsl */`
  varying vec3 vColor;

  void main() {
    vec2  c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;

    float core     = exp(-d * d * 3.2) * 0.90;   // sharp bright core
    float glow     = exp(-d * d * 1.0) * 0.25;   // medium glow ring
    float atm      = exp(-d * d * 0.28) * 0.10;  // wide atmospheric halo
    float pinpoint = exp(-d * d * 30.0) * 0.28;  // ultra-bright center spike

    float alpha = core + glow + atm;
    vec3  col   = vColor * (core + glow + atm) + pinpoint;

    gl_FragColor = vec4(min(col, 1.5), alpha);
  }
`;

// ── Gas/nebula vertex: orbit only, no mouse ───────────────────────────────────
const vertGas = /* glsl */`
  attribute float aRadius;
  attribute float aInitAngle;
  attribute float aHeight;
  attribute float aSpeed;
  attribute float aSize;

  uniform float u_time;
  varying vec3 vColor;

  void main() {
    float angle = aInitAngle + aSpeed * u_time;
    vec3 pos = vec3(
      cos(angle) * aRadius,
      aHeight,
      sin(angle) * aRadius
    );

    vColor = color;
    vec4 mvp = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp(aSize * (24.0 / -mvp.z), 4.0, 60.0);
    gl_Position  = projectionMatrix * mvp;
  }
`;

// ── Gas fragment: wide, very soft, atmospheric blobs ─────────────────────────
const fragGas = /* glsl */`
  varying vec3 vColor;

  void main() {
    vec2  c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;

    float alpha = exp(-d * d * 0.55) * 0.022;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ── Nucleus billboard shaders ─────────────────────────────────────────────────
const billVert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const billFrag = /* glsl */`
  uniform float u_time;
  varying vec2  vUv;

  void main() {
    vec2  c = vUv - 0.5;
    float d = length(c) * 2.0;

    // Four concentric layers: white core → pink → violet → deep blue
    float tight  = exp(-d * d * 7.0);
    float medium = exp(-d * d * 2.2) * 0.55;
    float wide   = exp(-d * d * 0.75) * 0.22;

    float pulse = 0.92 + 0.08 * sin(u_time * 0.65);

    vec3 coreCol  = vec3(1.00, 0.98, 0.92) * pulse;   // warm white
    vec3 goldCol  = vec3(0.98, 0.78, 0.28);            // gold
    vec3 outerCol = vec3(0.55, 0.20, 0.88);            // purple corona

    vec3  col   = coreCol * tight + goldCol * medium + outerCol * wide;
    float alpha = (tight + medium * 0.55 + wide * 0.35) * pulse;

    gl_FragColor = vec4(col, alpha);
  }
`;

// ── Nucleus billboard (always faces camera) ───────────────────────────────────
function NucleusBillboard() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ u_time: { value: 0 } }), []);

  useFrame(({ clock, camera }) => {
    if (meshRef.current) meshRef.current.quaternion.copy(camera.quaternion);
    if (matRef.current)  matRef.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} renderOrder={2}>
      <planeGeometry args={[2.4, 2.4]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={billVert}
        fragmentShader={billFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ── Galaxy geometry builder ───────────────────────────────────────────────────
function buildGalaxy() {
  const MAIN  = 52000;
  const BULGE =  5500;
  const HALO  =  2500;
  const GAS   = 12000;

  const TOTAL_STARS = MAIN + BULGE + HALO;

  const ARMS   = 3;
  const RADIUS = 5.5;
  const SPIN   = 1.85;   // tighter spiral → more defined arms
  const RAND_P = 3.6;

  // ── Star buffers ──
  const sPos    = new Float32Array(TOTAL_STARS * 3);
  const sCol    = new Float32Array(TOTAL_STARS * 3);
  const sRadius = new Float32Array(TOTAL_STARS);
  const sAngle  = new Float32Array(TOTAL_STARS);
  const sHeight = new Float32Array(TOTAL_STARS);
  const sSpeed  = new Float32Array(TOTAL_STARS);
  const sSize   = new Float32Array(TOTAL_STARS);

  // ── Gas buffers ──
  const gPos    = new Float32Array(GAS * 3);
  const gCol    = new Float32Array(GAS * 3);
  const gRadius = new Float32Array(GAS);
  const gAngle  = new Float32Array(GAS);
  const gHeight = new Float32Array(GAS);
  const gSpeed  = new Float32Array(GAS);
  const gSize   = new Float32Array(GAS);

  // ── Color palette — purple / pink / blue (matches reference) ──
  // ── Original palette restored ──
  const white     = new THREE.Color('#ffffff');
  const warm      = new THREE.Color('#ffc87a');   // gold
  const mid       = new THREE.Color('#9d7bff');   // violet
  const outer     = new THREE.Color('#4A90FF');   // blue
  const haloC     = new THREE.Color('#6680cc');   // blue-gray halo

  // Gas colors matching original palette (warm → violet → blue)
  const gasInner  = new THREE.Color('#cc8833');   // warm golden gas
  const gasArm    = new THREE.Color('#7755cc');   // violet gas
  const gasOuter  = new THREE.Color('#3355aa');   // blue gas

  const rand = () =>
    Math.pow(Math.random(), RAND_P) * (Math.random() < 0.5 ? 1 : -1);

  // ── Spiral arm stars ──────────────────────────────────────────────────────
  for (let i = 0; i < MAIN; i++) {
    const r      = Math.pow(Math.random(), 0.52) * RADIUS;
    const branch = (i % ARMS) / ARMS * Math.PI * 2;
    const spin   = r * SPIN;

    // Tighter scatter than before → more defined arm lanes
    const scatter = 0.16 + (1.0 - r / RADIUS) * 0.14;
    const px = Math.cos(branch + spin) * r + rand() * scatter * r;
    const pz = Math.sin(branch + spin) * r + rand() * scatter * r;
    const py = rand() * 0.05 * r;

    const ar = Math.sqrt(px * px + pz * pz);
    const aa = Math.atan2(pz, px);

    sRadius[i] = ar;
    sAngle[i]  = aa;
    sHeight[i] = py;
    sSpeed[i]  = 0.13 / Math.sqrt(ar + 0.12);

    const innerBoost = Math.max(0, 1.0 - r / (RADIUS * 0.4));
    sSize[i] = Math.random() * 2.0 + 0.5 + innerBoost * 1.5;

    sPos[i*3] = px; sPos[i*3+1] = py; sPos[i*3+2] = pz;

    const t = Math.min(r / RADIUS, 1);
    let c: THREE.Color;
    if      (t < 0.12) c = white.clone().lerp(warm, t / 0.12);
    else if (t < 0.45) c = warm.clone().lerp(mid,  (t - 0.12) / 0.33);
    else               c = mid.clone().lerp(outer, (t - 0.45) / 0.55);

    sCol[i*3] = c.r; sCol[i*3+1] = c.g; sCol[i*3+2] = c.b;
  }

  // ── Spherical bulge (wraps the nucleus) ───────────────────────────────────
  for (let i = MAIN; i < MAIN + BULGE; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = Math.pow(Math.random(), 1.2) * 0.65;

    const px = r * Math.sin(phi) * Math.cos(theta);
    const py = r * Math.cos(phi) * 0.60;
    const pz = r * Math.sin(phi) * Math.sin(theta);

    const ar = Math.sqrt(px * px + pz * pz);
    const aa = Math.atan2(pz, px);

    sRadius[i] = ar;
    sAngle[i]  = aa;
    sHeight[i] = py;
    sSpeed[i]  = ar > 0.01 ? 0.24 / Math.sqrt(ar + 0.03) : 0;
    sSize[i]   = Math.random() * 2.8 + 1.0;
    sPos[i*3]  = px; sPos[i*3+1] = py; sPos[i*3+2] = pz;

    const t = r / 0.65;
    const c = white.clone().lerp(warm, t * 0.72);
    sCol[i*3] = c.r; sCol[i*3+1] = c.g; sCol[i*3+2] = c.b;
  }

  // ── Outer halo ────────────────────────────────────────────────────────────
  for (let i = MAIN + BULGE; i < TOTAL_STARS; i++) {
    const r  = RADIUS + Math.random() * RADIUS * 0.9;
    const a  = Math.random() * Math.PI * 2;
    const py = (Math.random() - 0.5) * r * 0.28;

    sRadius[i] = r;
    sAngle[i]  = a;
    sHeight[i] = py;
    sSpeed[i]  = 0.030 / Math.sqrt(r);
    sSize[i]   = Math.random() * 1.0 + 0.3;
    sPos[i*3]  = Math.cos(a)*r; sPos[i*3+1] = py; sPos[i*3+2] = Math.sin(a)*r;
    sCol[i*3]  = haloC.r * 0.38; sCol[i*3+1] = haloC.g * 0.38; sCol[i*3+2] = haloC.b * 0.48;
  }

  // ── Gas / nebula particles ────────────────────────────────────────────────
  // Larger, very transparent blobs along the spiral arms — create the
  // gaseous cloud atmosphere seen in the reference image.
  for (let i = 0; i < GAS; i++) {
    const r      = Math.pow(Math.random(), 0.55) * RADIUS * 0.92;
    const branch = (i % ARMS) / ARMS * Math.PI * 2;
    const spin   = r * SPIN;

    // Wide scatter → diffuse gas clouds rather than sharp arm lines
    const scatter = 0.40 + (1.0 - r / RADIUS) * 0.30;
    const px = Math.cos(branch + spin) * r + (Math.random() - 0.5) * scatter * r * 2.0;
    const pz = Math.sin(branch + spin) * r + (Math.random() - 0.5) * scatter * r * 2.0;
    const py = (Math.random() - 0.5) * 0.14 * r;

    const ar = Math.sqrt(px * px + pz * pz);
    const aa = Math.atan2(pz, px);

    gRadius[i] = ar;
    gAngle[i]  = aa;
    gHeight[i] = py;
    gSpeed[i]  = 0.09 / Math.sqrt(ar + 0.18);
    gSize[i]   = Math.random() * 9.0 + 5.0;   // large blobs
    gPos[i*3]  = px; gPos[i*3+1] = py; gPos[i*3+2] = pz;

    const t = Math.min(r / RADIUS, 1);
    let c: THREE.Color;
    if      (t < 0.22) c = gasInner.clone().lerp(gasArm,   t / 0.22);
    else               c = gasArm.clone().lerp(gasOuter,   (t - 0.22) / 0.78);

    gCol[i*3] = c.r; gCol[i*3+1] = c.g; gCol[i*3+2] = c.b;
  }

  // ── Star geometry ──────────────────────────────────────────────────────────
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position',   new THREE.BufferAttribute(sPos,    3));
  starGeo.setAttribute('color',      new THREE.BufferAttribute(sCol,    3));
  starGeo.setAttribute('aRadius',    new THREE.BufferAttribute(sRadius, 1));
  starGeo.setAttribute('aInitAngle', new THREE.BufferAttribute(sAngle,  1));
  starGeo.setAttribute('aHeight',    new THREE.BufferAttribute(sHeight, 1));
  starGeo.setAttribute('aSpeed',     new THREE.BufferAttribute(sSpeed,  1));
  starGeo.setAttribute('aSize',      new THREE.BufferAttribute(sSize,   1));

  const starMat = new THREE.ShaderMaterial({
    vertexShader:   vertStar,
    fragmentShader: fragStar,
    uniforms: {
      u_time:  { value: 0 },
      u_mouse: { value: new THREE.Vector2() },
    },
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
    vertexColors: true,
  });

  // ── Gas geometry ───────────────────────────────────────────────────────────
  const gasGeo = new THREE.BufferGeometry();
  gasGeo.setAttribute('position',   new THREE.BufferAttribute(gPos,    3));
  gasGeo.setAttribute('color',      new THREE.BufferAttribute(gCol,    3));
  gasGeo.setAttribute('aRadius',    new THREE.BufferAttribute(gRadius, 1));
  gasGeo.setAttribute('aInitAngle', new THREE.BufferAttribute(gAngle,  1));
  gasGeo.setAttribute('aHeight',    new THREE.BufferAttribute(gHeight, 1));
  gasGeo.setAttribute('aSpeed',     new THREE.BufferAttribute(gSpeed,  1));
  gasGeo.setAttribute('aSize',      new THREE.BufferAttribute(gSize,   1));

  const gasMat = new THREE.ShaderMaterial({
    vertexShader:   vertGas,
    fragmentShader: fragGas,
    uniforms: { u_time: { value: 0 } },
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
    vertexColors: true,
  });

  return { starGeo, starMat, gasGeo, gasMat };
}

// ── Galaxy mesh (stars + gas in a single rotating group) ─────────────────────
function GalaxyMesh() {
  const mouseRaw  = useRef(new THREE.Vector2());
  const mouseSoft = useRef(new THREE.Vector2());
  const groupRef  = useRef<THREE.Group>(null);

  const { starGeo, starMat, gasGeo, gasMat } = useMemo(buildGalaxy, []);
  const stars = useMemo(() => new THREE.Points(starGeo, starMat), [starGeo, starMat]);
  const gas   = useMemo(() => new THREE.Points(gasGeo,  gasMat),  [gasGeo,  gasMat]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouseRaw.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => () => {
    starGeo.dispose(); starMat.dispose();
    gasGeo.dispose();  gasMat.dispose();
  }, [starGeo, starMat, gasGeo, gasMat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mouseSoft.current.lerp(mouseRaw.current, 0.035);

    starMat.uniforms.u_time.value = t;
    starMat.uniforms.u_mouse.value.copy(mouseSoft.current);
    gasMat.uniforms.u_time.value  = t;

    if (groupRef.current) {
      groupRef.current.rotation.x = -0.22;   // slight tilt — shows spiral arms
      groupRef.current.rotation.y = t * 0.008;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gas}   />   {/* gas behind stars */}
      <primitive object={stars} />   {/* stars on top */}
    </group>
  );
}

// ── Full scene ────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <GalaxyMesh />
      <NucleusBillboard />
    </>
  );
}

export default function GalaxyCenter() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 5.2, 9.2], fov: 62 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
