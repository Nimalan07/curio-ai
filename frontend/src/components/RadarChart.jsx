import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function RadarChart({ report }) {
  const data = [
    {
      subject: "Clarity",
      score: Number(report.clarity_score) || 0,
      fullMark: 10,
    },
    {
      subject: "Completeness",
      score: Number(report.completeness_score) || 0,
      fullMark: 10,
    },
    {
      subject: "Accuracy",
      score: Number(report.accuracy_score) || 0,
      fullMark: 10,
    },
    {
      subject: "Depth",
      score: Number(report.depth_score) || 0,
      fullMark: 10,
    },
  ];

  return (
    <div className="radar-card">
      <div className="section-heading">
        <div>
          <span className="section-label">UNDERSTANDING</span>
          <h2>Overall Understanding</h2>
        </div>
      </div>

      <div className="radar-wrapper">
        <ResponsiveContainer width="100%" height={360}>
          <RechartsRadarChart data={data}>
            <PolarGrid />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#0F172A",
                fontSize: 13,
                fontWeight: 600,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{
                fill: "#64748B",
                fontSize: 11,
              }}
            />

            <Radar
              name="Understanding"
              dataKey="score"
              stroke="#1976D2"
              fill="#1976D2"
              fillOpacity={0.35}
              strokeWidth={3}
            />

            <Tooltip />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RadarChart;
