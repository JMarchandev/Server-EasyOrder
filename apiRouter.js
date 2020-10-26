// Imports
var express = require('express');
var usersController = require('./routes/usersController');

// Const
const establishmentsController = require('./routes/establishmentsController');
const productsController = require('./routes/productsController');
const menusController = require('./routes/menusController');

// Router
exports.router = (function() {
    var apiRouter = express.Router();

    // User Route
    apiRouter.route('/users/register/').post(usersController.register);
    apiRouter.route('/users/login/').post(usersController.login);
    apiRouter.route('/users/list/').get(usersController.getAllUserProfile)
    apiRouter.route('/users/me/').get(usersController.getUserProfile);
    apiRouter.route('/users/me/').put(usersController.updateUserProfile);

    // Establishment Route
    apiRouter.route('/shop/add/').post(establishmentsController.addEstablishment);
    apiRouter.route('/shop/list/').get(establishmentsController.getAllEstablishments);

    // Products Route
    apiRouter.route('/product/add/').post(productsController.addProduct);
    apiRouter.route('/products/list/').get(productsController.getAllProducts);
    
    // Menus Route
    apiRouter.route('/menu/add/').post(menusController.newMenu);
    
    return apiRouter;
})();
