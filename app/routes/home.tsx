import type { Route } from "./+types/home";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  MILESTONES,
  createFloatingMountain,
  createHobbitCharacter,
  createCampfire,
  createMilestoneTree,
  type Milestone
} from "../components/portfolio.client";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Anime Floating Mountain Portfolio" },
    { name: "description", content: "Single floating world interactive portfolio showcase" }
  ];
}

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const MILESTONES: Milestone[] = [
    {
      id: "origin",
      title: "The Origin Biome",
      subTitle: "Equity Analyst & Full-Stack Developer",
      targetPos: { x: 0, z: 4.5 }, // Campfire starting base
      details: [
        "Bridging quantitative market analysis with high-performance engineering.",
        "Generating clean code & Alpha simultaneously."
      ]
    },
    {
      id: "college",
      title: "The Academy Grove",
      subTitle: "Academic Foundations & Radical Builds",
      targetPos: { x: -4.5, z: -1 }, // The Sakura Tree
      details: [
        "Developed Git Gandalf: Local LLM pre-commit hooks to assess risk.",
        "Built GeoMusic Guesser: 3D coordinates meets audio identification."
      ]
    },
    {
      id: "job",
      title: "The Trading Peaks",
      subTitle: "Professional Experience",
      targetPos: { x: 4.5, z: 1 }, // The Crystal Spire
      details: [
        "Engineered core infrastructure at a premier trading firm.",
        "Generated a proven 24% annual return through rigorous market analysis."
      ]
    },
    {
      id: "sanctum",
      title: "The Tech Sanctum",
      subTitle: "The Stack & Beyond",
      targetPos: { x: 0, z: -2.5 }, // The Ancient Monolith
      details: [
        "React Router v7 (Framework Mode), Drizzle ORM, and PostgreSQL.",
        "Crafting deep 3D interfaces & reliable automated tooling."
      ]
    }
  ];
  const activeData = MILESTONES[currentIndex];

  // System animation variables managed inside a mutable safe reference object
  const internalState = useRef({
    // Cinematic Opening Positions (Far away, high sky view)
    camCurrentX: 0,   camTargetX: 0,
    camCurrentY: 35,  camTargetY: 4.5,
    camCurrentZ: 50,  camTargetZ: 9,
    
    // Hobbit real-time coordinates on mountain space
    hobbitX: MILESTONES[0].targetPos.x,
    hobbitZ: MILESTONES[0].targetPos.z,
    
    worldRotationY: 0,
    lerpSpeed: 0.035,
    actorMoveSpeed: 0.04
  });

  const handleNext = () => {
    if (currentIndex < MILESTONES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const animeSky = 0xbfe3ff; // Soft painterly blue background
    scene.background = new THREE.Color(animeSky);
    scene.fog = new THREE.FogExp2(animeSky, 0.018);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const state = internalState.current;
    camera.position.set(state.camCurrentX, state.camCurrentY, state.camCurrentZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Warm Anime-style ambient parameters
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(25, 45, 20);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0xfff3d1, 0.65));

    // The Single Global World Container - Everything spins here together!
    const mountainWorld = createFloatingMountain();
    scene.add(mountainWorld);

    // Add Milestone Entities directly onto the mountain surface mesh
    const campfire = createCampfire();
    campfire.position.set(MILESTONES[0].targetPos.x, 0, MILESTONES[0].targetPos.z);
    mountainWorld.add(campfire);

    const collegeTree = createMilestoneTree(0xffb7c5); // Sakura Pink
    collegeTree.position.set(MILESTONES[1].targetPos.x, 0, MILESTONES[1].targetPos.z);
    mountainWorld.add(collegeTree);

    const jobSpire = createMilestoneTree(0x63b3ed); // Crystal Ice Blue
    jobSpire.position.set(MILESTONES[2].targetPos.x, 0, MILESTONES[2].targetPos.z);
    mountainWorld.add(jobSpire);

    const sanctumTower = createMilestoneTree(0xb794f4); // Mystic Purple
    sanctumTower.position.set(MILESTONES[3].targetPos.x, 0, MILESTONES[3].targetPos.z);
    mountainWorld.add(sanctumTower);

    // Instantiate our tiny Hobbit character
    const hobbitCharacter = createHobbitCharacter();
    hobbitCharacter.position.set(state.hobbitX, 0, state.hobbitZ);
    mountainWorld.add(hobbitCharacter);

    let animationFrameId = 0;
    // let clock = new THREE.Clock();
    let lastTime = performance.now();
    let totalElapsedTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000; // Gives you the exact delta in seconds
      lastTime = currentTime;
      totalElapsedTime += delta;

      // 1. Smoothly spin the entire world on its center axis
      state.worldRotationY += 0.05 * delta;
      mountainWorld.rotation.y = state.worldRotationY;

      // 2. Animate Hobbit position to follow active state indices
      const currentTarget = MILESTONES[currentIndex].targetPos;
      const dx = currentTarget.x - state.hobbitX;
      const dz = currentTarget.z - state.hobbitZ;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 0.05) {
        // Move character towards current milestone coordinates
        state.hobbitX += (dx / distance) * state.actorMoveSpeed;
        state.hobbitZ += (dz / distance) * state.actorMoveSpeed;
        hobbitCharacter.position.set(state.hobbitX, 0, state.hobbitZ);

        // Turn character to look forward into the vector path direction
        hobbitCharacter.rotation.y = Math.atan2(dx, dz);

        // Simple procedural hopping animation to simulate walking steps
        hobbitCharacter.position.y = Math.abs(Math.sin(totalElapsedTime * 10)) * 0.12;
      } else {
        hobbitCharacter.position.y = 0; // stand still when arrived
      }

      // 3. Smooth Camera Cinematic interpolation tracking mechanics
      state.camCurrentX += (state.camTargetX - state.camCurrentX) * state.lerpSpeed;
      state.camCurrentY += (state.camTargetY - state.camCurrentY) * state.lerpSpeed;
      state.camCurrentZ += (state.camTargetZ - state.camCurrentZ) * state.lerpSpeed;

      camera.position.set(state.camCurrentX, state.camCurrentY, state.camCurrentZ);

      // Camera dynamic tracking logic: 
      // We compute exactly where the character is right now inside the rotating matrix space!
      const characterWorldPos = new THREE.Vector3(state.hobbitX, 0.5, state.hobbitZ);
      characterWorldPos.applyMatrix4(mountainWorld.matrixWorld);
      camera.lookAt(characterWorldPos);

      // Trigger user experience UI presentation layer fade once entry zoom drops close to deck
      if (!isIntroComplete && state.camCurrentY - state.camTargetY < 2) {
        setIsIntroComplete(true);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [currentIndex, isIntroComplete]);

  return (
    <div className={styles.portfolioContainer}>
      <div ref={mountRef} className={styles.canvasMount} />

      {/* Modern glassmorphic narrative overlays */}
      <div className={`${styles.uiWrapper} ${isIntroComplete ? styles.visible : styles.hidden}`}>
        <header className={styles.headerCard}>
          <h1 className={styles.headerTitle}>Interactive Developer Journey</h1>
          <p className={styles.headerSubtitle}>Procedural 3D Anime Environment</p>
        </header>

        <div className={styles.dataPanel}>
          <span className={styles.chapterTag}>
            Chapter {currentIndex + 1} of {MILESTONES.length}
          </span>
          <h2 className={styles.panelTitle}>{activeData.title}</h2>
          <p className={styles.panelSubtitle}>{activeData.subTitle}</p>
          
          <ul className={styles.detailList}>
            {activeData.details.map((detail, idx) => (
              <li key={idx} className={styles.detailItem}>
                <span className={styles.bulletPoint}>▹</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.navigationBar}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`${styles.navButton} ${styles.btnBack}`}
          >
            ◀ Back
          </button>
          <div className={styles.locationIndicator}>
            STEP: {currentIndex + 1}
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex === MILESTONES.length - 1}
            className={`${styles.navButton} ${styles.btnProceed}`}
          >
            Proceed ▶
          </button>
        </nav>
      </div>
    </div>
  );
}