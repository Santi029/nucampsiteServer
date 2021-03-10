const express = require("express");
const campsiteRouter = express.Router();

campsiteRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        res.end("Will send all the campsites to you");
    })
    .post((req, res) => {
        res.end(
            `Will add the campsite: ${req.body.name} with description: ${req.body.description}`
        );
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /campsites");
    })
    .delete((req, res) => {
        res.end("Deleting all campsites");
    });

campsiteRouter
    .route("/:campsiteId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        res.end(`Will send all info for ${req.params.campsiteId} to you`);
    })
    .post((req, res) => {
        res.end(
            `Will add the campsite: ${req.body.name} with description: ${req.body.description}`
        );
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end(
            `The campsite: ${req.params.campsiteId} information has been upload`
        );
    })
    .delete((req, res) => {
        res.end(`Deleting ${req.params.campsiteId} campsites`);
    });

module.exports = campsiteRouter;
