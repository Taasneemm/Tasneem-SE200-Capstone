// components/ui/overview.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type OverviewProps = {
  data: { name: string; total: number }[];
  message?: string; // fallback message if no data or error
};

export function Overview({ data, message }: OverviewProps) {
  const isEmpty = data.every((item) => item.total === 0);

  return (
    <div className="flex h-[350px] w-full items-center justify-center">
      {isEmpty && message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
