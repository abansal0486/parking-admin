import React from 'react';
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
    Box
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addBuilding } from '../../api/api';

const AddBuildingModal = ({ open, onClose }) => {
    return (
        <Box>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Add New Building</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: '',
                            code: '',
                            nights: 0,
                            file: null   // 👈 file field
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Name is required'),
                            nights: Yup.number().required('Maximum Nights count is required')
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                setSubmitting(true);

                                // use FormData to include file
                                const formData = new FormData();
                                formData.append('name', values.name);
                                formData.append('code', values.code);
                                formData.append('nights', values.nights);
                                if (values.file) {
                                    formData.append('file', values.file);
                                }

                                const res = await addBuilding(formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                });

                                toast.success(res.message || 'Building added successfully');
                                resetForm();
                                onClose();
                            } catch (error) {
                                console.error('Error adding building:', error);
                                toast.error('Failed to add building');
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ handleSubmit, handleBlur, handleChange, setFieldValue, touched, values, errors }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={2} sx={{ mt: 1, flexDirection: 'column' }}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="name">Site ID/Name</InputLabel>
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
                                            <InputLabel htmlFor="code">Code (Optional)</InputLabel>
                                            <OutlinedInput
                                                id="code"
                                                name="code"
                                                type="text"
                                                value={values.code}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter code"
                                                fullWidth
                                                error={Boolean(touched.code && errors.code)}
                                            />
                                            {touched.code && errors.code && (
                                                <FormHelperText error>{errors.code}</FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="nights">Maximum Nights</InputLabel>
                                            <OutlinedInput
                                                id="nights"
                                                name="nights"
                                                type="number"
                                                value={values.nights}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter nights"
                                                fullWidth
                                                error={Boolean(touched.nights && errors.nights)}
                                                inputProps={{ min: 1 }}
                                            />
                                            {touched.nights && errors.nights && (
                                                <FormHelperText error>{errors.nights}</FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    {/* 👇 New CSV Upload field */}
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="file">Banned Plates (Optional)</InputLabel>
                                            <OutlinedInput
                                                id="file"
                                                name="file"
                                                type="file"
                                                inputProps={{ accept: '.csv' }}
                                                onChange={(e) => setFieldValue("file", e.currentTarget.files[0])}
                                                fullWidth
                                            />
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <DialogActions>
                                            <Button onClick={onClose}>Cancel</Button>
                                            <Button type="submit" variant="contained">
                                                Add Building
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

export default AddBuildingModal;
