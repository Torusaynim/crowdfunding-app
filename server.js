import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { updateUser, newProject, getAllProjects, getUserProjects, deleteProject, editProject, supportProject, getUserById, getPermissionsByRole, getUserPermissions } from './mongodb.js'

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/api/google-login', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const { sub, name, email } = ticket.getPayload();
    const user = {
        googleId: sub,
        name: name,
        email: email,
        role: 'user'
    }
    await updateUser(user)
    res.status(201);
    res.json(user);
});

app.post('/api/new-project', async (req, res) => {
    const { user, name, sum } = req.body;
    console.log(req.body);
    await newProject(user, name, sum);
    res.json('created project')
});

app.get('/api/get-all-projects', async (req, res) => {
    const notes = await getAllProjects()
    res.status(200);
    res.json(notes)
});

app.get('/api/get-user-projects/:googleId', async (req, res) => {
    const userNotes = await getUserProjects(req.params.googleId)
    res.status(200);
    // console.log(userNotes)
    res.json(userNotes)
});

app.post('/api/delete-project', async (req, res) => {
    const { _id } = req.body;
    const delete_note = await deleteProject(_id)
    res.json(delete_note)
})

app.post('/api/edit-project', async (req, res) => {
    const { _id, name, sum } = req.body;
    console.log({ _id, name, sum })

    const edit_note = await editProject(_id, name,sum)
    res.json(edit_note)
})

app.post('/api/support-project', async (req, res) => {
    const { _id, sum } = req.body;
    console.log({ _id, sum })

    const edit_note = await supportProject(_id, sum)
    res.json(edit_note)
})

app.get('/api/get-user/:id', async (req, res) => {
    const user = await getUserById(req.params.id)
    res.json(user)
})

app.get('/api/get-permissions/:role', async (req, res) => {
    const perms = await getPermissionsByRole(req.params.role)
    res.json(perms.permissions)
})

app.get('/api/get-user-permissions/:userId', async (req, res) => {
    const perms = await getUserPermissions(req.params.userId)
    res.json(perms)
})

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `Server is ready at http://localhost:${process.env.PORT || 5000}/`
    );
});