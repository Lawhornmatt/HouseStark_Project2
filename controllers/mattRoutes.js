const router = require('express').Router();
const withAuth = require('../utils/auth');
const {Book, Recipe, User, BookRecipe} = require('../models');
const bcrypt = require('bcrypt')

// ===  NEW BOOK ROUTES ===

router.get('/newbook',withAuth, (req, res) => {

    try {
        res.render('newBook', {
          logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/newbook',withAuth, async (req, res) =>{
    // console.log('POST /register | req.body: ' + req.body.firstName + ' ' + req.body.lastName + ' ' + req.body.username + ' ' + req.body.email + ' ' + req.body.password)
    try {
        const bookData = await Book.create({
          name: req.body.name,
          user_id: req.body.user_id,
        });
  
        // console.log('POST /register | bookData' + bookData);
  
        req.session.save(() => {
          req.session.logged_in = true;
  
          console.log(`status: 'ok', message: ${bookData.name} is created!`);
          res.redirect('/books');
        });
    }catch(err){
        res.status(400).json(err);
    }
});

// ===  NEW RECIPE ROUTES ===

router.get('/newrecipe',withAuth, async (req, res) => {

    try {
      const userBooks = await Book.findAll( {
        where: {
          user_id: req.session.user_id
        }
      });

      const preBookData = userBooks.map((book) => book.get({plain: true}));

      res.render('newRecipe', {
        preBookData,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/newrecipe',withAuth, async (req, res) =>{
  console.log(`\x1b[32mPOST /newrecipe | req.body\x1b[0m` + JSON.stringify(req.body));
    // FIRST: Create the recipe in the recipe table
    var newRecipeID;

    try {
        const recipeData = await Recipe.create({
          name: req.body.name,
          ingredients: req.body.ingredients,
          directions: req.body.directions,
        }).then(function(info) {
          // console.log(`\x1b[32mpost-create info: \x1b[0m` + info.id);
          newRecipeID = info.id;
        });
  

        req.session.save(() => {
          req.session.logged_in = true;
  
          console.log(`\x1b[32mstatus: 'ok', message: ==replace_me== is created!\x1b[0m`); // ${recipeData.name}
          res.redirect('/recipes');
        });
    }catch(err){
        res.status(400).json(err);
    }
    console.log(`\x1b[32mpost-create info: \x1b[0m` + newRecipeID);
    // SECOND: Create however many BookRecipe tags as necessary 
  //   try {
  //     const BRData = await BookRecipe.create({
  //       book_id: req.body.bookAssign[0],
  //       recipe_id: req.body.ingredients,
  //     });


  //     req.session.save(() => {
  //       req.session.logged_in = true;

  //       console.log(`status: 'ok', message: ${BRData.name} is created!`);
  //       res.redirect('/recipes');
  //     });
  // }catch(err){
  //     res.status(400).json(err);
  // }
});

router.post('/editbook',withAuth, async (req, res) =>{
    try {
        const bookData = await Book.create({
          name: req.body.name,
          user_id: req.body.user_id,
        });
  
        // console.log('POST /editbook | bookData' + bookData);
  
        req.session.save(() => {
          req.session.logged_in = true;
  
          res.json({status: 'ok', message:`${bookData.name} is created!`})
        });
    }catch(err){
        res.status(400).json(err);
    }
});

module.exports = router;
