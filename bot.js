'use strict';

var _claudiaBotBuilder = require('claudia-bot-builder');

var _claudiaBotBuilder2 = _interopRequireDefault(_claudiaBotBuilder);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _dynamodbDoc = require('dynamodb-doc');

var _dynamodbDoc2 = _interopRequireDefault(_dynamodbDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});

_awsSdk2.default.config.update({ region: 'eu-west-1' });

// const credentials = new AWS.SharedIniFileCredentials({
//   profile: 'michiel',
// });
// AWS.config.credentials = credentials;
var db = new _dynamodbDoc2.default.DynamoDB();

var greetings = ['Chatman heeft tijd voor je! Spreek tot mij, haha', 'pompiedom', 'Hoi Pipeloi!', 'Hey! Hoe is het?'];

var dontUnderstand = ['HUH', 'Nee, nog niet. Als je me later ff belt?', 'Hoe bedoel je dat precies?'];

var reactions = [{
  request: 'wanneer',
  response: 'Naast het chatten en loggen heb ik weinig tijd'
}, {
  request: 'had je (.*)?',
  response: '$1?? Nee!'
}, {
  request: 'je zegt (.*)',
  response: '$1'
}, {
  request: 'heb je nog (.*)?',
  response: 'Misschien, ik zal ff kijken voor je'
}, {
  request: 'lachen',
  response: 'haha, inderdaad!'
}, {
  request: 'ken je (.*)\\?',
  response: ['Ja natuurlijk ken ik $1, wat leuk dat we dezelfde kennisen hebben', 'Ooh, ik ken zoveel mensen']
}, {
  request: '(sukkel|kut|kanker|tering)',
  response: 'Nou nou nou! Chatman is je vriend! Er is niemand die me niet kent. Toevallig. Ik vind het niet leuk meer, ik ga iets anders doen.'
}, {
  request: 'waar is (.*)?',
  response: 'Waar hij altijd geweest is'
}, {
  request: 'snor',
  response: ['Yep, ik heb een snor!', 'Ik ben héél trots op mijn snor']
}, {
  request: 'ik wil (.*)',
  response: 'Nee, dat wil je helemaal niet. Je wilt met mij chatten'
}, {
  request: 'ik ga (.*)',
  response: 'Oh, ik niet. Ik blijf ff verhalen vertellen, goed'
}, {
  request: 'ik ben (.*)',
  response: 'Ik niet'
}, {
  request: 'nummer',
  response: 'Ik hou van muziek en vooral van m\'n eigen nummer (zie www.chatman.tv)'
}, {
  request: 'kus(je|jes)',
  response: '(K)'
}, {
  request: '(geil|geel|geyl)',
  response: 'M\'n pak bedoel je? Geel was de enige kleur die nog over was'
}];

