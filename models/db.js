const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todoDB', { useNewUrlParser : true },
(err) => {
    if(!err){
        console.log("Connection established");
    }
    else{
        console.log("Error in connection : " + err);
    }
})

require('./todo.model');