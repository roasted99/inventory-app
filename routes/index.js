var express = require('express');
var multer = require('multer');
var router = express.Router();
const path = require('path');

var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

//file path for upload
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'public/uploads')
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

var imgFilter = function(file, cb) {
  var ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !=='.jpeg') {
    return cb(new Error('Upload in .jpg, .png or jpeg file'));
  }
  cb(null, true);
}

const upload = multer({ storage: storage, 
                        fileFilter: function(req, file, cb) {
                         imgFilter(file, cb);
                        },limits:{fileSize: 10000000} });

/* GET home page. */
router.get('/', item_controller.index);

router.get('/item/create', item_controller.item_create_get);

router.post('/item/create', upload.single('item_img'), item_controller.item_create_post);

router.get('/item/:id/delete', item_controller.item_delete_get);

router.post('/item/:id/delete', item_controller.item_delete_post);

router.get('/item/:id/update', item_controller.item_update_get);

router.post('/item/:id/update', upload.single('item_img'), item_controller.item_update_post);

router.get('/item/:id', item_controller.item_detail);

router.get('/items', item_controller.item_list);

//Category Routes//

router.get('/', item_controller.index);

router.get('/category/create', category_controller.category_create_get);

router.post('/category/create', category_controller.category_create_post);

router.get('/category/:id/delete', category_controller.category_delete_get);

router.post('/category/:id/delete', category_controller.category_delete_post);

router.get('/category/:id/update', category_controller.category_update_get);

router.post('/category/:id/update', category_controller.category_update_post);

router.get('/category/:id', category_controller.category_detail);

router.get('/categories', category_controller.category_list);

module.exports = router;
