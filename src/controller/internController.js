const internModel = require("../models/internModel")
const mongoose = require('mongoose')
const collegeModel = require("../models/collegeModel")

// --------------------------- Regex for email and mobile ---------------------

const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
//const mobileRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
const mobileRegex = /^[6-9]\d{9}$/



//
const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }
const objectValue = function (value) {
    if (typeof value === "undefined" || value === null || typeof value === Number) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


// -------------------------- CREATE Intern -----------------------------

const createIntern = async function (req, res) {
    try {
        const internData = req.body
        const { name, email, mobile, collegeName } = internData
        console.log(internData)

        if (Object.keys(internData).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Provide Data" })
        }

        if (!internData.name) {
            return res.status(400).send({ status: false, msg: "Please Provide Name" })
        }
        if (objectValue(internData.name)) {
            return res.status(400).send({ status: false, msg: "Please Provide valid Name" })
        }
        if (!internData.email) {
            console.log(internData.email)
            return res.status(400).send({ status: false, msg: "Please Provide email" })
        }
        if (!emailRegex.test(internData.email))
            return res.status(400).send({ status: false, message: "Please Enter Email in valid Format" })

        let duplicateEmail = await internModel.findOne({ email: internData.email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: `${internData.email} already exists!` });
        }
        if (!internData.mobile) {
            return res.status(400).send({ status: false, msg: "Please Provide Mobile No" })
        }
        if (!mobileRegex.test(internData.mobile)) {     //Error 
            return res.status(400).send({ status: false, msg: "Please Provide valid Mobile No" })
        }
        let duplicateMobile = await internModel.findOne({ mobile: internData.mobile });
        if (duplicateMobile) {
            return res.status(400).send({ status: false, msg: `${internData.mobile} already exists!` });
        }


        if (!internData.collegeName) {
            return res.status(400).send({ status: false, msg: "Please Provide college name" })

        }
        const collegeData = await collegeModel.findOne({ name: collegeName })
        if (!collegeData) {
            return res.status(400).send({ status: false, msg: "college data not found" })
        }
        const collegeId = collegeData._id // 
        const dataOfIntern = { name, email, mobile, collegeId } // restructuring of internData
        let savedData = await internModel.create(dataOfIntern)
        return res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports.createIntern = createIntern 