const User = require("../models/usersModel")
async function createNewUser(req, res){
    const body = req.body
   //console.log(body);
    if(!body || !body.email)
        return res.status(400).json({msg: "Please Enter Valid Email.."})
       const result =  await User.create({
            email : body.email,
        })
    //console.log("Body", body)
    console.log(result)
   return res.status(201).json({msg : "Success"})
   //return res.status(201).end
}

module.exports = {
    createNewUser,
}