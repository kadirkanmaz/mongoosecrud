const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

var upload = multer({
    storage: storage,
}).single('image');



//insert an user into database route
router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });
    console.log(user);
    user.save()
        .then(() => {

            req.session.message = {
                type: "success",
                message: "user added successfuly!"
            };

        })
        .catch((err) => {
            res.json({ message: err.message, type: 'danger' });
        })
    res.redirect('/');
    ;
})

router.get("/", (req, res) => {
    // res.send("Home Page");
    res.render('index', { title: 'Home Page' })
});

router.get("/add", (req, res) => {
    res.render('add_users', { title: 'Add Users' })
});


router.get("/users", (req, res) => {
    res.send("All Users");
});

module.exports = router;