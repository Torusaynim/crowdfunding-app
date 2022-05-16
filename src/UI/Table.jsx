import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationIcon from '@mui/icons-material/MonetizationOn';
import Button from '@mui/material/Button';


export default function BasicTable(props) {

    const onProjectEdit = (e) => {
        e.preventDefault()
        props.onProjectEdit(e.target.value);
    }

    const onProjectDelete = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        props.onProjectDelete(e.target.value);
    }

    return (
        <TableContainer component={Paper} sx={{ marginTop: 3, maxWidth: 1200, marginX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Author</TableCell>
                        <TableCell>Project Name</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((row) => (
                        <TableRow
                            key={row._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{row.author}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.raised} of {row.requested}</TableCell>
                            <TableCell align="right">
                                <Button onClick={onProjectEdit} value={row._id} sx={{marginRight: 2}}><MonetizationIcon/>Support</Button>
                                <Button onClick={onProjectEdit} value={row._id} sx={{marginRight: 2}}><EditIcon/>Edit</Button>
                                <Button onClick={onProjectDelete} value={row._id} variant="text"><DeleteOutlineIcon/>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}