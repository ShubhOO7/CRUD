const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');



//Mongoose Connection
const DB = "mongodb+srv://Shubham:Shubh165!@cluster0.ggqzc.mongodb.net/NodeExpress?retryWrites=true&w=majority"
mongoose.connect(DB,{ 
    useNewUrlParser : true  , 
    useUnifiedTopology : true
}).then(()=>{
    console.log("Connection successful");
}).catch((err)=>{
    console.log("Connection error: " + err);
})


const UserSchema = new mongoose.Schema({
    username : {
        type  : String,
        unique: true
    },
    name : String,
    phone : Number,
    password : String
});


const User = mongoose.model("User", UserSchema);





const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;









//CREATE 
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    // const name = req.body.name;
    // const username = req.body.username;
    // const password = req.body.password;
    // const phone = req.body.phone;

    const newUser = new User({
        name : req.body.name,
        username : req.body.username,
        password : req.body.password,
        phone : req.body.number
    });

    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){
               res.send("USER already exists with username " + req.body.username );
           }
           else{
               newUser.save(function (err){
                   if(!err){
                       res.send(`User ${newUser} added to the database`) ;
                   }else{
                       res.send(err);
                   }
               });
           }
        }else{
            res.send(err);
        }
    });

})








//READ
app.get("/find",(req, res) => {
    res.render("search");
});


app.post("/find", function(req, res){
    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){
               res.send(founduser);
           }
           else{
               res.send("No matching User Found");
           }
        }else{
            res.send(err);
        }
    });
});






//Delete
app.get("/delete",(req, res) => {
    res.render("delete");
});


app.post("/delete", function(req, res){
    const userN = req.body.username;
    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){
                User.deleteOne({username : req.body.username} , function(err,founduser){
                    if(!err){
                       if(founduser){
                            res.send(`${userN} deleted from the database`) ;
                       }
                       else{
                           res.send("No matching User Found with username " + userN);
                       }
                    }else{
                        res.send(err);
                    }
                } )
           }
           else{
               res.send("No matching User Found with username " + userN);
           }
        }else{
            res.send(err);
        }
    });
    
});








//UPDATE
app.get("/update",(req, res) => {
    res.render("update");
});
// app.post("/updatecheck", function(req, res){
//     User.findOne({username : req.body.username} , function(err,founduser){
//         if(!err){
//            if(founduser){
//                res.render("update");
//            }
//            else{
//                res.send("No matching User Found");
//            }
//         }else{
//             res.send(err);
//         }
//     } )
// });

app.post("/update", (req, res)=>{
    console.log("update founduser ");
    
    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){
                 User.updateOne(
                    {username : req.body.username},
                    {$set : req.body},
        
                    function(err){
                        if(!err){
                            console.log("Succesfully Updated");
                            res.send("Succesfuly updated")
                        }else{
                        console.log(err);
                            res.send(err);
                        }
                    })
           }
           else{
            res.send("No matching User Found with username " + req.body.username);
           }
        }else{
            res.send(err);
        }
    });
})


app.route("/:username")
.get(
    function(req, res){
        res.send("hello");
        console.log("hello");
    }
)




app.listen(PORT, function() {
    console.log("Server started on port 3000");
  });
