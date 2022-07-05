var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');
const { body, validationResult } = require('express-validator');
const fs = require('fs');


exports.index = function(req, res, next) {
    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({}, callback);
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, (err, results) => {
        res.render('index', {title: 'Kou Building Materials', error: err, data: results});
    });
};

// Display list of all items.
exports.item_list = function(req, res, next) {
    Item.find({}).sort({name: 1}).exec((err, list_items) => {
        if (err) { return next(err); }
        res.render('item_list', {title: 'Item list', item_list: list_items})
    });
};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
    if (err) { return next(err); }
    if (item == null) {
        let err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }
    res.render('item_detail', { title: item.name, item: item });
  });
};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
   Category.find({}).exec(function(err, categories) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create Item', categories: categories, errors: null, item: undefined });
    });
};

// Handle item create on POST.
exports.item_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must not be empty.').trim().isLength({min: 1}).escape(),
    body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Number in stock must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        console.log(req.body.name)
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock
        });

        if (req.file && errors.isEmpty()) {
            item.item_img = req.file.item_img;
            fs.unlink(`public/uploads/${req.body.item_img}`, err => {
                if(err) console.log(err)
                console.log(req.body.item_img, "was deleted");
            });
        } else if (req.body.item_img && req.body.item_img !== 'null' && req.body.item_img !== 'underfined') {
            item.item_img = req.body.item_img;
        }

        if (!errors.isEmpty()) {
            Category.find({}).exec(function(err, categories) {
                if (err) { console.log(err); return next(err); }
                res.render('item_form', { title: 'Create Item', categories: categories, item: item, errors: errors.array() });
                return;
            });
        }
        else {
            item.save(function(err) {
                if(err) { return next(err); }
                console.log(item)
                res.redirect(item.url);
            });
        }
    }
];

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
    if (err) { return next(err); }
    if (item == null) {
       res.redirect('/items');
    }
    res.render('item_delete', { title: 'Delete Item', item: item});
  });
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res, next) {
    Item.findById(req.params.itemid)
    .populate('category')
    .exec(function (err, item) {
    if (err) { return next(err); }
    Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
        if (err) { return next(err); }
        res.redirect('/items')
    })
  });
};

// Display item update form on GET.
exports.item_update_get = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).populate('category').exec(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item == null) {
            let err = new Error('Item not found')
            err.status = 404;
            return next(err);
        }
        res.render('item_form', { title: 'Update Item', categories: results.categories, item: results.item, errors: null})
    })
};

// Handle item update on POST.
exports.item_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must not be empty.').trim().isLength({min: 1}).escape(),
    body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Number in stock must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        console.log(req.body.name)
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            _id: req.params.id
        });

        if (req.file && errors.isEmpty()) {
            item.item_img = req.file.item_img;
            fs.unlink(`public/uploads/${req.body.item_img}`, err => {
                if(err) console.log(err)
                console.log(req.body.item_img, "was deleted");
            });
        } else if (req.body.item_img && req.body.item_img !== 'null' && req.body.item_img !== 'underfined') {
            item.item_img = req.body.item_img;
        }

        if (!errors.isEmpty()) {
            Category.find({}).exec(function(err, categories) {
                if (err) { console.log(err); return next(err); }
                res.render('item_form', { title: 'Update Item', categories: categories, item: item, errors: errors.array() });
                return;
            });
        }
        else {
            item.save(function(err) {
                if(err) { return next(err); }
                res.redirect(item.url);
            });
        }
    }
];
