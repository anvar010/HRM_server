
'use strict';

module.exports = {
  up: (models, mongoose) => {
    return models.users
    .insertMany ([{
      _id : "65e557b0e06e940dfa023fa2",

      
        first_name : "mark",
        last_name : "antony",
        email : 'mark@gmail.com',
        password : "$2a$12$0gY8ytInp36Mef90KKKnpOWNhT789TunW/bMwayE2fSUvLod3/7v6",

    }
  ])
  .then((res)=>{
    console.log(res.insertMany)
  })


    
  },

  down: (models, mongoose) => {
    return models.users
    .deleteMany({
      _id : {
        $in : [
          "65e557b0e06e940dfa023fa2",
         

        ]
      }
    })
    .then((res)=>{
      console.log(res.deletedCount)
    });
 
  },
};
