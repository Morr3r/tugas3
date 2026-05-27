"use client";

import { Float, Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type LoginFocusField = "username" | "password" | null;

type LmsLoginExperienceProps = {
  focusedField?: LoginFocusField;
  usernameLength?: number;
  passwordLength?: number;
  isSubmitting?: boolean;
  hasError?: boolean;
  showPassword?: boolean;
};

type LoginSceneDynamics = {
  focusedField: LoginFocusField;
  usernameLength: number;
  passwordLength: number;
  credentialStrength: number;
  isSubmitting: boolean;
  hasError: boolean;
  showPassword: boolean;
};

type PanelConfig = {
  id: "username" | "password" | "session" | "shield";
  accent: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

type AccessNode = {
  color: string;
  position: [number, number, number];
  scale: number;
};

const authCoreVertexShader = `
  uniform float uTime;
  uniform float uPulse;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 displacedPosition = position;
    float waveA = sin((position.y * 4.8) + (uTime * 1.4)) * 0.035;
    float waveB = cos((position.x * 5.6) - (uTime * 1.1)) * 0.024;
    float pulse = 1.0 + uPulse * 0.72;
    displacedPosition += normal * ((waveA + waveB) * pulse + uPulse * 0.038);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  }
`;

const authCoreFragmentShader = `
  uniform float uTime;
  uniform float uPulse;
  uniform float uAlert;
  uniform float uStrength;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
    float scan = smoothstep(0.45, 0.52, sin((vUv.y * 18.0) + (uTime * 2.3)) * 0.5 + 0.5);
    float circuit = smoothstep(0.96, 1.0, sin((vUv.x + vUv.y) * 64.0 + uTime * 0.7) * 0.5 + 0.5);
    vec3 color = mix(uColorA, uColorB, vUv.y + fresnel * 0.22);
    vec3 finalColor = color + circuit * 0.42 + vec3(uPulse * 0.22) + vec3(uStrength * 0.12);
    finalColor = mix(finalColor, vec3(1.0, 0.24, 0.36), uAlert * 0.64);
    float alpha = 0.42 + fresnel * 0.38 + scan * 0.16 + circuit * 0.12 + uPulse * 0.18 + uStrength * 0.14;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const fieldVertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 nextPosition = position;
    float ripple = sin((position.x * 1.7) + (uTime * 0.55)) * cos((position.y * 2.2) - (uTime * 0.4));
    nextPosition.z += ripple * (0.08 + uIntensity * 0.09);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(nextPosition, 1.0);
  }
`;

const fieldFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uAlert;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float line(float value, float width) {
    return 1.0 - smoothstep(width, width + 0.012, abs(value));
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float radial = 1.0 - smoothstep(0.08, 0.72, dist);
    float gridX = line(fract(vUv.x * (18.0 + uIntensity * 5.0) + uTime * 0.025) - 0.5, 0.018);
    float gridY = line(fract(vUv.y * (12.0 + uIntensity * 4.0) - uTime * 0.018) - 0.5, 0.018);
    float sweep = smoothstep(0.0, 0.03, abs(sin((vUv.y * 4.0) + (uTime * (0.8 + uIntensity * 1.4)))));
    float alpha = (gridX + gridY) * 0.08 + radial * 0.16 + (1.0 - sweep) * 0.08;
    vec3 color = mix(uAccent, vec3(1.0, 0.24, 0.36), uAlert * 0.56);

    gl_FragColor = vec4(color, alpha * (1.0 + uIntensity * 1.35));
  }
`;

const ribbonColors = ["#37e5a5", "#74d4ff", "#f7c948", "#9a7cff"];

const panelConfigs: PanelConfig[] = [
  {
    id: "username",
    accent: "#37e5a5",
    position: [-2.82, 0.98, -0.4],
    rotation: [0.08, 0.3, 0],
  },
  {
    id: "password",
    accent: "#74d4ff",
    position: [2.7, 0.82, -0.48],
    rotation: [0.08, -0.3, 0],
  },
  {
    id: "session",
    accent: "#f7c948",
    position: [-2.28, -0.96, -0.18],
    rotation: [0.08, 0.24, 0],
  },
  {
    id: "shield",
    accent: "#9a7cff",
    position: [2.14, -0.96, -0.32],
    rotation: [0.08, -0.26, 0],
  },
];

const keypadKeys = Array.from({ length: 12 }, (_, index) => ({
  position: [
    ((index % 4) - 1.5) * 0.38,
    -Math.floor(index / 4) * 0.29,
    0,
  ] as [number, number, number],
  color: ribbonColors[index % ribbonColors.length],
}));

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function updateBodyCursor(isPointer: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  document.body.style.cursor = isPointer ? "pointer" : "";
}

export default function LmsLoginExperience({
  focusedField = null,
  usernameLength = 0,
  passwordLength = 0,
  isSubmitting = false,
  hasError = false,
  showPassword = false,
}: LmsLoginExperienceProps) {
  const credentialStrength = clamp01(
    (Math.min(usernameLength, 12) / 12) * 0.42 +
      (Math.min(passwordLength, 12) / 12) * 0.58,
  );
  const sceneDynamics: LoginSceneDynamics = {
    focusedField,
    usernameLength,
    passwordLength,
    credentialStrength,
    isSubmitting,
    hasError,
    showPassword,
  };

  return (
    <Canvas
      className="h-full w-full"
      camera={{ fov: 43, position: [0, 0.35, 7.6] }}
      dpr={[1, 1.75]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onPointerMissed={() => updateBodyCursor(false)}
      onCreated={({ gl }) => {
        gl.setClearColor("#05070b", 0);
      }}
    >
      <color attach="background" args={["#05070b"]} />
      <fog attach="fog" args={["#05070b", 7.8, 15.5]} />
      <ambientLight intensity={0.72 + credentialStrength * 0.16} />
      <directionalLight color="#e9fdff" intensity={1.45} position={[4.2, 4.8, 5.2]} />
      <pointLight
        color={hasError ? "#fb7185" : "#37e5a5"}
        intensity={isSubmitting ? 4.6 : 3.2 + credentialStrength * 0.8}
        position={[-3.8, 1.1, 2.4]}
      />
      <pointLight
        color="#74d4ff"
        intensity={2.8 + credentialStrength * 0.9}
        position={[3.8, 2.4, 2.8]}
      />
      <pointLight
        color={isSubmitting ? "#f7c948" : "#9a7cff"}
        intensity={isSubmitting ? 2.8 : 1.4}
        position={[0.6, -1.4, 2.2]}
      />
      <LoginCameraRig {...sceneDynamics} />
      <AuthEnvironment {...sceneDynamics} />
      <Sparkles
        color={hasError ? "#fb7185" : isSubmitting ? "#fff2a8" : "#d8fbff"}
        count={isSubmitting ? 152 : hasError ? 120 : 104}
        scale={[9.4, 4.5, 5.8]}
        size={isSubmitting ? 1.55 : 1.2}
        speed={isSubmitting ? 0.64 : 0.3 + credentialStrength * 0.18}
        opacity={hasError ? 0.48 : 0.36 + credentialStrength * 0.12}
      />
    </Canvas>
  );
}

function LoginCameraRig({
  focusedField,
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics) {
  const cameraTarget = useRef(new THREE.Vector3(0.24, 0.02, 0));
  const nextTarget = useRef(new THREE.Vector3(0.24, 0.02, 0));
  const nextPosition = useRef(new THREE.Vector3());

  useFrame((state) => {
    const focusShift =
      focusedField === "username" ? -0.2 : focusedField === "password" ? 0.24 : 0;
    const targetX = state.pointer.x * 0.86 + focusShift;
    const targetY = 0.35 + state.pointer.y * 0.32 + (focusedField ? 0.06 : 0);
    const targetZ =
      7.6 - credentialStrength * 0.44 - (isSubmitting ? 0.38 : 0) + (hasError ? 0.16 : 0);

    nextPosition.current.set(targetX, targetY, targetZ);
    nextTarget.current.set(0.18 + focusShift * 0.35, focusedField ? 0.08 : 0.02, -0.08);
    state.camera.position.lerp(nextPosition.current, 0.048);
    cameraTarget.current.lerp(nextTarget.current, 0.06);
    state.camera.lookAt(cameraTarget.current);

    const targetFov = isSubmitting ? 39 : focusedField ? 41 : 43;
    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.05);
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

function AuthEnvironment(sceneDynamics: LoginSceneDynamics) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const focusShift =
      sceneDynamics.focusedField === "username"
        ? -0.16
        : sceneDynamics.focusedField === "password"
          ? 0.16
          : 0;
    const targetScale =
      0.98 +
      sceneDynamics.credentialStrength * 0.07 +
      (sceneDynamics.isSubmitting ? 0.06 : 0) -
      (sceneDynamics.hasError ? 0.025 : 0);
    const targetX = -0.95 + focusShift;
    const targetY = -0.06 + (sceneDynamics.isSubmitting ? 0.05 : 0);

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.045);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.045);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.045),
    );
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.16) * 0.045 +
      state.pointer.x * 0.055 +
      sceneDynamics.credentialStrength * 0.035;
    groupRef.current.rotation.x = state.pointer.y * 0.025;
  });

  return (
    <group ref={groupRef} position={[-0.95, -0.06, 0]} scale={0.98}>
      <ShaderField {...sceneDynamics} />
      <SecurityCore {...sceneDynamics} />
      <SignalRibbons {...sceneDynamics} />
      <DataPanels {...sceneDynamics} />
      <CredentialConstellation {...sceneDynamics} />
      <InteractiveKeypad {...sceneDynamics} />
      <AccessNodes {...sceneDynamics} />
    </group>
  );
}

function ShaderField({
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uAlert: { value: 0 },
      uAccent: { value: new THREE.Color("#74d4ff") },
    }),
    [],
  );

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    const targetIntensity = isSubmitting ? 1 : credentialStrength;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uIntensity.value,
      targetIntensity,
      0.08,
    );
    materialRef.current.uniforms.uAlert.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uAlert.value,
      hasError ? 1 : 0,
      0.12,
    );
  });

  return (
    <mesh position={[0.62, -1.82, -1.1]} rotation={[-Math.PI / 2.55, 0, 0]}>
      <planeGeometry args={[10.4, 6.6, 112, 72]} />
      <shaderMaterial
        ref={materialRef}
        args={[
          {
            uniforms,
            vertexShader: fieldVertexShader,
            fragmentShader: fieldFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </mesh>
  );
}

function SecurityCore({
  credentialStrength,
  focusedField,
  isSubmitting,
  hasError,
  showPassword,
}: LoginSceneDynamics) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uAlert: { value: 0 },
      uStrength: { value: 0 },
      uColorA: { value: new THREE.Color("#37e5a5") },
      uColorB: { value: new THREE.Color("#74d4ff") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const submitPulse = isSubmitting ? Math.sin(elapsed * 9.4) * 0.16 + 0.28 : 0;
    const focusPulse = focusedField ? 0.1 : 0;
    const interactionPulse = hovered ? 0.24 : 0;
    const pulse = Math.max(0, pulseRef.current) + submitPulse + focusPulse + interactionPulse;

    pulseRef.current = Math.max(0, pulseRef.current - delta * 1.55);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
      materialRef.current.uniforms.uPulse.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uPulse.value,
        pulse,
        0.16,
      );
      materialRef.current.uniforms.uAlert.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uAlert.value,
        hasError ? 1 : 0,
        0.16,
      );
      materialRef.current.uniforms.uStrength.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uStrength.value,
        credentialStrength,
        0.1,
      );
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * (0.28 + credentialStrength * 0.2) + pulse * 0.15;
      coreRef.current.rotation.x = Math.sin(elapsed * 0.42) * 0.1 + state.pointer.y * 0.05;
      coreRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          coreRef.current.scale.x,
          1 + credentialStrength * 0.18 + pulse * 0.08,
          0.14,
        ),
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(elapsed * 0.32) * 0.16 + state.pointer.y * 0.05;
      ringRef.current.rotation.y = elapsed * (0.2 + credentialStrength * 0.22 + (isSubmitting ? 0.4 : 0));
      ringRef.current.rotation.z = Math.cos(elapsed * 0.24) * 0.1 + state.pointer.x * 0.08;
      ringRef.current.scale.setScalar(
        THREE.MathUtils.lerp(ringRef.current.scale.x, hovered ? 1.06 : 1, 0.12),
      );
    }

    if (shellRef.current) {
      shellRef.current.rotation.y = -elapsed * 0.13;
      shellRef.current.rotation.z = elapsed * 0.08;
    }
  });

  return (
    <Float floatIntensity={0.28} rotationIntensity={0.12} speed={1.08}>
      <group
        position={[0, 0.36, 0]}
        onClick={(event) => {
          event.stopPropagation();
          pulseRef.current = 1;
        }}
        onPointerOut={() => {
          setHovered(false);
          updateBodyCursor(false);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          updateBodyCursor(true);
        }}
      >
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.42, 0.018, 18, 144]} />
            <meshStandardMaterial
              color={hasError ? "#fb7185" : "#74d4ff"}
              emissive={hasError ? "#fb7185" : "#74d4ff"}
              emissiveIntensity={hovered || isSubmitting ? 1.45 : 1.05}
              metalness={0.42}
              roughness={0.18}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.55, 0.2, Math.PI / 8]}>
            <torusGeometry args={[1.92, 0.011, 12, 144]} />
            <meshStandardMaterial
              color="#37e5a5"
              emissive="#37e5a5"
              emissiveIntensity={hovered ? 1.05 : 0.8}
              metalness={0.3}
              roughness={0.24}
              transparent
              opacity={0.75 + credentialStrength * 0.16}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.2, -0.45, -Math.PI / 8]}>
            <torusGeometry args={[2.36, 0.008, 12, 144]} />
            <meshStandardMaterial
              color={isSubmitting ? "#fff2a8" : "#f7c948"}
              emissive={isSubmitting ? "#fff2a8" : "#f7c948"}
              emissiveIntensity={isSubmitting ? 0.9 : 0.48}
              transparent
              opacity={0.54 + credentialStrength * 0.2}
            />
          </mesh>
        </group>

        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.86, 24]} />
          <shaderMaterial
            ref={materialRef}
            args={[
              {
                uniforms,
                vertexShader: authCoreVertexShader,
                fragmentShader: authCoreFragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
              },
            ]}
          />
        </mesh>

        <mesh ref={shellRef} scale={[1.16, 1.16, 1.16]}>
          <icosahedronGeometry args={[0.86, 1]} />
          <meshBasicMaterial
            color={showPassword ? "#fff2a8" : "#d8fbff"}
            wireframe
            transparent
            opacity={showPassword ? 0.22 : 0.12 + credentialStrength * 0.08}
          />
        </mesh>
      </group>
    </Float>
  );
}

function SignalRibbons({
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics) {
  const groupRef = useRef<THREE.Group>(null);
  const ribbons = useMemo(
    () =>
      ribbonColors.map((color, ribbonIndex) => {
        const points = Array.from({ length: 90 }, (_, index) => {
          const t = index / 89;
          const x = -4.4 + t * 8.8;
          const y = Math.sin(t * Math.PI * 2 + ribbonIndex * 0.9) * 0.32 + ribbonIndex * 0.18;
          const z = Math.cos(t * Math.PI * 1.45 + ribbonIndex) * 0.25 - 0.22 - ribbonIndex * 0.03;

          return new THREE.Vector3(x, y, z);
        });

        return { color, points };
      }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.23) * 0.025;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.03;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        1 + credentialStrength * 0.08 + (isSubmitting ? 0.08 : 0),
        0.05,
      ),
    );
  });

  return (
    <group ref={groupRef} position={[0.44, 0.12, -0.38]}>
      {ribbons.map((ribbon, index) => (
        <Line
          key={ribbon.color}
          points={ribbon.points}
          color={hasError && index === 0 ? "#fb7185" : ribbon.color}
          transparent
          opacity={0.32 + credentialStrength * 0.12 - index * 0.025}
          lineWidth={isSubmitting ? 2.6 : 1.8}
        />
      ))}
    </group>
  );
}

function DataPanels(sceneDynamics: LoginSceneDynamics) {
  return (
    <group>
      {panelConfigs.map((panel, index) => (
        <InteractiveDataPanel
          key={panel.id}
          index={index}
          panel={panel}
          {...sceneDynamics}
        />
      ))}
    </group>
  );
}

function InteractiveDataPanel({
  panel,
  index,
  focusedField,
  usernameLength,
  passwordLength,
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics & {
  panel: PanelConfig;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const accent = useMemo(() => new THREE.Color(panel.accent), [panel.accent]);
  const fieldFill =
    panel.id === "username"
      ? clamp01(usernameLength / 12)
      : panel.id === "password"
        ? clamp01(passwordLength / 12)
        : panel.id === "session"
          ? credentialStrength
          : hasError
            ? 1
            : credentialStrength * 0.78;
  const isFocusedPanel =
    (panel.id === "username" && focusedField === "username") ||
    (panel.id === "password" && focusedField === "password");
  const isActive = hovered || isFocusedPanel || (panel.id === "session" && isSubmitting);
  const isAlertPanel = hasError && panel.id === "shield";

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const pulse = pulseRef.current;
    pulseRef.current = Math.max(0, pulseRef.current - delta * 1.8);
    groupRef.current.position.set(
      panel.position[0],
      panel.position[1] + Math.sin(state.clock.elapsedTime * 0.75 + index) * 0.026 + pulse * 0.08,
      panel.position[2],
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      panel.rotation[0] + state.pointer.y * 0.04,
      0.08,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      panel.rotation[1] + state.pointer.x * 0.06,
      0.08,
    );
    groupRef.current.rotation.z = panel.rotation[2] + Math.sin(state.clock.elapsedTime * 0.42 + index) * 0.018;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, isActive || isAlertPanel ? 1.08 : 1, 0.12),
    );
  });

  return (
    <group
      ref={groupRef}
      onClick={(event) => {
        event.stopPropagation();
        pulseRef.current = 1;
      }}
      onPointerOut={() => {
        setHovered(false);
        updateBodyCursor(false);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        updateBodyCursor(true);
      }}
    >
      <mesh>
        <boxGeometry args={[1.34, 0.72, 0.035]} />
        <meshStandardMaterial
          color={isAlertPanel ? "#2a0f18" : "#07111b"}
          emissive={isAlertPanel ? "#fb7185" : accent}
          emissiveIntensity={isActive || isAlertPanel ? 0.34 : 0.16}
          metalness={0.24}
          roughness={0.36}
          transparent
          opacity={isActive ? 0.9 : 0.78}
        />
      </mesh>
      <mesh position={[0, 0.31, 0.028]}>
        <boxGeometry args={[1.15, 0.018, 0.022]} />
        <meshBasicMaterial
          color={isAlertPanel ? "#fb7185" : accent}
          transparent
          opacity={isActive || isAlertPanel ? 0.95 : 0.72}
        />
      </mesh>
      {[0, 1, 2].map((lineIndex) => {
        const lineWidth = (0.84 - lineIndex * 0.13) * (0.36 + fieldFill * 0.64);
        const y = -0.16 + lineIndex * 0.18;

        return (
          <mesh key={lineIndex} position={[-0.2 + lineWidth / 2, y, 0.03]}>
            <boxGeometry args={[lineWidth, 0.03, 0.02]} />
            <meshBasicMaterial
              color={isAlertPanel ? "#fb7185" : lineIndex === 1 ? "#f7c948" : "#d8fbff"}
              transparent
              opacity={0.48 + fieldFill * 0.38}
            />
          </mesh>
        );
      })}
      <mesh position={[0.49, -0.22, 0.05]}>
        <octahedronGeometry args={[0.085 + fieldFill * 0.035, 0]} />
        <meshStandardMaterial
          color={isAlertPanel ? "#fb7185" : "#9a7cff"}
          emissive={isAlertPanel ? "#fb7185" : "#9a7cff"}
          emissiveIntensity={isActive || isAlertPanel ? 1.08 : 0.72}
          metalness={0.22}
          roughness={0.2}
        />
      </mesh>
      {(isActive || isAlertPanel) && (
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.42, 0.8]} />
          <meshBasicMaterial
            color={isAlertPanel ? "#fb7185" : accent}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

function CredentialConstellation({
  focusedField,
  usernameLength,
  passwordLength,
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.28) * 0.1 + state.pointer.x * 0.035;
    groupRef.current.rotation.x = state.pointer.y * 0.025;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        1 + credentialStrength * 0.06 + (isSubmitting ? 0.04 : 0),
        0.08,
      ),
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.36, 0.44]}>
      <CredentialOrbit
        active={focusedField === "username"}
        color="#37e5a5"
        filledCount={Math.min(8, Math.ceil(usernameLength / 2))}
        hasError={hasError}
        isSubmitting={isSubmitting}
        radiusX={1.92}
        radiusY={0.42}
        totalCount={8}
        y={0.52}
      />
      <CredentialOrbit
        active={focusedField === "password"}
        color="#74d4ff"
        filledCount={Math.min(10, Math.ceil(passwordLength / 2))}
        hasError={hasError}
        isSubmitting={isSubmitting}
        radiusX={2.22}
        radiusY={0.5}
        totalCount={10}
        y={-0.52}
      />
    </group>
  );
}

function CredentialOrbit({
  active,
  color,
  filledCount,
  hasError,
  isSubmitting,
  radiusX,
  radiusY,
  totalCount,
  y,
}: {
  active: boolean;
  color: string;
  filledCount: number;
  hasError: boolean;
  isSubmitting: boolean;
  radiusX: number;
  radiusY: number;
  totalCount: number;
  y: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(
    () =>
      Array.from({ length: 96 }, (_, index) => {
        const angle = (index / 95) * Math.PI * 2;

        return new THREE.Vector3(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 0);
      }),
    [radiusX, radiusY],
  );
  const nodes = useMemo(
    () =>
      Array.from({ length: totalCount }, (_, index) => {
        const angle = (index / totalCount) * Math.PI * 2;

        return {
          index,
          position: [Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 0] as [
            number,
            number,
            number,
          ],
        };
      }),
    [radiusX, radiusY, totalCount],
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const direction = y > 0 ? 1 : -1;
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.34 + y) * 0.035 +
      (isSubmitting ? state.clock.elapsedTime * 0.08 * direction : 0);
  });

  return (
    <group ref={groupRef} position={[0, y, 0]} rotation={[0.18, 0, 0]}>
      <Line
        points={points}
        color={hasError ? "#fb7185" : color}
        transparent
        opacity={active ? 0.48 : 0.22}
        lineWidth={active || isSubmitting ? 2 : 1.2}
      />
      {nodes.map((node) => (
        <CredentialNode
          key={node.index}
          active={active}
          color={hasError ? "#fb7185" : color}
          filled={node.index < filledCount || (active && filledCount === 0 && node.index === 0)}
          index={node.index}
          isSubmitting={isSubmitting}
          position={node.position}
        />
      ))}
    </group>
  );
}

function CredentialNode({
  active,
  color,
  filled,
  index,
  isSubmitting,
  position,
}: {
  active: boolean;
  color: string;
  filled: boolean;
  index: number;
  isSubmitting: boolean;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    pulseRef.current = Math.max(0, pulseRef.current - delta * 1.9);
    const wave =
      isSubmitting || active
        ? Math.sin(state.clock.elapsedTime * 4.2 + index * 0.7) * 0.018
        : 0;
    const targetScale = filled || hovered ? 1.42 : 0.8;

    meshRef.current.position.set(position[0], position[1] + wave + pulseRef.current * 0.08, position[2]);
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale + pulseRef.current * 0.7, 0.14),
    );
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(event) => {
        event.stopPropagation();
        pulseRef.current = 1;
      }}
      onPointerOut={() => {
        setHovered(false);
        updateBodyCursor(false);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        updateBodyCursor(true);
      }}
    >
      <sphereGeometry args={[0.035, 14, 14]} />
      <meshStandardMaterial
        color={filled || hovered ? color : "#203040"}
        emissive={filled || hovered ? color : "#0b1620"}
        emissiveIntensity={filled || hovered ? 1.55 : 0.24}
        transparent
        opacity={filled || hovered ? 0.95 : 0.44}
      />
    </mesh>
  );
}

function InteractiveKeypad({
  focusedField,
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.x = -0.62 + Math.sin(state.clock.elapsedTime * 0.28) * 0.035;
    groupRef.current.rotation.y = state.pointer.x * 0.08;
    groupRef.current.position.y =
      -1.08 + Math.sin(state.clock.elapsedTime * 0.44) * 0.03 + credentialStrength * 0.06;
  });

  return (
    <group ref={groupRef} position={[0.1, -1.08, 0.74]} scale={0.92}>
      {keypadKeys.map((key, index) => (
        <KeypadTile
          key={index}
          active={
            isSubmitting ||
            (focusedField === "username" && index < 4) ||
            (focusedField === "password" && index >= 4 && index < 8)
          }
          color={hasError && index % 3 === 0 ? "#fb7185" : key.color}
          index={index}
          position={key.position}
        />
      ))}
    </group>
  );
}

function KeypadTile({
  active,
  color,
  index,
  position,
}: {
  active: boolean;
  color: string;
  index: number;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    pulseRef.current = Math.max(0, pulseRef.current - delta * 2.6);
    const lift =
      (active ? 0.022 : 0) +
      (hovered ? 0.05 : 0) +
      pulseRef.current * 0.12 +
      Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.005;

    meshRef.current.position.set(position[0], position[1], position[2] + lift);
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, active || hovered ? 1.08 : 1, 0.16),
    );
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          pulseRef.current = 1;
        }}
        onPointerOut={() => {
          setHovered(false);
          updateBodyCursor(false);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          updateBodyCursor(true);
        }}
      >
        <boxGeometry args={[0.28, 0.18, 0.055]} />
        <meshStandardMaterial
          color={active || hovered ? color : "#07111b"}
          emissive={color}
          emissiveIntensity={active || hovered ? 0.82 : 0.2}
          metalness={0.28}
          roughness={0.32}
          transparent
          opacity={active || hovered ? 0.94 : 0.72}
        />
      </mesh>
      <mesh position={[position[0], position[1] + 0.06, position[2] + 0.035]}>
        <boxGeometry args={[0.18, 0.012, 0.012]} />
        <meshBasicMaterial color={color} transparent opacity={active || hovered ? 0.9 : 0.34} />
      </mesh>
    </group>
  );
}

function AccessNodes({
  credentialStrength,
  isSubmitting,
  hasError,
}: LoginSceneDynamics) {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo<AccessNode[]>(
    () =>
      Array.from({ length: 32 }, (_, index) => {
        const angle = (index / 32) * Math.PI * 2;
        const radius = 2.08 + (index % 5) * 0.22;
        const y = ((index % 8) - 3.5) * 0.23;

        return {
          color: ribbonColors[index % ribbonColors.length],
          position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.28 - 0.22] as [
            number,
            number,
            number,
          ],
          scale: 0.035 + (index % 4) * 0.01,
        };
      }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = state.clock.elapsedTime * (0.08 + credentialStrength * 0.06);
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.26) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, index) => (
        <InteractiveAccessNode
          key={`${node.color}-${index}`}
          active={isSubmitting || credentialStrength > index / nodes.length}
          color={hasError && index % 4 === 0 ? "#fb7185" : node.color}
          index={index}
          node={node}
        />
      ))}
    </group>
  );
}

function InteractiveAccessNode({
  active,
  color,
  index,
  node,
}: {
  active: boolean;
  color: string;
  index: number;
  node: AccessNode;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    pulseRef.current = Math.max(0, pulseRef.current - delta * 1.8);
    const pulse = active ? Math.sin(state.clock.elapsedTime * 3.4 + index) * 0.18 + 0.18 : 0;
    const targetScale = 1 + pulse + (hovered ? 0.74 : 0) + pulseRef.current * 1.2;

    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.16),
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onClick={(event) => {
        event.stopPropagation();
        pulseRef.current = 1;
      }}
      onPointerOut={() => {
        setHovered(false);
        updateBodyCursor(false);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        updateBodyCursor(true);
      }}
    >
      <sphereGeometry args={[node.scale, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active || hovered ? 1.8 : 0.78}
        transparent
        opacity={active || hovered ? 0.92 : 0.56}
      />
    </mesh>
  );
}
