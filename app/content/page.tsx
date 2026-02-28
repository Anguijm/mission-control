"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlayCircle, TrendingUp, Users, Eye, BarChart3, ArrowUpRight, Twitter, Linkedin } from "lucide-react";

export default function ContentIntelPage() {
  const content = useQuery(api.content.list, { limit: 50 });
  const syncContent = useMutation(api.content.sync);

  const stats = useMemo(() => {
    if (!content || content.length === 0) {
      return { totalViews: 0, avgViews: 0, engagementRate: 0 };
    }
    const totalViews = content.reduce((acc, item) => acc + item.views, 0);
    const avgViews = totalViews / content.length;
    const totalLikes = content.reduce((acc, item) => acc + item.likes, 0);
    const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0.0";

    return { totalViews, avgViews, engagementRate };
  }, [content]);

  const getOutlierScore = (views: number) => {
    if (stats.avgViews === 0) return 0;
    return views / stats.avgViews;
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
          <button 
            onClick={() => syncContent({ source: "youtube" })}
            className="flex items-center gap-2 rounded-xl bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--bg-hover)]"
          >
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
          <div className="mt-2 text-xs text-secondary">Last 50 items</div>
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
          {content === undefined ? (
             <div className="col-span-full py-12 text-center text-muted">Loading content...</div>
          ) : content.length === 0 ? (
             <div className="col-span-full py-12 text-center text-muted">No content synced yet. Click "Sync Now".</div>
          ) : (
            content.map((item) => {
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
                <article key={item._id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[var(--bg-card)] transition hover:-translate-y-1 hover:border-white/10 hover:shadow-lg">
                  <div className="aspect-video w-full overflow-hidden bg-zinc-900">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                        {item.platform === 'youtube' ? <PlayCircle size={32} className="text-muted" /> : 
                         item.platform === 'twitter' ? <Twitter size={32} className="text-muted" /> : 
                         <BarChart3 size={32} className="text-muted" />}
                      </div>
                    )}
                    <div className="absolute right-3 top-3">
                      <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${badgeColor}`}>
                        {badgeText} {score.toFixed(1)}x
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted">
                      <span className="flex items-center gap-1 uppercase tracking-wider">
                        {item.platform === 'youtube' ? <PlayCircle size={12} /> : item.platform}
                      </span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="line-clamp-2 text-sm font-semibold leading-relaxed text-[var(--text-primary)] group-hover:text-white">
                      {item.title}
                    </h3>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-secondary">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye size={12} /> {item.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {item.likes.toLocaleString()}</span>
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-white" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
