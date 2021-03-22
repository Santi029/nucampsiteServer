const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const config = require("./config.js");
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("JWT payload:", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    })
);

// Option 1
// exports.jwtPassport = passport.use(
//     new verifyAdmin(opts, (jwt_payload, done) => {
//         console.log("JWT payload:", jwt_payload);
//             if (err) {
//                 return done(err, false);
//             } else if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//             }
//     })
// );

// Option 2
// exports.verifyUser = function(req, res, next) {
//     const admin = true;
//     if (admin) {
//         return true;
//     } else (user) {
//         return false;
//     }
// };

// Option 3
// exports.verifyUser = function(req, res, next) {
//     user.verifyAdmin(req.user.admin)
//     if (err) {
//         return  res.status(err.status || 403), 'You are not authorized to perform this operation!';
//     } else (user) {
//         return next();
//     }
// };

// Option 4
exports.verifyAdmin = function authorizeUsersAccess(req, res, next) {
    if (req.query.admin === "true") {
        req.admin = true;
        next();
    } else {
        return (
            res.status(err.status || 403),
            res.send("You are not authorized to perform this operation!")
        );
    }
};

exports.verifyUser = passport.authenticate("jwt", { session: false });
exports.verifyAdmin = passport.authenticate("jwt", { session: false });
