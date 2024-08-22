const mongoose = require("mongoose")
const homeSchema = new mongoose.Schema({
  totalCases : {
        type : Number,
        required : true,
      },
  totalAdvocates : {
    type : Number,
    required : true,
    },
    totalDocuments : {
        type : Number,
        required : true,
    },
    totalTeamMembers : {
        type : Number,
        required : true,
    },
    totalTodos : {
        type : Number,
        required : true,
  } 
})
const HomeModel = mongoose.model("homeMode", homeSchema)
module.exports = HomeModel

