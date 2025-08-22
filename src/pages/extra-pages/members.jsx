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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// project imports
import { deleteMember, getMembers } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import { set } from 'lodash-es';
import AddMemberModal from '../../components/member/AddMemberModal';
import EditMemberModal from '../../components/member/EditMemberModal';

const headCells = [
    { id: 'name', align: 'left', disablePadding: false, label: 'Name' },
    { id: 'email', align: 'left', disablePadding: false, label: 'Email' },
    // { id: 'unitNumber', align: 'left', disablePadding: false, label: 'Unit Number' },
    // { id: 'building', align: 'left', disablePadding: false, label: 'Building' },
    { id: 'role', align: 'left', disablePadding: false, label: 'Role' }
];

export default function MembersPage() {
    const [open, setOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [editData, setEditData] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        fetchMembers(page);
    }, [page]);

    const fetchMembers = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await getMembers(pageNumber + 1, limit);
            setMembers(res.results);
            setTotalPages(res.totalPages);
            setTotal(res.total);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        console.log({ newPage }, { totalPages }, newPage >= 0 && newPage <= totalPages - 1);

        if (newPage >= 0 && newPage <= totalPages - 1) {
            setPage(newPage);
            fetchMembers(newPage);
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
        fetchMembers(page);
    };
    const handleEditClose = () => {
        setEditOpen(false);
        fetchMembers(page);
    };

    const handleEdit = (row) => {
        // TODO: Handle edit logic
        console.log('Edit member:', row);
        setEditData(row);
        setEditOpen(true)
    };

    const handleDelete = async() => {
        // TODO: Handle delete logic
        console.log('Delete member:', memberToDelete);
        const res = await deleteMember(memberToDelete);
        fetchMembers(page);
        toast.success(res.message);
        setOpenDeleteModal(false);
        
    };

    const onCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setMemberToDelete(null);
    };



    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
                    Add New Member
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
                    <TableBody>
                        {members.map((row, index) => {
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
                                    <TableCell>{row.email}</TableCell>
                                    {/* <TableCell >{row.unitNumber}</TableCell>
                                    <TableCell>{row.building?.name}</TableCell> */}
                                    <TableCell >
                                        {row.role=='member' ? 'Member' : 'Admin'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="medium" onClick={() => handleEdit(row)}>
                                            <EditOutlined />
                                        </IconButton >
                                        <IconButton size="medium" color="error" aria-label="delete" onClick={() => {setOpenDeleteModal(true);
                                        setMemberToDelete(row._id)}}>
                                            <DeleteOutlined />
                                        </IconButton >
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
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
            <AddMemberModal open={open} onClose={handleClose} />
            <EditMemberModal openEdit={openEdit} onEditClose={handleEditClose} data={editData} />

            <Dialog open={openDeleteModal} onClose={onCloseDeleteModal}>
                <DialogTitle>Delete Member</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this member?</Typography>
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
