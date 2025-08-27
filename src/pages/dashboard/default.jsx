// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import WeeklyBarChart from 'sections/dashboard/default/WeeklyBarChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';

// assets

import { useEffect, useState } from 'react';
import { getStats } from '../../api/api';
import { ToastContainer } from 'react-toastify';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    getStatsData();
  }, []);

  const getStatsData = async () => {
    const response = await getStats();
    setStats(response);
  };
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Vehicles Registered Today" count={stats.todayCreated} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Registered Vehicles" count={stats.totalTickets} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Registrations Expiring Today" count={stats.expiringToday} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Buildings" count={stats.totalBuildings} />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard monthlyStats={stats.last12Months} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Registration Overview</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                This Week Statistics
              </Typography>
              {/* <Typography variant="h3">$7,650</Typography> */}
            </Stack>
          </Box>
          <WeeklyBarChart weeklyStats={stats.last7days} />
        </MainCard>
      </Grid>
      <ToastContainer
        closeButton={false}
        autoClose={5000}
        position='top-right' />
    </Grid>
  );
}
