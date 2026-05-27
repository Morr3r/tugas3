"use client";

import { Float, Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type LearningSpaceCourse = {
  id: string;
  slug: string;
  shortTitle: string;
  stack: string;
  level: string;
  moduleCount: number;
  completedCount: number;
  completionRate: number;
  color: string;
  secondaryColor: string;
};

type LmsLearningSpaceProps = {
  activeCourseId: string | null;
  courses: LearningSpaceCourse[];
  onEnterCourse: (courseSlug: string) => void;
  onHoverCourse: (courseId: string | null) => void;
};

const portalPositions: Array<[number, number, number]> = [
  [-2.8, -0.28, 0.1],
  [0.1, 0.1, -0.75],
  [3.05, -0.32, 0.15],
];

export default function LmsLearningSpace({
  activeCourseId,
  courses,
  onEnterCourse,
  onHoverCourse,
}: LmsLearningSpaceProps) {
  const spaceCourses = useMemo(
    () =>
      courses.map((course, index) => ({
        ...course,
        position: portalPositions[index % portalPositions.length],
      })),
    [courses],
  );

  return (
    <Canvas
      camera={{ fov: 44, position: [0, 1.25, 7.4] }}
      dpr={[1, 1.6]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onPointerMissed={() => onHoverCourse(null)}
      onCreated={({ gl }) => {
        gl.setClearColor("#05070b", 0);
      }}
    >
      <color attach="background" args={["#05070b"]} />
      <fog attach="fog" args={["#05070b", 7, 15]} />
      <ambientLight intensity={0.56} />
      <directionalLight color="#d8fbff" intensity={1.1} position={[3, 5, 6]} />
      <pointLight color="#37e5a5" intensity={2.1} position={[-3.5, 1.4, 2.4]} />
      <pointLight color="#5ec7ff" intensity={1.8} position={[3.6, 2.3, 1.8]} />
      <CameraRig />
      <LearningMuseum
        activeCourseId={activeCourseId}
        courses={spaceCourses}
        onEnterCourse={onEnterCourse}
        onHoverCourse={onHoverCourse}
      />
      <Sparkles
        color="#c6f7ff"
        count={76}
        scale={[8, 3.2, 4.5]}
        size={1.4}
        speed={0.24}
        opacity={0.36}
      />
    </Canvas>
  );
}

function CameraRig() {
  const cameraPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3(0, 0.1, -0.35));

  useFrame((state) => {
    const scrollMax =
      typeof document === "undefined"
        ? 1
        : Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress =
      typeof window === "undefined" ? 0 : Math.min(1, window.scrollY / scrollMax);

    cameraPosition.current.set(
      Math.sin(scrollProgress * Math.PI * 0.85) * 1.05 + state.pointer.x * 0.55,
      1.25 - scrollProgress * 0.48 + state.pointer.y * 0.28,
      7.4 - scrollProgress * 1.55,
    );
    state.camera.position.lerp(cameraPosition.current, 0.045);
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}

function LearningMuseum({
  activeCourseId,
  courses,
  onEnterCourse,
  onHoverCourse,
}: {
  activeCourseId: string | null;
  courses: Array<LearningSpaceCourse & { position: [number, number, number] }>;
  onEnterCourse: (courseSlug: string) => void;
  onHoverCourse: (courseId: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.035;
  });

  return (
    <group ref={groupRef} position={[0.72, -0.42, 0]} scale={0.94}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, -0.32]}>
        <planeGeometry args={[9.2, 6.4, 18, 18]} />
        <meshStandardMaterial
          color="#071017"
          emissive="#0e3340"
          emissiveIntensity={0.2}
          metalness={0.1}
          roughness={0.55}
          transparent
          opacity={0.76}
          wireframe
        />
      </mesh>

      <Line
        points={courses.map((course) => course.position)}
        color="#8eeeff"
        transparent
        opacity={0.28}
        lineWidth={1.4}
      />

      {courses.map((course, index) => (
        <PortalNode
          key={course.id}
          active={course.id === activeCourseId}
          course={course}
          index={index}
          onEnterCourse={onEnterCourse}
          onHoverCourse={onHoverCourse}
        />
      ))}
    </group>
  );
}

function PortalNode({
  active,
  course,
  index,
  onEnterCourse,
  onHoverCourse,
}: {
  active: boolean;
  course: LearningSpaceCourse & { position: [number, number, number] };
  index: number;
  onEnterCourse: (courseSlug: string) => void;
  onHoverCourse: (courseId: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(course.color), [course.color]);
  const secondary = useMemo(
    () => new THREE.Color(course.secondaryColor),
    [course.secondaryColor],
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const time = state.clock.elapsedTime;
    const targetScale = active ? 1.14 : 1;
    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12);

    groupRef.current.scale.setScalar(nextScale);
    groupRef.current.rotation.y = Math.sin(time * 0.46 + index) * 0.12;
    groupRef.current.rotation.x = Math.sin(time * 0.38 + index * 0.8) * 0.04;
  });

  return (
    <Float floatIntensity={0.32} rotationIntensity={0.16} speed={1.35 + index * 0.12}>
      <group
        ref={groupRef}
        position={course.position}
        onClick={(event) => {
          event.stopPropagation();
          onEnterCourse(course.slug);
        }}
        onPointerOut={() => onHoverCourse(null)}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverCourse(course.id);
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.94, 0.028, 16, 96]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 1.25 : 0.68}
            metalness={0.42}
            roughness={0.22}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.12, 0.012, 12, 96]} />
          <meshStandardMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={active ? 0.85 : 0.36}
            transparent
            opacity={0.72}
          />
        </mesh>

        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.48, 0.9, 0.08]} />
          <meshStandardMaterial
            color="#07111b"
            emissive={color}
            emissiveIntensity={active ? 0.34 : 0.16}
            metalness={0.36}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[1.31, 0.68]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.24 : 0.14} />
        </mesh>

        {[-0.36, -0.08, 0.2].map((y, rowIndex) => (
          <mesh key={y} position={[-0.18 + rowIndex * 0.08, y, 0.09]}>
            <boxGeometry args={[0.72 - rowIndex * 0.12, 0.025, 0.015]} />
            <meshBasicMaterial color={rowIndex === 1 ? secondary : color} transparent opacity={0.86} />
          </mesh>
        ))}

        <mesh position={[0.54, 0.3, 0.1]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={active ? 1.5 : 0.8}
            metalness={0.2}
            roughness={0.18}
          />
        </mesh>

      </group>
    </Float>
  );
}
