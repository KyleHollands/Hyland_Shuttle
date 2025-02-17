// This file contains the code that wraps the async function in a try-catch block to catch any errors that may occur during the execution of the function.
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}