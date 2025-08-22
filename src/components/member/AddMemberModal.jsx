import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Stack,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    MenuItem,
    TextField,
    Box
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

import IconButton from 'components/@extended/IconButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { addMember, getBuildings } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';

const AddMemberModal = ({ open, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    // const [buildingOptions, setBuildingOptions] = useState([]);
    const roleOptions = [{ value: 'superadmin', label: 'Admin' }, { value: 'member', label: 'Member' }];

    // useEffect(() => {
    //     // Fetch building options from your API
    //     const fetchBhildings = async () => {
    //         const res = await getBuildings();
    //         setBuildingOptions(res);
    //     };
    //     fetchBhildings();
    // }, []);


    return (
        <Box>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Member</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        role: 'member',
                        // unitNumber: '',
                        // building: ''
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required('Name is required'),
                        email: Yup.string().email('Invalid email').required('Email is required'),
                        password: Yup.string()
                            .required('Password is required')
                            .min(6, 'Password must be at least 6 characters')
                            .max(20, 'Password must be less than 20 characters'),
                        // unitNumber: Yup.string().required('Unit Number is required'),
                        // building: Yup.string().required('Building is required')
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            setSubmitting(true);
                            // Add member logic goes here
                            const res = await addMember(values);
                            toast.success(res.message);
                            resetForm();
                            onClose();
                        } catch (error) {
                            console.error('Error adding member:', error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ handleSubmit, handleBlur, handleChange, touched, values, errors }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mt: 1, flexDirection: 'column' }}>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Name</InputLabel>
                                        <OutlinedInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={values.name}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter full name"
                                            fullWidth
                                            error={Boolean(touched.name && errors.name)}
                                        />
                                        {touched.name && errors.name && (
                                            <FormHelperText error>{errors.name}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <OutlinedInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={values.email}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter email address"
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error>{errors.email}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        color="secondary"
                                                    >
                                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {touched.password && errors.password && (
                                            <FormHelperText error>{errors.password}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
{/* 
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="unitNumber">Unit Number</InputLabel>
                                        <OutlinedInput
                                            id="unitNumber"
                                            name="unitNumber"
                                            type="text"
                                            value={values.unitNumber}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter unit number"
                                            fullWidth
                                            error={Boolean(touched.unitNumber && errors.unitNumber)}
                                        />
                                        {touched.unitNumber && errors.unitNumber && (
                                            <FormHelperText error>{errors.unitNumber}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="building">Building</InputLabel>
                                        <TextField
                                            id="building"
                                            name="building"
                                            select
                                            fullWidth
                                            value={values.building}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={Boolean(touched.building && errors.building)}
                                            helperText={touched.building && errors.building}
                                            inputProps={{ 'aria-label': 'Select Building' }}
                                        >
                                            {buildingOptions.map((b) => (
                                                <MenuItem key={b._id} value={b._id}>
                                                    {b.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Grid> */}

                                 <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="role">Role</InputLabel>
                                        <TextField
                                            id="role"
                                            name="role"
                                            select
                                            fullWidth
                                            value={values.role}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={Boolean(touched.role && errors.role)}
                                            helperText={touched.role && errors.role}
                                            inputProps={{ 'aria-label': 'Select Role' }}
                                        >
                                            {roleOptions.map((b) => (
                                                <MenuItem key={b.value} value={b.value}>
                                                    {b.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Grid> 


                                <Grid item xs={12}>
                                    <DialogActions>
                                        <Button onClick={onClose}>Cancel</Button>
                                        <Button type="submit" variant="contained">
                                            Add Member
                                        </Button>
                                    </DialogActions>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
            <ToastContainer
                closeButton={false}
                autoClose={5000}
                position='top-right'
            />
        </Box>
    );
};

export default AddMemberModal;
