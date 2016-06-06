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



exports.sumrev = function(request, response) {
  db.Cart.find().exec(function(err, results) {
  console.log("trying");
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
  var qnty = request.body.quanity;
  console.log(qnty);
  //var id = "17697";
  
  if (!id) return next();
  db.Product.findOne({id:id}, function(err, cart) {
    
  if (cart) {
    console.log(qnty);
    var Cart = new db.Cart({
      id: cart.id,
      productname: cart.productname,
      productprice: cart.productprice,
      displayName: cart.displayName,
      quantity: qnty
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
  var product = request.body.product;
  
  request.var_name.displayName = product.displayName;

  db.Cart.findOneAndUpdate({_id: request.var_name._id}, request.var_name, function(err) {
    if (err) {
      request.session.error = 'Error updating delete product!';
    } else {
      request.session.success = 'Product updated succesfuly!';
    }
    response.redirect("/crud/product/" + request.var_name.id + "/edit");
  });
};

exports.delete = function(request, response) {
  var result = '';

  db.Cart.findOneAndRemove({_id: request.var_name._id}, function(err) {
    if (err) {
      request.session.error = 'Error trying delete product!';
      result = err.message
    } else {
      request.session.success = 'Product deleted succesfuly!';
      result = 'Deleted'
    }

    response.json({ result: result });
  });
};