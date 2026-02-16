"use client";

import React from 'react';

type AgentNode = {
  name: string;
  role: string;
  emoji: string;
  children?: AgentNode[];
};

const orgData: AgentNode = {
  name: "Main",
  role: "Circus",
  emoji: "🎪",
  children: [
    {
      name: "Engineering",
      role: "Branch",
      emoji: "🔧",
      children: [
        {
          name: "Bolt",
          role: "Head",
          emoji: "⚡",
          children: [
            { name: "Radar", role: "Skills", emoji: "📡" }
          ]
        }
      ]
    },
    {
      name: "Content",
      role: "Branch",
      emoji: "📝",
      children: [
        {
          name: "Scope",
          role: "Head",
          emoji: "🔭",
          children: [
            { name: "Archive", role: "KM", emoji: "🗄️" }
          ]
        }
      ]
    },
    {
      name: "Operations",
      role: "Branch",
      emoji: "💼",
      children: [
        { name: "Tempo", role: "Head", emoji: "⏱️" }
      ]
    },
    {
      name: "HR",
      role: "Branch",
      emoji: "👥",
      children: [
        { name: "Scout", role: "Head", emoji: "🦅" }
      ]
    },
    {
      name: "Relations",
      role: "Branch",
      emoji: "🤝",
      children: [
        { 
          name: "Beau", 
          role: "Head", 
          emoji: "🎩",
          children: [
            { name: "Lobby", role: "Concierge", emoji: "🛎️" }
          ]
        }
      ]
    },
    {
      name: "Creative",
      role: "Branch",
      emoji: "🎨",
      children: [
        { name: "Palette", role: "Designer", emoji: "🖌️" }
      ]
    }
  ]
};

const NodeCard = ({ node }: { node: AgentNode }) => (
  <div className="z-10 bg-zinc-900 border border-zinc-700 p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[140px] hover:border-emerald-500/50 transition-all duration-300 group hover:shadow-emerald-900/20">
    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{node.emoji}</span>
    <span className="font-bold text-lg text-zinc-100">{node.name}</span>
    <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">{node.role}</span>
  </div>
);

const TreeParams = () => (
  <style jsx global>{`
    .tree ul {
      padding-top: 20px; 
      position: relative;
      transition: all 0.5s;
      display: flex;
      justify-content: center;
    }

    .tree li {
      float: left; text-align: center;
      list-style-type: none;
      position: relative;
      padding: 20px 5px 0 5px;
      transition: all 0.5s;
    }

    /* Vertical line from parent to children */
    .tree ul ul::before {
      content: '';
      position: absolute; top: 0; left: 50%;
      border-left: 1px solid #3f3f46;
      width: 0; height: 20px;
    }

    .tree li::before, .tree li::after {
      content: '';
      position: absolute; top: 0; right: 50%;
      border-top: 1px solid #3f3f46;
      width: 50%; height: 20px;
    }

    .tree li::after {
      right: auto; left: 50%;
      border-left: 1px solid #3f3f46;
    }

    .tree li:only-child::after, .tree li:only-child::before {
      display: none;
    }

    .tree li:only-child { padding-top: 0; }

    .tree li:first-child::before {
      border: 0 none;
    }

    .tree li:last-child::after {
      border-top: 0 none;
    }
    
    .tree li:last-child::before {
      border-right: 1px solid #3f3f46;
      border-radius: 0 5px 0 0;
    }
    
    .tree li:first-child::after {
      border-radius: 5px 0 0 0;
    }
  `}</style>
);

const TreeNode = ({ node }: { node: AgentNode }) => {
  return (
    <li>
      <NodeCard node={node} />
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function OrgPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 overflow-auto">
      <TreeParams />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Chart</h1>
        <p className="text-zinc-400">Agent Hierarchy & Roles</p>
      </div>
      
      <div className="tree flex justify-center pb-20 min-w-max">
        <ul>
          <TreeNode node={orgData} />
        </ul>
      </div>
    </div>
  );
}
