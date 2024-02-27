'use strict';

module.exports = {
  up: (models, mongoose) => {
    return models.users
    .insertOne ({
      _id : '65dd74c80697c4fa67d003dd',

      user_details :{
        name : mark,
        email : 'mark@gmail.com',
        password : 'mark@123',



      }

    }
    )


    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          insertOne: {
            document: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    */
  },

  down: (models, mongoose) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
  }
};
