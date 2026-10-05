/* Modelos 3D procedurais das mesas. Tudo é construído com geometrias simples
   para carregar rápido e seguir a paleta da marca. Para usar modelos
   fotorrealistas no futuro, troque um componente por um <primitive> de um .glb. */
import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { LOGO_H, LOGO_RULE, LOGO_TAG, LOGO_W, LOGO_WORD } from "../logo-paths";

const metal = { metalness: 0.85, roughness: 0.28 };
const gold = "#c9a46a";
const steel = "#b9bcb8";
const black = "#161714";

function Tube({
  points,
  radius = 0.025,
  color = black,
}: {
  points: [number, number, number][];
  radius?: number;
  color?: string;
}) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 80, radius, 10, false);
  }, [points, radius]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

/* ---------- Mesa ---------- */

export function Table({ top, leg, mat }: { top: string; leg: string; mat?: string }) {
  return (
    <group>
      <RoundedBox
        args={[7, 0.18, 4.2]}
        radius={0.06}
        smoothness={4}
        position={[0, -0.09, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={top} roughness={0.55} metalness={0.05} />
      </RoundedBox>
      {mat && (
        <RoundedBox args={[5.6, 0.02, 3.1]} radius={0.01} position={[0, 0.01, 0.05]} receiveShadow>
          <meshStandardMaterial color={mat} roughness={0.9} />
        </RoundedBox>
      )}
      {(
        [
          [-3.2, -1.85],
          [3.2, -1.85],
          [-3.2, 1.85],
          [3.2, 1.85],
        ] as const
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, -2.1, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.06, 4, 16]} />
          <meshStandardMaterial color={leg} {...metal} />
        </mesh>
      ))}
    </group>
  );
}

/* Folha de papel com a logo desenhada — a identidade da marca sobre a mesa. */
export function BrandSheet({
  position,
  rotation = 0,
  ink = "#252622",
  paper = "#efe8dc",
}: {
  position: [number, number, number];
  rotation?: number;
  ink?: string;
  paper?: string;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1400;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = paper;
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "rgba(37,38,34,0.12)";
    g.lineWidth = 2;
    for (let x = 0; x <= c.width; x += 64) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, c.height);
      g.stroke();
    }
    for (let y = 0; y <= c.height; y += 64) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(c.width, y);
      g.stroke();
    }
    const s = 820 / LOGO_W;
    g.save();
    g.translate(102, 520);
    g.scale(s, s);
    g.fillStyle = ink;
    g.fill(new Path2D(LOGO_RULE), "evenodd");
    g.fill(new Path2D(LOGO_WORD), "evenodd");
    g.fill(new Path2D(LOGO_TAG), "evenodd");
    g.restore();
    g.strokeStyle = "#9a4729";
    g.setLineDash([10, 10]);
    g.lineWidth = 3;
    g.strokeRect(80, 520 - 60, 864, LOGO_H * s + 120);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [ink, paper]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={[1.5, 2.05]} />
      <meshStandardMaterial map={texture} roughness={0.95} />
    </mesh>
  );
}

/* ---------- Tatuagem ---------- */

export function TattooMachine() {
  return (
    <group rotation={[0, 0.5, Math.PI / 2]} position={[0, 0.16, 0]}>
      {/* corpo */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.9, 40]} />
        <meshStandardMaterial color={black} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.08, 40]} />
        <meshStandardMaterial color="#9a4729" {...metal} />
      </mesh>
      {/* grip */}
      <mesh castShadow position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.48, 40]} />
        <meshStandardMaterial color="#334238" roughness={0.85} />
      </mesh>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, -0.25 - i * 0.065, 0]}>
          <torusGeometry args={[0.125 - i * 0.003, 0.01, 8, 40]} />
          <meshStandardMaterial color="#252622" roughness={0.9} />
        </mesh>
      ))}
      {/* cartucho translúcido */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.07, 0.03, 0.38, 24]} />
        <meshPhysicalMaterial color="#d8ccb6" transparent opacity={0.55} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.07, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.1, 6]} />
        <meshStandardMaterial color={steel} {...metal} />
      </mesh>
      <Tube
        points={[
          [0, 0.72, 0],
          [0, 1.1, 0.05],
          [0.3, 1.5, 0.3],
          [0.9, 1.7, 0.1],
          [1.4, 1.6, -0.4],
        ]}
        radius={0.03}
      />
    </group>
  );
}

