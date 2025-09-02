import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

// ==============================|| WEEKLY BAR CHART ||============================== //
export default function WeeklyBarChart({ weeklyStats }) {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  // Day mapping (1 = Su, 7 = Sa)
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const [data, setData] = useState([]);
  const [xLabels, setXLabels] = useState([]);

  useEffect(() => {
    if (weeklyStats) {
      let counts = Array(7).fill(0);
      weeklyStats.forEach((item) => {
        const dayIndex = item._id.day - 1; // 0 = Sunday
        counts[dayIndex] = item.count;
      });

      // Rotate so that today is last
      const todayIndex = new Date().getDay(); // 0 = Sunday
      const rotatedCounts = [
        ...counts.slice(todayIndex + 1),
        ...counts.slice(0, todayIndex + 1),
      ];
      const rotatedLabels = [
        ...weekDays.slice(todayIndex + 1),
        ...weekDays.slice(0, todayIndex + 1),
      ];

      setData(rotatedCounts);
      setXLabels(rotatedLabels);
    }
  }, [weeklyStats]);

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
