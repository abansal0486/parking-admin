import { useEffect, useState } from 'react';
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
    FormHelperText,
    MenuItem,
    TextField,
    Box
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
    updateMember,
    // getBuildings 
} from '../../api/api';
import { toast } from 'react-toastify';

const EditMemberModal = ({ openEdit, onEditClose, data }) => {
    const roleOptions = [{ value: 'superadmin', label: 'Admin' }, { value: 'member', label: 'Member' }];
    // const [buildingOptions, setBuildingOptions] = useState([]);

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
            <Dialog open={openEdit} onClose={onEditClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Member</DialogTitle>
                {data && <DialogContent>
                    <Formik
                        initialValues={{
                            name: data.name,
                            email: data.email,
                            password: data.password,
                            role: data.role,
                            // unitNumber: data.unitNumber,
                            // building: data.building._id
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Name is required'),
                            email: Yup.string().email('Invalid email').required('Email is required'),
                            role: Yup.string().required('Role is required'),
                            // unitNumber: Yup.string().required('Unit Number is required'),
                            // building: Yup.string().required('Building is required')
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                setSubmitting(true);
                                // Add member logic goes here
                                const res = await updateMember(data._id, values);
                                toast.success(res.message);
                                resetForm();
                                onEditClose();
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

                                    {/* <Grid item xs={12}>
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
                                            <Button onClick={onEditClose}>Cancel</Button>
                                            <Button type="submit" variant="contained">
                                                Update
                                            </Button>
                                        </DialogActions>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </DialogContent>}
            </Dialog>
        </Box>
    );
};

export default EditMemberModal;
