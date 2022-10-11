const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const multer  = require('multer')
const fs = require('fs');




//Mongoose Connection
const DB = "mongodb+srv://Shubham:Shubh165!@cluster0.ptpsp.mongodb.net/?retryWrites=true&w=majority"
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
    password : String,
    img : {
        data : Buffer,
        contentType : String,
    }
});


const User = mongoose.model("User", UserSchema);





const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;




const Storage = multer.diskStorage({
    destination: (req, file, cb) =>{
          cb(null, 'uploads' );
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  
const upload = multer({ 
    storage: Storage 
}).single('img');




//CREATE 
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/create', (req, res) => {
    res.render('index');
});

app.post('/create', upload , (req, res) => {
    // const name = req.body.name;
    // const username = req.body.username;
    // const password = req.body.password;
    // const phone = req.body.phone;
    // console.log(req.body);

    const newUser = new User({
        name : req.body.name,
        username : req.body.username,
        password : req.body.password,
        phone : req.body.number,
        img :{
            data : fs.readFileSync('uploads/' + req.file.filename),
            contentType : 'image/png'
        }
    });

    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){
            res.render('UserSuccess',{
                userName : req.body.username,
                userStatus : "  is already Registered  with our College"
            }
            );
            //    res.send("USER already exists with username " + req.body.username );
           }
           else{
               newUser.save(function (err){
                   if(!err){
                    //    res.send(`User ${newUser} added to the database`) ;
                    res.render('UserSuccess',{
                        userName : req.body.username,
                        userStatus : "  is now Registered  with our College"
                    }
                    );
                   }else{
                    //    res.send(err);
                    res.render('UserFailure');
                   }
               });
           }
        }else{
            res.render('UserFailure');
            // res.send(err);
        }
    });

})








//READ
app.get("/find",(req, res) => {
    res.render("search");
});

app.get("/show",(req, res) => {
    (User).find({}, (err, foundAll) => {
        if(err){
        console.log(err)
        }else{
            // res.send(foundAll);
        res.render("show", { allUsers : foundAll})
        }
       })
    // res.render("show");
});



app.post("/find",  function(req, res){
    // console.log(req.body);
    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){      
            //    res.contentType(founduser.img.contentType);      
            //    res.send(founduser.img.data);
            res.render('indDisplay' , {
                userName : founduser.username,
                Name : founduser.name,
                phoneNumber : founduser.phone,
            });
           }
           else{
            //    res.send("No matching User Found");
            res.render('UserSuccess',{
                userName : req.body.username,
                userStatus : "  is not Registered  with our College"
            }
            );
           }
        }else{
            res.send(err);
        }
    });
});


//Image Finding Methods

app.get("/image/:username", function(req, res){
    User.findOne({username : req.params.username} , function(err,founduser){
        if(!err){     
            res.contentType(founduser.img.contentType);      
            res.send(founduser.img.data);
        }
    });
});



//Delete
app.get("/delete",(req, res) => {
    res.render("delete");
});
app.post("/deleteCheck",(req, res) => {
    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){      
            //    res.contentType(founduser.img.contentType);      
            //    res.send(founduser.img.data);
            res.render('indDisplay' , {
                userName : founduser.username,
                Name : founduser.name,
                phoneNumber : founduser.phone,
            });
           }
           else{
            //    res.send("No matching User Found");
            res.render('UserSuccess',{
                userName : req.body.username,
                userStatus : "  is not Registered  with our College"
            }
            );
           }
        }else{
            res.send(err);
        }
    });
})

app.post("/delete/:username", function(req, res){
    const userN = req.params.username;
    User.deleteOne({username : req.params.username} , function(err,founduser){
        if(!err){
           if(founduser){

            res.render('UserSuccess2',{
                userName : userN,
                userStatus : "  is now Removed from our College Database."
            }
            );
                // res.send(`${userN} deleted from the database`) ;
           }
           else{
            res.render('UserSuccess',{
                userName : userN,
                userStatus : "  is not Registered  with our College"
            }
            );
           }
        }else{
            res.send(err);
        }
    } )
});








//UPDATE
app.get("/update" , (req, res) => {
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

app.post("/update", upload ,  (req, res)=>{
    // console.log(req.body);

    User.findOne({username : req.body.username} , function(err,founduser){
        if(!err){
           if(founduser){      
            //    res.contentType(founduser.img.contentType);      
            //    res.send(founduser.img.data);
                   User.updateOne(
                    {username : req.body.username},
                    {$set : req.body},
        
                    function(err){
                        if(!err){
                            res.render('UserSuccess',{
                                userName : req.body.username,
                                userStatus : "  Profile in now Updated. "
                            }
                            );
                        }else{
                            res.render('UserSuccess',{
                                userName : req.body.username,
                                userStatus : "  Profile cannot be updated because of Invalid Data."
                            }
                            );
                        }
                    })
           }
           else{
            //    res.send("No matching User Found");
            res.render('UserSuccess',{
                userName : req.body.username,
                userStatus : "  is not Registered  with our College"
            }
            );
           }
        }else{
            res.send(err);
        }
    });

})




app.listen(PORT, function() {
    console.log("Server started on port 3000");
  });
