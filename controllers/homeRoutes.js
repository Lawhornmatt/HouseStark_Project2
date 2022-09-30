const router = require('express').Router();
const withAuth = require('../utils/auth');
const User = require('../models/User.js');
const bcrypt = require('bcrypt')

router.get('/', withAuth, async (req, res) => {
  try {

    res.render('home', {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});




//get and post of register

router.get('/register',withAuth, (req, res) => {

  try {
          //replace this with the correct handlebars path
          //       VVVVVVVVVVV
      res.render('signup', {
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }

  //LIST OF THE COOKBOOKS


});

router.post('/register', async (req, res) =>{
  // create user
  try {
      const user = await User.create({...req.body})
      res.json({data:user})
  }catch(err){
      res.json({status:'error',message: err.message})
  }
  
})

router.get('/contact',withAuth, (req, res) => {

  try {
          //replace this with the correct handlebars path
          //       VVVVVVVVVVV
      res.render('contact', {
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }

  //LIST OF THE COOKBOOKS


});









router.get('/about',withAuth, (req, res) => {

  try {
          //replace this with the correct handlebars path
          //       VVVVVVVVVVV
      res.render('TEMP_RECIPES', {
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }

  //about us information


});



router.get('/login', (req, res) => {
  console.log(req.session.logged_in);
  res.render('login');

//THIS NEEDS TO BE UNCOMMENTED IF REQ SESSION LOGGED IN IS WORKING

  // if (req.session.logged_in) {
  //   res.redirect('/');
  //   return;
   
  // }


});

//LOGIN (AUTHENTICATE USER)
router.post('/login', async (req, res) =>{
  console.log(req.body)
  //Read name and password from req.body
  const email = req.body.email
  const password = req.body.password

  //find if name exists in db
 const user = await User.findOne(
      {
          where:{
              email
          }
      }
  )
  if (!user){
      res.json({status: 'error', message: 'Invalid Login'})
      return
  }
  if(await bcrypt.compare(password, user.password)){
      res.json({status: 'ok', message:`${user.first_name} is logged in!`})
  }else{
      res.json({status: 'error', message: 'Invalid Login'})
  }

})





module.exports = router;