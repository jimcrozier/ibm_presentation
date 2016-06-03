var db = require('../../db');

exports.prefix = "/crud";

exports.name = "cart";

exports.engine = "handlebars";

exports.before = function(request, response, next) {
  var id = request.params._id;
  if (!id) return next();
  db.Cart.findOne({id:id}, function(err, cart) {
    if (!cart) return next('route');
    request.var_name = cart;
    next();
  });
};

exports.index = function(request, response) {
  response.redirect('/crud/carts');  
};

exports.list = function(request, response) {
  db.Cart.find().exec(function(err, results) {
    response.render("crud-cart/list", {
      title: 'List Carts',
      crud_cart: results
    });
  });
};

exports.new = function(request, response) {
  response.render("crud-cart/new", {
    title: 'New Cart'
  });
};

exports.create = function(request, response) {
  //var cart = request.body.cart;
  
  //var id = 17697;
  var id = request.body.id;
  console.log(request.body);
  //var id = "17697";
  
  if (!id) return next();
  db.Product.findOne({id:id}, function(err, cart) {
    
  if (cart) {
    var Cart = new db.Cart({
      id: Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4),
      cartname: cart.productame,
      cartprice: cart.productprice,
      displayName: cart.displayName,
      cartsku: cart.productsku
    });
  
    // Save 
    Cart.save(function(err) {
      if (err) {
        request.session.error = err.message;
        reponse.redirect('back');
      }
      
      request.session.success = 'Cart created succesfuly!';
          response.redirect('/crud/shops');
    });
  } else {
    response.redirect('/crud/shop');
  }


  });
};

exports.show = function(request, response) {
  response.render("crud-cart/show", {
    title: 'Show Cart',
    crud_cart: request.var_name 
  });
};

exports.edit = function(request, response) {
  response.render("crud-cart/edit", {
    title: 'Edit Cart',
    crud_cart: request.var_name 
  });
};

exports.update = function(request, response) {
  var cart = request.body.cart;
  
  request.var_name.displayName = cart.displayName;

  db.Cart.findOneAndUpdate({_id: request.var_name._id}, request.var_name, function(err) {
    if (err) {
      request.session.error = 'Error updating delete cart!';
    } else {
      request.session.success = 'Cart updated succesfuly!';
    }
    response.redirect("/crud/cart/" + request.var_name.id + "/edit");
  });
};

exports.delete = function(request, response) {
  var result = '';

  db.Cart.findOneAndRemove({_id: request.var_name._id}, function(err) {
    if (err) {
      request.session.error = 'Error trying delete cart!';
      result = err.message
    } else {
      request.session.success = 'Cart deleted succesfuly!';
      result = 'Deleted'
    }

    response.json({ result: result });
  });
};