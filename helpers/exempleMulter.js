// const multerStorage = multer.diskStorage({
//     destination: (req, file, cbk) => {
//         cbk(null, 'public/avatars');
//     },
//     filename: (req, file, cbk) => {
//         const extension = file.mimetype.split('/')[1];

//         cbk(null, `${req.user.id}-${uuid()}.${extension}`);
//     }
// });
// const multerFilter = (req, file, cbk) => {

//     if(file.mimetype.startsWith('image/')) {
//         cbk(null, true);
//     } else {
//         cbk(new AppError(400, 'Expects image file type..', false));
//     }
// };

// const uploadUserAvatar = multer({
//         storage: multerStorage,
//         fileFilter: multerFilter,
//         limits: {
//             fileSize: 2 * 1024 * 1024,
//         },
//     }).single('avatar');