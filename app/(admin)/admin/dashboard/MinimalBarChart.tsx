"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MinimalBarChart({ data, dataKey, xKey }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey={xKey} stroke="#000" />
        <YAxis stroke="#000" />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#000" stroke="#000" />
      </BarChart>
    </ResponsiveContainer>
  );
}
