"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatTime } from "@/lib/utils";
import type { TimeSlotCount } from "@/types/api";

/** `mostUsedTimeSlots` (spec §13.11, §13.12) — loaded via `next/dynamic({ssr:false})` by the consumer. */
export function TimeSlotsChart({ data }: { data: TimeSlotCount[] | undefined }) {
  const chartData = (data ?? []).map((item) => ({
    ...item,
    label: item.startTime.includes("T") ? formatTime(item.startTime) : item.startTime,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="total" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
