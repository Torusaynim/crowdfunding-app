import './App.css';
import GoogleLogin from 'react-google-login';
import { useState } from 'react';
import Input from './UI/Input'
import Button from '@mui/material/Button';
import Table from './UI/Table';
import React from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";


function App() {
    const [open, setOpen] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [text, setText] = useState('Sample name');
    const [access, setAccess] = useState(false);

    const handleEditNote = async (noteId) => {
        console.log('handleEditNote')
        if (noteId) {
            setOpen(true);
            setNoteId(noteId);
        }
    };

    const handleClose = () => {
        console.log('handleClose')
        setOpen(false);
    }

    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );

    const [notesList, toggleNotes] = useState(
        false
    )

    const handleFailure = (result) => {
        alert(result);
    };

    const handleLogin = async (googleData) => {
        const res = await fetch('/api/google-login', {
            method: 'POST',
            body: JSON.stringify({
                token: googleData.tokenId,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        setLoginData(data);
        toggleNotes(false);
        localStorage.setItem('loginData', JSON.stringify(data));
    };
    const handleLogout = () => {
        localStorage.removeItem('loginData');
        setLoginData(null);
        toggleNotes(false);
    };

    const handleGetAllNotes = async () => {
        // if (!notesList) {
            const res = await fetch('/api/get-all-projects')
            const result = await res.json().then(data => {return data})
            toggleNotes(result)
        // } else {
            // toggleNotes(false)
        // }
    }

    const handleGetUserProjects = async () => {
        // if (!notesList) {
            const res = await fetch('/api/get-user-projects/'+loginData.googleId)
            const result = await res.json().then(data => {return data})
            toggleNotes(result)
        // } else {
            // toggleNotes(false)
        // }
    }

    const handleNewNote = async (name) => {
        console.log('handleNewNote')
        await fetch('/api/new-project', {
            method: 'POST',
            body: JSON.stringify({
                user: loginData.googleId,
                name: name
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await handleGetUserProjects(loginData.googleId);
    };

    const handleDelete = async (noteId) => {
        console.log('handleDelete')
        await fetch('/api/delete-project', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        await handleGetUserProjects(loginData.googleId)
    };

    const handleEdit = async () => {
        await fetch('/api/edit-project', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId,
                name: text
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setOpen(false)
        await handleGetUserProjects(loginData.googleId)
    };

    const handleChangeText = (e) => {
        setText(e.target.value)
    };

    // const getUser = async (userId) => {
    //     const user_res = await fetch('/api/get-user/' + userId)
    //     const result = await user_res.json().then(data => {return data})
    //     console.log(result)
    //     return result
    // }
    //
    // const getPermissions = async (role) => {
    //     const res = await fetch('/api/get-permissions/'+role)
    //     const result = await res.json().then(data => {return data})
    //     console.log(result)
    //     return result
    // }

    const hasUserAccess = async(perm) => {
        const res = await fetch('/api/get-user-permissions/'+loginData.googleId)
        const result = await res.json()
        setPermission(result.permissions.some(e => e === perm))
    }

    const setPermission = (permission) => {
        setAccess(permission)
    }

    return (
    <div className="App">
        <div>
            {loginData ? (
                <div>
                    <h1>Kickstart Your Projects</h1>
                    <h3>You logged in as {loginData.email}</h3>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Edit name</DialogTitle>
                        <DialogContent>
                            <TextField
                                onChange={handleChangeText}
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Enter new name"
                                type="name"
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleEdit}>Edit</Button>
                        </DialogActions>
                    </Dialog>
                    <Input onNewNote={handleNewNote}/>
                    <Button variant="outlined" onClick={handleGetAllNotes}>Browse All Projects</Button>
                    {/* {hasUserAccess('view_all') &&
                        <Button disabled={!access} variant="outlined" onClick={handleGetAllNotes}>Get all notes</Button>
                    } */}
                    <Button variant="outlined" onClick={handleGetUserProjects}>My Projects</Button>
                    {notesList ? (
                        <div>
                            <Table data={notesList} onNoteEdit={handleEditNote} onNoteDelete={handleDelete}/>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <br/><br/><br/>
                    <button onClick={handleLogout} className="ggl-btn">
                        <span style={{fontWeight: 500, padding: "10px"}}>Logout</span>
                    </button>
                </div>
            ) : (
                <div>
                <h1>Login Page</h1>
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Log in with Google"
                    onSuccess={handleLogin}
                    onFailure={handleFailure}
                    cookiePolicy={'single_host_origin'}
                />
                </div>
            )}
        </div>
    </div>
    );
}

export default App;