const INK_COLORS = ["#111210", "#9a4729", "#5f725a", "#efe8dc", "#c9a46a"];

export function InkBottles() {
  return (
    <group>
      {INK_COLORS.slice(0, 4).map((c, i) => {
        const x = (i % 2) * 0.42 - 0.2;
        const z = Math.floor(i / 2) * 0.42 - 0.2;
        const h = 0.7 + (i % 3) * 0.05;
        return (
          <group key={c} position={[x, 0, z]}>
            <mesh castShadow position={[0, h / 2, 0]}>
              <cylinderGeometry args={[0.16, 0.16, h, 32]} />
              <meshPhysicalMaterial color={c} roughness={0.15} clearcoat={1} />
            </mesh>
            <mesh position={[0, h * 0.45, 0]}>
              <cylinderGeometry args={[0.165, 0.165, h * 0.42, 32, 1, true]} />
              <meshStandardMaterial color="#efe8dc" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, h * 0.45, 0.166]}>
              <planeGeometry args={[0.12, 0.12]} />
              <meshStandardMaterial color={c === "#efe8dc" ? "#252622" : c} />
            </mesh>
            <mesh castShadow position={[0, h + 0.1, 0]}>
              <cylinderGeometry args={[0.07, 0.1, 0.2, 24]} />
              <meshStandardMaterial color={black} roughness={0.5} />
            </mesh>
            <mesh castShadow position={[0, h + 0.25, 0]}>
              <coneGeometry args={[0.05, 0.14, 20]} />
              <meshStandardMaterial color={black} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function InkCaps() {
  const caps = [...INK_COLORS, "#334238", "#111210"];
  return (
    <group>
      <mesh receiveShadow castShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.62, 0.66, 0.06, 48]} />
        <meshStandardMaterial color="#d8ccb6" roughness={0.6} />
      </mesh>
      {caps.map((c, i) => {
        const a = (i / caps.length) * Math.PI * 2;
        const r = i === 0 ? 0 : 0.4;
        const p: [number, number, number] =
          i === 0 ? [0, 0.14, 0] : [Math.cos(a) * r, 0.14, Math.sin(a) * r];
        return (
          <group key={i} position={p}>
            <mesh castShadow>
              <cylinderGeometry args={[0.11, 0.09, 0.18, 24, 1, true]} />
              <meshStandardMaterial color="#f4f1ea" roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.105, 24]} />
              <meshPhysicalMaterial color={c} roughness={0.05} clearcoat={1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function FilmRoll() {
  return (
    <group rotation={[0, -0.4, 0]}>
      <mesh castShadow position={[0, 0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 1.3, 48]} />
        <meshPhysicalMaterial
          color="#c9d6cc"
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.32, 32]} />
        <meshStandardMaterial color="#9a4729" roughness={0.8} />
      </mesh>
      {/* filme desenrolado */}
      <mesh position={[0, 0.006, 0.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.25, 1.0]} />
        <meshPhysicalMaterial
          color="#e6f0ea"
          transparent
          opacity={0.35}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function Gloves() {
  return (
    <group rotation={[0, 0.8, 0]}>
      <RoundedBox args={[0.9, 0.08, 0.5]} radius={0.04} position={[0, 0.04, 0]} castShadow>
        <meshStandardMaterial color="#1b1c19" roughness={0.7} />
      </RoundedBox>
      {[...Array(4)].map((_, i) => (
        <RoundedBox
          key={i}
          args={[0.42, 0.06, 0.09]}
          radius={0.03}
          position={[0.6, 0.035, -0.18 + i * 0.12]}
          rotation={[0, (i - 1.5) * 0.12, 0]}
          castShadow
        >
          <meshStandardMaterial color="#1b1c19" roughness={0.7} />
        </RoundedBox>
      ))}
    </group>
  );
}

/* ---------- Barbearia ---------- */

export function Clipper() {
  return (
    <group rotation={[0, -0.6, 0]}>
      <RoundedBox
        args={[1.5, 0.34, 0.5]}
        radius={0.15}
        smoothness={6}
        position={[0, 0.2, 0]}
        castShadow
      >
        <meshStandardMaterial color={black} metalness={0.5} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.36, 0.52]} radius={0.12} position={[-0.35, 0.2, 0]} castShadow>
        <meshStandardMaterial color={gold} {...metal} />
      </RoundedBox>
      <mesh position={[0.8, 0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.56]} />
        <meshStandardMaterial color={steel} {...metal} />
      </mesh>
      {[...Array(14)].map((_, i) => (
        <mesh key={i} position={[0.88, 0.2, -0.26 + i * 0.04]}>
          <boxGeometry args={[0.06, 0.26, 0.02]} />
          <meshStandardMaterial color={steel} {...metal} />
        </mesh>
      ))}
      <mesh position={[0.2, 0.38, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
        <meshStandardMaterial color="#9a4729" emissive="#9a4729" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function bladeShape(len: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(len * 0.5, 0.09, len, 0.01);
  s.lineTo(len, -0.01);
  s.quadraticCurveTo(len * 0.5, -0.02, 0, -0.06);
  s.closePath();
  return s;
}

export function Scissors({ color = gold }: { color?: string }) {
  const blade = useMemo(
    () => new THREE.ExtrudeGeometry(bladeShape(1.3), { depth: 0.025, bevelEnabled: false }),
    [],
  );
  return (
    <group rotation={[-Math.PI / 2, 0, 0.3]} position={[0, 0.05, 0]}>
      {[0.12, -0.12].map((a, i) => (
        <group key={i} rotation={[0, 0, a]}>
          <mesh geometry={blade} castShadow position={[0, 0, i * 0.03]}>
            <meshStandardMaterial color={color} {...metal} />
          </mesh>
          <mesh position={[-0.32, i === 0 ? 0.1 : -0.12, i * 0.03]} castShadow>
            <torusGeometry args={[0.15, 0.035, 12, 40]} />
            <meshStandardMaterial color={color} {...metal} />
          </mesh>
          <mesh
            position={[-0.12, i === 0 ? 0.04 : -0.05, i * 0.03]}
            rotation={[0, 0, i === 0 ? 0.4 : -0.4]}
          >
            <boxGeometry args={[0.24, 0.05, 0.03]} />
            <meshStandardMaterial color={color} {...metal} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
        <meshStandardMaterial color={steel} {...metal} />
      </mesh>
    </group>
  );
}

export function Razor() {
  return (
    <group rotation={[0, 0.9, 0]}>
      <RoundedBox args={[1.1, 0.08, 0.2]} radius={0.035} position={[-0.45, 0.05, 0]} castShadow>
        <meshStandardMaterial color="#5a3a25" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0.45, 0.05, 0.02]} castShadow>
        <boxGeometry args={[0.8, 0.02, 0.22]} />
        <meshStandardMaterial color={steel} metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[0.06, 0.05, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <meshStandardMaterial color={gold} {...metal} />
      </mesh>
    </group>
  );
}

export function Dryer() {
  return (
    <group rotation={[0, 0.4, 0]}>
      <mesh castShadow position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 40]} />
        <meshStandardMaterial color="#334238" metalness={0.3} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0.55, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.24, 0.32, 32]} />
        <meshStandardMaterial color={black} roughness={0.4} />
      </mesh>
      <mesh position={[-0.41, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 40]} />
        <meshStandardMaterial color={gold} {...metal} />
      </mesh>
      <RoundedBox
        args={[0.2, 0.18, 0.7]}
        radius={0.08}
        position={[-0.1, 0.12, 0.45]}
        rotation={[0.4, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color="#334238" roughness={0.4} />
      </RoundedBox>
      <Tube
        points={[
          [-0.1, 0.05, 0.8],
          [-0.2, 0.02, 1.2],
          [-0.8, 0.02, 1.4],
          [-1.4, 0.02, 1.1],
        ]}
        radius={0.025}
      />
    </group>
  );
}

export function Pomade() {
  return (
    <group>
      <mesh castShadow position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.32, 48]} />
        <meshStandardMaterial color="#efe8dc" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.1, 48]} />
        <meshStandardMaterial color="#9a4729" {...metal} />
      </mesh>
      <mesh position={[0, 0.16, 0.362]}>
        <planeGeometry args={[0.36, 0.14]} />
        <meshStandardMaterial color="#334238" />
      </mesh>
      <mesh castShadow position={[0.7, 0.04, 0.1]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.18]} />
        <meshStandardMaterial color={black} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ---------- Laser & Peeling ---------- */

export function LaserPen() {
  return (
    <group rotation={[0, -0.5, 0]}>
      <group rotation={[0, 0, Math.PI / 2 - 0.15]} position={[0, 0.2, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.16, 1.1, 8, 32]} />
          <meshStandardMaterial color="#efe8dc" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.78, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.15, 0.3, 32]} />
          <meshStandardMaterial color={steel} {...metal} />
        </mesh>
        <mesh position={[0, -0.96, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#ff5a3c"
            emissive="#ff3b1f"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.1, 0.16]}>
          <boxGeometry args={[0.08, 0.3, 0.03]} />
          <meshStandardMaterial color="#9a4729" />
        </mesh>
      </group>
      <Tube
        points={[
          [-0.6, 0.25, 0],
          [-1, 0.1, 0.2],
          [-1.3, 0.04, 0.6],
          [-1.1, 0.03, 1.1],
          [-1.6, 0.03, 1.3],
        ]}
        radius={0.035}
        color="#d8ccb6"
      />
    </group>
  );
}

export function LaserUnit() {
  return (
    <group>
      <RoundedBox args={[1.1, 0.9, 0.9]} radius={0.08} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#efe8dc" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.58, 0.455]}>
        <planeGeometry args={[0.8, 0.45]} />
        <meshStandardMaterial
          color="#334238"
          emissive="#5f725a"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.3, 0.2, 0.455]}>
        <circleGeometry args={[0.06, 24]} />
        <meshStandardMaterial color="#9a4729" emissive="#9a4729" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

export function Goggles() {
  return (
    <group rotation={[-0.15, 0.6, 0]} position={[0, 0.14, 0]}>
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.14, 0.035, 12, 40]} />
            <meshStandardMaterial color={black} roughness={0.5} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.13, 32]} />
            <meshPhysicalMaterial
              color="#c86a2a"
              transparent
              opacity={0.75}
              roughness={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.12, 0.03, 0.03]} />
        <meshStandardMaterial color={black} />
      </mesh>
      <Tube
        points={[
          [-0.34, 0, 0],
          [-0.5, -0.08, -0.3],
          [0, -0.12, -0.55],
          [0.5, -0.08, -0.3],
          [0.34, 0, 0],
        ]}
        radius={0.02}
        color="#9a4729"
      />
    </group>
  );
}

