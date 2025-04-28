import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: any[];
  bars: {
    dataKey: string;
    fill: string;
    name: string;
  }[];
  xAxisDataKey: string;
  title?: string;
}

const BarChart = ({ data, bars, xAxisDataKey, title }: BarChartProps) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
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
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
