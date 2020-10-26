// Imports
var models = require('../models');
var asyncLib = require('async');

// Routes
module.exports = {
    addEstablishment: function (req, res) {
        var idUser = parseInt(req.body.idUser)
        var name = req.body.name
        var address = req.body.address
        var town = req.body.town
        var zipCode = parseInt(req.body.zipCode)
        var country = req.body.country

        asyncLib.waterfall([
            function (done) {
                models.Establishment.findOne({
                    attributes: ['name'],
                    where: { name: name }
                })
                    .then(function (establishmentFound) {
                        done(null, establishmentFound)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify establishment' })
                    });
            },
            function (establishmentFound, done) {
                if (!establishmentFound) {
                    done(null, establishmentFound)
                } else {
                    return res.status(409).json({ 'error': 'establishment already exist' });
                }
            },
            function (establishmentFound, done) {
                var newEstablishment = models.Establishment.create({
                    UserId: idUser,
                    name: name,
                    address: address,
                    town: town,
                    zipCode: zipCode,
                    country: country,
                })
                    .then(function (newEstablishment) {
                        done(newEstablishment)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add establishment' })
                    });
            }
        ], function (newEstablishment) {
            if (newEstablishment) {
                return res.status(201).json({
                    'establishmentId': newEstablishment.id,
                    'establishmentName': newEstablishment.name
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add establishment' })
            }
        })
    },
    getAllEstablishments: function (req, res) {
        models.Establishment.findAll()
            .then(function (establishments) {
                if (establishments) {
                    res.status(201).json(establishments)
                } else {
                    return res.status(400).json({ 'error': 'cannot found establishments' })
                }
            })
            .catch(function (err) {
                res.status(500).json({ 'error': 'cannot fetch establishments' })
            })
    }
}