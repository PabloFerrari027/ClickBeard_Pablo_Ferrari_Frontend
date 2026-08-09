"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DayOfWeekCount } from "@/types/api";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** `busiestDaysOfWeek` (spec §13.11, §13.12) — eixo com nomes dos dias traduzidos de 0..6. */
export function BusiestDaysChart({ data }: { data: DayOfWeekCount[] | undefined }) {
  const chartData = (data ?? []).map((item) => ({
    ...item,
    label: DAY_LABELS[item.dayOfWeek] ?? String(item.dayOfWeek),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
