const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Todo = mongoose.model('Task')

/* router.get("/",(req, res) =>{
    res.json('sample text');
}); */

router.get("/",(req,res) =>{
    res.render("todo/addOrEdit",{
        viewTitle : "Add your Task"
    })
})

router.post("/", (req, res) =>{
    //console.log(req.body);
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
})

function insertRecord(req,res){
    var todo = new Todo();
    todo.task = req.body.task;
    todo.description = req.body.description;
    todo.save((err, doc)=>{
        if(!err){
            res.redirect('todo/list');
        }
        else{
            if(err.name  == "ValidationError"){
                handleValidationError(err, req.body);
                res.render("todo/addOrEdit",{
                    viewTitle : "Add your Task",
                    todo : req.body
                })
            }
            console.log(err);
        }
    });
}

function updateRecord(req, res) {
    Todo.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('todo/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("todo/addOrEdit", {
                    viewTitle: 'Update Task',
                    todo: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/delete/:id', (req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/todo/list');
        }
        else { console.log( err); }
    });
});

router.get('/list',(req,res) =>{
    //res.json('sample text');
    Todo.find((err, docs) =>{
        if(!err){
            const context = {
                userTasks : docs.map(doc =>{
                    return{
                        task : doc.task,
                        description : doc.description,
                        _id : doc._id
                    }
                })
            }
            res.render("todo/list",{
                list : context.userTasks
            });            
        }
        else{
            console.log(err);
        }
    });
})

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'task':
                body['taskError'] = err.errors[field].message;
                break;            
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Todo.findById(req.params.id, (err, doc) => {
        if (!err) {
            const context = {
                userTask : {
                    task : doc.task,
                    description : doc.description,
                    _id : doc._id
                } 
            }    
            res.render("todo/addOrEdit", {
                viewTitle: "Update Task",
                todo : context.userTask
            });
        }
    });
});

module.exports = router