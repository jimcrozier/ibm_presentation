var express      = require('express');
var exphbs       = require('express-handlebars');
var session      = require('express-session');
var path         = require('path');
var favicon      = require('serve-favicon');
var methodOver   = require('method-override');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var Router       = require('named-routes');
var Autoloader   = require('./lib/autoloader').Autoloader;
var Auth         = require('./lib/auth').Auth;
var PassportAuth = require('./lib/passport').Passport;
var Errors       = require('./lib/errors');
var db           = require('./db');
var mysql        = require('mysql');

var mysqlconn = mysql.createConnection({
        host     : 'localhost',
        user     : 'root'
      });

// Main App
var app = express();

// Config named routes
var router = new Router();
router.extendExpress(app);
router.registerAppHelpers(app);

// Config session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'A77as7diubhaisdgibkn!'
}));

// Morgarn logger
app.use(logger('dev'));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// allow overriding methods in query (?_method=put)
app.use(methodOver('_method'));

// Cookie parser
app.use(cookieParser());

// Public assets
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/admin', express.static(path.join(__dirname, 'public')));

// Active URL for helper
var activeRoute = '';
app.use(function(request, response, next) {
  var route = router.match(request)
  if (route) {
    activeRoute = route.route.options.name
  }
  next()
});

// Session-persisted message middleware
app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.currentuser = req.session.user;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// Auth load and middleware
Auth.load(app);
app.use(Autoloader.allRoutes(), Auth.restrict)

// Passport load and middleware
//PassportAuth.load(app);
//app.use(Autoloader.allRoutes(), require('connect-ensure-login').ensureLoggedIn())

// Register route
app.get('/register', 'register', function(req, res) {
  res.render( 'user/register', {
    title: 'Register',
    layout: 'auth'
  });
});
app.post('/register', function(req, res) {
  var body = req.body;
  if (body.user) {
    var User = new db.User({
      id: Math.floor(100000 + Math.random() * 900000).toString().substring(0,4),
      username: body.user.username,
      password: body.user.password,
      displayName: body.user.name,
      emails: [{value: body.user.email}]
    });
    User.save(function(err) {
       if (err) req.session.error = err.message;
       else req.session.success = 'User saved successfuly!';
       res.redirect('/register');
    });
  } else {
    res.redirect('/register');
  }
});

//app.get('/mysqltest', function (req, res) {
//    mysqlconn.query("select concat(year(dt),' Q', quarter(dt)) as y, sum(rev) as rev from anchor.cust_purchases group by year(dt), quarter(dt) order by year(dt), quarter(dt)", req.body, 
//            function (err, result) {
//                        if (err) throw err;
//                        res.send(result);
//                                            }
//                                                );
//                                                });
//

app.get('/box', function(req, res) {
  var cat = req.query.id; 
  db.Product.find({category:cat}).limit( 10 ).exec(function(err, results) {
 res.send(results);
  });
});


app.get('/test/:invoice_nbr', function(request, response, next) {
  var invoice_nbr = request.params.invoice_nbr;
  db.Invoice.find({invoice_nbr:invoice_nbr}).exec(function(err, results) {
    response.render("crud-invoice/list", {
      title: 'List Invoices',
      crud_invoice: results
    });
  });
}); 

app.get('/invoicesum/list2', function(request, response, next) {
  var currentuser = request.session.user;
  if (currentuser['username'] == 'admin'){
  db.Invoicesum.find().exec(function(err, results) {
    response.render("crud-invoicesum/list", {
      title: 'List Invoicesums',
      crud_invoicesum: results
    });
  });
} else {
  db.Invoicesum.find({customer:currentuser['displayName']}).exec(function(err, results) {
    response.render("crud-invoicesum/list", {
      title: 'List Invoicesums',
      crud_invoicesum: results
    });
  });
}
});

app.get('/cart/list2', function(request, response, next) {
  var currentuser = request.session.user;
  db.Cart.find({customer:currentuser['displayName']}).exec(function(err, results) {
    response.render("crud-cart/list", {
      title: 'List Carts',
      crud_cart: results
    });
  });
});
// MVC Autoloader
Autoloader.load(app, {verbose: !module.parent});

// Config Handlebars
var blocks = {};
var Handlebars = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    url: function(routeName, params) {
      return app.locals.url(routeName, params);
    },
    activeRoute: function(routeName) {
      return routeName === activeRoute ? 'active' : '';
    },
    activeRoutes: function(routeNames) {
      // TODO
      return routeNames.split(',').indexOf(activeRoute) >= 0 ? 'active' : '';
    },
    block: function(name) {
      var val = (blocks[name] || []).join('\n');

      // clear the block
      blocks[name] = [];
      return val;
    },
    multreturn: function(one,two) {
      // TODO
      out = one * two 
      return Math.round(out * 100) / 100; 
    }, 
//    testhis: function() {
//      // TODO
// db.Product.find({category:"OTHER"}).limit( 10 ).exec(function(err, results) {
//    response.render("crud-shop/list", {
//      title: 'List Products',
//      return results;
//    });
//  });
//    }, 
    //countcart: function() {
      // TODO
     //var sum = 0;
     //for(var i=0; i< data.length; i++) {
     //sum += data[i].quantity * data[i].productprice;
     //}
     //return Math.round(10 * 100) / 100; 
    //}, 
    revtotal: function(data) {
      // TODO
     var sum = 0;
     for(var i=0; i< data.length; i++) {
     sum += data[i].quantity * data[i].productprice;
     }
     return Math.round(sum * 100) / 100; 
    }, 
    revtaxtotal: function(data) {
      // TODO
     var sum = 0;
     for(var i=0; i< data.length; i++) {
     sum += data[i].quantity * data[i].productprice;
     }
     sum = sum*0.08; 
     return Math.round(sum * 100) / 100; 
    }, 
    revplustaxtotal: function(data) {
      // TODO
     var sum = 0;
     for(var i=0; i< data.length; i++) {
     sum += data[i].quantity * data[i].productprice;
     }
     tax = sum*0.08; 
     sum = sum + tax ; 
     return Math.round(sum * 100) / 100; 
    }, 
    countcart: function() {
      // TODO
      var cartcount;
    db.Cart.find().count().exec(function(err, results) {
      //console.log("asdfasdf" + results);
       cartcount = results;
      //return cartcount; 
    //return results;
    });
    console.log(cartcount);
    return cartcount;
    
    }, 
    extend: function(name, context) {
      var block = blocks[name];
      if (!block) {
          block = blocks[name] = [];
      }

      block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
    }
  }
});

// View engine setup
app.engine('handlebars', Handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Errors load
Errors(app);

module.exports = app;
