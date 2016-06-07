var db = require('../../db');

exports.prefix = "/crud";

exports.name = "shop";

exports.engine = "handlebars";

exports.before = function(request, response, next) {
  var id = request.params._id;
  if (!id) return next();
  db.Product.findOne({id:id}, function(err, product) {
    if (!product) return next('route');
    request.var_name = product;
    next();
  });
};

exports.index = function(request, response) {
  response.redirect('/crud/shops');  
};

exports.list2 = function(request, response) {
  db.Product.find({category:"OTHER"}).limit( 10 ).exec(function(err, results) {
    response.render("crud-shop/list", {
      title: 'List Products',
      crud_product2: results
    });
  });
};

exports.list = function(request, response) {
  db.Product.distinct("category").exec(function(err, results) {
    response.render("crud-shop/list", {
      title: 'List Products',
      crud_cats: results
    });
  });
};

exports.new = function(request, response) {
  response.render("crud-shop/new", {
    title: 'New Product'
  });
};

exports.create = function(request, response) {
  var product = request.body.product;
  console.log("shop");
    var id = request.params._id;
  if (!id) return next();
  if (product) {
    var Product = new db.Product({
      id: Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4),
      productname: product.productname,
      password: product.password,
      category: product.category,
      displayName: product.displayName,
      emails: [{ value: product.email }]
    });
  
    // Save 
    Product.save(function(err) {
      if (err) {
        request.session.error = err.message;
        reponse.redirect('back');
      }
      
      request.session.success = 'Product created succesfuly!';
      response.redirect("/crud/product/" + Product.id);
    });
  } else {
    response.redirect('/crud/products');
  }
};

exports.show = function(request, response) {
  response.render("crud-shop/show", {
    title: 'Show Product',
    crud_product: request.var_name 
  });
};

exports.edit = function(request, response) {
  response.render("crud-shop/edit", {
    title: 'Edit Product',
    crud_product: request.var_name 
  });
};

exports.update = function(request, response) {
  var product = request.body.product;
  
  request.var_name.displayName = product.displayName;

  db.Product.findOneAndUpdate({_id: request.var_name._id}, request.var_name, function(err) {
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

  db.Product.findOneAndRemove({_id: request.var_name._id}, function(err) {
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