import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    stroke: string;
    name: string;
  }[];
  xAxisDataKey: string;
  title?: string;
}

const LineChart = ({ data, lines, xAxisDataKey, title }: LineChartProps) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.name}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
