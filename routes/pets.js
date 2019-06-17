// UPLOADING TO AWS S3
const multer = require('multer');

const upload = multer({
  dest: 'uploads/',
});
// MODELS
const Pet = require('../models/pet');

// require('lib')

// PET ROUTES
module.exports = (app) => {
  // INDEX PET => index.js

  // NEW PET
  app.get('/pets/new', (req, res) => {
    res.render('pets-new');
  });

  // CREATE PET
  app.post('/pets', upload.single('avatar'), (req, res, next) => {
    const pet = new Pet(req.body);
    pet.save((err) => {
      if (req.file) {
        client.upload(req.file.path, {}, (err, versions, meta) => {
          if (err) {
            return res.status(400).send({
              err,
            });
          }

          const imgUrl = versions[0].url.split('-');
          imgUrl.pop();
          imgUrl.join('-');
          pet.avatarUrl = imgUrl;
          pet.save();

          res.send({
            pet,
          });
        });
      } else {
        res.send({
          pet,
        });
      }
    });
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-show', {
        pet,
      });
    });
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-edit', {
        pet,
      });
    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`);
      })
      .catch((err) => {
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => res.redirect('/'));
  });

  // SEARCH PET
  app.get('/search', (req, res) => {
    const term = new RegExp(req.query.term, 'i');

    const page = req.query.page || 1;
    Pet.paginate({
      $or: [{
        name: term,
      },
      {
        species: term,
      },
      ],
    }, {
      page,
    }).then((results) => {
      res.render('pets-index', {
        pets: results.docs,
        pagesCount: results.pages,
        currentPage: page,
        term: req.query.term,
      });
    });
  });

  // PURCHASE
  app.post('/pets/:id/purchase', (req, res) => {
    console.log(`Purchase body: ${req.body}`);
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    const stripe = require('stripe')(process.env.PRIVATE_STRIPE_API_KEY);

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express

    // req.body.petId can become null through seeding,
    // this way we'll insure we use a non-null value
    const petId = req.body.petId || req.params.id;

    Pet.findById(petId).exec((err, pet) => {
      if (err) {
        console.log(`Error: ${err}`);
        res.redirect(`/pets/${req.params.id}`);
      }
      const charge = stripe.charges.create({
        amount: pet.price * 100,
        currency: 'usd',
        description: `Purchased ${pet.name}, ${pet.species}`,
        source: token,
      }).then((chg) => {
        res.redirect(`/pets/${req.params.id}`);
      }).catch((err) => {
        console.log(`Error: ${err}`);
      });
    });
  });
};