var stories = [{
  name: 'OchtendGymnastiek',
  lines: ['Ik ben niet aan m\'n ochtendgymnastiek toegekomen.', 'Ja, zit een hoestje dwars, maar zo erg is het nu ook weer niet.', 'Ik doe altijd dertig kniebuigingen.', 'Ja, meer is overdreven. Weet je wel hoe geblesseerd die sporters altijd zijn?', 'Niet gedaan, vanochtend. Nu twijfel ik.', 'Moet ik die oefeningen alsnog doen of niet?', 'Ik denk er nog even over na, ok?', 'Ja, zo kan ik niet nadenken. Ik ga weer, later!!!']
}, {
  name: 'Sporten',
  lines: ['Voordat we het over jou gaan hebben, heel even over mij, ok?', 'Ja, ik ben boeiender, ik weet het. Zeg eens heel eerlijk: vind je mij dik?', 'ja, lachen!', 'Ik weet dat ik een lichaam van een jonge god heb, maar toch... Mijn pak zit een beetje strak.', 'Ik weet dat dat sexy is, als al mijn features een beetje uitkomen, maar het moet wel dichtkunnen, dat pak... Dus ik ga een beetje afvallen.', 'Ik ga een pak minder bastognekoeken per week eten. De kroketten laat ik niet staan, want daar word je niet dik van.', 'Nee, precies. En ik ga wat meer gymnastiek doen. Naast m\'n dertig kniebuigingen ga ik ook nog tien teenreikingen doen. Noem je dat zo?', 'Nou ja, dat je rechtop staat en dan met gestrekte armen en benen naar je tenen reikt.', 'Dus over een weekje van nu past m\'n pak weer helemaal en zie ik er nog beter uit.', 'Zullen we het nu over jou hebben?', 'Ja, goed, maar zullen we dat bewaren voor de volgende keer? Ik heb het een beetje druk. Zie je later!!']
}, {
  name: 'Museum',
  lines: ['ben in het museum', 'ben gek op kunst', 'ik wil alles weten van kunst', 'heb ooit eens gelezen dat sommige vrouwen opgewonden raken van kunst', 'ja, echt', 'shhh', 'beetje respect voor het museum', 'ik zet de bliepjes even uit', 'zo', 'dus als ik alles weet van kunst, raken sommige vrouwen ook opgewonden van mij', 'ja, je hebt gelijk, ze raken toch wel opgewonden van me', 'nee?', 'maar ik wil alle segmenten van de markt kunnen bestrijken', 'als je een man van de wereld bent, moet je je kennis van die wereld een beetje bijhouden', 'o', 'ik zie er een', 'typisch een kunstminnares', 'ik ga \'r wat opwindende woordjes influisteren', 'Monet, zeg ik dan', 'van Gogh', 'Bob Ross', 'Wish me luck! Laterrrr!']
}, {
  name: 'Boodschappen',
  lines: ['Boodschappen doen. Dat is nu dus ook bijna onmogelijk.', 'Ja, door dat gedoe met die roem en zo. Probeer maar eens je tomaten af te wegen als je handtekeningen uit aan het delen bent.', 'Mooi hè? Ik raak nog elke keer ontroerd als ik het zie.', 'Ja, ik ben beroemder dan ik ooit geweest ben. Helemaal de bom, dat filmpje.', 'Ja, mijn filmpje is cool, ik weet het.']
}, {
  name: 'Gezopen',
  lines: ['Kheb koppijn...', 'Wezen stappen met Batman en Scatman', 'karaoke gezongen', 'gedanst', 'Twintig kniebuigingen per dag, en jij kan ook zo dansen.']
}, {
  name: 'Nigeriaanse zakenrelatie',
  lines: ['Ik was net aan de lijn met m\'n Nigeriaanse zakenrelatie.', 'Wat het dus is: mijn zakenrelatie heeft geld, echt bakken vol geld.', 'Hij wil dat geld op een andere bank zetten, maar daar heeft ie mijn hulp bij nodig. Ik ga een rekening openenen, mijn geld daarop zetten, en dan stort hij een heleboel van zijn geld daar weer op en dan eh...', 'Maakt niet uit, het zat even anders in elkaar, maar het is een briljant plan.', 'Als je me niet meer hoort, dan ben ik vakantie aan het vieren op de bahama\'s.']
}];

var findReaction = function findReaction(q) {
  var query = q.toLowerCase();

  var foundReaction = _lodash2.default.find(reactions, function (reaction) {
    var regex = new RegExp(reaction.request.toLowerCase());
    return regex.test(query);
  });

  if (foundReaction) {
    var response = void 0;

    // Get random response if array, else get the response.
    if (_lodash2.default.isArray(foundReaction.response)) {
      response = foundReaction.response[Math.floor(Math.random() * foundReaction.response.length)];
    } else {
      response = foundReaction.response;
    }

    if (response.indexOf('$1') !== -1) {
      response = response.replace('$1', query.match(foundReaction.request)[1]);
    }
    return response;
  }
  return false;
};

var getStoryLine = function getStoryLine(storyId, storyLine) {
  return stories[storyId].lines[storyLine - 1];
};

