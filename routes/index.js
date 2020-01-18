var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const axios = require('axios');

router.get('/get', async function(req, res, next) {
  // Temp
  const urlList = [
    'https://ichef.bbci.co.uk/wwfeatures/live/976_549/images/live/p0/7r/yy/p07ryyyj.jpg',
    'https://www.sciencemag.org/sites/default/files/styles/inline__699w__no_aspect/public/dogs_1280p_0.jpg?itok=_Ch9dkfK',
    'https://media-exp1.licdn.com/dms/image/C5103AQH1_LNOfsbFoQ/profile-displayphoto-shrink_200_200/0?e=1584576000&v=beta&t=X9uSLtg5_kxL3nF7vBo_MvZ_JPaXjSb9nwWTzkjHB2M',
    'https://media-exp1.licdn.com/dms/image/C5103AQFOXQZs5nuoXQ/profile-displayphoto-shrink_200_200/0?e=1584576000&v=beta&t=v6Bxl3WaHQTF1LWwHGIYOfL-OFhh2pdpnPIhA2f1p3Y',
    'https://avatars3.githubusercontent.com/u/37643262?v=4?height=180&width=180'
  ];
  const infoList = await getTags(5, urlList); // 10 is the number of pictures uploaded, temporarily put to 10

  console.log('res', infoList);
  // // calculatePoints(unprocessedTags[i].confidence);
  // var dict = {};
  // var i;
  // for (i = 0; i < unprocessedTags.length(); i++) {
  //   dict.name = unprocessedTags[i].name;
  //   dict.points = calculatePoints(unprocessedTags[i].confidence);
  //   //dict.imageUrl = ;
  // }
});

/** Points distribution based on confidence level */
function calculatePoints(confidence) {
  switch(roundUp(confidence, 1)) {
    case 1.0:
      return 20;
    case 0.9:
      return 18;
    case 0.8:
      return 16;
    case 0.7:
      return 14;
    case 0.6:
      return 12;
    case 0.5:
      return 10;
    case 0.4:
      return 7;
    default:
      return 5;
  }
};

/**
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 */
function roundUp(num, precision) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

/** This function gets the tags of all the images and their corresponding confidence levels.
 * Takes in the total number of pictures used and the list of image URLs.
 * Returns an ordered list of tags containing name and confidence.
*/
function getTags(numOfPics, urlList) {
  var tagList = [];

  var i;
  for (i = 0; i < numOfPics; i++) {
    tagList.push(createImageInfo(urlList[i]));
  }
  
  return Promise.all(tagList).then(values => {
    // Code below is for the purpose of debugging
    // for (i = 0; i < numOfPics; i++) {
    //   console.log(i);
    //   console.log(values[i]);
    // }
    // End of debugging code
    return values;
  });
};

/** Creates a dictionary of the image information given the image URL */
async function createImageInfo(url) {
  var imageDict = {};
  imageDict.url = url;
  const info = await tag(url);
  var i;
  // Number on the list set to 8
  for (i = 0; i < 8; i++) {
    const confidence = info[i].confidence;
    info[i].confidence = calculatePoints(confidence);
  }
  imageDict.info = info;
  console.log(info);
  return imageDict;
};

/** This function returns the tag corresponding to the image given in the image url 
 * Returns a dictionary with the name and confidence as well as hint (if any).
*/
function tag(url) {
  return axios({
    method: 'post',
    url: 'https://westus2.api.cognitive.microsoft.com/vision/v2.1/analyze?visualFeatures=Tags&language=en',
    headers: {
      'Content-Type': 'application/json', 
      'Ocp-Apim-Subscription-Key': 'a135c377379848b8a03213e115109b98'
    },
    data: {
      url: url
    }
  })  
    .then(function (response) {
      return response.data.tags;
    })
    .catch(function (error) {
      console.log(error);
      return 0;
    });
};

module.exports = router;

