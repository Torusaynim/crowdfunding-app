import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const ariaLabel = { 'aria-label': 'description' };

export default function Inputs(props) {
    const createNote = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const userValue = event.target.value;
            console.log(userValue);
            // props.onNewNote(userValue,);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onNewNote(event.target.name.value, event.target.sum.value);
    }
    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1 },
            }}
        >
            <form onSubmit={handleSubmit}>

                <Input id='name' placeholder="Start New Project" inputProps={ariaLabel} required />
                <Input id='sum' type="number" style={{ marginLeft: "1em" }} placeholder="Insert project sum" required />
                <Button variant="outlined" style={{ marginLeft: "1em" }} type="submit">Create project</Button>
            </form>

        </Box>
    );
}