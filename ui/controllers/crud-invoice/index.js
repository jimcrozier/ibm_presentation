var db = require('../../db');

exports.prefix = "/crud";

exports.name = "invoice";

exports.engine = "handlebars";

exports.before = function(request, response, next) {
  var id = request.params._id;
  if (!id) return next();
  db.Invoice.findOne({id:id}, function(err, invoice) {
    if (!invoice) return next('route');
    request.var_name = invoice;
    next();
  });
};

exports.index = function(request, response) {
  response.redirect('/crud/invoices');  
};

exports.list = function(request, response) {
  db.Invoice.find().exec(function(err, results) {
    response.render("crud-invoice/list", {
      title: 'List Invoices',
      crud_invoice: results
    });
  });
};

exports.new = function(request, response) {
  response.render("crud-invoice/new", {
    title: 'New Invoice'
  });
};

exports.create = function(request, response) {
  var invoice = request.body.invoice;
  
  if (invoice) {
    var Invoice = new db.Invoice({
      id: Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4),
      invoicename: invoice.invoicename,
      password: invoice.password,
      displayName: invoice.displayName,
      emails: [{ value: invoice.email }]
    });
  
    // Save 
    Invoice.save(function(err) {
      if (err) {
        request.session.error = err.message;
        reponse.redirect('back');
      }
      
      request.session.success = 'Invoice created succesfuly!';
      response.redirect("/crud/invoice/" + Invoice.id);
    });
  } else {
    response.redirect('/crud/invoices');
  }
};

exports.show = function(request, response) {
  response.render("crud-invoice/show", {
    title: 'Show Invoice',
    crud_invoice: request.var_name 
  });
};

exports.edit = function(request, response) {
  response.render("crud-invoice/edit", {
    title: 'Edit Invoice',
    crud_invoice: request.var_name 
  });
};

exports.update = function(request, response) {
  var invoice = request.body.invoice;
  
  request.var_name.displayName = invoice.displayName;

  db.Invoice.findOneAndUpdate({_id: request.var_name._id}, request.var_name, function(err) {
    if (err) {
      request.session.error = 'Error updating delete invoice!';
    } else {
      request.session.success = 'Invoice updated succesfuly!';
    }
    response.redirect("/crud/invoice/" + request.var_name.id + "/edit");
  });
};

exports.delete = function(request, response) {
  var result = '';

  db.Invoice.findOneAndRemove({_id: request.var_name._id}, function(err) {
    if (err) {
      request.session.error = 'Error trying delete invoice!';
      result = err.message
    } else {
      request.session.success = 'Invoice deleted succesfuly!';
      result = 'Deleted'
    }

    response.json({ result: result });
  });
};