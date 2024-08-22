const mongoose = require("mongoose")
const todoSchema = new mongoose.Schema({
  allTodos : [{
    all : {
        type : String,
        required : false
    },
    pending : {
        type : String,
        required : false
    },
    upcoming : {
        type : String,
        required : false
    },
    completed : {
        type : String,
        required : false
    }
  }]
})
const TodoModel = mongoose.model("todoModel", todoSchema)
module.exports = TodoModel

