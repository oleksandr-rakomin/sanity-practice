import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  outputFileTracingRoot: path.resolve(process.cwd()),
};

export default nextConfig;
