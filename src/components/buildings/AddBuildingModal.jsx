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
    FormHelperText,
    Box
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
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
                            code: ''
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Name is required'),
                            code: Yup.string().required('Code is required')
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                setSubmitting(true);
                                // Add building logic goes here
                                const res = await addBuilding(values);
                                toast.success(res.message);
                                resetForm();
                                onClose();
                            } catch (error) {
                                console.error('Error adding building:', error);
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
                                            <InputLabel htmlFor="code">Code</InputLabel>
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
            <ToastContainer
                closeButton={false}
                autoClose={5000}
                position='top-right'
            />
        </Box>
    );
};

export default AddBuildingModal;
