import { randomUUID } from 'crypto';
import multer from 'multer';
import { tmpdir } from 'os';
import { allowFormat, fileFilter } from './mulet.validation.js';

export const storageTypes = {
    memory: "memory",
    disk: "disk",
};

export function fileUpload(type = storageTypes.memory, allowFormats = allowFormat.img, filezise = 5) {
    const storage =
        type === storageTypes.memory
            ? multer.memoryStorage()
            : multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, tmpdir());
                },
                filename: function (req, file, cb) {
                    cb(null, `${randomUUID()}-${file.originalname}`);
                },
            });

    return multer({ storage, fileFilter: fileFilter(allowFormats), limits: { fileSize: filezise * 1024 * 1024 } });
}

