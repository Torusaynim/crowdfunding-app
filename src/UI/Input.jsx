import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

const ariaLabel = { 'aria-label': 'description' };

export default function Inputs(props) {
    const createNote = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const userValue = event.target.value;
            props.onNewNote(userValue);
        }
    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
        >
            <Input placeholder="Start New Project" inputProps={ariaLabel} onKeyPress={createNote}/>
        </Box>
    );
}