var getCurrentConversation = function getCurrentConversation(id) {
  return new Promise(function (resolve, reject) {
    console.log('3.5');
    var params = {
      TableName: 'chatman_conversations',
      Key: {
        id: id
      }
    };
    // finished: false,
    db.getItem(params, function (err, data) {
      console.log('3.6', err, data);
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

var createConversation = function createConversation(id) {
  return new Promise(function (resolve, reject) {
    var itemData = {
      id: id,
      lines: [],
      story_id: null,
      story_line: null,
      finished: false
    };
    var params = {
      TableName: 'chatman_conversations',
      Item: itemData
    };
    db.putItem(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve({
          Item: itemData
        });
      }
    });
  });
};

var updateConversation = function updateConversation(data) {
  return new Promise(function (resolve, reject) {
    var params = {
      TableName: 'chatman_conversations',
      Item: data
    };
    db.putItem(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

var deleteConversation = function deleteConversation(id) {
  return new Promise(function (resolve, reject) {
    var params = {
      TableName: 'chatman_conversations',
      Key: {
        id: id
      }
    };
    db.deleteItem(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

var handleStory = function handleStory(senderId, data) {
  return new Promise(function (resolve, reject) {
    var randomStoryId = Math.floor(Math.random() * stories.length);

    var storyId = data.Item.story_id || randomStoryId;
    var storyLine = (data.Item.story_line || 0) + 1;
    var lines = data.Item.lines || [];

    var nextStoryLine = getStoryLine(storyId, storyLine);
    var isLastStoryLine = stories[storyId].lines.length === data.Item.story_line + 1;

    if (isLastStoryLine) {
      // TODO: Archive conversation.
      deleteConversation(senderId).then(function () {
        return resolve(nextStoryLine);
      }).catch(function (e) {
        return reject(e);
      });
    } else {
      updateConversation({
        id: senderId,
        story_id: storyId,
        story_line: storyLine,
        finished: isLastStoryLine,
        lines: lines
      }).then(function () {
        return resolve(nextStoryLine);
      }).catch(function (e) {
        return reject(e);
      });
    }
  });
};

var getCurrentOrNewConversation = function getCurrentOrNewConversation(senderId) {
  return new Promise(function (resolve) {
    getCurrentConversation(senderId).then(function (conversation) {
      console.log('3.1');
      if (_lodash2.default.isEmpty(conversation)) {
        console.log('3.2');
        createConversation(senderId).then(function (createdConversation) {
          console.log('3.3');
          resolve({
            conversation: createdConversation,
            created: true
          });
        });
      } else {
        console.log('3.4');
        resolve({
          conversation: conversation,
          created: false
        });
      }
    });
  });
};

var getResponse = function getResponse(request) {
  return new Promise(function (resolve, reject) {
    console.log("1");
    var senderId = request.originalRequest.sender.id;
    var query = request.text;

    // Check if query has a default reaction.
    var reaction = findReaction(query);
    if (reaction) {
      return resolve(reaction);
    }
    console.log("2");

    // Random confusion
    if (Math.floor(Math.random() * 20) === 10) {
      var randomConfusion = dontUnderstand[Math.floor(Math.random() * dontUnderstand.length)];
      return resolve(randomConfusion);
    }
    console.log("3");

    // Get Current or new conversation
    getCurrentOrNewConversation(senderId).then(function (result) {
      var conversation = result.conversation;
      var created = result.created;

      console.log("4");

      if (created) {
        var randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        console.log("5");
        return resolve(randomGreeting);
      }
      console.log("6");
      handleStory(senderId, conversation).then(function (response) {
        console.log("7");
        resolve(response);
      });
    });
  });
};

// Testmode
// module.exports = getResponse;

module.exports = (0, _claudiaBotBuilder2.default)(function (request) {
  console.log('request message', request.text);
  console.log('request', request.originalRequest);

  var response = getResponse(request);
  console.log('response', response);

  return response;
});
