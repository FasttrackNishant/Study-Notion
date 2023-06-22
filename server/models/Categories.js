const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({

    name:
    {
        type: String,
        require: true,
    },
    description:
    {
        type: String,
    },
    Course:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }
})

module.exports = mongoose.model("Tag", tagSchema);