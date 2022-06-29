const collegeModel = require("../models/collegeModel")

//--------------------------- Regex 

const logoRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/ 

// ---------------------- CREATE COLLEGE ---------------------
 
const createCollege = async function(req,res){
  try{
      const data = req.body
      
    if(Object.keys(data).length == 0){
        return res.status(400).send({status: false, msg: "Please Provide Data"})
      }

    if(!data.name){
        return res.status(400).send({status: false, msg: "Please Provide Name"})
    }
    let duplicateName = await collegeModel.findOne({ name: data.name });
        if (duplicateName) {
            return res.status(400).send({ status: false, msg: "Name Already Exists..!" });
        }
    if(!data.fullName){
        return res.status(400).send({status: false, msg: "Please Provide fullName"})
    }
    if(!data.logoLink){
        return res.status(400).send({status: false, msg: "Please Provide logoLink"})
    }
    if(!logoRegex.test(data.logoLink)){          //.png has to be validated
        return res.status(400).send({status: false, msg: "Please Provide valid logoLink"})
    }
    let duplicatelogoLink = await collegeModel.findOne({ logoLink: data.logoLink });
        if (duplicatelogoLink) {
            return res.status(400).send({ status: false, msg: `${data.logoLink} already exists!` });
        }
    
    let savedData = await collegeModel.create(data)
    return res.status(201).send({status:true,data:savedData})
}
catch(err){
    return res.status(500).send({status:false,msg:err.message})

}
}



module.exports.createCollege = createCollege