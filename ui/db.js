var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    urlMLocal = 'mongodb://localhost:27017/admin-lte-express';

// Uncomment for use mongo database
mongoose.connect(urlMLocal, function(err) {
  if (err) console.log(err);
});

// Users Model
var usersSchema = new Schema({
  id: Number,
  username: String,
  password: String,
  displayName: String,
  emails: Array
}, {collection:'users'});

var User = exports.User = mongoose.model('User', usersSchema);

exports.getUsers = function(cb) {
  User.find().exec(function(err, results) {
    cb(err, results);
  });
};

var users = exports.users = [
  new User({ 
    id: 1, 
    username: 'admin', 
    password: 'admin', 
    displayName: 'Jack', 
    emails: [ { value: 'jack@example.com' } ] 
  })]

// add users from collection mongo
this.getUsers(function(err, results) {
  if (err) throw err;
  results.forEach(function(user) {
    users.push(user);
  });
});

exports.findById = function(id, cb) {
  for (var i = 0, len = users.length; i < len; i++) {
    if (users[i].id === id) {
      return cb(null, users[i]);
    }
  }
  return cb(new Error('User ' + id + ' does not exist'));
};

exports.findByUsername = function(username, cb) {
  for (var i = 0, len = users.length; i < len; i++) {
    if (users[i].username === username) {
      return cb(null, users[i]);
    }
  }
  return cb(null, null);
};


// Products Model
var productsSchema = new Schema({
  id: Number,
  productname: String,
  productprice: Number,
  displayName: String,
  category:String,
  productsku: String
}, {collection:'products'});

var Product = exports.Product = mongoose.model('Product', productsSchema);

exports.getProducts = function(cb) {
  Product.find().exec(function(err, results) {
    cb(err, results);
  });
};

var products = exports.products = [
  new Product({ 
    id: 1, 
    productname: 'hammer', 
    productprice: '19.99', 
    displayName: 'Hammer', 
    category: 'OTHER',
    productsku: '123456-1234'
  })]

// add products from collection mongo
this.getProducts(function(err, results) {
  if (err) throw err;
  results.forEach(function(product) {
    products.push(product);
  });
});

exports.findById = function(id, cb) {
  for (var i = 0, len = products.length; i < len; i++) {
    if (products[i].id === id) {
      return cb(null, products[i]);
    }
  }
  return cb(new Error('Product ' + id + ' does not exist'));
};

exports.findByProductname = function(productname, cb) {
  for (var i = 0, len = products.length; i < len; i++) {
    if (products[i].productname === productname) {
      return cb(null, products[i]);
    }
  }
  return cb(null, null);
};


// Carts Model
var cartsSchema = new Schema({
  id: Number,
  productname: String,
  productprice: Number,
  displayName: String,
  category: String,
  quantity: Number
}, {collection:'carts'});

var Cart = exports.Cart = mongoose.model('Cart', cartsSchema);

exports.getCarts = function(cb) {
  Cart.find().exec(function(err, results) {
    cb(err, results);
  });
};




var carts = exports.carts = [
  new Cart({ 
    id: 1, 
    productname: 'hammer', 
    productprice: '19.99', 
    displayName: 'Hammer', 
    category: 'OTHER',
    quantity: 2
  })]

// add carts from collection mongo
this.getCarts(function(err, results) {
  if (err) throw err;
  results.forEach(function(cart) {
    carts.push(cart);
  });
});

exports.findById = function(id, cb) {
  for (var i = 0, len = carts.length; i < len; i++) {
    if (carts[i].id === id) {
      return cb(null, carts[i]);
    }
  }
  return cb(new Error('Cart ' + id + ' does not exist'));
};

exports.findByCartname = function(cartname, cb) {
  for (var i = 0, len = carts.length; i < len; i++) {
    if (carts[i].cartname === cartname) {
      return cb(null, carts[i]);
    }
  }
  return cb(null, null);
};



// Invoices Model
var invoicesSchema = new Schema({
  id: Number,
  dt: String,
  invoice_nbr: String,
  customer: String,
  desc: String,
  sku: String,
  qnty:Number,
  price:Number,
  amt:Number,
  saledesc: String

}, {collection:'invoices'});

var Invoice = exports.Invoice = mongoose.model('Invoice', invoicesSchema);

exports.getInvoices = function(cb) {
  Invoice.find().exec(function(err, results) {
    cb(err, results);
  });
};



var invoices = exports.invoices = [
  new Invoice({ 
   id: 1,
  dt: "2015-08-28",
  invoice_nbr: "35B-1440795424",
  customer: "String",
  desc: "String",
  sku: "String",
  qnty:10,
  price:10,
  amt:100,
  saledesc: "String"
  })]

// add invoices from collection mongo
this.getInvoices(function(err, results) {
  if (err) throw err;
  results.forEach(function(invoice) {
    invoices.push(invoice);
  });
});

exports.findById = function(id, cb) {
  for (var i = 0, len = invoices.length; i < len; i++) {
    if (invoices[i].id === id) {
      return cb(null, invoices[i]);
    }
  }
  return cb(new Error('Invoice ' + id + ' does not exist'));
};

exports.findByInvoicename = function(invoicename, cb) {
  for (var i = 0, len = invoices.length; i < len; i++) {
    if (invoices[i].invoicename === invoicename) {
      return cb(null, invoices[i]);
    }
  }
  return cb(null, null);
};

