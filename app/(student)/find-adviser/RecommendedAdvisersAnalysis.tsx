"use client";

import {
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import React from "react";
import { CustomRadarTooltip } from "../../../components/CustomRadarToolkit";

interface AdviserRadarChartProps {
  advisers: {
    name: string;
    similarity: number; // 0-1
    experience: number; // 0-1
    overall: number;
    top_project: {
      title: string;
      similarity: number;
    };
  }[];
}

const chartConfig = {
  similarity: { label: "Similarity", color: "#3b82f6" }, // blue
  experience: { label: "Experience", color: "#60a5fa" }, // lighter blue
} satisfies ChartConfig;

// Blue shades for pie chart
const pieColors = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

export function RecommendedAdvisersAnalysis({
  advisers,
}: AdviserRadarChartProps) {
  const renderValueLabel = (props: { x: number; y: number; value: number }) => {
    const { x, y, value } = props;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {(value * 100).toFixed(1)}%
      </text>
    );
  };

  const topAdvisers = advisers
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 5);

  const pieData = topAdvisers.map((adv) => ({
    name: adv.name,
    value: adv.similarity * 100,
  }));

  return (
    <Card className="rounded-3xl bg-white/5 border border-white/10 text-white">
      <CardHeader className="items-center text-center">
        <CardTitle className="text-4xl font-bold">
          Recommended Advisers
        </CardTitle>
        <CardDescription className="text-lg text-gray-300">
          Analysis of top recommended advisers based on similarity and
          experience
        </CardDescription>

        {/* Top 5 advisers table */}
        <table className="w-full max-w-3xl mx-auto mt-6 border border-gray-600 text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="border text-center border-gray-600 px-3 py-1">
                Rank
              </th>
              <th className="border text-center border-gray-600 px-3 py-1">
                Name
              </th>
              <th className="border text-center border-gray-600 px-3 py-1">
                Similarity
              </th>
              <th className="border text-center border-gray-600 px-3 py-1">
                Experience
              </th>
              <th className="border text-center border-gray-600 px-3 py-1">
                Overall
              </th>
            </tr>
          </thead>
          <tbody>
            {topAdvisers.map((adviser, index) => (
              <tr key={adviser.name} className="even:bg-gray-800">
                <td className="border border-gray-600 px-3 py-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-600 px-3 py-1 font-medium text-center">
                  {adviser.name}
                </td>
                <td className="border border-gray-600 px-3 py-1 text-center">
                  {(adviser.similarity * 100).toFixed(1)}%
                </td>
                <td className="border border-gray-600 px-3 py-1 text-center">
                  {(adviser.experience * 100).toFixed(1)}%
                </td>
                <td className="border border-gray-600 px-3 py-1 text-center">
                  {(adviser.overall * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Explanation */}
        <div className="mt-4 max-w-3xl mx-auto text-left text-white bg-gray-800 p-4 rounded-lg border border-gray-600">
          <p>
            <strong>Similarity:</strong> Calculated using semantic similarity
            between your thesis (title + overview) and the adviser’s past
            supervised theses. Higher similarity indicates closer alignment with
            your research topic.
          </p>
          <p className="mt-2">
            <strong>Experience:</strong> Computed based on the adviser’s past
            work in topics similar to your thesis:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>
                <strong>Supervised Thesis:</strong> +1 point for each thesis the
                adviser directly supervised.
              </li>
              <li>
                <strong>Panel Membership:</strong> +0.3 points for each time the
                adviser served as a panel member on a relevant thesis.
              </li>
              <li>
                <strong>Similarity Contribution:</strong> +0.5 × semantic
                similarity score of the thesis.
              </li>
            </ul>
            Only the top 5 most relevant past theses are considered, and points
            are normalized across all advisers to create a 0–1 experience score.
          </p>
          <p className="mt-2">
            <strong>Overall:</strong> Combined score = 90% Similarity + 10%
            Normalized Experience. This gives a final ranking considering both
            relevance and experience.
          </p>
          <p className="mt-2 italic text-gray-300">
            This table and radar chart visualize the top 5 advisers based on
            these metrics.
          </p>
        </div>
      </CardHeader>

      {/* Radar Chart */}
      <CardContent className="mt-6">
        <ChartContainer config={chartConfig} className="mx-auto">
          <RadarChart data={topAdvisers} margin={{ top: -20, bottom: -20 }}>
            <ChartTooltip content={<CustomRadarTooltip />} cursor={false} />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 16, fill: "white", fontWeight: "bold" }}
            />
            <PolarGrid radialLines gridType="polygon" />
            <Radar
              dataKey="similarity"
              stroke="#4ade80"
              fill="#4ade80"
              fillOpacity={0.55}
              label={renderValueLabel}
            />
            <Radar
              dataKey="experience"
              stroke="#60a5fa"
              fill="#60a5fa"
              fillOpacity={0.55}
              label={renderValueLabel}
            />
            <ChartLegend className="text-lg" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2  text-sm mt-12">
        {/* Most Similar Theses */}
        <h2 className="mb-3 text-2xl font-bold text-white text-center">
          Most Similar Theses
        </h2>
        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto w-full">
          {topAdvisers.map((adviser) => (
            <div
              key={adviser.name}
              className="bg-gray-800 p-4 text-center rounded-lg border border-gray-600 text-white"
            >
              <h3 className="font-semibold text-lg">{adviser.name}</h3>
              <p className="mt-1">{adviser.top_project.title}</p>
              <p className="mt-1">
                <strong className="text-base">Semantic Score:</strong>{" "}
                {(adviser.top_project.similarity * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        {/* Semantic score explanation */}
        <p className="mt-4 max-w-3xl mx-auto text-center text-gray-300 text-sm">
          <strong>Note:</strong> The Semantic Score is calculated using SBERT
          embeddings. It measures how closely your thesis (title + overview)
          matches an adviser&apos;s past supervised theses. Higher scores
          indicate stronger alignment with your research topic.
        </p>
      </CardFooter>
    </Card>
  );
}
