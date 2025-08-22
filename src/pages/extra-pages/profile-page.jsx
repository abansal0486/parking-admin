import { useEffect, useState } from 'react';
import { getUserDetails, updatePassword } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// MUI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Tabs,
  Tab,
  IconButton,
  InputAdornment
} from '@mui/material';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const [tab, setTab] = useState(0);

  // show/hide toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await getUserDetails();
      setUser(res);
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setMessage('New password cannot be the same as the current password.');
      return;
    }

    const res = await updatePassword({ currentPassword, newPassword });
    toast.success(res.message);

    setMessage('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Box mt={2}>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Profile" />
        <Tab label="Change Password" />
      </Tabs>

      {/* Profile Tab */}
      {tab === 0 && user && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <TextField
            label="Name"
            value={user.name}
            margin="normal"
            InputProps={{ readOnly: true }}
            sx={{ width: '400px', display: 'block' }}
          />
          <TextField
            label="Email"
            value={user.email}
            margin="normal"
            InputProps={{ readOnly: true }}
            sx={{ width: '400px', display: 'block' }}
          />
        </Box>
      )}

      {/* Change Password Tab */}
      {tab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>

          <TextField
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            sx={{ width: '400px', display: 'block' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end">
                    {showCurrent ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="New Password"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            sx={{ width: '400px', display: 'block' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                    {showNew ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            sx={{ width: '400px', display: 'block' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {message && (
            <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2, width: '400px' }}>
              {message}
            </Alert>
          )}

          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordChange}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </Box>
  );
};

export default ProfilePage;
