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

import { updateTicket, getBuildings } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';

const EditTicketModal = ({ openEdit, onEditClose, data }) => {
    const [buildingOptions, setBuildingOptions] = useState([]);

    useEffect(() => {
        // Fetch building options from your API
        const fetchBhildings = async () => {
            const res = await getBuildings();
            setBuildingOptions(res);
        };
        fetchBhildings();
    }, []);

        const getMaxNights = (buildingId) => {
        const building = buildingOptions.find((b) => b._id === buildingId);
        return building ? building.nights : 0;
    };


    return (
        <Box>
        <Dialog open={openEdit} onClose={onEditClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Ticket</DialogTitle>
            {data &&<DialogContent>
                <Formik
                    initialValues={{
                        plateNumber: data.plateNumber,
                        email: data.email,
                        unitNumber: data.unitNumber,
                        building: data.buildingData._id,
                        nights: data.nights || 0
                    }}
                    validationSchema={Yup.object().shape({
                        plateNumber: Yup.string().required('Plate Number is required'),
                        email: Yup.string().email('Invalid email'),
                        unitNumber: Yup.string().required('Unit Number is required'),
                        building: Yup.string().required('Building is required'),
                        nights: Yup.number().required('Number of Maximum Nights is required')
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        try {
                            setSubmitting(true);
                            // Add ticket logic goes here
                            const res = await updateTicket(data._id, values);
                            toast.success(res.message);
                            resetForm();
                            onEditClose();
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
                                        <InputLabel htmlFor="plateNumber">Plate Number</InputLabel>
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
                                            readOnly
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
                                            readOnly
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
                                            disabled
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
                                            inputProps={{ min: 1
                                                // max: getMaxNights(values.building) 
                                            }}
                                        />
                                        {touched.nights && errors.nights && (
                                            <FormHelperText error>{errors.nights}</FormHelperText>
                                        )}
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
            <ToastContainer
                closeButton={false}
                autoClose={5000}
                position='top-right'
            />
        </Box>
    );
};

export default EditTicketModal;
