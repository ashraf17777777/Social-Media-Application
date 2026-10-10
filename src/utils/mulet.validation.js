import multer from "multer";

/**
 * Allowed file formats
 */
export const allowFormat = {
    img: [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/x-png"
    ],

    video: [
        "video/mp4",
        "video/ogg",
        "video/webm"
    ],

    pdf: [
        "application/pdf"
    ],
};

/**
 * Multer file filter factory
 */
export function fileFilter(allowedMimeTypes = []) {

    return (req, file, cb) => {
        const isAllowed = allowedMimeTypes.includes(file.mimetype);

        if (!isAllowed) {
            return cb(new Error("File type not allowed"), false);
        }

        cb(null, true);
    };
}
