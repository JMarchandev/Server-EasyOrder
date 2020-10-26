// Imports
var models = require('../models');
var asyncLib = require('async');

// Routes
module.exports = {
    addProduct: function (req, res) {
        var name = req.body.name;
        var description = req.body.description;
        var mark = req.body.mark;
        var size = parseInt(req.body.size);
        var region = req.body.region;
        var country = req.body.country;
        var isAlcohol = req.body.isAlcohol;
        var category = req.body.category;


        if (name == null || size == null || category == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        asyncLib.waterfall([
            /*function (done) {
                models.Product.findOne({
                    attributes: ['name'],
                    where: { name: name }
                })
                    .then(function (productFound) {
                        done(null, productFound)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify products' })
                    });
            },
            function (productFound, done) {
                if (!productFound) {
                    done(null, productFound)
                } else {
                    return res.status(409).json({ 'error': 'product is already exist ' });
                }
            },*/
            function (/*productFound, */done) {
                var newProduct = models.Product.create({
                    name: name,
                    description: description,
                    mark: mark,
                    size: size,
                    region: region,
                    country: country,
                    isAlcohol: isAlcohol,
                    category: category,
                })
                    .then(function (newProduct) {
                        done(newProduct)
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add product' })
                    });
            }
        ], function (newProduct) {
            if (newProduct) {
                return res.status(201).json({
                    'productId': newProduct.id,
                    'productName': newProduct.name
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add product' })
            }
        })
    },
    getAllProducts: function (req, res) {
        models.Product.findAll({
            attributes: [
                "id",
                "name",
                "description",
                "mark",
                "size",
                "region",
                "country",
                "isAlcohol",
                "category",
                "createdAt",
                "updatedAt",
            ]
        })
            .then(function (list) {
                if (list) {
                    res.status(201).json(list)
                } else {
                    return res.status(400).json({ 'error': 'cannot found products' })
                }
            })
            .catch(function (err) {
                res.status(500).json({ 'error': 'cannot fetch products' })
            })
    }
}
