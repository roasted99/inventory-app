var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all Category.
exports.category_list = function(req, res, next) {
    Category.find().sort({name:1})
    .exec(function(err, item_categories) {
        if (err) { return next(err); }
        res.render('category_list', { title:'Category List', category_list: item_categories});
    })
};

// Display detail page for a specific Category.
exports.category_detail = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
            .exec(callback);
        },
        category_items: function(callback) {
            Item.find({'category': req.params.id})
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category == null) {
            let err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        res.render('category_detail', { title: 'Category Detail', category: results.category, category_items: results.category_items });
    });
};

// Display Category create form on GET.
exports.category_create_get = function(req, res) {
    res.render('category_form', { title: 'Create Category', errors: null});
};

// Handle Category create on POST.
exports.category_create_post = [
    body('name', 'Category name required.').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        var category = new Category(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) {
            console.log(errors)
            res.render('category_form', { title: 'Create Category', category: category, errors: errors.array()});
            return;
        }
        else {
            Category.findOne({ 'name': req.body.name })
            .exec(function(err, found_category) {
                if (err) { return next(err); }
                if (found_category) {
                    res.redirect(found_category.url);
                }
                else {
                    category.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(category.url);
                    });
                }
            });
        }
    }
];

// Display Category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update POST');
};
