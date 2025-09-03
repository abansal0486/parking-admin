import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';

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
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TextField } from '@mui/material';

// project imports
import { deleteTicket, getTickets } from '../../api/api';
import AddTicketModal from '../../components/tickets/AddTicketModal';
import EditTicketModal from '../../components/tickets/EditTicketModal';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


const headCells = [
    { id: 'plateNumber', align: 'left', disablePadding: false, label: 'Plate Number' },
    { id: 'unitNumber', align: 'left', disablePadding: false, label: 'Unit Number' },
    { id: 'building', align: 'left', disablePadding: false, label: 'Building' },
    { id: 'startTime', align: 'left', disablePadding: false, label: 'Start Time' },
    { id: 'endTime', align: 'right', disablePadding: false, label: 'End Time' },
    { id: 'nights', align: 'left', disablePadding: false, label: 'Nights' }
];

export default function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");



    // debounce search input (300ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(0);
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchTickets(page, limit, debouncedSearch);
    }, [page, debouncedSearch, limit]);

    const fetchTickets = async (pageNumber, perPage, searchQuery = "") => {
        setLoading(true);
        try {
            const res = await getTickets(pageNumber + 1, perPage || limit, searchQuery);
            setTickets(res.results);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        console.log({ newPage }, { totalPages }, newPage >= 0 && newPage <= totalPages - 1);

        if (newPage >= 0 && newPage <= totalPages - 1) {
            setPage(newPage);
            fetchTickets(newPage);
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
        fetchTickets(page);
    };
    const handleEditClose = () => {
        setEditOpen(false);
        fetchTickets(page);
    };

    const handleEdit = (row) => {
        // TODO: Handle edit logic
        console.log('Edit ticket:', row);
        setEditData(row);
        setEditOpen(true)
    };

    const handleDelete = async () => {
        // TODO: Handle delete logic
        console.log('Delete ticket:', ticketToDelete);
        const res = await deleteTicket(ticketToDelete);
        setPage(0);
        setDebouncedSearch('');
        setSearch('');
        fetchTickets(0, limit, '');
        toast.success(res.message);
        setOpenDeleteModal(false);

    };

    const onCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setTicketToDelete(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    size="small"
                    placeholder="Search by Plate or Building"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ m: 2, width: 300 }}
                />
                <Button variant="contained" onClick={handleOpen} sx={{ m: 2 }}>
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
                                <TableCell colSpan={7}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) :
                        <TableBody>
                            {tickets.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{row.plateNumber}</TableCell>
                                        <TableCell component="th" id={labelId} scope="row">
                                            <Link color="secondary">{row.unitNumber}</Link>
                                        </TableCell>
                                        <TableCell>{row.buildingData?.name}</TableCell>
                                        <TableCell >{moment.parseZone(row.startTime).format('DD/MM/YY HH:mm')}</TableCell>
                                        <TableCell align="right">
                                            {moment.parseZone(row.endTime).format("DD/MM/YY HH:mm")}
                                        </TableCell>
                                        <TableCell>{row.nights}</TableCell>
                                        <TableCell>
                                            <IconButton size="medium" onClick={() => handleEdit(row)}>
                                                <EditOutlined />
                                            </IconButton >
                                            <IconButton size="medium" color="error" aria-label="delete" onClick={() => {
                                                setOpenDeleteModal(true);
                                                setTicketToDelete(row._id)
                                            }}>
                                                <DeleteOutlined />
                                            </IconButton >
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
            <AddTicketModal open={open} onClose={handleClose} />
            <EditTicketModal openEdit={openEdit} onEditClose={handleEditClose} data={editData} />

            <Dialog open={openDeleteModal} onClose={onCloseDeleteModal}>
                <DialogTitle>Delete Ticket</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this ticket?</Typography>
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
