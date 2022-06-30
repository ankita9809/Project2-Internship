const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")


//--------------------------- Regex for logo ----------------- 

const logoRegex = /(ftp|http|https|):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
const nameRegex = /^[a-zA-Z]{1,20}$/

//-------------------------- Validation ------------------------
const objectValue = function (value) {
    if (typeof value === undefined || value === null ) return false    //|| typeof value === Number
    if (typeof value === "string" && value.trim().length === 0) return false
    if(typeof value === "Number") return false
    return true
}

// ---------------------- CREATE COLLEGE ---------------------

const createCollege = async function (req, res) {
    try {
        
        // const paramsData = req.params            //Error
        // if(paramsData){
        //     return res.status(400).send({ status: false, msg: "Invalid Request, you can't provide data in query params."})
        // }

        const data = req.body
        data.name = data.name.trim()
       
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Provide Data" })
        }
        if (!data.name) {       //|| data.name.trim().length == 0
            return res.status(400).send({ status: false, msg: "Please Provide Name" })
        }
        
        const duplicateName = await collegeModel.findOne({ name: data.name });
        if (duplicateName) {
            return res.status(400).send({ status: false, msg: "Name Already Exists..!" });
        }
        // data.name = data.name.trim()
        if (!nameRegex.test(data.name)) {
            return res.status(400).send({ status: false, msg: "Please Provide correct input for name" })
        }
        if (!data.fullName) {
            return res.status(400).send({ status: false, msg: "Please Provide fullName" })
        }
        if (!data.logoLink) {
            return res.status(400).send({ status: false, msg: "Please Provide logoLink" })
        }
        if (!logoRegex.test(data.logoLink)) {
            return res.status(400).send({ status: false, msg: "Please Provide valid logoLink" })
        }
        let duplicatelogoLink = await collegeModel.findOne({ logoLink: data.logoLink });
        if (duplicatelogoLink) {
            return res.status(400).send({ status: false, msg: `Logo Link already exists!` });
        }
        let savedData = await collegeModel.create(data)
        return res.status(201).send({
            status: true,
            data: {
                name: savedData.name,
                fullName: savedData.fullName,
                logoLink: savedData.logoLink,
                isDeleted: savedData.isDeleted
            }
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}

//------------------------------------------- GET Details ------------------------------------------------

const getCollegeDetails = async function (req, res) {
    try {

        const collegeName = req.query.collegeName
        if (!collegeName)
            return res.status(400).send({ status: false, msg: "college name is required" })

        const allData = await collegeModel.findOne({ name: collegeName }).select({ name: 1, fullName: 1, logoLink: 1 })
        if (!allData)
            return res.status(400).send({ status: false, msg: "college does not exist" })

        const interns = await internModel.find({ collegeId: allData._id, isDeleted: false }, { name: 1, email: 1, mobile: 1 })
        if (!interns)
            return res.status(400).send({ status: false, msg: "interns not found or already deleted" })

        res.status(200).send({
            status: true,
            data: {
                name: allData.name,
                fullName: allData.fullName,
                logoLink: allData.logoLink,
                interns: interns
            }
        })


    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}




module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails