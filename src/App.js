import './App.css';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';


function App() {
    const [openEdit, setOpenEdit] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [text, setText] = useState('Sample name');
    const [sumGET, setSum] = useState(0);

    const [access, setAccess] = useState(false);

    const backUri = 'http://127.0.0.1:5000';

    const handleEditProject = async (noteId) => {
        console.log('handleEditProject')
        if (noteId) {
            setOpenEdit(true);
            setNoteId(noteId);
        }
    };

    const handleSupportProject = async (noteId) => {
        console.log('handleSupportProject')
        console.log(access)
        if (noteId) {
            setOpenSupport(true);
            setNoteId(noteId);
        }
    };

    const handleCloseEdit = () => {
        console.log('handleCloseEdit')
        setOpenEdit(false);
    }

    const handleCloseSupport = () => {
        console.log('handleCloseSupport')
        setOpenSupport(false);
    }

    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );

    const [projectsList, toggleProjects] = useState(
        false
    )

    // const handleFailure = (result) => {
    //     console.log(window.location.href);
    //     console.log(result);
    // };

    const handleLogin = async (googleData) => {
        console.log(googleData);

        const res = await fetch(backUri+'/api/google-login', {
            method: 'POST',
            body: JSON.stringify({
                token: googleData.credential,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        const data = await res.json();
        setLoginData(data);
        toggleProjects(false);
        localStorage.setItem('loginData', JSON.stringify(data));
    };
    const handleLogout = () => {
        localStorage.removeItem('loginData');
        setLoginData(null);
        toggleProjects(false);
    };

    const handleGetAllProjects = async () => {
        // if (!projectsList) {
        const res = await fetch(backUri+'/api/get-all-projects')
        const result = await res.json().then(data => { return data })
        toggleProjects(result)
        // } else {
        // toggleProjects(false)
        // }
    }

    const handleGetUserProjects = async () => {
        // if (!projectsList) {
        const res = await fetch(backUri+'/api/get-user-projects/' + loginData.googleId)
        const result = await res.json().then(data => { return data })
        toggleProjects(result)
        // } else {
        // toggleProjects(false)
        // }
    }

    const handleNewProject = async (name,sum) => {
        console.log('handleNewProject')
    
        console.log(sum);
        await fetch(backUri+'/api/new-project', {
            method: 'POST',
            body: JSON.stringify({
                user: loginData.googleId,
                name: name,
                sum: sum,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await handleGetUserProjects(loginData.googleId);
    };
  

    const handleDelete = async (noteId) => {
        console.log('handleDelete')
        await fetch(backUri+'/api/delete-project', {
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
     
        await fetch(backUri+'/api/edit-project', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId,
                name: text,
                sum: sumGET
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setOpenEdit(false)
        await handleGetUserProjects(loginData.googleId)
    };

    const handleSupport = async () => {
     
        await fetch(backUri+'/api/support-project', {
            method: 'POST',
            body: JSON.stringify({
                _id: noteId,
                sum: sumGET
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setOpenSupport(false)
        await handleGetUserProjects(loginData.googleId)
    };

    const handleChangeText = (e) => {

        setText(e.target.value)
    };
    const handleChangeSum = (e) => {
        setSum(e.target.value)
    };

    // const getUser = async (userId) => {
    //     const user_res = await fetch(backUri+'/api/get-user/' + userId)
    //     const result = await user_res.json().then(data => {return data})
    //     console.log(result)
    //     return result
    // }
    //
    // const getPermissions = async (role) => {
    //     const res = await fetch(backUri+'/api/get-permissions/'+role)
    //     const result = await res.json().then(data => {return data})
    //     console.log(result)
    //     return result
    // }

    const hasUserAccess = async (perm) => {
        const res = await fetch(backUri+'/api/get-user-permissions/' + loginData.googleId)
        const result = await res.json()
        setPermission(result.permissions.some(e => e === perm))
    }

    const setPermission = (permission) => {
        setAccess(permission)
    }

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div className="App">
                <div>
                    {loginData ? (
                        <div>
                            <h1>Kickstart Your Projects</h1>
                            <h3>You've logged in as {loginData.email} (googleId - {loginData.googleId})</h3>
                            <Dialog open={openEdit} onClose={handleCloseEdit}>
                                <DialogTitle>Edit project</DialogTitle>
                            
                                <DialogContent>
                                    <form>

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
                                    <TextField
                                        onChange={handleChangeSum}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Enter new sum"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        />
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseEdit}>Cancel</Button>
                                    <Button onClick={handleEdit}>Edit</Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={openSupport} onClose={handleCloseSupport}>
                                <DialogTitle>Support project</DialogTitle>
                            
                                <DialogContent>
                                    <form>

                                    <TextField
                                        onChange={handleChangeSum}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Enter amount of support"
                                        type="number"
                                        fullWidth
                                        variant="standard"
                                        />
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseSupport}>Cancel</Button>
                                    <Button onClick={handleSupport}>Support</Button>
                                </DialogActions>
                            </Dialog>
                            <Input onNewNote={handleNewProject} />
                            <Button variant="outlined" onClick={handleGetAllProjects}>Browse All Projects</Button>
                            {/* {hasUserAccess('view_all') &&
                                <Button disabled={!access} variant="outlined" onClick={handleGetAllProjects}>Get all notes</Button>
                            } */}
                            <Button variant="outlined" onClick={handleGetUserProjects}>My Projects</Button>
                            {projectsList ? (
                                <div>
                                {hasUserAccess('view_all') &&
                                    <Table data={projectsList} currentUser={loginData.googleId} access={access} onProjectSupport={handleSupportProject} onProjectEdit={handleEditProject} onProjectDelete={handleDelete} />
                                }
                                </div>
                            ) : (
                                <div></div>
                            )}
                            <br /><br /><br />
                            <button onClick={handleLogout} className="ggl-btn">
                                <span style={{ fontWeight: 500, padding: "10px" }}>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h1>Login Page</h1>
                                <GoogleLogin
                                    onSuccess={handleLogin}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                                {/* <GoogleLogin
                                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                    buttonText="Log in with Google"
                                    onSuccess={handleLogin}
                                    onFailure={handleFailure}
                                    cookiePolicy={'single_host_origin'}
                                /> */}
                        </div>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );

}

export default App;