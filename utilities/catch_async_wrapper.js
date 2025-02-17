// ====================
// This is a function to wrap async functions in a try/catch block to catch any errors that may occur.
// ====================

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}