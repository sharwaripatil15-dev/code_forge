'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArchitectureNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Box,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Eye,
  RefreshCw,
  X,
  Zap,
  Layers,
  Cpu,
  Database,
  Globe,
  Code,
  Copy,
  Check,
  Search,
  Sparkles,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Architecture3DCanvasProps {
  nodes: ArchitectureNode[];
  onBackTo2D?: () => void;
}

interface ProjectedLabel {
  id: string;
  title: string;
  category: string;
  tech: string;
  x: number;
  y: number;
  visible: boolean;
  colorHex: string;
}

const LAYER_MAPPING = {
  frontend: { name: 'Presentation / UI Tier', colorHex: '#00f0ff', colorThree: 0x00f0ff, tierY: 6, shape: 'slab' },
  gateway: { name: 'API / Gateway Tier', colorHex: '#ff9500', colorThree: 0xff9500, tierY: 2, shape: 'torus' },
  ai: { name: 'AI & Neural Reasoning Tier', colorHex: '#ff3b00', colorThree: 0xff3b00, tierY: -2, shape: 'icosahedron' },
  storage: { name: 'Data & Vector Storage Tier', colorHex: '#10b981', colorThree: 0x10b981, tierY: -6, shape: 'cylinder' },
  agent: { name: 'Integration & External Agents', colorHex: '#a855f7', colorThree: 0xa855f7, tierY: -4, shape: 'octahedron' },
};

function getLayerInfo(category: string) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('frontend') || cat.includes('ui') || cat.includes('presentation') || cat.includes('client')) {
    return LAYER_MAPPING.frontend;
  }
  if (cat.includes('gateway') || cat.includes('api') || cat.includes('router') || cat.includes('auth')) {
    return LAYER_MAPPING.gateway;
  }
  if (cat.includes('storage') || cat.includes('vector') || cat.includes('database') || cat.includes('cache') || cat.includes('data')) {
    return LAYER_MAPPING.storage;
  }
  if (cat.includes('agent') || cat.includes('integration') || cat.includes('webhook') || cat.includes('external')) {
    return LAYER_MAPPING.agent;
  }
  // Default to AI Reasoning
  return LAYER_MAPPING.ai;
}

