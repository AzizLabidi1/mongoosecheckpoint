var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/* database connection  */
const uri = "mongodb+srv://azizlabidi:23318@cluster0.pj2po.mongodb.net/firstmongoosedb";
mongoose.connect(
  uri,
  async(err)=>{
      if(err) throw err;
      console.log("connected to db")
  }
)


/* create a schema */
let personSchema =new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

    },
    age: Number,
    favoriteFoods: [String],
  }
)

/* create model */

let person = mongoose.model("people", personSchema)

/* Creating a document instance using the Person constructor and saving it */
var p1 = new person();
p1.name = "aziz";
p1.age = 22;
p1.favoriteFoods = ["Pasta", "Cheesecake"];
p1.save(function (err, data) {
  if (err) {
    return console.error(err);
  }
  return console.log("created successfully");
});

/* Creating Many Records with model.create() */

person.create(
  [
    {
      name: "mohamed",
      age: 22,
      favoriteFoods: ["pasta with tuna", "pizza"],
    },
    {
      name: "emna",
      age: 22,
      favoriteFoods: ["cheese", "milkshake vanille"],
    },
    {
      name: "rainm",
      age: 22,
      favoriteFoods: ["nuggets","cheese"],
    },
  ],
  function (err, data) {
    if (err) {
      return console.error(err);
    }
    return console.log("created successfully");
  }
);

/* Finding all the people having a given name, using Model.find() */
person.find({
  name: "emna", 
})
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => { 
    console.error(err);
  });

/* Finding just one person which has a certain food in the person's favorites, using Model.findOne() */  
person.findOne({
  favoriteFoods: "cheese", 
})
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error(err);
  });

  /* Finding the (only!!) person having a given _id, using Model.findById() */
  person.findById("6198f4f8a317af4a3f3aff85") // search query

  .then((doc) => {
    console.log("The person with this id is ")
    console.log(doc)


  })
  .catch((err) => {
    console.error(err);
  });

  /*Find a person by _id with. Add "hamburger" to the list of the person's favoriteFoods
 Then - inside the find callback - save() the updated person*/

  person.findById("6198f4f8a317af4a3f3aff85", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      result.favoriteFoods.push("hamburger");
      result.save((error, updatedResult) => {
        if (error) {
          console.log(error);
        } else {
          console.log("success: adding favourite food");
        }
      });
    }
  });

    /* Find a person by Name and set the person's age to 20 */
person.findOneAndUpdate(
  { name: "emna" },
  { $set: { age: 20} },
  { new: true },
  (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }

    console.log("updated successfully");
  }
);

  /*Delete all the people whose name is “Ranim”*/

person.remove({ name: "ranim" }, (error, JSONStatus) => {
  if (error) {
    console.log(error);
  } else {
    console.log("success : remove", JSONStatus);
  }
});


/*Find people who like burritos. Sort them by name, limit the results to two documents,
 and hide their age. Chain .find(), .sort(), .limit(), .select(), and then .exec()*/
 person.find({ favoriteFoods: { $all: ["cheese"] } })
 .sort({ name: "asc" })
 .limit(2)
 .select("-age")
 .exec((error, filteredResults) => {
   if (error) {
     console.log(error);
   } else {
     console.log("find/sort/limit/select : success", filteredResults);
   }
 });

 var server = app.listen( 3000, () => {

  console.log('Server is started on localhost:'+ (3000))
})



module.exports = app;
