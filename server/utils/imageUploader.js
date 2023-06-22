const cloudinary = require('cloudinary');


exports.uploadImageToCloudinary = async (file, folder, height, quality) =>
{
    const options = { folder };

    //ye option mein set kar dega data ko

    if (height) {
        options.height = height;
    }

    if (quality) {
        options.quality = height;
    }

    //ye auto detecht karlega source ka type kya hain
    options.resource_type = "auto";

    return await cloudinary.uploder(file.tempFilePath, options);
}