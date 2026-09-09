import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Three.js + React Three Fiber ship modern ESM — transpile them for Next.js
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
  ],
  // @react-three/rapier uses WASM which cannot be bundled server-side
  serverExternalPackages: ["@react-three/rapier"],
};

export default nextConfig;
