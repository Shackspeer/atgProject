const express = require("express")
const app = express();
const cors = require("cors") // to set cors-policy for accessibility
const port = 4444; 
const db = require("./dbConnecter");
const bodyParser = require("body-parser"); // to parse requests as json
app.use(cors());
app.use(bodyParser.json())



app.listen(port,()=>{
    console.log(`app listening on port ${port}`)
})





app.get("/logs",(req,res)=>{
    // to get all resource from database
    db.getUsers(res);
})



app.post("/update/:id",(req,res)=>{
    // to update single resource from database  
    db.updateCustomer(req,res)
})


app.get("/delete/:id",(req,res)=>{
    // to delete a resource from from database
    db.deleteUser(req,res)
})

app.post("/insert",(req,res)=>{
    // for insert a resource to database
    db.insertData(req,res)
})