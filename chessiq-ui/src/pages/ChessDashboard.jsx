// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ScatterChart,
//   Scatter,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { TrendingDown, TrendingUp, Target, Brain, Crown } from "lucide-react";

// const ChessDashboard = () => {
//   const [activeTab, setActiveTab] = useState("performance");

//   // Sample data for trends (you would have multiple periods)
//   const accuracyTrendData = [
//     { period: "Week 1", accuracy: 28 },
//     { period: "Week 2", accuracy: 30 },
//     { period: "Week 3", accuracy: 29 },
//     { period: "Week 4", accuracy: 31.4 },
//   ];

//   const cplTrendData = [
//     { period: "Week 1", cpl: 620 },
//     { period: "Week 2", cpl: 590 },
//     { period: "Week 3", cpl: 575 },
//     { period: "Week 4", cpl: 562.2 },
//   ];

//   const blundersTrendData = [
//     { period: "Week 1", blunders: 18.5 },
//     { period: "Week 2", blunders: 17.2 },
//     { period: "Week 3", blunders: 17.0 },
//     { period: "Week 4", blunders: 16.57 },
//   ];

//   // Weakness data
//   const weaknessData = [
//     { name: "Positional Misjudgment", value: 187 },
//     { name: "King Safety", value: 129 },
//     { name: "Tactical Blindness", value: 116 },
//     { name: "Middlegame Planning", value: 76 },
//     { name: "Endgame Conversion", value: 54 },
//     { name: "Pawn Structure", value: 17 },
//     { name: "Piece Coordination", value: 17 },
//   ];

//   const weaknessTrendData = [
//     {
//       period: "Week 1",
//       positional: 50,
//       kingSafety: 35,
//       tactical: 30,
//       middlegame: 20,
//       endgame: 15,
//       pawn: 5,
//       piece: 5,
//     },
//     {
//       period: "Week 2",
//       positional: 60,
//       kingSafety: 40,
//       tactical: 35,
//       middlegame: 25,
//       endgame: 18,
//       pawn: 6,
//       piece: 6,
//     },
//     {
//       period: "Week 3",
//       positional: 70,
//       kingSafety: 50,
//       tactical: 45,
//       middlegame: 28,
//       endgame: 20,
//       pawn: 7,
//       piece: 7,
//     },
//     {
//       period: "Week 4",
//       positional: 187,
//       kingSafety: 129,
//       tactical: 116,
//       middlegame: 76,
//       endgame: 54,
//       pawn: 17,
//       piece: 17,
//     },
//   ];

//   const topWeaknesses = weaknessData.slice(0, 3);

//   // Opening data
//   const openingCplData = [
//     { name: "Scandinavian Defense", cpl: 303.4, eco: "B01" },
//     { name: "Gunderam Defense", cpl: 365.7, eco: "C40" },
//     { name: "Zukertort Opening", cpl: 380.7, eco: "A06" },
//     { name: "Four Knights Game", cpl: 461.8, eco: "C47" },
//     { name: "Petrov's Defense", cpl: 543.6, eco: "C42" },
//     { name: "Italian Game", cpl: 643.8, eco: "C55" },
//     { name: "Damiano Defense", cpl: 1236.7, eco: "C40" },
//   ].sort((a, b) => a.cpl - b.cpl);

//   const openingRadarData = [
//     { opening: "Scandinavian", accuracy: 85, cpl: 70, consistency: 80 },
//     { opening: "Gunderam", accuracy: 72, cpl: 65, consistency: 70 },
//     { opening: "Italian Game", accuracy: 45, cpl: 40, consistency: 50 },
//     { opening: "Damiano", accuracy: 20, cpl: 15, consistency: 25 },
//   ];

//   // Mistake breakdown
//   const mistakeData = [
//     { name: "Blunders", value: 12, color: "#ef4444" },
//     { name: "Mistakes", value: 6, color: "#f97316" },
//     { name: "Inaccuracies", value: 1, color: "#eab308" },
//   ];

//   // Color performance
//   const colorPerformanceData = [
//     { metric: "Avg CPL", white: 365.7, black: 450 },
//     { metric: "Accuracy", white: 27.8, black: 24 },
//     { metric: "Blunders/Game", white: 12, black: 15 },
//   ];

//   // Games vs Quality
//   const gamesQualityData = [
//     { games: 5, accuracy: 28 },
//     { games: 10, accuracy: 30 },
//     { games: 15, accuracy: 29.5 },
//     { games: 20, accuracy: 31.4 },
//     { games: 25, accuracy: 32 },
//   ];

