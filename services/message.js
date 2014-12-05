/**
 * Handle the message endpoints
 * @module services/message
 */

var Message = require('./../models/message');
var networkUtils = require('./../utils/network');

/***
 * Parse the request and save the message on the DB
 * @param req {object} Express req
 * @param res {object} Express res
 * @param next {object} Express next
 */
module.exports.createMessage = function(req, res, next) {
    var message = new Message();
    var userMessage = req.param('message');
    var longitude = parseFloat(req.param('longitude'));
    var latitude = parseFloat(req.param('latitude'));
    if (req.user && userMessage && latitude && longitude && (typeof latitude === "number") && (typeof longitude === "number")){
        message.message = userMessage;
        message.location.coordinates.push(longitude);
        message.location.coordinates.push(latitude);
        var user = req.user;
        message.userSocialNetwork = user.socialNetwork;
        message.userDisplayName = user.name;
        message.userSocialNetworkId = user.id;
        message.user = user._id;
        message.ip = networkUtils.getIpAddress(req);
        if (req.param('country')){
            message.country = req.param('country');
        }
        if (req.param('countryCode')){
            message.countryCode = req.param('countryCode');
        }
        if (req.param('city')){
            message.city = req.param('city');
        }
        message.save(function (error, result, numberAffected) {
            if (error){
                console.log(error);
                res.sendStatus(500);
            }else {
                res.status(201).json(result);
            }
        });
    }else {
        res.status(400).send('Bad Request, missing parameters');
    }
};

module.exports.getMessages = function(req, res, next) {
    Message.find().sort({ "created":-1}).limit(200).exec( function(error, results){
        if (error){
            console.log(error);
            res.sendStatus(500);
        }
        res.status(200).json(results || []);
    });    
};


module.exports.getMessageById = function(req, res, next) {
    Message.findById(req.params.id, function(error, result){
        if (error){
            console.log(error);
            res.sendStatus(500);
        }
        res.status(200).json(result || {});
    });    
};