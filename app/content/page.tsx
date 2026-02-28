"use client";

import { useMemo } from "react";
import { PlayCircle, TrendingUp, Users, Eye, BarChart3, ArrowUpRight } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  publishedAt: string;
  platform: "youtube" | "twitter" | "linkedin";
}

const MOCK_CONTENT: ContentItem[] = [
  {
    id: "1",
    title: "How I Built an AI Agent in 24 Hours",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    views: 12500,
    likes: 840,
    publishedAt: "2024-02-10",
    platform: "youtube",
  },
  {
    id: "2",
    title: "The Death of SaaS (And What Comes Next)",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    views: 45000,
    likes: 3200,
    publishedAt: "2024-02-05",
    platform: "youtube",
  },
  {
    id: "3",
    title: "Coding with GPT-5: First Impressions",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    views: 2800,
    likes: 150,
    publishedAt: "2024-01-28",
    platform: "youtube",
  },
  {
    id: "4",
    title: "Why Your Prompts Fail",
    thumbnail: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&q=80",
    views: 8900,
    likes: 600,
    publishedAt: "2024-01-20",
    platform: "youtube",
  },
  {
    id: "5",
    title: "Day in the Life of a Systems Architect",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    views: 1500,
    likes: 90,
    publishedAt: "2024-01-15",
    platform: "youtube",
  },
];

export default function ContentIntelPage() {
  const stats = useMemo(() => {
    const totalViews = MOCK_CONTENT.reduce((acc, item) => acc + item.views, 0);
    const avgViews = totalViews / MOCK_CONTENT.length;
    const totalLikes = MOCK_CONTENT.reduce((acc, item) => acc + item.likes, 0);
    const engagementRate = ((totalLikes / totalViews) * 100).toFixed(1);

    return { totalViews, avgViews, engagementRate };
  }, []);

  const getOutlierScore = (views: number) => {
    const ratio = views / stats.avgViews;
    return ratio;
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Analytics</p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Intel</h1>
            <p className="text-secondary">Performance tracking and outlier detection.</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--bg-hover)]">
            <TrendingUp size={16} />
            Sync Now
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total Views</p>
            <Eye size={20} className="text-[var(--color-brand-blue)]" />
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
          <div className="mt-2 text-xs text-[var(--color-brand-green)]">+12% vs last month</div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Baseline (Avg)</p>
            <BarChart3 size={20} className="text-[var(--color-brand-orange)]" />
          </div>
          <p className="mt-3 text-3xl font-bold">{Math.round(stats.avgViews).toLocaleString()}</p>
          <div className="mt-2 text-xs text-secondary">Last 15 videos</div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Engagement Rate</p>
            <Users size={20} className="text-[var(--color-brand-green)]" />
          </div>
          <p className="mt-3 text-3xl font-bold">{stats.engagementRate}%</p>
          <div className="mt-2 text-xs text-[var(--color-brand-green)]">Healthy range</div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Performance</h2>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--color-brand-green)]"></span> Viral (3x)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--color-brand-blue)]"></span> Outlier (1.5x)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-zinc-600"></span> Normal</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_CONTENT.map((item) => {
            const score = getOutlierScore(item.views);
            let badgeColor = "bg-zinc-800 text-zinc-400";
            let badgeText = "Normal";
            
            if (score >= 3.0) {
              badgeColor = "bg-[var(--color-brand-green)] text-zinc-950 font-bold";
              badgeText = "Viral";
            } else if (score >= 1.5) {
              badgeColor = "bg-[var(--color-brand-blue)] text-white";
              badgeText = "Outlier";
            } else if (score < 0.5) {
              badgeColor = "bg-[var(--color-brand-red)]/20 text-[var(--color-brand-red)]";
              badgeText = "Under";
            }

            return (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[var(--bg-card)] transition hover:-translate-y-1 hover:border-white/10 hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute right-3 top-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${badgeColor}`}>
                      {badgeText} {score.toFixed(1)}x
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1 uppercase tracking-wider">
                      <PlayCircle size={12} /> YouTube
                    </span>
                    <span>{item.publishedAt}</span>
                  </div>
                  
                  <h3 className="line-clamp-2 text-sm font-semibold leading-relaxed text-[var(--text-primary)] group-hover:text-white">
                    {item.title}
                  </h3>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-secondary">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye size={12} /> {item.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {item.likes.toLocaleString()}</span>
                    </div>
                    <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
