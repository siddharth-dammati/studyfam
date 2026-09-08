"use client";

import { useState, useEffect } from "react";

export function NationalSection() {
  const [isClient, setIsClient] = useState(false);
  const [nodes, setNodes] = useState<{left: string, top: string, opacity: number}[]>([]);

  useEffect(() => {
    setIsClient(true);
    const newNodes = [...Array(150)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() > 0.5 ? 1 : 0.2
    }));
    setNodes(newNodes);
  }, []);

  return (
    <section className="py-40 bg-[var(--background-soft)] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        {/* Abstract India-like Node Grid */}
        <div className="relative w-[600px] h-[600px]">
           {isClient && nodes.map((node, i) => (
             <div 
               key={i} 
               className="absolute w-1.5 h-1.5 bg-[var(--foreground)] rounded-full"
               style={{
                 left: node.left,
                 top: node.top,
                 opacity: node.opacity
               }}
             />
           ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-h1 font-bold tracking-tighter text-[var(--foreground)] mb-8">
          ONE INDIA.<br />
          <span className="text-[var(--foreground-muted)]">ONE MOCK.</span>
        </h2>
        <p className="text-xl text-[var(--foreground-secondary)] font-medium mb-2">
          Built for JEE aspirants across India.
        </p>
      </div>
    </section>
  );
}