export function CarbonJar() {
  return (
    <group>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.44, 40]} />
        <meshPhysicalMaterial color="#0d0d0c" roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.06, 40]} />
        <meshStandardMaterial color={gold} {...metal} />
      </mesh>
      <mesh position={[0, 0.22, 0.302]}>
        <planeGeometry args={[0.32, 0.16]} />
        <meshStandardMaterial color="#efe8dc" />
      </mesh>
      {/* espátula + pincel */}
      <group position={[0.65, 0.03, 0.1]} rotation={[0, -0.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.03, 0.06]} />
          <meshStandardMaterial color="#efe8dc" />
        </mesh>
        <mesh position={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.04, 0.16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

export function SerumBottle() {
  return (
    <group>
      {[0, 1].map((i) => (
        <group key={i} position={[i * 0.42 - 0.2, 0, i * 0.2]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.6, 32]} />
            <meshPhysicalMaterial
              color={i ? "#9a4729" : "#5f725a"}
              transmission={0.4}
              thickness={0.4}
              roughness={0.08}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[0, 0.66, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.12, 24]} />
            <meshStandardMaterial color={gold} {...metal} />
          </mesh>
          <mesh position={[0, 0.82, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.14, 6, 16]} />
            <meshStandardMaterial color={black} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0.65 + i * 0.05, 0.02 + i * 0.03, -0.25]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
          <meshStandardMaterial color="#f7f4ee" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
