const mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    task :{
        type:"String",
        required : "This field is mandatory"
    },
    "description" :{
        type : "String"
    }
});

mongoose.model('Task', todoSchema);