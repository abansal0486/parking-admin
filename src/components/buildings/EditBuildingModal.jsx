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
    Paper,
    TextField,
    MenuItem
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { removeFile, updateBuilding } from '../../api/api';
import { toast } from 'react-toastify';

const EditBuildingModal = ({ openEdit, onEditClose, data, setEditData }) => {

    const removeAttachment = async () => {
        const res = await removeFile(data._id, data.bannedPlatesFile);
        toast.success(res.message);
        setEditData({ ...data, bannedPlatesFile: null });
    }
    const getSelectedDuration = (data) => {
        if (data.maxNightPerWeek > 0) {
            return 'weekly';
        } else if (data.maxNightPerMonth > 0) {
            return 'monthly';
        } else if (data.maxNightPerYear > 0) {
            return 'yearly';
        }
        return 'once';
    }

    const getCount = (data) => {
        if (data.maxNightPerWeek > 0) {
            return data.maxNightPerWeek;
        } else if (data.maxNightPerMonth > 0) {
            return data.maxNightPerMonth;
        } else if (data.maxNightPerYear > 0) {
            return data.maxNightPerYear;
        }
        return data.nights;
    }
    return (
        <Box>
            <Dialog open={openEdit} onClose={onEditClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Building</DialogTitle>
                {data && (
                    <DialogContent>
                        <Formik
                            initialValues={{
                                name: data.name,
                                code: data.code,
                                nights: data.nights,
                                count: getCount(data),
                                selectedDuration: getSelectedDuration(data),
                                maxNightPerWeek: data.maxNightPerWeek,
                                maxNightPerMonth: data.maxNightPerMonth,
                                maxNightPerYear: data.maxNightPerYear,
                                bannedPlatesFile: null
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required('Name is required'),
                                // nights: Yup.number().required('Maximum Nights count is required')
                                count: Yup.number().min(1, 'Minimum Nights count is 1').required('Maximum Nights count is required'),
                                selectedDuration: Yup.string().required('Duration is required'),
                            })}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                try {
                                    setSubmitting(true);
                                    if (!values.count || !values.selectedDuration) {
                                        return
                                    }
                                    if (values.selectedDuration === 'once') {
                                        values.nights = values.count;
                                        values.maxNightPerWeek=0
                                        values.maxNightPerMonth=0
                                        values.maxNightPerYear=0
                                    }
                                    if (values.selectedDuration === 'weekly') {
                                        values.maxNightPerWeek = values.count;
                                        values.nights=0
                                        values.maxNightPerMonth=0
                                        values.maxNightPerYear=0
                                    }
                                    if (values.selectedDuration === 'monthly') {
                                        values.maxNightPerMonth = values.count;
                                        values.nights=0
                                        values.maxNightPerWeek=0
                                        values.maxNightPerYear=0
                                    }
                                    if (values.selectedDuration === 'yearly') {
                                        values.maxNightPerYear = values.count;
                                        values.nights=0
                                        values.maxNightPerWeek=0
                                        values.maxNightPerMonth=0
                                    }

                                    const formData = new FormData();
                                    formData.append("name", values.name);
                                    formData.append("code", values.code || "");
                                    // formData.append("nights", values.nights);
                                    formData.append('nights', values.nights);
                                    formData.append('maxNightPerWeek', values.maxNightPerWeek);
                                    formData.append('maxNightPerMonth', values.maxNightPerMonth);
                                    formData.append('maxNightPerYear', values.maxNightPerYear);
                                    if (values.bannedPlatesFile) {
                                        formData.append("file", values.bannedPlatesFile);
                                    }

                                    const res = await updateBuilding(data._id, formData);
                                    toast.success(res.message);
                                    resetForm();
                                    onEditClose();
                                } catch (error) {
                                    console.error('Error updating building:', error);
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

                                        {/* <Grid item xs={12}>
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
                                        </Grid> */}
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
                                        </Grid>

                                        {/* 🔹 File Upload for banned plates */}
                                        {/* <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="bannedPlatesFile">Banned Plates</InputLabel>
                                                <input
                                                    id="bannedPlatesFile"
                                                    name="bannedPlatesFile"
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={(event) =>
                                                        setFieldValue("bannedPlatesFile", event.currentTarget.files[0])
                                                    }
                                                />
                                                {values.bannedPlatesFile && (
                                                    <FormHelperText>{values.bannedPlatesFile.name}</FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid> */}

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="bannedPlatesFile">Banned Plates</InputLabel>

                                                {/* 🔹 Existing file */}
                                                {data?.bannedPlatesFile && !values.bannedPlatesFile && (
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            p: 1.2,
                                                            borderRadius: 2,
                                                            backgroundColor: '#f9f9f9'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            📄
                                                            <span>{data.bannedPlatesFile.split('/').pop()}</span>
                                                        </Box>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => {
                                                                setFieldValue("bannedPlatesFile", null);
                                                                removeAttachment();
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Paper>
                                                )}

                                                {/* 🔹 Upload new file */}
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                                                >
                                                    {data?.bannedPlatesFile ? 'Replace' : 'Upload'} CSV
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept=".csv"
                                                        onChange={(event) => {
                                                            setFieldValue("bannedPlatesFile", event.currentTarget.files[0])
                                                            // reset input value so same file can be re-uploaded
                                                            event.target.value = null
                                                        }}
                                                    />
                                                </Button>

                                                {/* 🔹 New file preview */}
                                                {values.bannedPlatesFile && (
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            p: 1.2,
                                                            borderRadius: 2,
                                                            backgroundColor: '#f9f9f9',
                                                            mt: 1
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            📄
                                                            <span>{values.bannedPlatesFile.name}</span>
                                                        </Box>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => setFieldValue("bannedPlatesFile", null)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Paper>
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
                    </DialogContent>
                )}
            </Dialog>
        </Box>
    );
};

export default EditBuildingModal;
