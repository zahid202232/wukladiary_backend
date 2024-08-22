const express = require("express");
const {createNewUser} = require("../controllers/users")
const {emailStorageValidator} = require("../helpers/adminValidator")
    


const router = express.Router()
 
//Routes
// router.get("/", async (req, res) => {
//     const allDBUsers = await User.find({})
//     const html = `
//     <ul>
//         ${allDBUsers.map((user) => `<li>${user.firstName} - ${user.email} </li>`).join("")}
//     </ul>`;
//     res.send(html)
// })
//REST API

router.route("/")
.post(emailStorageValidator, createNewUser)
// router.route(":/id")
// .get(handleAllUsersById)
// .patch(UpdatingAllUsers)
// .delete(deleteAllUsers)
// router.get("/", handleAllUsers)
// router.post("/", createNewUser)


//Uaing Route Once

// app.route("/api/users/:id").get((req,res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id)
//     return res.json(user)
// }).patch((req,res) => {
//      //TODO : Edit the User
//      return res.json({status : "Pending"})
// }).delete((req,res) => {
//      //TODO: DELETE THE USER with ID
//      return res.json({status: "Pending"})
// })
//By ID

module.exports = router