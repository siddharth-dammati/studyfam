"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getActiveMilestone, getMilestoneProgress, MilestoneTier, MILESTONE_TIERS } from "@/lib/impactConfig";

export interface ImpactStats {
  total_registrations: number;
  support_pool: number;
  funded_students: number;
  milestone: number;
  progress_percentage: number;
  remaining_to_milestone: number;
  current_tier: MilestoneTier;
  isLoading: boolean;
}

const defaultTier = MILESTONE_TIERS[0]; // 1,000 Aspirants

const defaultStats: ImpactStats = {
  total_registrations: 0,
  support_pool: 0,
  funded_students: 0,
  milestone: 1000,
  progress_percentage: 0,
  remaining_to_milestone: 1000,
  current_tier: defaultTier,
  isLoading: true,
};

export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStats>(defaultStats);

  const fetchStats = async () => {
    try {
      const supabase = createClient();
      // 1. Try secure Postgres RPC function
      const { data, error } = await supabase.rpc("get_impact_stats");
      if (!error && data) {
        const total = Number(data.total_registrations) || 0;
        const pool = Number(data.support_pool) || (total * 18);
        const funded = Number(data.funded_students) || Math.floor(pool / 900);
        const progressInfo = getMilestoneProgress(total);

        setStats({
          total_registrations: total,
          support_pool: pool,
          funded_students: funded,
          milestone: progressInfo.current.students,
          progress_percentage: progressInfo.progressInTier,
          remaining_to_milestone: progressInfo.remaining,
          current_tier: progressInfo.current,
          isLoading: false,
        });
        return;
      }

      // 2. Fallback: direct count on registrations table
      const { count, error: countErr } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });

      if (!countErr && count !== null) {
        const total = count;
        const pool = total * 18;
        const funded = Math.floor(pool / 900);
        const progressInfo = getMilestoneProgress(total);

        setStats({
          total_registrations: total,
          support_pool: pool,
          funded_students: funded,
          milestone: progressInfo.current.students,
          progress_percentage: progressInfo.progressInTier,
          remaining_to_milestone: progressInfo.remaining,
          current_tier: progressInfo.current,
          isLoading: false,
        });
        return;
      }

      setStats(prev => ({ ...prev, isLoading: false }));
    } catch {
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchStats();

    let channel: any;
    try {
      const supabase = createClient();
      channel = supabase
        .channel("realtime-registrations")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "registrations" },
          () => {
            fetchStats();
          }
        )
        .subscribe();
    } catch {
      // Fallback safely if WebSocket/Realtime fails
    }

    return () => {
      try {
        if (channel) {
          const supabase = createClient();
          supabase.removeChannel(channel);
        }
      } catch {
        // Safe cleanup
      }
    };
  }, []);

  return { ...stats, refetch: fetchStats };
}
