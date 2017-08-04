module.exports = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.json({ error: 'Permission denied'});
    }
}