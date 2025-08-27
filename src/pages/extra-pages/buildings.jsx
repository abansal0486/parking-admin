import { useEffect, useState } from 'react';

// material-ui
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';

import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';

// project imports
import { deleteBuilding, getPaginatedBuildings } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import { set } from 'lodash-es';
import AddBuildingModal from '../../components/buildings/AddBuildingModal';
import EditBuildingModal from '../../components/buildings/EditBuildingModal';

const headCells = [
    { id: 'name', align: 'left', disablePadding: false, label: 'Name' },
    { id: 'nights', align: 'left', disablePadding: false, label: 'Maximum Nights' },
    { id: 'code', align: 'left', disablePadding: false, label: 'Code' },
    { id: 'status', align: 'left', disablePadding: false, label: 'Status' }
];

export default function BuildingsPage() {
    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [editData, setEditData] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [buildingToDelete, setBuildingToDelete] = useState(null);

    useEffect(() => {
        fetchBuildings(page);
    }, [page]);

    const fetchBuildings = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await getPaginatedBuildings(pageNumber + 1, limit);

            setBuildings(res.results);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch (err) {
            console.error('Failed to fetch buildings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        console.log({ newPage }, { totalPages }, newPage >= 0 && newPage <= totalPages - 1);

        if (newPage >= 0 && newPage <= totalPages - 1) {
            setPage(newPage);
            fetchBuildings(newPage);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = () => {
        setEditData(null);
        setOpen(true)
    };
    const handleEditOpen = () => {
        setEditData(null);
        setEditOpen(true)
    };
    const handleClose = () => {
        setOpen(false);
        fetchBuildings(page);
    };
    const handleEditClose = () => {
        setEditOpen(false);
        fetchBuildings(page);
    };

    const handleEdit = (row) => {
        // TODO: Handle edit logic
        console.log('Edit building:', row);
        setEditData(row);
        setEditOpen(true)
    };

    const handleDelete = async () => {
        // TODO: Handle delete logic
        console.log('Delete building:', buildingToDelete);
        const res = await deleteBuilding(buildingToDelete);
        fetchBuildings(page);
        toast.success(res.message);
        setOpenDeleteModal(false);

    };

    const onCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setBuildingToDelete(null);
    };



    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
                    Add New
                </Button>
            </Box>

            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.align}
                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                            <TableCell>Actions</TableCell>

                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) :
                        <TableBody>
                            {buildings.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" id={labelId} scope="row">
                                            <Link color="secondary">{row.name}</Link>
                                        </TableCell>
                                        <TableCell>{row.nights}</TableCell>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell >{row.status}</TableCell>
                                        <TableCell>
                                            <IconButton size="medium" onClick={() => handleEdit(row)}>
                                                <EditOutlined />
                                            </IconButton >
                                            <IconButton size="medium" color="error" aria-label="delete" onClick={() => {
                                                setOpenDeleteModal(true);
                                                setBuildingToDelete(row._id)
                                            }}>
                                                <DeleteOutlined />
                                            </IconButton >
                                            {row.bannedPlatesFile && (
                                                <Tooltip title="Download banned plates file" arrow>
                                                    <IconButton
                                                        size="medium"
                                                        component="a"
                                                        href={row.bannedPlatesFile}
                                                        download
                                                        aria-label="download"
                                                    >
                                                        <DownloadOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                        </TableCell>

                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    }
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={limit}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <AddBuildingModal open={open} onClose={handleClose} />
            <EditBuildingModal openEdit={openEdit} onEditClose={handleEditClose} data={editData} />

            <Dialog open={openDeleteModal} onClose={onCloseDeleteModal}>
                <DialogTitle>Delete Building</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this building?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDeleteModal} color="inherit">Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer
                closeButton={false}
                autoClose={5000}
                position='top-right'
            />

        </Box>
    );
}
