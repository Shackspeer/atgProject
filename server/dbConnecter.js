
const mysql = require("mysql")
const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "emreukbe55",
    database : "ATG"
})
con.connect();



const insertData = async (req,res) =>{
  const {LanguageCode,PageName,ResourceCode,Resource} = req.body;
  let isExist = await new Promise(resolve=>{
    con.query(`select * from ATG_project where LanguageCode = '${LanguageCode}' and PageName = '${PageName}' and ResourceCode = '${ResourceCode}'`,(err,resp)=>{
      if(err) resolve(false)
      else{
        if(resp.length > 0) resolve(true)
        else{
          resolve(false)
        }
      }
    })
  })




  if(!isExist){
    con.query(`insert into ATG_project(LanguageCode,PageName,ResourceCode,Resource) values('${LanguageCode}','${PageName}','${ResourceCode}','${Resource}')`,(err,resp)=>{
      if(err) res.send({inserted : false})
      else{
        res.send({inserted : true})
      }
    })
  }
  else{
    let isDelete = await new Promise(resolve=>{
      con.query(`delete from ATG_project where LanguageCode = '${LanguageCode}' and PageName = '${PageName}' and ResourceCode = '${ResourceCode}'`,(err,resp)=>{
        if(err) resolve(false)
        else{
          resolve(true)
        }
      })
    })

    if(isDelete){
      con.query(`insert into ATG_project(LanguageCode,PageName,ResourceCode,Resource) values('${LanguageCode}','${PageName}','${ResourceCode}','${Resource}')`,(err,resp)=>{
        if(err) res.send({inserted : false})
        else{
          res.send({inserted : true})
        }
      })
    }
  }





  
}


 
const updateCustomer = async (req,res) =>{

  const { LanguageCode,PageName,ResourceCode,Resource} = req.body

  
  const id = req.params.id


  const state = await new Promise((resolve) => {
    // Gönderilen verileri bir obje içerisine toplayın
    const data = {
      LanguageCode: LanguageCode,
      PageName: PageName,
      ResourceCode: ResourceCode,
      Resource: Resource,
    };
  
    // Sadece tanımlı olan değişkenleri sorguya ekleyin
    let query = "update ATG_project set ";
    const fields = [];
  
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== undefined) {
        fields.push(`${key} = '${data[key]}'`);
      }
    }
  
    if (fields.length === 0) {
      // Gönderilen hiçbir veri yoksa hata kodu döndürün
      resolve(304);
      return;
    }
  
    query += fields.join(", ");
    query += ` where id = ${id}`
    console.log(query)
    con.query(query, (err, resp) => {
      if (err) resolve(304);
      else {
        resolve(204);
      }
    });
  });


  state === 204 ? res.send({updateState : true}) : res.send({updateState : false,errorCode : state})
 



  
}
const getUsers = (res) =>{
  con.query("select * from ATG_project",(err,resp)=>{
    if(err) throw err
    res.send(resp)
  })
}
const deleteUser = (req,res) =>{
  const id = req.params.id;


  con.query(`delete from ATG_Project where id = ${id}`,(err,resp)=>{
    if(err) res.send({deleted : false})
    else if(resp.affectedRows > 0) res.send({deleted:true})
    else res.send({deleted:false})
  })
}




module.exports = {
  getUsers,
  updateCustomer,
  deleteUser,
  insertData,

}