//   const COLORS = [
//     "#3b82f6",
//     "#8b5cf6",
//     "#ec4899",
//     "#f59e0b",
//     "#10b981",
//     "#6366f1",
//     "#14b8a6",
//   ];

//   const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
//     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-600 mb-1">{title}</p>
//           <p className="text-3xl font-bold text-gray-900">{value}</p>
//           {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
//         </div>
//         {Icon && (
//           <div className="p-3 bg-blue-50 rounded-lg">
//             <Icon className="w-6 h-6 text-blue-600" />
//           </div>
//         )}
//       </div>
//       {trend && (
//         <div
//           className={`flex items-center mt-3 text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}
//         >
//           {trend > 0 ? (
//             <TrendingUp className="w-4 h-4 mr-1" />
//           ) : (
//             <TrendingDown className="w-4 h-4 mr-1" />
//           )}
//           {Math.abs(trend)}% vs last period
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
//             <Crown className="w-10 h-10 text-blue-600" />
//             Chess Performance Dashboard
//           </h1>
//           <p className="text-gray-600">
//             Monthly Analysis: December 21, 2025 - January 20, 2026
//           </p>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatCard title="Games Played" value="7" icon={Target} />
//           <StatCard title="Avg Accuracy" value="31.4%" trend={-2.3} />
//           <StatCard title="Avg CPL" value="562.2" trend={2.1} />
//           <StatCard title="Blunders/Game" value="16.57" trend={1.8} />
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6 border-b border-gray-200">
//           {["performance", "weaknesses", "openings", "analysis"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-3 font-medium capitalize transition-colors ${
//                 activeTab === tab
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Performance Tab */}
//         {activeTab === "performance" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Accuracy Over Time */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">Accuracy Trend</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <LineChart data={accuracyTrendData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="period" />
//                     <YAxis domain={[0, 100]} />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="accuracy"
//                       stroke="#3b82f6"
//                       strokeWidth={2}
//                       name="Accuracy %"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* CPL Trend */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Average CPL Trend
//                 </h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <LineChart data={cplTrendData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="period" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="cpl"
//                       stroke="#ef4444"
//                       strokeWidth={2}
//                       name="Avg CPL"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Blunders Per Game */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Blunders Per Game
//                 </h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <LineChart data={blundersTrendData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="period" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="blunders"
//                       stroke="#f59e0b"
//                       strokeWidth={2}
//                       name="Blunders/Game"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Games vs Quality */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Practice Volume vs Quality
//                 </h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <ScatterChart>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="games" name="Total Games" />
//                     <YAxis
//                       dataKey="accuracy"
//                       name="Accuracy"
//                       domain={[0, 100]}
//                     />
//                     <Tooltip cursor={{ strokeDasharray: "3 3" }} />
//                     <Legend />
//                     <Scatter
//                       name="Games Played"
//                       data={gamesQualityData}
//                       fill="#8b5cf6"
//                     />
//                   </ScatterChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Weaknesses Tab */}
//         {activeTab === "weaknesses" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Weakness Distribution */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Weakness Distribution
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={weaknessData} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis
//                       dataKey="name"
//                       type="category"
//                       width={150}
//                       tick={{ fontSize: 12 }}
//                     />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#3b82f6">
//                       {weaknessData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Weakness Trends */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Weakness Evolution
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={weaknessTrendData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="period" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Area
//                       type="monotone"
//                       dataKey="positional"
//                       stackId="1"
//                       stroke="#ef4444"
//                       fill="#ef4444"
//                       name="Positional"
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="kingSafety"
//                       stackId="1"
//                       stroke="#f59e0b"
//                       fill="#f59e0b"
//                       name="King Safety"
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="tactical"
//                       stackId="1"
//                       stroke="#3b82f6"
//                       fill="#3b82f6"
//                       name="Tactical"
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="middlegame"
//                       stackId="1"
//                       stroke="#8b5cf6"
//                       fill="#8b5cf6"
//                       name="Middlegame"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Top 3 Weaknesses */}
//             <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                 <Brain className="w-5 h-5 text-red-600" />
//                 Priority Focus Areas
//               </h3>
//               <div className="space-y-4">
//                 {topWeaknesses.map((weakness, idx) => (
//                   <div key={weakness.name}>
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="font-medium text-gray-900">
//                         {idx + 1}. {weakness.name}
//                       </span>
//                       <span className="text-sm font-semibold text-gray-700">
//                         {weakness.value} occurrences
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                       <div
//                         className="h-3 rounded-full transition-all"
//                         style={{
//                           width: `${(weakness.value / weaknessData[0].value) * 100}%`,
//                           backgroundColor: COLORS[idx],
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Openings Tab */}
//         {activeTab === "openings" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Opening Performance Comparison */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Opening Performance (CPL)
//                 </h3>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <BarChart data={openingCplData} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis
//                       dataKey="name"
//                       type="category"
//                       width={140}
//                       tick={{ fontSize: 11 }}
//                     />
//                     <Tooltip />
//                     <Bar dataKey="cpl" name="Avg CPL">
//                       {openingCplData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={
//                             entry.cpl > 600
//                               ? "#ef4444"
//                               : entry.cpl > 400
//                                 ? "#f59e0b"
//                                 : "#10b981"
//                           }
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Opening Radar */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Opening Quality Comparison
//                 </h3>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <RadarChart data={openingRadarData}>
//                     <PolarGrid />
//                     <PolarAngleAxis dataKey="opening" />
//                     <PolarRadiusAxis angle={90} domain={[0, 100]} />
//                     <Radar
//                       name="Accuracy"
//                       dataKey="accuracy"
//                       stroke="#3b82f6"
//                       fill="#3b82f6"
//                       fillOpacity={0.6}
//                     />
//                     <Radar
//                       name="Quality"
//                       dataKey="cpl"
//                       stroke="#10b981"
//                       fill="#10b981"
//                       fillOpacity={0.6}
//                     />
//                     <Radar
//                       name="Consistency"
//                       dataKey="consistency"
//                       stroke="#f59e0b"
//                       fill="#f59e0b"
//                       fillOpacity={0.6}
//                     />
//                     <Legend />
//                     <Tooltip />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Opening Details Table */}
//             <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold mb-4">Opening Details</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-200">
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                         ECO
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                         Opening
//                       </th>
//                       <th className="text-right py-3 px-4 font-semibold text-gray-700">
//                         Avg CPL
//                       </th>
//                       <th className="text-right py-3 px-4 font-semibold text-gray-700">
//                         Rating
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {openingCplData.map((opening, idx) => (
//                       <tr
//                         key={idx}
//                         className="border-b border-gray-100 hover:bg-gray-50"
//                       >
//                         <td className="py-3 px-4 text-sm font-mono">
//                           {opening.eco}
//                         </td>
//                         <td className="py-3 px-4 text-sm">{opening.name}</td>
//                         <td className="py-3 px-4 text-sm text-right font-semibold">
//                           {opening.cpl}
//                         </td>
//                         <td className="py-3 px-4 text-right">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-medium ${
//                               opening.cpl > 600
//                                 ? "bg-red-100 text-red-700"
//                                 : opening.cpl > 400
//                                   ? "bg-yellow-100 text-yellow-700"
//                                   : "bg-green-100 text-green-700"
//                             }`}
//                           >
//                             {opening.cpl > 600
//                               ? "Needs Work"
//                               : opening.cpl > 400
//                                 ? "Fair"
//                                 : "Good"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Analysis Tab */}
//         {activeTab === "analysis" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Mistake Breakdown */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Mistake Distribution
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={mistakeData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) =>
//                         `${name}: ${(percent * 100).toFixed(0)}%`
//                       }
//                       outerRadius={100}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {mistakeData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="mt-4 space-y-2">
//                   {mistakeData.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex justify-between items-center text-sm"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: item.color }}
//                         />
//                         <span>{item.name}</span>
//                       </div>
//                       <span className="font-semibold">{item.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Color Performance */}
//               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Performance by Color
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={colorPerformanceData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="metric" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="white" fill="#e5e7eb" name="White" />
//                     <Bar dataKey="black" fill="#374151" name="Black" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Key Insights */}
//             <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <h4 className="font-semibold text-blue-900 mb-2">
//                     Strongest Opening
//                   </h4>
//                   <p className="text-sm text-blue-700">
//                     Scandinavian Defense (303.4 CPL) - Keep practicing this!
//                   </p>
//                 </div>
//                 <div className="p-4 bg-red-50 rounded-lg">
//                   <h4 className="font-semibold text-red-900 mb-2">
//                     Needs Improvement
//                   </h4>
//                   <p className="text-sm text-red-700">
//                     Damiano Defense (1236.7 CPL) - Consider avoiding or studying
//                     deeply
//                   </p>
//                 </div>
//                 <div className="p-4 bg-yellow-50 rounded-lg">
//                   <h4 className="font-semibold text-yellow-900 mb-2">
//                     Main Weakness
//                   </h4>
//                   <p className="text-sm text-yellow-700">
//                     Positional Misjudgment (187 errors) - Focus on positional
//                     understanding
//                   </p>
//                 </div>
//                 <div className="p-4 bg-green-50 rounded-lg">
//                   <h4 className="font-semibold text-green-900 mb-2">
//                     Practice More
//                   </h4>
//                   <p className="text-sm text-green-700">
//                     Only 7 games this month - aim for 15+ for better progress
//                     tracking
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChessDashboard;

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp, Target, Brain, Crown } from "lucide-react";

const ChessDashboard = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/dashboard/populate`,
          {
            method: "GET",
            credentials: "include", // keep if auth cookies are used
          },
        );
        const result = await response.json();

        if (result.status === "success") {
          setDashboardData(result.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No data available</div>
      </div>
    );
  }

  const { weekly, monthly } = dashboardData;
  const latestWeek = weekly.latestWeek;

  // Extract data from API response
  const accuracyTrendData = weekly.accuracyTrend;
  const cplTrendData = weekly.cplTrend;
  const blundersTrendData = weekly.blundersTrend;
  const weaknessTrendData = weekly.weaknessTrend;
  const gamesQualityData = weekly.gamesQuality;

  // Weakness data from latest week
  const weaknessData = latestWeek
    ? [
        {
          name: "Positional Misjudgment",
          value: latestWeek.summary.weaknesses.POSITIONAL_MISJUDGMENT || 0,
        },
        {
          name: "King Safety",
          value: latestWeek.summary.weaknesses.KING_SAFETY || 0,
        },
        {
          name: "Tactical Blindness",
          value: latestWeek.summary.weaknesses.TACTICAL_BLINDNESS || 0,
        },
        {
          name: "Middlegame Planning",
          value: latestWeek.summary.weaknesses.MIDDLEGAME_PLANNING || 0,
        },
        {
          name: "Endgame Conversion",
          value: latestWeek.summary.weaknesses.ENDGAME_CONVERSION || 0,
        },
        {
          name: "Pawn Structure",
          value: latestWeek.summary.weaknesses.PAWN_STRUCTURE || 0,
        },
        {
          name: "Piece Coordination",
          value: latestWeek.summary.weaknesses.PIECE_COORDINATION || 0,
        },
      ].sort((a, b) => b.value - a.value)
    : [];

  const topWeaknesses = weaknessData.slice(0, 3);

  // Opening data from monthly summary
  const openingCplData = monthly.summary.openings
    .map((opening) => ({
      name:
        opening.name.length > 25
          ? opening.name.substring(0, 25) + "..."
          : opening.name,
      fullName: opening.name,
      cpl: opening.avgCpl,
      eco: opening.eco,
    }))
    .sort((a, b) => a.cpl - b.cpl);

  // Create radar data for top openings
  const openingRadarData = openingCplData.slice(0, 4).map((opening) => ({
    opening: opening.eco,
    accuracy: Math.max(0, 100 - opening.cpl / 15), // Convert CPL to accuracy-like score
    cpl: Math.max(0, 100 - opening.cpl / 15),
    consistency: Math.max(0, 100 - opening.cpl / 15),
  }));

  // Calculate mistake data from latest week
  const mistakeData = latestWeek
    ? [
        {
          name: "Blunders",
          value: Math.round(
            latestWeek.summary.blundersPerGame *
              latestWeek.summary.gamesPlayed *
              0.6,
          ),
          color: "#ef4444",
        },
        {
          name: "Mistakes",
          value: Math.round(
            latestWeek.summary.blundersPerGame *
              latestWeek.summary.gamesPlayed *
              0.3,
          ),
          color: "#f97316",
        },
        {
          name: "Inaccuracies",
          value: Math.round(
            latestWeek.summary.blundersPerGame *
              latestWeek.summary.gamesPlayed *
              0.1,
          ),
          color: "#eab308",
        },
      ]
    : [];

  // Color performance data - mock for now, would need backend support
  const colorPerformanceData = [
    {
      metric: "Avg CPL",
      white: latestWeek?.summary.avgCpl || 0,
      black: (latestWeek?.summary.avgCpl || 0) * 1.2,
    },
    {
      metric: "Accuracy",
      white: latestWeek?.summary.avgAccuracy || 0,
      black: (latestWeek?.summary.avgAccuracy || 0) * 0.9,
    },
    {
      metric: "Blunders/Game",
      white: latestWeek?.summary.blundersPerGame || 0,
      black: (latestWeek?.summary.blundersPerGame || 0) * 1.25,
    },
  ];

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#6366f1",
    "#14b8a6",
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
      {trend !== undefined && trend !== null && (
        <div
          className={`flex items-center mt-3 text-sm ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"}`}
        >
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : trend < 0 ? (
            <TrendingDown className="w-4 h-4 mr-1" />
          ) : null}
          {Math.abs(trend)}% vs last period
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3 justify-center">
            Chess Performance Dashboard
          </h1>
          <p className="text-gray-600">
            Monthly Analysis: {new Date(monthly.from).toLocaleDateString()} -{" "}
            {new Date(monthly.to).toLocaleDateString()}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Games Played"
            value={monthly.summary.gamesPlayed}
            icon={Target}
            trend={weekly.trends.gamesPlayed}
          />
          <StatCard
            title="Avg Accuracy"
            value={`${monthly.summary.avgAccuracy}%`}
            trend={weekly.trends.accuracy}
          />
          <StatCard
            title="Avg CPL"
            value={monthly.summary.avgCpl}
            trend={weekly.trends.cpl}
          />
          <StatCard
            title="Blunders/Game"
            value={monthly.summary.blundersPerGame}
            trend={weekly.trends.blunders}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {["performance", "weaknesses", "openings", "analysis"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Accuracy Over Time */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Accuracy Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Accuracy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* CPL Trend */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Average CPL Trend
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cplTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cpl"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Avg CPL"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Blunders Per Game */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Blunders Per Game
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={blundersTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="blunders"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Blunders/Game"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Games vs Quality */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Practice Volume vs Quality
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="games" name="Total Games" />
                    <YAxis
                      dataKey="accuracy"
                      name="Accuracy"
                      domain={[0, 100]}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name="Games Played"
                      data={gamesQualityData}
                      fill="#8b5cf6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Weaknesses Tab */}
        {activeTab === "weaknesses" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weakness Distribution */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Weakness Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weaknessData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6">
                      {weaknessData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Weakness Trends */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Weakness Evolution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weaknessTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="positional"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      name="Positional"
                    />
                    <Area
                      type="monotone"
                      dataKey="kingSafety"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      name="King Safety"
                    />
                    <Area
                      type="monotone"
                      dataKey="tactical"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      name="Tactical"
                    />
                    <Area
                      type="monotone"
                      dataKey="middlegame"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      name="Middlegame"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 3 Weaknesses */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-red-600" />
                Priority Focus Areas
              </h3>
              <div className="space-y-4">
                {topWeaknesses.map((weakness, idx) => (
                  <div key={weakness.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        {idx + 1}. {weakness.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {weakness.value} occurrences
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${(weakness.value / weaknessData[0].value) * 100}%`,
                          backgroundColor: COLORS[idx],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Openings Tab */}
        {activeTab === "openings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opening Performance Comparison */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Opening Performance (CPL)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={openingCplData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={140}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                              <p className="font-semibold">
                                {payload[0].payload.fullName}
                              </p>
                              <p className="text-sm">CPL: {payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="cpl" name="Avg CPL">
                      {openingCplData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.cpl > 600
                              ? "#ef4444"
                              : entry.cpl > 400
                                ? "#f59e0b"
                                : "#10b981"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Opening Radar */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Opening Quality Comparison
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={openingRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="opening" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Accuracy"
                      dataKey="accuracy"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Quality"
                      dataKey="cpl"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Consistency"
                      dataKey="consistency"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Opening Details Table */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Opening Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        ECO
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Opening
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        Avg CPL
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {openingCplData.map((opening, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm font-mono">
                          {opening.eco}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {opening.fullName}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold">
                          {opening.cpl}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              opening.cpl > 600
                                ? "bg-red-100 text-red-700"
                                : opening.cpl > 400
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {opening.cpl > 600
                              ? "Needs Work"
                              : opening.cpl > 400
                                ? "Fair"
                                : "Good"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mistake Breakdown */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Mistake Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mistakeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mistakeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {mistakeData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Performance */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Performance by Color
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={colorPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="white" fill="#e5e7eb" name="White" />
                    <Bar dataKey="black" fill="#374151" name="Black" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Strongest Opening
                  </h4>
                  <p className="text-sm text-blue-700">
                    {openingCplData[0]?.fullName} ({openingCplData[0]?.cpl} CPL)
                    - Keep practicing this!
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Needs Improvement
                  </h4>
                  <p className="text-sm text-red-700">
                    {openingCplData[openingCplData.length - 1]?.fullName} (
                    {openingCplData[openingCplData.length - 1]?.cpl} CPL) -
                    Consider avoiding or studying deeply
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Main Weakness
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {weaknessData[0]?.name} ({weaknessData[0]?.value} errors) -
                    Focus on positional understanding
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Games Played
                  </h4>
                  <p className="text-sm text-green-700">
                    {monthly.summary.gamesPlayed} games this month -{" "}
                    {monthly.summary.gamesPlayed < 10
                      ? "aim for 15+ for better progress tracking"
                      : "great practice volume!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessDashboard;
