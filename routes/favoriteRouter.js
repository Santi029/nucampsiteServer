const express = require("express");
const Favorite = require("../models/favorites");
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
            Favorite.findOne({ user: req.user._id });
            res.end(
                `Will find the campsite: ${req.body.name} with description: ${req.body.description}`
            );
        }
    )
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

module.exports = favoriteRouter;
