// class AppError extends Error {
//     constructor(status, message) {
//         super(message);
//         this.status = status;
//     }
// };

// module.exports = AppError;

// const ctrlWrapper = ctrl => {
//     const func = async (req, res, next) => {
//         try {
//             await ctrl(req, res, next);
//         } catch (error) {
//             next(error);
//         }
//     };
//     return func;
// }

// module.exports = ctrlWrapper;