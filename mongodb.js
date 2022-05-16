import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient("mongodb://localhost:27017/rbac")
const users = client.db().collection('users')
const projects = client.db().collection('projects')
const roles = client.db().collection('role_permissions')

const start = async() => {
    try {
        await client.connect()
        console.log('Connected')
    } catch (e) {
        console.log(e)
    }
}

const updateUser = async (user) => {
    await users.updateOne(
        {googleId: user.googleId},
        {$setOnInsert: {
            name: user.name, email: user.email, role: user.role
        }},
        {upsert: true}
    )
}

const newProject = async (user, name) => {
    await projects.insertOne({author: user, name: name})
}

const getAllProjects = async() => {
    const res = await projects.find().toArray()
    return res
}

const getUserProjects = async(userId) => {
    const res = await projects.find({author: userId}).toArray()
    return res
}

const deleteProject = async(_id) => {
    const res = await projects.deleteOne({_id: ObjectId(_id)})
    return res
}

const editProject = async(_id, anotherName) => {
    console.log(_id, anotherName)
    const res = await projects.updateOne({_id: ObjectId(_id)}, {$set: {"name": anotherName}})

    console.log(res)
}

const getUserById = async(id) => {
    return await users.findOne({googleId: id})
}

const getPermissionsByRole = async(role) => {
    return await roles.findOne({role: role})
}

const getUserPermissions = async(userId) => {
    const user = await users.findOne({googleId: userId})
    const perms = await roles.findOne({role: user.role})
    return perms
}

start()

export {
    updateUser, newProject, getAllProjects, getUserProjects, deleteProject, editProject, getUserById, getPermissionsByRole, getUserPermissions
}