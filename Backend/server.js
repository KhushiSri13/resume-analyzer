require("dotenv").config()
const app = require("../Backend/src/app")
const connectToDB = require("../Backend/src/config/database")
// const invokeGeminiAi = require("./src/services/ai.services")

// const {resume, selfDescription, jobDescription} = require("./src/services/temp")

// const {generateInterviewReport} = require("./src/services/ai.services")

connectToDB()

// invokeGeminiAi()

// generateInterviewReport(resume, selfDescription, jobDescription)

app.listen(3000, () =>{
    console.log("server is running")
})