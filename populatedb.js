#! /usr/bin/env node

console.log('This script populates some data to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []


function categoryCreate(name, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, description, category, price, number_in_stock, cb) {
  itemdetail = { 
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock
  }
  if (category != false) itemdetail.category = category
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function createCategories(cb) {
  async.parallel([
      function(callback) {
        categoryCreate("Flooring", callback);
      },
      function(callback) {
        categoryCreate("Sanitary", callback);
      },
      function(callback) {
        categoryCreate("Painting", callback);
      },
      function(callback) {
        categoryCreate("Lighting", callback);
      }
      ],
      // optional callback
      cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Jotun JOTASHIELD ANTIFADE COLOURS', 
          'Jotashield Antifade Colours  made with  pigment  technology to offer superior Exterior protection with long-lasting colours. jotashield is Anti Algae & Anti Fungal,Reduce Temperature,Water Resistant,Dirt Resistant.', 
          categories[2], 
          24, 11, callback);
        },
        function(callback) {
          itemCreate("Cotto C125317(CV4) Simply Connect with Convenic C9204 (UC+)", 
          'SIMPLY CONNECT” represent the global trend and your personality styling for those who value simplicity and minimalism.Two choices for saving water, 3 liters or 4.5 liters. (Save 12.5% more, when compared with 3/6 liters) Ultra clean Plus. Less stain and easy to clean.',
         categories[1], 236, 6, callback);
        },
        function(callback) {
          itemCreate("Cotto C00381MLG Geo Square Above Counter Basin", 
          'he perfection of geometric design ,being attractive and modern with 2 different shape of basin. For mix and matching GEO series only your own style.',
          categories[1], 109, 13, callback);
        },
        function(callback) {
          itemCreate("Inovar Floor IMPREZZ RESILIENT VINYL TILES-CLICK", 
          "Authentic wood based designs with diverse concepts that reflects modern and conventional colours. This collections is a versatile choice for both professionals and consumers.",
          categories[0], 5, 889, callback);
        },
        function(callback) {
          itemCreate("Hafary Sunstone Groa Rett",
          "Sunstone porcelain tile collection showcases the beauty of stone in five different colours for selection. From warm browns to cool greys, the tile collection is able to be applied to various interior design themes effortlessly.",
          categories[0], 35, 432, callback);
        },
        function(callback) {
          itemCreate('IKEA ARSTID',
           "One of our most cherished lamp series and it’s no wonder why – it has a timeless design that fits right in. Combine several lamps from the series to create a soft, comfortable light and a unified look.",
            categories[3], 89, 4, callback);
        },
        function(callback) {
          itemCreate('IKEA SOLHETTA', "This energy-efficient and long-lasting LED light bulb has a lifetime of approximately 25,000 hours and spreads a pleasant warm-white light that allows the room's natural colours to come into their own.", 
          categories[3], 22, 52, callback)
        }
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('categories: '+ categories);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



