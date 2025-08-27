// material-ui
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

const rawData = [
  { _id: { date: "2025-08-14", day: 5 }, count: 3 },
  { _id: { date: "2025-08-18", day: 2 }, count: 3 },
  { _id: { date: "2025-08-20", day: 4 }, count: 1 }
];



// ==============================|| WEEKLY BAR CHART ||============================== //

export default function WeeklyBarChart({ weeklyStats }) {
  // Day mapping (1 = Su, 7 = Sa)
  const xLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Fill counts with 0 by default
  const [data, setData] = useState(Array(7).fill(0));

  useEffect(() => {
    if (weeklyStats) {
      setData(Array(7).fill(0));
      weeklyStats.forEach((item) => {
        const dayIndex = item._id.day - 1; // shift to 0-based
        setData((prev) => [...prev.slice(0, dayIndex), item.count, ...prev.slice(dayIndex + 1)]);
      });
    }
  }, [weeklyStats]);
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      hideLegend
      height={380}
      series={[{ data, label: 'Total Registrations' }]}
      xAxis={[{ data: xLabels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ position: 'none' }]}
      slotProps={{ bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}
