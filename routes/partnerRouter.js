const express = require("express");
const partner = require("../models/partner");
const authenticate = require("../authenticate");

const partnerRouter = express.Router();

partnerRouter
    .route("/")
    .get((req, res, next) => {
        partner
            .find()
            .then((partners) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(partners);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        partner
            .create(req.body)
            .then((partner) => {
                console.log("partner Created ", partner);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(partner);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /partners");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        partner
            .deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
            })
            .catch((err) => next(err));
    });

partnerRouter
    .route("/:partnerId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {
        res.end(`Will send all info for ${req.params.partnerId} to you`);
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.end(
            `Will add the partner: ${req.body.name} with description: ${req.body.description}`
        );
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
            `The partner: ${req.params.partnerId} information has been upload`
        );
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        res.end(`Deleting ${req.params.partnerId} partners`);
    });

partnerRouter
    .route("/:partnerId/comments")
    .get((req, res, next) => {
        partner
            .findById(req.params.partnerId)
            .then((partner) => {
                if (partner) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(partner.comments);
                } else {
                    err = new Error(
                        `partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        partner
            .findById(req.params.partnerId)
            .then((partner) => {
                if (partner) {
                    partner.comments.push(req.body);
                    partner
                        .save()
                        .then((partner) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(partner);
                        })
                        .catch((err) => next(err));
                } else {
                    err = new Error(
                        `partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(
            `PUT operation not supported on /partners/${req.params.partnerId}/comments`
        );
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        partner
            .findById(req.params.partnerId)
            .then((partner) => {
                if (partner) {
                    for (let i = partner.comments.length - 1; i >= 0; i--) {
                        partner.comments.id(partner.comments[i]._id).remove();
                    }
                    partner
                        .save()
                        .then((partner) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(partner);
                        })
                        .catch((err) => next(err));
                } else {
                    err = new Error(
                        `partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

partnerRouter
    .route("/:partnerId/comments/:commentId")
    .get((req, res, next) => {
        partner
            .findById(req.params.partnerId)
            .then((partner) => {
                if (partner && partner.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(partner.comments.id(req.params.commentId));
                } else if (!partner) {
                    err = new Error(
                        `partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(
                        `Comment ${req.params.commentId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(
            `POST operation not supported on /partners/${req.params.partnerId}/comments/${req.params.commentId}`
        );
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        partner
            .findById(req.params.partnerId)
            .then((partner) => {
                if (partner && partner.comments.id(req.params.commentId)) {
                    if (req.body.rating) {
                        partner.comments.id(req.params.commentId).rating =
                            req.body.rating;
                    }
                    if (req.body.text) {
                        partner.comments.id(req.params.commentId).text =
                            req.body.text;
                    }
                    partner
                        .save()
                        .then((partner) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(partner);
                        })
                        .catch((err) => next(err));
                } else if (!partner) {
                    err = new Error(
                        `partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(
                        `Comment ${req.params.commentId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        partner
            .findById(req.params.partnerId)
            .then((partner) => {
                if (partner && partner.comments.id(req.params.commentId)) {
                    partner.comments.id(req.params.commentId).remove();
                    partner
                        .save()
                        .then((partner) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(partner);
                        })
                        .catch((err) => next(err));
                } else if (!partner) {
                    err = new Error(
                        `partner ${req.params.partnerId} not found`
                    );
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(
                        `Comment ${req.params.commentId} not found`
                    );
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

module.exports = partnerRouter;
