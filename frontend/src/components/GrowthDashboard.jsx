import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getProgress } from "../api/curioApi";

export default function GrowthDashboard() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const data = await getProgress();
        setHistory(data.history || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  if (loading) {
    return (
      <div className="growth-loading" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        Loading your learning history...
      </div>
    );
  }

  if (history.length === 0) {

    return (
      <section className="growth-empty">

        <div className="growth-icon">
          ↗
        </div>

        <h2>
          Your learning graph starts here.
        </h2>

        <p style={{ color: "#64748b", marginTop: "8px" }}>
          Complete a few Curio sessions and
          you'll see your understanding change over time.
        </p>

      </section>
    );

  }

  // Reverse the history array first, so oldest is at index 0, and assign session numbers chronologically
  const chartData = [...history].reverse().map(
    (item, index) => ({
      session: index + 1,
      topic: item.topic,
      score: item.score
    })
  );

  const average =
    history.reduce(
      (sum, item) => sum + Number(item.score),
      0
    ) / history.length;

  return (
    <section className="growth-dashboard">

      <div className="growth-header">

        <div>
          <span className="section-label">
            YOUR PROGRESS
          </span>

          <h2>
            Understanding over time
          </h2>
        </div>

        <div className="growth-average">

          <strong>
            {average.toFixed(1)}
          </strong>

          <span>
            average /10
          </span>

        </div>

      </div>

      <div className="growth-chart" style={{ marginTop: "24px" }}>

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="session"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              label={{
                value: "Sessions",
                position: "insideBottom",
                offset: -5,
                fill: "#64748B"
              }}
            />

            <YAxis
              domain={[0, 10]}
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)" }}
              formatter={(value) => [
                `${value}/10`,
                "Understanding"
              ]}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.session === label);

                return item
                  ? item.topic
                  : `Session ${label}`;
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#108A93"
              strokeWidth={3}
              dot={{ r: 5, fill: "#108A93", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 7 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="growth-history" style={{ marginTop: "32px" }}>

        {history.map((item, index) => (

          <div
            className="history-item"
            key={index}
          >

            <span>
              {item.topic}
            </span>

            <strong>
              {item.score}/10
            </strong>

          </div>

        ))}

      </div>

    </section>
  );
}
