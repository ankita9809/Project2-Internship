const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")


//--------------------------- Regex for logo ---------------------------------------------------------------

const logoRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

// ---------------------- CREATE COLLEGE ---------------------

const createCollege = async function (req, res) {
    try {
        const data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Provide Data" })
        }

        if (!data.name||data.name.trim().length==0) {
            return res.status(400).send({ status: false, msg: "Please Provide Name" })
        }
        let duplicateName = await collegeModel.findOne({ name: data.name });
        if (duplicateName) {
            return res.status(400).send({ status: false, msg: "Name Already Exists..!" });
        }
        if (!data.fullName) {
            return res.status(400).send({ status: false, msg: "Please Provide fullName" })
        }
        if (!data.logoLink) {
            return res.status(400).send({ status: false, msg: "Please Provide logoLink" })
        }
        if (!logoRegex.test(data.logoLink)) {          //.png has to be validated
            return res.status(400).send({ status: false, msg: "Please Provide valid logoLink" })
        }
        let duplicatelogoLink = await collegeModel.findOne({ logoLink: data.logoLink });
        if (duplicatelogoLink) {
            return res.status(400).send({ status: false, msg: `${data.logoLink} already exists!` });
        }

        let savedData = await collegeModel.create(data)
        return res.status(201).send({ status: true, data:{name:savedData.name,fullName:savedData.fullName,logoLink:savedData.logoLink,isDeleted:savedData.isDeleted}})
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}

//------------------------------------------- GET Details ------------------------------------------------

const getCollegeDetails = async function (req, res) {
    try {

        const collegeName = req.query.name
        if (!collegeName) return res.status(400).send({ status: false, msg: "college name is required" })
        const allData = await collegeModel.findOne({ name:collegeName}).select({name:1,fullName:1,logoLink:1})
        if (!allData) return res.status(400).send({ status: false, msg: "college does not exist" })
        const interns = await internModel.find({ collegeId: allData._id, isDeleted: false }, { name: 1, email: 1, mobile: 1 })
        if (!interns) return res.status(400).send({ status: false, msg: "interns not found or already deleted" })

        res.status(200).send({ status: true, data: { name: allData.name, fullName: allData.fullName, logoLink: allData.logoLink, interns: interns } })


    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}

// -------------------------- GET COLLEGE ---------------------------------------------------------------

const getDetails = async function(req, res){
    try{
        const allData = await collegeModel.find()
        res.status(200).send({status: false, data: allData})
    } catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}



module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails
