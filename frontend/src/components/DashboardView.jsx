import React from 'react';
import { BarChart3, TrendingUp, Compass, Award, Calendar } from 'lucide-react';

export default function DashboardView({ analytics }) {
  const {
  totalProposals = 0,
  mostPopularPackage = 'N/A',
  mostPopularCity = 'N/A',
  trend = []
} = analytics || {};
  // Render a custom responsive SVG Area Chart for the proposal generation trend
  const renderTrendChart = () => {
    if (!trend || trend.length === 0) {
      return (
        <div className="h-60 flex items-center justify-center text-gray-500 text-sm">
          No trend data available. Save proposals to populate the chart.
        </div>
      );
    }

    const chartWidth = 500;
    const chartHeight = 200;
    const paddingLeft = 30;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const graphWidth = chartWidth - paddingLeft - paddingRight;
    const graphHeight = chartHeight - paddingTop - paddingBottom;

    // Find the max y-value to scale the graph (min scale is 5)
    const maxVal = Math.max(...trend.map(t => t.count), 5);

    // Calculate coordinates for points
    const points = trend.map((t, idx) => {
      const x = paddingLeft + (idx / Math.max(1, trend.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (t.count / maxVal) * graphHeight;
      return { x, y, ...t };
    });

    // Create path strings
    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z`;
    }

    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
          <defs>
            {/* Gold Area Gradient */}
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * graphHeight;
            const value = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="rgba(212, 175, 55, 0.08)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="rgba(156, 163, 175, 0.6)"
                  fontSize="8"
                  textAnchor="end"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaPath && <path d={areaPath} fill="url(#chartGlow)" />}

          {/* Golden stroke line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#d4af37"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points / Circles */}
          {points.map((p, idx) => (
            <g key={idx} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#0B0B0C"
                stroke="#d4af37"
                strokeWidth="2"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="#d4af37"
                fillOpacity="0"
                className="hover:fill-opacity-20 cursor-pointer transition-all"
              >
                <title>{`${p.date}: ${p.count} proposal(s)`}</title>
              </circle>
            </g>
          ))}

          {/* X Axis Labels (Dates) */}
          {points.map((p, idx) => {
            // Display date short format: e.g. "06/08"
            const shortDate = p.date.split('-').slice(1).join('/');
            return (
              <text
                key={idx}
                x={p.x}
                y={chartHeight - 8}
                fill="#9ca3af"
                fontSize="8"
                textAnchor="middle"
              >
                {shortDate}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Introduction */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-gold-300 font-medium tracking-wide">
          Admin Analytics
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Monitor proposal generation metrics, customer preferences, and seasonal trends.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-6 border border-gold-400/15 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xs uppercase tracking-widest text-gray-500 font-bold">Total Proposals</p>
            <h3 className="text-3xl font-bold font-serif text-white mt-1">{totalProposals}</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-6 border border-gold-400/15 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xs uppercase tracking-widest text-gray-500 font-bold">Popular Package</p>
            <h3 className="text-xl font-bold text-gold-300 mt-1 font-serif">{mostPopularPackage}</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-6 border border-gold-400/15 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xs uppercase tracking-widest text-gray-500 font-bold">Popular Market</p>
            <h3 className="text-xl font-bold text-white mt-1 font-serif">{mostPopularCity}</h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-gold-400/15">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/80">
          <BarChart3 className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif text-lg text-white font-medium">Generation Trend (Last 7 Days)</h3>
        </div>
        {renderTrendChart()}
      </div>

      {/* Numerical Data List */}
      <div className="glass-card rounded-2xl overflow-hidden border border-gold-400/10">
        <div className="px-6 py-4 bg-zinc-950/40 border-b border-gold-400/10 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-400" />
          <h3 className="font-serif text-sm text-gold-200 font-semibold uppercase tracking-wider">
            Daily Generated Breakdown
          </h3>
        </div>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold text-right">Proposals Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {trend && trend.length > 0 ? (
              [...trend].reverse().map((t, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/10">
                  <td className="px-6 py-3.5 text-gray-300 font-medium">{t.date}</td>
                  <td className="px-6 py-3.5 text-gold-300 font-bold text-right">{t.count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-6 text-center text-gray-500">
                  No records stored yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
