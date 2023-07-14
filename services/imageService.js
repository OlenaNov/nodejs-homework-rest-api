const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const AppError = require('../helpers/appError');

class ImageService {
    static upload(name) {
        const multerStorage = multer.memoryStorage();

        const multerFilter = (req, file, cbk) => {
            if(file.mimetype.startsWith('image/')) {
                cbk(null, true);
            } else {
                cbk(new AppError(400, 'Expects image file type..', false));
            };
        };

        return multer({
            storage: multerStorage,
            fileFilter: multerFilter
        }).single(name);
    };

    static async save(file, options, ...pathSegments) {
        const fileName = `${uuid()}.jpeg`;
        const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);
        
        await fse.ensureDir(fullFilePath);
        await sharp(file.buffer)
            .resize(options || { height: 250, width: 250 })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(fullFilePath, fileName));

        return path.join(...pathSegments, fileName);
    };
};

module.exports = ImageService;

/* OPTIONAL Jimp example
const avatar = await jimp.read(file.buffer);
await avatar
  .cover(options.width || 500, options.height || 500)
  .quality(90)
  .writeAsync(path.join(fullFilePath, fileName));
*/