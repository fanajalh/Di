import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Subcomponent to animate floating elements and handle auto rotation of the room
function RoomGroup() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Auto-rotation around the Y axis
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Floor */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>

      {/* Back Left Wall */}
      <mesh receiveShadow castShadow position={[-2.9, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 6]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* Back Right Wall */}
      <mesh receiveShadow castShadow position={[0, 2.5, -2.9]}>
        <boxGeometry args={[6, 5, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* Window on Left Wall */}
      <group position={[-2.78, 2.8, 1]}>
        <mesh>
          <boxGeometry args={[0.05, 1.8, 1.5]} />
          <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.6} />
        </mesh>
        {/* Window light beam projection */}
        <mesh position={[1, -1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[2, 0.01, 1.5]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Bed frame & Mattress */}
      <group position={[-1.6, 0.1, -1.6]} rotation={[0, 0, 0]}>
        {/* Wooden Bed Base */}
        <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[2.2, 0.4, 1.6]} />
          <meshStandardMaterial color="#4b5563" roughness={0.7} />
        </mesh>
        {/* Mattress */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[2.0, 0.3, 1.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* Red Blanket / Duvet */}
        <mesh castShadow position={[0.4, 0.61, 0]}>
          <boxGeometry args={[1.2, 0.1, 1.51]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
        {/* Pillows */}
        <mesh castShadow position={[-0.8, 0.66, 0]}>
          <boxGeometry args={[0.4, 0.15, 0.9]} />
          <meshStandardMaterial color="#f3f4f6" roughness={0.9} />
        </mesh>
      </group>

      {/* Study Desk and Chair */}
      <group position={[1.5, 0.1, -1.2]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Desk Tabletop */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[1.8, 0.1, 1.0]} />
          <meshStandardMaterial color="#374151" roughness={0.5} />
        </mesh>
        {/* Desk Legs */}
        <mesh castShadow position={[-0.8, 0.4, -0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow position={[0.8, 0.4, -0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow position={[-0.8, 0.4, 0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow position={[0.8, 0.4, 0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Laptop on the desk */}
        <group position={[0, 0.85, 0.1]} rotation={[0, 0.1, 0]}>
          <mesh castShadow position={[0, 0.01, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.35]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.17, -0.17]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.02]} />
            {/* Monitor screen with dynamic red glow */}
            <meshStandardMaterial color="#111827" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Minimal Office Chair */}
        <group position={[0, 0.1, 0.7]} rotation={[0, Math.PI, 0]}>
          {/* Seat */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <meshStandardMaterial color="#111827" roughness={0.6} />
          </mesh>
          {/* Seat Back */}
          <mesh castShadow position={[0, 0.7, -0.27]}>
            <boxGeometry args={[0.5, 0.6, 0.08]} />
            <meshStandardMaterial color="#dc2626" roughness={0.6} />
          </mesh>
          {/* Central leg */}
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
        </group>
      </group>

      {/* Floating Holographic "Di" Sign / Logo Sphere */}
      <group position={[0, 3.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#ef4444" 
            emissive="#ef4444" 
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>
        {/* Hologram rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.03, 16, 100]} />
          <meshBasicMaterial color="#f87171" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.9, 0.02, 16, 100]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Decorative Bookcase / Plants Shelves */}
      <group position={[-1.8, 1.8, -2.7]}>
        {/* Shelves boards */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.08, 0.4]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[1.5, 0.08, 0.4]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        {/* Decorative elements - books */}
        <mesh castShadow position={[-0.4, 0.2, 0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.35, 0.3]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh castShadow position={[-0.25, 0.2, 0]} rotation={[0, -0.05, 0]}>
          <boxGeometry args={[0.08, 0.38, 0.3]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Cute plant pot */}
        <group position={[0.4, 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.08, 0.2]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Decorative light strip on base walls */}
      <mesh position={[0, 0.12, -2.75]}>
        <boxGeometry args={[5.6, 0.04, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

export default function IsometricRoom() {
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Simple verification of WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGlSupported(support);
    } catch (e) {
      setWebGlSupported(false);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0A0A0A]/60 rounded-2xl border border-[#2A2A2A]">
        <div className="w-8 h-8 border-2 border-[#3A3A3A] border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!webGlSupported) {
    // Beautiful interactive alternative in case of No WebGL
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-2xl border border-red-500/20 p-6 relative overflow-hidden group">
        {/* Animated ambient particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08),transparent_70%)]"></div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Isometric SVG Vector Room Illustration for 100% reliable visuals without WebGL rendering issues */}
        <div className="w-72 h-72 relative flex items-center justify-center animate-bounce duration-[4000ms]">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_15px_30px_rgba(220,38,38,0.3)]">
            {/* Draw isometric floor */}
            <polygon points="50,15 90,35 50,55 10,35" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
            {/* Left wall */}
            <polygon points="10,35 50,55 50,90 10,70" fill="#111827" stroke="#1f2937" strokeWidth="0.5" />
            {/* Right wall */}
            <polygon points="50,55 90,35 90,70 50,90" fill="#0f172a" stroke="#1f2937" strokeWidth="0.5" />
            
            {/* Isometric Cozy Bed */}
            <polygon points="25,40 45,50 35,55 15,45" fill="#374151" />
            <polygon points="25,38 43,47 35,51 17,42" fill="#dc2626" /> {/* Red duvet */}
            <polygon points="20,36 28,40 24,42 16,38" fill="#f3f4f6" /> {/* Pillow */}
            
            {/* Windows Left */}
            <polygon points="18,45 32,52 32,62 18,55" fill="#fca5a5" opacity="0.8" />
            
            {/* Isometric Study Desk */}
            <polygon points="53,49 73,39 83,44 63,54" fill="#4b5563" />
            <polygon points="53,49 53,64 55,64 55,50" fill="#1f2937" />
            <polygon points="73,39 73,54 75,54 75,40" fill="#1f2937" />
            
            {/* Glowing Laptop */}
            <polygon points="61,45 69,41 73,43 65,47" fill="#ffffff" />
            <polygon points="65,47 65,42 61,40 61,45" fill="#ef4444" opacity="0.9" /> {/* red glowing laptop screen */}

            {/* Glowing Hologram Ball */}
            <circle cx="50" cy="30" r="6" fill="#8A8A8A" opacity="0.8" className="animate-pulse" />
            <ellipse cx="50" cy="30" rx="10" ry="3" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" className="animate-spin" />
          </svg>
        </div>

        <div className="mt-4 text-center z-10">
          <p className="text-sm font-display font-semibold text-white">Visualisasi 3D Kamar Kost</p>
          <p className="text-xs text-red-400 mt-1 max-w-[280px]">Mendukung Rotasi Orbit 360° secara otomatis dalam mode performa terbaik.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-gray-950/40 rounded-3xl border border-gray-800 p-2 overflow-hidden group">
      {/* Visual Ambient Overlays */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 bg-red-950/60 border border-red-900/40 px-2 py-0.5 rounded-full backdrop-blur-sm animate-pulse">
          INTERACTIVE 3D
        </span>
        <span className="text-xs font-display text-gray-400 font-medium">Model Kamar Isometric</span>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-gray-500 pointer-events-none">
        Orbit & Zoom Aktif • Geser untuk Memutar
      </div>

      <Canvas
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <PerspectiveCamera makeDefault position={[5, 6, 5]} fov={50} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        
        {/* Deep Red directional theme light */}
        <directionalLight 
          position={[-5, 8, -5]} 
          intensity={1.2} 
          color="#fca5a5" 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        {/* Warm key light */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#ffffff" 
        />
        
        {/* Red accent spot light for dramatic effect */}
        <pointLight position={[0, 4, 0]} intensity={2.0} color="#ef4444" distance={8} />

        {/* The Animated Room Elements */}
        <RoomGroup />

        {/* Orbit Controls to let user rotate */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1} // prevent going below floor
        />
      </Canvas>
    </div>
  );
}
