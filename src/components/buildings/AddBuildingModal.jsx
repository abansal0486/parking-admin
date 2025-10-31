import React, { useState } from 'react';
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
    Box,
    MenuItem,
    TextField,
    IconButton
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addBuilding } from '../../api/api';
import { CloseOutlined } from '@ant-design/icons';

const AddBuildingModal = ({ open, onClose }) => {
    const [fields, setFields] = useState([]); // 👈 track dynamic fields
    const [selectedDuration, setSelectedDuration] = useState('');
    const [count, setCount] = useState(0);

    const handleAddField = (setFieldValue) => {
        if (selectedDuration && !fields.includes(selectedDuration)) {
            setFields([...fields, selectedDuration]);
            setSelectedDuration(''); // 👈 reset dropdown
            // 👇 clear the corresponding value in Formik
            if (selectedDuration === 'once') setFieldValue('nights', count);
            if (selectedDuration === 'weekly') setFieldValue('maxNightPerWeek', count);
            if (selectedDuration === 'monthly') setFieldValue('maxNightPerMonth', count);
            if (selectedDuration === 'yearly') setFieldValue('maxNightPerYear', count);
            setCount(0);
        }
    };

    const handleRemoveField = (field, setFieldValue) => {
        setFields(fields.filter((f) => f !== field));
        // also clear Formik value when removing field
        if (field === 'once') setFieldValue('nights', '');
        if (field === 'weekly') setFieldValue('maxNightPerWeek', '');
        if (field === 'monthly') setFieldValue('maxNightPerMonth', '');
        if (field === 'yearly') setFieldValue('maxNightPerYear', '');
    };


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
                            count: 0,
                            selectedDuration: '',
                            maxNightPerWeek: 0,
                            maxNightPerMonth: 0,
                            maxNightPerYear: 0,
                            file: null   // 👈 file field
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Name is required'),
                            count: Yup.number().min(1, 'Minimum Nights count is 1').required('Maximum Nights count is required'),
                            selectedDuration: Yup.string().required('Duration is required'),
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                if (!values.count || !values.selectedDuration) {
                                    return
                                }
                                if (values.selectedDuration === 'once') values.nights = values.count;
                                if (values.selectedDuration === 'weekly') values.maxNightPerWeek = values.count;
                                if (values.selectedDuration === 'monthly') values.maxNightPerMonth = values.count;
                                if (values.selectedDuration === 'yearly') values.maxNightPerYear = values.count;

                                setSubmitting(true);

                                // use FormData to include file
                                const formData = new FormData();
                                formData.append('name', values.name);
                                formData.append('code', values.code);
                                if (values.nights) formData.append('nights', values.nights);
                                if (values.maxNightPerWeek) formData.append('maxNightPerWeek', values.maxNightPerWeek);
                                if (values.maxNightPerMonth) formData.append('maxNightPerMonth', values.maxNightPerMonth);
                                if (values.maxNightPerYear) formData.append('maxNightPerYear', values.maxNightPerYear);
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
                                <Grid container spacing={1} sx={{ mt: 1, flexDirection: 'column' }}>
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
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Grid item size={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="count">Maximum Nights Count</InputLabel>
                                                <OutlinedInput
                                                    id="count"
                                                    name="count"
                                                    type="number"
                                                    value={values.count}
                                                    onBlur={handleBlur}
                                                    // onChange={(e) => setCount(e.target.value)}
                                                    onChange={handleChange}
                                                    placeholder="Enter count"
                                                    fullWidth
                                                    error={Boolean(touched.count && errors.count)}
                                                    inputProps={{ min: 1 }}
                                                />
                                                {touched.count && errors.count && (
                                                    <FormHelperText error>{errors.count}</FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        <Grid item size={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="selectedDuration">Maximum Nights Duration</InputLabel>
                                                <TextField
                                                    id="selectedDuration"
                                                    name="selectedDuration"
                                                    select
                                                    fullWidth
                                                    value={values.selectedDuration}
                                                    // onChange={(e) => setSelectedDuration(e.target.value)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    inputProps={{ 'aria-label': 'Select Role' }}
                                                    error={Boolean(touched.selectedDuration && errors.selectedDuration)}
                                                >
                                                    <MenuItem value={'once'}>At Once</MenuItem>
                                                    <MenuItem value={'weekly'}>Weekly</MenuItem>
                                                    <MenuItem value={'monthly'}>Monthly</MenuItem>
                                                    <MenuItem value={'yearly'}>Yearly</MenuItem>
                                                </TextField>
                                                {touched.selectedDuration && errors.selectedDuration && (
                                                    <FormHelperText error>{errors.selectedDuration}</FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>
                                        {/*<Grid item size={2}>
                                            <Stack spacing={1}>
                                                <Button type="button" variant="contained" onClick={()=>{
                                                    handleAddField(setFieldValue);
                                                }}>
                                                    Add
                                                </Button>
                                            </Stack>
                                        </Grid>*/}
                                    </Grid>

                                    {/* 👇 Dynamically added fields */}
                                    {/* {fields.map((field) => (
                                        <Grid
                                            key={field}
                                            item
                                            xs={12}
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}
                                        >
                                            <Stack spacing={1} sx={{ flexGrow: 1 }}>
                                                <InputLabel htmlFor={field}>
                                                    {field === 'once'
                                                        ? 'Maximum Nights At Once'
                                                        : field === 'weekly'
                                                            ? 'Maximum Nights Per Week'
                                                            : field === 'monthly'
                                                                ? 'Maximum Nights Per Month'
                                                                : 'Maximum Nights Per Year'}
                                                </InputLabel>
                                                <OutlinedInput
                                                    id={field}
                                                    name={
                                                        field === 'once'
                                                            ? 'nights'
                                                            : field === 'weekly'
                                                                ? 'maxNightPerWeek'
                                                                : field === 'monthly'
                                                                    ? 'maxNightPerMonth'
                                                                    : 'maxNightPerYear'
                                                    }
                                                    type="number"
                                                    value={
                                                        field === 'once'
                                                            ? values.nights
                                                            : field === 'weekly'
                                                                ? values.maxNightPerWeek
                                                                : field === 'monthly'
                                                                    ? values.maxNightPerMonth
                                                                    : values.maxNightPerYear
                                                    }
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field} nights`}
                                                    fullWidth
                                                    inputProps={{ min: 1 }}
                                                />
                                            </Stack>
                                            <IconButton color="error" onClick={() => handleRemoveField(field)}>
                                                <CloseOutlined />
                                            </IconButton>
                                        </Grid>
                                    ))} */}

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
