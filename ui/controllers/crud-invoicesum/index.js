var db = require('../../db');

exports.prefix = "/crud";

exports.name = "invoicesum";

exports.engine = "handlebars";

exports.before = function(request, response, next) {
  var id = request.params._id;
  if (!id) return next();
  db.Invoicesum.findOne({id:id}, function(err, invoicesum) {
    if (!invoicesum) return next('route');
    request.var_name = invoicesum;
    next();
  });
};

exports.index = function(request, response) {
  response.redirect('/crud/invoicesums');  
};

exports.list = function(request, response) {
  db.Invoicesum.find().exec(function(err, results) {
    response.render("crud-invoicesum/list", {
      title: 'List Invoicesums',
      crud_invoicesum: results
    });
  });
};

exports.new = function(request, response) {
  response.render("crud-invoicesum/new", {
    title: 'New Invoicesum'
  });
};

exports.create = function(request, response) {
  var invoicesum = request.body.invoicesum;
  
  if (invoicesum) {
    var Invoicesum = new db.Invoicesum({
      id: Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4),
      invoicesumname: invoicesum.invoicesumname,
      password: invoicesum.password,
      displayName: invoicesum.displayName,
      emails: [{ value: invoicesum.email }]
    });
  
    // Save 
    Invoicesum.save(function(err) {
      if (err) {
        request.session.error = err.message;
        reponse.redirect('back');
      }
      
      request.session.success = 'Invoicesum created succesfuly!';
      response.redirect("/crud/invoicesum/" + Invoicesum.id);
    });
  } else {
    response.redirect('/crud/invoicesums');
  }
};

exports.show = function(request, response) {
  response.render("crud-invoicesum/show", {
    title: 'Show Invoicesum',
    crud_invoicesum: request.var_name 
  });
};

exports.edit = function(request, response) {
  response.render("crud-invoicesum/edit", {
    title: 'Edit Invoicesum',
    crud_invoicesum: request.var_name 
  });
};

exports.update = function(request, response) {
  var invoicesum = request.body.invoicesum;
  
  request.var_name.displayName = invoicesum.displayName;

  db.Invoicesum.findOneAndUpdate({_id: request.var_name._id}, request.var_name, function(err) {
    if (err) {
      request.session.error = 'Error updating delete invoicesum!';
    } else {
      request.session.success = 'Invoicesum updated succesfuly!';
    }
    response.redirect("/crud/invoicesum/" + request.var_name.id + "/edit");
  });
};

exports.delete = function(request, response) {
  var result = '';

  db.Invoicesum.findOneAndRemove({_id: request.var_name._id}, function(err) {
    if (err) {
      request.session.error = 'Error trying delete invoicesum!';
      result = err.message
    } else {
      request.session.success = 'Invoicesum deleted succesfuly!';
      result = 'Deleted'
    }

    response.json({ result: result });
  });
};