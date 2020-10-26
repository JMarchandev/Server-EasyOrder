// Imports
var models = require('../models');
var asyncLib = require('async');

// Const

// Routes
module.exports = {
    newMenu: function (req, res) {
        var idEstablishment = req.body.idEstablishment;
        var products = JSON.stringify(req.body.products);
        var name = req.body.name;

        if (idEstablishment == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }
        
        asyncLib.waterfall([
            function (done) {
                var newMenu = models.Menu.create({
                    idEstablishment: idEstablishment,
                    products: products,
                    name: name
                })
                    .then(function (newMenu) {
                        done(newMenu)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add menu' })
                    });
            }
        ], function (newMenu) {
            if (newMenu) {
                return res.status(201).json({
                    'menuId': newMenu.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add menu' })
            }
        })
    }
}