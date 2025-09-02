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

import { addTicket, getBuildings } from '../../api/api';
import { toast } from 'react-toastify';

const AddTicketModal = ({ open, onClose }) => {
    const [buildingOptions, setBuildingOptions] = useState([]);

    useEffect(() => {
        // Fetch building options from your API
        const fetchBhildings = async () => {
            const res = await getBuildings();
            setBuildingOptions(res);
        };
        fetchBhildings();
    }, []);


    return (
        <Box>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Ticket</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        plateNumber: '',
                        email: '',
                        unitNumber: '',
                        buildingId: '',
                        nights: 0,
                        startTime: '',
                    }}
                    validationSchema={Yup.object().shape({
                        plateNumber: Yup.string().required('License Plate Number is required'),
                        email: Yup.string().email('Invalid email'),
                        unitNumber: Yup.string().required('Unit Number is required'),
                        buildingId: Yup.string().required('Building is required'),
                        nights: Yup.number().required('Nights is required'),
                        startTime: Yup.date().required('Start Time is required'),
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            setSubmitting(true);
                            // Add ticket logic goes here
                            const res = await addTicket(values);
                            toast.success(res.message);
                            resetForm();
                            onClose();
                        } catch (error) {
                            console.error('Error adding ticket:', error);
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
                                        <InputLabel htmlFor="plateNumber">License Plate Number</InputLabel>
                                        <OutlinedInput
                                            id="plateNumber"
                                            name="plateNumber"
                                            type="text"
                                            value={values.plateNumber}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter full plateNumber"
                                            fullWidth
                                            error={Boolean(touched.plateNumber && errors.plateNumber)}
                                        />
                                        {touched.plateNumber && errors.plateNumber && (
                                            <FormHelperText error>{errors.plateNumber}</FormHelperText>
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
                                        <InputLabel htmlFor="buildingId">Building</InputLabel>
                                        <TextField
                                            id="buildingId"
                                            name="buildingId"
                                            select
                                            fullWidth
                                            value={values.buildingId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={Boolean(touched.buildingId && errors.buildingId)}
                                            helperText={touched.buildingId && errors.buildingId}
                                            inputProps={{ 'aria-label': 'Select Building' }}
                                        >
                                            {buildingOptions.map((b) => (
                                                <MenuItem key={b._id} value={b._id}>
                                                    {b.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="nights">Nights</InputLabel>
                                        <OutlinedInput
                                            id="nights"
                                            name="nights"
                                            type="number"
                                            value={values.nights}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter number of nights"
                                            fullWidth
                                            error={Boolean(touched.nights && errors.nights)}
                                            inputProps={{ min: 1, max: 10 }}
                                        />
                                        {touched.nights && errors.nights && (
                                            <FormHelperText error>{errors.nights}</FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                 <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="startTime">Start Time</InputLabel>
                                        <OutlinedInput
                                            id="startTime"
                                            name="startTime"
                                            type="datetime-local"
                                            value={values.startTime}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter start time"
                                            fullWidth
                                            error={Boolean(touched.startTime && errors.startTime)}
                                        />
                                        {touched.startTime && errors.startTime && (
                                            <FormHelperText error>{errors.startTime}</FormHelperText>
                                        )}
                                    </Stack>
                                 </Grid>


                                <Grid item xs={12}>
                                    <DialogActions>
                                        <Button onClick={onClose}>Cancel</Button>
                                        <Button type="submit" variant="contained">
                                            Add Ticket
                                        </Button>
                                    </DialogActions>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
        </Box>
    );
};

export default AddTicketModal;