export default function Architecture3DCanvas({ nodes, onBackTo2D }: Architecture3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [viewPreset, setViewPreset] = useState<'iso' | 'top' | 'exploded' | 'front'>('iso');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Screen projected persistent node labels
  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabel[]>([]);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const targetYSpacingRef = useRef<number>(3.5);
  const currentYSpacingRef = useRef<number>(3.5);

  const activeNodes = useMemo(() => {
    const list = nodes && nodes.length > 0 ? nodes : [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (n) => n.title.toLowerCase().includes(q) || n.tech.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
    );
  }, [nodes, searchQuery]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x040508);
    scene.fog = new THREE.FogExp2(0x040508, 0.01);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(24, 22, 32);
    cameraRef.current = camera;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Orbit Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 8;
    controls.maxDistance = 85;
    controlsRef.current = controls;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff3b00, 1.4);
    dirLight1.position.set(25, 40, 20);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight2.position.set(-25, 25, -20);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff9500, 1.5, 60);
    pointLight.position.set(0, 12, 0);
    scene.add(pointLight);

    // --- Background Matrix Starfield Particles ---
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 130;
      starPositions[i + 1] = (Math.random() - 0.5) * 90 + 10;
      starPositions[i + 2] = (Math.random() - 0.5) * 130;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.35,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const starParticles = new THREE.Points(starGeo, starMat);
    scene.add(starParticles);

    // --- Floor Grid ---
    const gridHelper = new THREE.GridHelper(75, 38, 0xff3b00, 0x1e293b);
    gridHelper.position.y = -8;
    scene.add(gridHelper);

    // --- Layer Planes (Holographic Architecture Tiers) ---
    const layerDefs = [
      { name: '1. Presentation / UI Tier', color: LAYER_MAPPING.frontend.colorThree, yOffset: 6 },
      { name: '2. API Gateway & Microservices', color: LAYER_MAPPING.gateway.colorThree, yOffset: 2 },
      { name: '3. AI Neural Reasoning Tier', color: LAYER_MAPPING.ai.colorThree, yOffset: -2 },
      { name: '4. Data, Vector & Agent Tier', color: LAYER_MAPPING.storage.colorThree, yOffset: -6 },
    ];

    const planeGroup = new THREE.Group();
    scene.add(planeGroup);

    layerDefs.forEach((layer) => {
      const planeGeo = new THREE.PlaneGeometry(42, 16);
      const planeMat = new THREE.MeshStandardMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        roughness: 0.1,
        metalness: 0.8,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = layer.yOffset;
      planeGroup.add(plane);

      // Glowing wireframe border
      const wireGeo = new THREE.WireframeGeometry(planeGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: layer.color, transparent: true, opacity: 0.22 });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      wire.rotation.x = Math.PI / 2;
      wire.position.y = layer.yOffset;
      planeGroup.add(wire);
    });

    // --- Create 3D Nodes based on Real Blueprint Data ---
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];
    const satelliteRings: THREE.Mesh[] = [];

    activeNodes.forEach((node, idx) => {
      const layerInfo = getLayerInfo(node.category);

      // Geometry mapping per layer type
      let geo: THREE.BufferGeometry;
      if (layerInfo.shape === 'slab') {
        geo = new THREE.BoxGeometry(4.4, 2.2, 1.8);
      } else if (layerInfo.shape === 'torus') {
        geo = new THREE.TorusGeometry(2.0, 0.55, 14, 30);
      } else if (layerInfo.shape === 'cylinder') {
        geo = new THREE.CylinderGeometry(1.9, 1.9, 2.8, 22);
      } else if (layerInfo.shape === 'octahedron') {
        geo = new THREE.OctahedronGeometry(2.2);
      } else {
        // AI / LLM Engine
        geo = new THREE.IcosahedronGeometry(2.2, 1);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: layerInfo.colorThree,
        emissive: layerInfo.colorThree,
        emissiveIntensity: 0.25,
        metalness: 0.7,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Real Tier Position Layout
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const posX = (col - 1.5) * 9.5;
      const posY = layerInfo.tierY;
      const posZ = (row - 0.5) * 5.5;

      mesh.position.set(posX, posY, posZ);
      mesh.userData = {
        node,
        colorHex: layerInfo.colorHex,
        defaultColor: layerInfo.colorThree,
        basePosY: posY,
      };

      // Wireframe outline
      const wireGeo = new THREE.WireframeGeometry(geo);
      const wireMat = new THREE.LineBasicMaterial({ color: layerInfo.colorThree, transparent: true, opacity: 0.45 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireMesh);

      // Orbiting Satellite Ring for AI & Gateway components
      if (layerInfo.shape === 'icosahedron' || layerInfo.shape === 'torus') {
        const ringGeo = new THREE.TorusGeometry(3.0, 0.07, 8, 36);
        const ringMat = new THREE.MeshBasicMaterial({ color: layerInfo.colorThree, transparent: true, opacity: 0.65 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        mesh.add(ringMesh);
        satelliteRings.push(ringMesh);
      }

      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);
      nodePositions.push(mesh.position.clone());
    });

    // --- 3D Data Flow Bezier Curves & Flow Particles ---
    const curveTubesGroup = new THREE.Group();
    scene.add(curveTubesGroup);

    const flowParticles: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; speed: number; progress: number }[] = [];

    // Create Data Flow connections along the actual architecture pipeline (Layer 3 -> 2 -> 1 -> 0)
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[i + 1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 + 2.8;
      const midZ = (p1.z + p2.z) / 2 + 1.5;

      const midPoint = new THREE.Vector3(midX, midY, midZ);
      const curve = new THREE.CatmullRomCurve3([p1, midPoint, p2]);

      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.09, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      curveTubesGroup.add(tubeMesh);

      // Flowing glowing particle
      const particleGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const particleMat = new THREE.MeshStandardMaterial({
        color: 0xff3b00,
        emissive: 0xff3b00,
        emissiveIntensity: 1.6,
      });
      const particleMesh = new THREE.Mesh(particleGeo, particleMat);
      curveTubesGroup.add(particleMesh);

      flowParticles.push({
        mesh: particleMesh,
        curve,
        speed: 0.007 + Math.random() * 0.003,
        progress: Math.random(),
      });
    }

    // --- Raycasting setup for Node Click ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const nodeData = hitMesh.userData.node as ArchitectureNode;
        setSelectedNode(nodeData);

        // Highlight selected mesh
        nodeMeshes.forEach((m) => {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (m === hitMesh) {
            mat.emissiveIntensity = 1.3;
          } else {
            mat.emissiveIntensity = 0.15;
          }
        });

        // Smooth camera target towards node
        controls.target.copy(hitMesh.position);
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // --- Animation & Label Projection Loop ---
    let tourAngle = 0;
    let animationFrameId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      // Smooth tier spacing for exploded view
      currentYSpacingRef.current += (targetYSpacingRef.current - currentYSpacingRef.current) * 0.06;

      // Rotate nodes & rings
      nodeMeshes.forEach((m) => {
        m.rotation.y += 0.006;
      });

      satelliteRings.forEach((r) => {
        r.rotation.z += 0.014;
      });

      // Flowing stream particles along data lines
      if (isFlowActive) {
        flowParticles.forEach((p) => {
          p.progress = (p.progress + p.speed) % 1;
          const pos = p.curve.getPoint(p.progress);
          p.mesh.position.copy(pos);
        });
      }

      // Star particles slow drift
      starParticles.rotation.y += 0.0003;

      // Cinematic camera tour
      if (isTourActive) {
        tourAngle += 0.005;
        camera.position.x = 32 * Math.cos(tourAngle);
        camera.position.z = 32 * Math.sin(tourAngle);
        camera.lookAt(0, 0, 0);
      }

      // --- Project 3D Node positions to 2D Screen HTML Coordinates ---
      const projected: ProjectedLabel[] = [];
      const currentContainer = mountRef.current;

      if (currentContainer && camera) {
        const cWidth = currentContainer.clientWidth;
        const cHeight = currentContainer.clientHeight;

        nodeMeshes.forEach((m) => {
          const nodeData = m.userData.node as ArchitectureNode;
          const colorHex = m.userData.colorHex as string;

          m.getWorldPosition(tempVec);
          tempVec.y += 2.8; // Position label right above 3D mesh shape

          tempVec.project(camera);

          // Visible if in front of camera frustum
          const isVisible = tempVec.z < 1.0 && Math.abs(tempVec.x) < 1.15 && Math.abs(tempVec.y) < 1.15;

          const screenX = ((tempVec.x + 1) * cWidth) / 2;
          const screenY = ((-tempVec.y + 1) * cHeight) / 2;

          projected.push({
            id: nodeData.id || nodeData.title,
            title: nodeData.title,
            category: nodeData.category,
            tech: nodeData.tech,
            x: screenX,
            y: screenY,
            visible: isVisible,
            colorHex,
          });
        });
      }

      setProjectedLabels(projected);
      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement) renderer.domElement.remove();
      renderer.dispose();
    };
  }, [activeNodes, isTourActive, isFlowActive]);

  // --- View Preset Handlers ---
  const handlePresetView = (preset: 'iso' | 'top' | 'exploded' | 'front') => {
    setViewPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctr = controlsRef.current;

    setIsTourActive(false);

    if (preset === 'iso') {
      targetYSpacingRef.current = 3.5;
      cam.position.set(24, 22, 32);
      ctr.target.set(0, 0, 0);
    } else if (preset === 'top') {
      targetYSpacingRef.current = 3.5;
      cam.position.set(0, 52, 0.1);
      ctr.target.set(0, 0, 0);
    } else if (preset === 'exploded') {
      targetYSpacingRef.current = 7.0; // Spread layers vertically
      cam.position.set(34, 28, 34);
      ctr.target.set(0, 0, 0);
    } else if (preset === 'front') {
      targetYSpacingRef.current = 3.5;
      cam.position.set(0, 4, 40);
      ctr.target.set(0, 0, 0);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Card
      variant="blueprint"
      className={`p-6 space-y-4 shadow-2xl relative transition-all duration-300 border border-quenched-steel/30 ${
        isFullScreen ? 'fixed inset-3 z-50 bg-forge-black/98 border-cyan-500/50 flex flex-col justify-between' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-quenched-steel/25 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Box className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                <span>3D System Architecture Blueprint</span>
                <Badge variant="mono" size="sm" className="font-mono text-[10px] text-cyan-300 border-cyan-500/30">
                  Live WebGL
                </Badge>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Real architecture components generated per-idea. Persistently labeled nodes with 3D data pipeline flows.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-2.5 bg-forge-surface-light border border-quenched-steel/30 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 w-40"
            />
          </div>

          {/* View Presets */}
          <div className="flex items-center bg-forge-black p-1 rounded-lg border border-quenched-steel/30 text-xs font-mono">
            <button
              onClick={() => handlePresetView('iso')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'iso' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              3D Iso
            </button>
            <button
              onClick={() => handlePresetView('top')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'top' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Top View
            </button>
            <button
              onClick={() => handlePresetView('exploded')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'exploded' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Exploded
            </button>
            <button
              onClick={() => handlePresetView('front')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'front' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Front
            </button>
          </div>

          {/* Flow Particles Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFlowActive(!isFlowActive)}
            className={`text-xs font-mono ${isFlowActive ? 'text-emerald-400 border-emerald-500/30' : 'text-zinc-400'}`}
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            {isFlowActive ? 'Flow Live' : 'Flow Paused'}
          </Button>

          {/* Cinematic Orbit Tour Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTourActive(!isTourActive)}
            className={`text-xs font-mono ${isTourActive ? 'text-amber-300 border-amber-500/40 bg-amber-500/10' : 'text-amber-400 border-amber-500/30'}`}
          >
            {isTourActive ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isTourActive ? 'Stop Tour' : 'Cinematic Orbit'}
          </Button>

          {onBackTo2D && (
            <Button variant="outline" size="sm" onClick={onBackTo2D} className="text-xs font-mono text-zinc-300">
              2D Schematic
            </Button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg bg-forge-black border border-quenched-steel/30 text-zinc-300 hover:text-white transition"
            title="Toggle Fullscreen"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={mountRef}
        className={`w-full bg-forge-black rounded-blueprint border border-quenched-steel/30 overflow-hidden relative ${
          isFullScreen ? 'flex-1 min-h-[560px]' : 'h-[480px]'
        }`}
      >
        {/* PERSISTENT 3D LABELS OVERLAY (Synced in real-time with WebGL screen coordinates) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {projectedLabels.map((lbl) => {
            if (!lbl.visible) return null;

            return (
              <div
                key={lbl.id}
                className="absolute pointer-events-auto transition-transform duration-75 ease-out"
                style={{
                  transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0) translate(-50%, -100%)`,
                }}
              >
                {/* Crisp Glassmorphic Label Badge */}
                <div
                  onClick={() => {
                    const found = activeNodes.find((n) => (n.id || n.title) === lbl.id);
                    if (found) setSelectedNode(found);
                  }}
                  className="bg-forge-black/95 backdrop-blur-md px-3 py-1.5 rounded-lg border shadow-xl flex flex-col items-center gap-0.5 cursor-pointer hover:scale-105 transition-all group"
                  style={{
                    borderColor: `${lbl.colorHex}90`,
                    boxShadow: `0 0 16px ${lbl.colorHex}35`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse shrink-0"
                      style={{ backgroundColor: lbl.colorHex }}
                    />
                    <span className="font-display font-extrabold text-xs text-white whitespace-nowrap group-hover:text-cyan-300 transition">
                      {lbl.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono whitespace-nowrap">
                    <span className="text-zinc-400 font-medium">{lbl.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span style={{ color: lbl.colorHex }} className="font-semibold">
                      {lbl.tech}
                    </span>
                  </div>
                </div>

                {/* Pointer Stem Line */}
                <div
                  className="w-0.5 h-3 mx-auto opacity-80"
                  style={{ backgroundColor: lbl.colorHex }}
                />
              </div>
            );
          })}
        </div>

        {/* Node Details Inspector Side Drawer */}
        {selectedNode && (
          <div className="absolute right-4 top-4 bottom-4 w-80 z-30 bg-forge-black/95 backdrop-blur-xl border border-brand-ember/50 p-4 rounded-xl shadow-2xl overflow-y-auto flex flex-col justify-between text-xs font-sans text-white animate-slide-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-quenched-steel/30 pb-2.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-ember" />
                  <span className="font-display font-bold text-sm text-white">Component Inspector</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-quenched-steel/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-white font-display mb-1">{selectedNode.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="ember" size="sm" className="font-mono text-[10px]">
                    {selectedNode.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {selectedNode.tech}
                  </span>
                </div>
              </div>

              <div className="bg-forge-surface-light/80 p-3 rounded-lg border border-quenched-steel/20 space-y-1">
                <p className="text-[11px] text-zinc-300 leading-relaxed">{selectedNode.description}</p>
              </div>

              {/* Sample API Code Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-brand-ember" /> Service Handler Spec
                  </span>
                  <button
                    onClick={() =>
                      handleCopyCode(
                        `// Microservice Handler for ${selectedNode.title}\nexport async function POST(req) {\n  return Response.json({ status: 'ok', service: '${selectedNode.tech}' });\n}`
                      )
                    }
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="bg-zinc-950 p-2.5 rounded border border-quenched-steel/30 font-mono text-[10px] text-emerald-400 overflow-x-auto">
{`// ${selectedNode.title} Spec
export async function POST(req) {
  return Response.json({
    status: 'active',
    component: '${selectedNode.title}',
    tech: '${selectedNode.tech}',
    nodeId: '${selectedNode.id}'
  });
}`}
                </pre>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedNode(null)}
              className="w-full mt-3 text-xs font-mono text-zinc-300"
            >
              Close Inspector
            </Button>
          </div>
        )}

        {/* Permanently Visible Layer Color Legend (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto flex items-center gap-3 text-[11px] font-mono text-zinc-300 bg-forge-black/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-quenched-steel/30 shadow-lg flex-wrap">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Legend:
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" /> Frontend
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" /> Gateway / API
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-ember shadow-sm shadow-brand-ember/50" /> AI LLM
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" /> Storage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" /> Agents
          </span>
        </div>

        {/* Orbit Helper Tip (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-forge-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-quenched-steel/20">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Click & Drag to rotate | Right-click to pan</span>
        </div>
      </div>
    </Card>
  );
}
