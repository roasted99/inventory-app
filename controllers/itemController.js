var Item = require('../models/item');

exports.index = function(req, res, next) {
    Item.find({}).sort({name: 1}).exec((err, list_items) => {
        if (err) { return next(err); }
        res.render('index', {title: 'Item list', item_list: list_items})
    });
};

// Display list of all items.
exports.item_list = function(req, res) {
    res.send('NOT IMPLEMENTED: item list');
};

// Display detail page for a specific item.
exports.item_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: item detail: ' + req.params.id);
};

// Display item create form on GET.
exports.item_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item create GET');
};

// Handle item create on POST.
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item create POST');
};

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};
