'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArchitectureNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Box, Play, Pause, Maximize2, Minimize2, Eye, RefreshCw, X, Plus } from 'lucide-react';

interface Architecture3DCanvasProps {
  nodes: ArchitectureNode[];
  onBackTo2D?: () => void;
}

export default function Architecture3DCanvas({ nodes, onBackTo2D }: Architecture3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [viewPreset, setViewPreset] = useState<'iso' | 'top' | 'exploded'>('iso');
  const [customNodes, setCustomNodes] = useState<ArchitectureNode[]>(nodes || []);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    setCustomNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070b);
    scene.fog = new THREE.FogExp2(0x06070b, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(22, 18, 28);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff3b00, 1.2);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    blueLight.position.set(-20, 20, -20);
    scene.add(blueLight);

    const gridHelper = new THREE.GridHelper(60, 30, 0xff3b00, 0x1f293d);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // Layer Planes
    const layers = ['Presentation', 'API Gateway', 'AI Reasoning', 'Data Storage'];
    const layerColors = [0x00f0ff, 0xff9500, 0xff3b00, 0x10b981];

    layers.forEach((layerName, idx) => {
      const planeGeo = new THREE.PlaneGeometry(36, 10);
      const planeMat = new THREE.MeshBasicMaterial({
        color: layerColors[idx],
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = idx * 4 - 2;
      scene.add(plane);

      const wireGeo = new THREE.WireframeGeometry(planeGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: layerColors[idx], transparent: true, opacity: 0.25 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      wireframe.rotation.x = Math.PI / 2;
      wireframe.position.y = idx * 4 - 2;
      scene.add(wireframe);
    });

    // Create 3D Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    customNodes.forEach((node, idx) => {
      let geo: THREE.BufferGeometry = new THREE.BoxGeometry(3, 2, 3);
      if (node.category.toLowerCase().includes('frontend')) {
        geo = new THREE.BoxGeometry(4, 2.2, 1.5);
      } else if (node.category.toLowerCase().includes('gateway') || node.category.toLowerCase().includes('api')) {
        geo = new THREE.TorusGeometry(1.8, 0.6, 12, 24);
      } else if (node.category.toLowerCase().includes('ai') || node.category.toLowerCase().includes('reasoning')) {
        geo = new THREE.IcosahedronGeometry(1.8, 1);
      } else if (node.category.toLowerCase().includes('data') || node.category.toLowerCase().includes('storage')) {
        geo = new THREE.CylinderGeometry(1.6, 1.6, 3, 16);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: layerColors[idx % layerColors.length],
        metalness: 0.6,
        roughness: 0.2,
        emissive: layerColors[idx % layerColors.length],
        emissiveIntensity: 0.2,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const posX = (idx - (customNodes.length - 1) / 2) * 7;
      const posY = (idx % 4) * 3;
      mesh.position.set(posX, posY, 0);
      mesh.userData = { node };
      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    let tourAngle = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      nodeMeshes.forEach((m) => {
        m.rotation.y += 0.008;
      });

      if (isTourActive) {
        tourAngle += 0.008;
        camera.position.x = 26 * Math.cos(tourAngle);
        camera.position.z = 26 * Math.sin(tourAngle);
        camera.lookAt(0, 3, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

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
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement) renderer.domElement.remove();
      renderer.dispose();
    };
  }, [customNodes, isTourActive]);

  const handlePresetView = (preset: 'iso' | 'top' | 'exploded') => {
    setViewPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;

    if (preset === 'iso') {
      cam.position.set(22, 18, 28);
    } else if (preset === 'top') {
      cam.position.set(0, 45, 0.1);
    } else if (preset === 'exploded') {
      cam.position.set(32, 24, 32);
    }
    controlsRef.current.target.set(0, 3, 0);
  };

  return (
    <Card
      variant="blueprint"
      className={`p-6 space-y-4 shadow-2xl relative transition-all duration-300 ${
        isFullScreen ? 'fixed inset-4 z-50 bg-forge-black/95 border-brand-ember' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-quenched-steel/25 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Box className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-display font-extrabold text-white">
              3D System Architecture Holo-Grid
            </h3>
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Interactive Three.js WebGL canvas. Orbit camera, inspect microservice layers, and run cinematic tours.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-forge-black p-1 rounded-lg border border-quenched-steel/30 text-xs font-mono">
            <button
              onClick={() => handlePresetView('iso')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'iso' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400'}`}
            >
              3D Iso
            </button>
            <button
              onClick={() => handlePresetView('top')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'top' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400'}`}
            >
              Top View
            </button>
            <button
              onClick={() => handlePresetView('exploded')}
              className={`px-2.5 py-1 rounded transition ${viewPreset === 'exploded' ? 'bg-cyan-500 text-white font-bold' : 'text-zinc-400'}`}
            >
              Exploded
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTourActive(!isTourActive)}
            className="text-xs font-mono text-amber-300"
          >
            {isTourActive ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isTourActive ? 'Pause Tour' : 'Cinematic Tour'}
          </Button>

          {onBackTo2D && (
            <Button variant="outline" size="sm" onClick={onBackTo2D} className="text-xs font-mono text-zinc-300">
              2D Schematic
            </Button>
          )}

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg bg-forge-black border border-quenched-steel/30 text-zinc-300 hover:text-white"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div
        ref={mountRef}
        className={`w-full bg-forge-black rounded-blueprint border border-quenched-steel/30 overflow-hidden relative ${
          isFullScreen ? 'h-[calc(100vh-140px)]' : 'h-[440px]'
        }`}
      />
    </Card>
  );
}
