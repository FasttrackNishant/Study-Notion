const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        courseID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        completedVideo:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subsection",
                }
            ]
    }

);
module.exports = mongoose.model("courseProgress", courseProgress);  