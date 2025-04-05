import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from 'recharts';

const RegimePopulationChart = () => {
  // Using actual data from our analysis
  const [fullData] = useState([
    { year: 1972, Free: 1.25, PartlyFree: 0.72, NotFree: 1.43, Unknown: 0.01 },
    { year: 1975, Free: 1.39, PartlyFree: 0.76, NotFree: 1.47, Unknown: 0.01 },
    { year: 1980, Free: 1.56, PartlyFree: 0.95, NotFree: 1.51, Unknown: 0.00 },
    { year: 1985, Free: 1.83, PartlyFree: 1.05, NotFree: 1.64, Unknown: 0.00 },
    { year: 1990, Free: 2.09, PartlyFree: 1.14, NotFree: 1.71, Unknown: 0.00 },
    { year: 1995, Free: 2.31, PartlyFree: 1.30, NotFree: 1.93, Unknown: 0.00 },
    { year: 2000, Free: 2.53, PartlyFree: 1.45, NotFree: 2.11, Unknown: 0.00 },
    { year: 2005, Free: 2.78, PartlyFree: 1.47, NotFree: 2.25, Unknown: 0.00 },
    { year: 2010, Free: 3.02, PartlyFree: 1.51, NotFree: 2.40, Unknown: 0.00 },
    { year: 2015, Free: 2.18, PartlyFree: 2.38, NotFree: 2.77, Unknown: 0.00 },
    { year: 2020, Free: 1.55, PartlyFree: 3.30, NotFree: 2.92, Unknown: 0.01 },
    { year: 2024, Free: 1.64, PartlyFree: 3.25, NotFree: 3.14, Unknown: 0.01 },
    { year: 2025, Free: 1.65, PartlyFree: 3.30, NotFree: 3.20, Unknown: 0.01 },
    { year: 2030, Free: 1.66, PartlyFree: 3.47, NotFree: 3.28, Unknown: 0.01 },
    { year: 2035, Free: 1.68, PartlyFree: 3.64, NotFree: 3.38, Unknown: 0.01 },
    { year: 2040, Free: 1.69, PartlyFree: 3.80, NotFree: 3.49, Unknown: 0.01 },
    { year: 2045, Free: 1.70, PartlyFree: 3.93, NotFree: 3.58, Unknown: 0.01 },
    { year: 2050, Free: 1.70, PartlyFree: 4.06, NotFree: 3.67, Unknown: 0.01 },
    { year: 2055, Free: 1.69, PartlyFree: 4.16, NotFree: 3.75, Unknown: 0.01 },
    { year: 2060, Free: 1.69, PartlyFree: 4.24, NotFree: 3.80, Unknown: 0.01 },
    { year: 2065, Free: 1.68, PartlyFree: 4.30, NotFree: 3.83, Unknown: 0.01 },
    { year: 2070, Free: 1.67, PartlyFree: 4.34, NotFree: 3.85, Unknown: 0.01 },
    { year: 2075, Free: 1.66, PartlyFree: 4.37, NotFree: 3.86, Unknown: 0.01 },
    { year: 2080, Free: 1.65, PartlyFree: 4.36, NotFree: 3.87, Unknown: 0.01 },
    { year: 2085, Free: 1.63, PartlyFree: 4.33, NotFree: 3.87, Unknown: 0.01 },
    { year: 2090, Free: 1.62, PartlyFree: 4.30, NotFree: 3.87, Unknown: 0.01 },
    { year: 2095, Free: 1.60, PartlyFree: 4.28, NotFree: 3.87, Unknown: 0.01 },
    { year: 2100, Free: 1.60, PartlyFree: 4.27, NotFree: 3.87, Unknown: 0.01 }
  ]);

  // Filter for chart display (don't need to show every year)
  const data = useMemo(() => {
    return fullData.filter(d =>
      [1972, 1980, 1990, 2000, 2010, 2020, 2024, 2030, 2040, 2050, 2075, 2100].includes(d.year)
    );
  }, [fullData]);

  // Create table data with 5-year intervals
  const tableData = useMemo(() => {
    return fullData.filter(d => d.year % 5 === 0 || d.year === 2024);
  }, [fullData]);

  const [viewMode, setViewMode] = useState('absolute'); // 'absolute' or 'percentage'

  // Calculate percentages for each year if in percentage mode
  const percentageData = useMemo(() => {
    return data.map(yearData => {
      const total = yearData.Free + yearData.PartlyFree + yearData.NotFree + (yearData.Unknown || 0);
      return {
        year: yearData.year,
        Free: (yearData.Free / total * 100).toFixed(1),
        PartlyFree: (yearData.PartlyFree / total * 100).toFixed(1),
        NotFree: (yearData.NotFree / total * 100).toFixed(1),
        Unknown: ((yearData.Unknown || 0) / total * 100).toFixed(1)
      };
    });
  }, [data]);

  // Calculate percentage table data
  const percentageTableData = useMemo(() => {
    return tableData.map(yearData => {
      const total = yearData.Free + yearData.PartlyFree + yearData.NotFree + (yearData.Unknown || 0);
      return {
        year: yearData.year,
        Free: (yearData.Free / total * 100).toFixed(1),
        PartlyFree: (yearData.PartlyFree / total * 100).toFixed(1),
        NotFree: (yearData.NotFree / total * 100).toFixed(1),
        Unknown: ((yearData.Unknown || 0) / total * 100).toFixed(1),
        Total: total.toFixed(2)
      };
    });
  }, [tableData]);

  const chartData = viewMode === 'absolute' ? data : percentageData;

  console.log('Chart Data:', chartData);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-4">
        Global Population by Regime Type (1972-2100)
      </h2>

      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${viewMode === 'absolute' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setViewMode('absolute')}
        >
          Absolute (Billions)
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === 'percentage' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setViewMode('percentage')}
        >
          Percentage (%)
        </button>
      </div>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              label={{
                value: viewMode === 'absolute' ? 'Population (Billions)' : 'Percentage (%)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
              domain={viewMode === 'percentage' ? [0, 100] : 'auto'}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value} ${viewMode === 'absolute' ? 'billion' : '%'}`,
                name === 'PartlyFree' ? 'Partly Free' : name === 'NotFree' ? 'Not Free' : name
              ]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend
              formatter={(value) => value === 'PartlyFree' ? 'Partly Free' : value === 'NotFree' ? 'Not Free' : value}
            />

            {/* Vertical line at 2024 marking historical vs projected data */}
            <ReferenceLine
              x={2024}
              stroke="#666"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: 'Present (2024)',
                position: 'insideTopRight',
                fill: '#666',
                fontSize: 12,
                offset: 15
              }}
            />

            <Area
              type="monotone"
              dataKey="NotFree"
              stackId="1"
              stroke="#d32f2f"
              fill="#ef5350"
              name="Not Free"
            />
            <Area
              type="monotone"
              dataKey="PartlyFree"
              stackId="1"
              stroke="#ff9800"
              fill="#ffb74d"
              name="Partly Free"
            />
            <Area
              type="monotone"
              dataKey="Free"
              stackId="1"
              stroke="#2e7d32"
              fill="#66bb6a"
              name="Free"
            />
            <Area
              type="monotone"
              dataKey="Unknown"
              stackId="1"
              stroke="#757575"
              fill="#bdbdbd"
              name="Unknown"
            />
            <Brush dataKey="year" height={30} stroke="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p className="font-semibold">Methodology:</p>
        <p>Static regime projection model based on Freedom House classifications.</p>
        <p>No regime changes assumed after 2024; population projections from UN medium variant.</p>
        <div className="mt-2 border-t pt-2 border-gray-300">
          <p className="font-semibold text-amber-700">Future Uncertainty Disclaimer:</p>
          <p>The projections after 2024 represent only one possible future based on current regime classifications and demographic trends.</p>
          <p>Actual outcomes may differ significantly due to democratic transitions, backsliding, and other political developments that cannot be predicted with certainty.</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-8 w-full">
        <h3 className="text-xl font-bold mb-3">Population by Regime Type (5-Year Intervals)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Year</th>
                <th className="py-2 px-4 border-b text-right">Total (B)</th>
                <th className="py-2 px-4 border-b text-right bg-green-50">Free (B)</th>
                <th className="py-2 px-4 border-b text-right">Free (%)</th>
                <th className="py-2 px-4 border-b text-right bg-orange-50">Partly Free (B)</th>
                <th className="py-2 px-4 border-b text-right">Partly Free (%)</th>
                <th className="py-2 px-4 border-b text-right bg-red-50">Not Free (B)</th>
                <th className="py-2 px-4 border-b text-right">Not Free (%)</th>
                <th className="py-2 px-4 border-b text-right bg-gray-50">Unknown (B)</th>
                <th className="py-2 px-4 border-b text-right">Unknown (%)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => {
                const total = row.Free + row.PartlyFree + row.NotFree;
                const freePercent = (row.Free / total * 100).toFixed(1);
                const pfPercent = (row.PartlyFree / total * 100).toFixed(1);
                const nfPercent = (row.NotFree / total * 100).toFixed(1);

                // Apply special styles for 2024 (present) year
                const is2024 = row.year === 2024;
                const rowClass = is2024 ? "bg-yellow-50 font-semibold" :
                  (index % 2 === 0 ? "bg-gray-50" : "bg-white");

                return (
                  <tr key={row.year} className={rowClass}>
                    <td className="py-2 px-4 border-b">{row.year}{is2024 ? " (Present)" : ""}</td>
                    <td className="py-2 px-4 border-b text-right">{total.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-right bg-green-50">{row.Free.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-right">{freePercent}%</td>
                    <td className="py-2 px-4 border-b text-right bg-orange-50">{row.PartlyFree.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-right">{pfPercent}%</td>
                    <td className="py-2 px-4 border-b text-right bg-red-50">{row.NotFree.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-right">{nfPercent}%</td>
                    <td className="py-2 px-4 border-b text-right bg-gray-50">{(row.Unknown || 0).toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-right">{((row.Unknown || 0) / total * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegimePopulationChart;
