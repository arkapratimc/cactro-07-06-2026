import * as THREE from "three";

export interface Milestone {
  id: string;
  title: string;
  subTitle: string;
  // Dynamic positioning targets on the SAME mountain surface
  targetPos: { x: number; z: number }; 
  details: string[];
}

export const MILESTONES: Milestone[] = [
  {
    id: "origin",
    title: "The Origin Biome",
    subTitle: "Equity Analyst & Full-Stack Developer",
    targetPos: { x: 0, z: 2 }, // Campfire starting base
    details: [
      "Bridging quantitative market analysis with high-performance engineering.",
      "Generating clean code & Alpha simultaneously."
    ]
  },
  {
    id: "college",
    title: "The Academy Grove",
    subTitle: "Academic Foundations & Radical Builds",
    targetPos: { x: -2.5, z: -1 }, // The Sakura Tree
    details: [
      "Developed Git Gandalf: Local LLM pre-commit hooks to assess risk.",
      "Built GeoMusic Guesser: 3D coordinates meets audio identification."
    ]
  },
  {
    id: "job",
    title: "The Trading Peaks",
    subTitle: "Professional Experience",
    targetPos: { x: 2.5, z: -1.5 }, // The Crystal Spire
    details: [
      "Engineered core infrastructure at a premier trading firm.",
      "Generated a proven 24% annual return through rigorous market analysis."
    ]
  },
  {
    id: "sanctum",
    title: "The Tech Sanctum",
    subTitle: "The Stack & Beyond",
    targetPos: { x: 0, z: -3 }, // The Ancient Monolith
    details: [
      "React Router v7 (Framework Mode), Drizzle ORM, and PostgreSQL.",
      "Crafting deep 3D interfaces & reliable automated tooling."
    ]
  }
];

// Single Large Anime Floating Mountain Base
export function createFloatingMountain(): THREE.Group {
  const mountainGroup = new THREE.Group();

  // Low-poly tapered base (the floating underside rock)
  const rockGeo = new THREE.CylinderGeometry(8, 0.5, 7, 8);
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x2d3748 });
  const rock = new THREE.Mesh(rockGeo, rockMat);
  rock.position.y = -3.5;
  mountainGroup.add(rock);

  // Vibrant green top grassy meadow surface
  const grassGeo = new THREE.CylinderGeometry(8.2, 7.8, 0.4, 8);
  const grassMat = new THREE.MeshLambertMaterial({ color: 0x48bb78 });
  const grass = new THREE.Mesh(grassGeo, grassMat);
  grass.position.y = 0;
  mountainGroup.add(grass);

  // Decorative backdrop low-poly peak on the back edge
  const peakGeo = new THREE.ConeGeometry(3, 5, 5);
  const peakMat = new THREE.MeshLambertMaterial({ color: 0x1a202c });
  const peak = new THREE.Mesh(peakGeo, peakMat);
  peak.position.set(0, 2.3, -2);
  mountainGroup.add(peak);

  return mountainGroup;
}

export function createHobbitCharacter(): THREE.Group {
  const hobbitGroup = new THREE.Group();

  // Head
  const headGeo = new THREE.SphereGeometry(0.2, 6, 6);
  const headMat = new THREE.MeshLambertMaterial({ color: 0xffdbac });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 0.8;
  hobbitGroup.add(head);

  // Torso / Cloak
  const bodyGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 6);
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x276749 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.45;
  hobbitGroup.add(body);

  // Boots
  const feetMat = new THREE.MeshLambertMaterial({ color: 0x4a5568 });
  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.15), feetMat);
  leftFoot.position.set(-0.08, 0.14, 0.02);
  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.15), feetMat);
  rightFoot.position.set(0.08, 0.14, 0.02);
  hobbitGroup.add(leftFoot, rightFoot);

  return hobbitGroup;
}

// Landmark 1: Start Campfire
export function createCampfire(): THREE.Group {
  const group = new THREE.Group();
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0x718096 });
  for (let i = 0; i < 6; i++) {
    const stone = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.2), stoneMat);
    const angle = (i / 6) * Math.PI * 2;
    stone.position.set(Math.cos(angle) * 0.4, 0.05, Math.sin(angle) * 0.4);
    group.add(stone);
  }
  const fire = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 4), new THREE.MeshBasicMaterial({ color: 0xdd6b20 }));
  fire.position.y = 0.2;
  group.add(fire);
  return group;
}

// Landmark 2: Academy Grove Tree (Pink Sakura style)
export function createMilestoneTree(color = 0xfbb6ce): THREE.Group {
  const treeGroup = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 1, 4), new THREE.MeshLambertMaterial({ color: 0x744210 }));
  trunk.position.y = 0.5;
  treeGroup.add(trunk);

  const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.55, 5, 5), new THREE.MeshLambertMaterial({ color }));
  foliage.position.y = 1.1;
  treeGroup.add(foliage);
  return treeGroup;
}