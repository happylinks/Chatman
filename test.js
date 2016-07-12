var bot = require('./bot');

bot({
  text: process.argv[2],
  originalRequest: {
    sender: {
      id: "16"
    }
  },
}).then(function(response) {
  console.log('response: ', response);
});
