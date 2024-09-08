const Listing = require('./models/Listing');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() || req.session.admin) {
        next();
    } else {
        req.session.redirectUrl = req.originalUrl;
        console.log("original path : " + req.originalUrl);
        console.log("req.path : " + req.path);
        req.flash('error', 'you are not logged in');
        res.redirect('/login');
    }
}

module.exports.isLoggedIn = isLoggedIn;

function saveRedirectedUrl(req, res, next) {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        next();
    } else {
        res.locals.redirectUrl = "/list";
        next();
    }
}

module.exports.saveRedirectedUrl = saveRedirectedUrl;

async function isListingOwner(req, res, next) {
    const listId = req.params.listId;
    const listing = await Listing.findById(listId);
    if (listing) {
        if (req.session.admin) {
            next();
        } else {
            if (listing.owner.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'you are not a owner of this listing');
                res.redirect(`/list/${listId}`);
            }
        }  

    } else {
        req.flash('error', 'No such listing is availble');
        res.redirect(`/list`);
    }
}

module.exports.isListingOwner = isListingOwner;