const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("User")
            .populate("Campsite")
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
            });
        // .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Favorite.create(req.body)
                .then((favorite) => {
                    console.log("favorite Created ", favorite);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                .catch((err) => next(err));
        }
    )
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403;
            res.end("PUT operation not supported on /favorites");
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Favorite.findOneAndDelete({ user: req.user._id })
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(response);
                })
                .catch((err) => next(err));
        }
    );

favoriteRouter
    .route("/:campsiteId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites`);
    })
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            Favorite.findOne({ favorite });
            res.end(
                `Will find the campsite: ${req.body.name} with description: ${req.body.description}`
            );
        }
    )

    //  POST to /favorites/:campsiteId: When the user performs a POST operation on '/favorites/:campsiteId', use findOne to locate the favorites document for the user. Then you will add the campsite specified in the URL parameter to the favorites.campsites array, if it's not already there. If the campsite is already in the array, then respond with a message saying "That campsite is already in the list of favorites!" If the user has not previously defined any favorites, then you will need to create a new Favorite document for this user and add the campsite to it. Note: As a bonus challenge, you could add error checking to make sure that the campsiteId in the URL parameter corresponds to a valid campsite, but it is not required for this assignment.

    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            res.statusCode = 403;
            res.end(`PUT operation not supported on /favorites`);
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            res.end(`Deleting ${req.params.campsiteId} campsite`);
        }
    );

// DELETE to /favorites/:campsiteId: When the user performs a DELETE operation on '/favorites/:campsiteId', use findOne to find the favorites document for the user.
// If it exists, delete the campsite in the URL parameter req.params.campsiteId from its campsites array. There are multiple ways to approach this. Because you are deleting an element from an array and not a single document, you can not use the findOneAndDelete method. Instead, you could use a combination of indexOf and splice methods on the favorite.campsites array to remove the specified campsite. Alternatively, you could use the filter array method. Afterward, save the document then return a response with a status code of 200, a Content-Type header of 'application/json', and the favorite document.
// If no favorite document exists, return a response with a Content-Type header of 'text/plain' and a message that there are no favorites to delete.

module.exports = favoriteRouter;
