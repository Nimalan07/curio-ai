import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";


export default function RadarChart({
  report
}) {

  const data = [
    {
      subject: "Clarity",
      score: report.clarity_score
    },
    {
      subject: "Completeness",
      score: report.completeness_score
    },
    {
      subject: "Accuracy",
      score: report.accuracy_score
    },
    {
      subject: "Depth",
      score: report.depth_score
    }
  ];


  return (
    <div className="radar-wrapper">

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <RechartsRadarChart data={data}>

          <PolarGrid />

          <PolarAngleAxis
            dataKey="subject"
          />

          <PolarRadiusAxis
            domain={[0, 10]}
          />

          <Radar
            name="Understanding"
            dataKey="score"
            stroke="#1976D2"
            fill="#1976D2"
            fillOpacity={0.18}
          />

        </RechartsRadarChart>

      </ResponsiveContainer>

    </div>
  );
}
