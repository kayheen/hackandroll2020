var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const axios = require('axios');

router.get('/getinformation', async function(req, res, next) {
  // Temp
  /*const urlList = [
    'https://ichef.bbci.co.uk/wwfeatures/live/976_549/images/live/p0/7r/yy/p07ryyyj.jpg',
    'https://www.sciencemag.org/sites/default/files/styles/inline__699w__no_aspect/public/dogs_1280p_0.jpg?itok=_Ch9dkfK',
    'https://media-exp1.licdn.com/dms/image/C5103AQH1_LNOfsbFoQ/profile-displayphoto-shrink_200_200/0?e=1584576000&v=beta&t=X9uSLtg5_kxL3nF7vBo_MvZ_JPaXjSb9nwWTzkjHB2M',
    'https://media-exp1.licdn.com/dms/image/C5103AQFOXQZs5nuoXQ/profile-displayphoto-shrink_200_200/0?e=1584576000&v=beta&t=v6Bxl3WaHQTF1LWwHGIYOfL-OFhh2pdpnPIhA2f1p3Y',
    'https://avatars3.githubusercontent.com/u/37643262?v=4?height=180&width=180',
    'https://live.staticflickr.com/1924/43762031060_4fcdd57460_b.jpg',
    'https://avatars0.githubusercontent.com/u/42461097?v=4?height=180&width=180',
    'https://cs2103-ay1819s2-w14-2.github.io/main/images/carrein.png',
    'https://ichef.bbci.co.uk/news/660/cpsprodpb/5FD0/production/_108982542_07e3c4ae-e447-48e7-beb9-9242e374ed87.jpg',
    'https://dictionary.cambridge.org/es/images/thumb/black_noun_002_03536.jpg?version=5.0.65'
  ];*/
  var urlList = await initialiseGameImages();
  const infoList = await getTags(10, urlList); // 10 is the number of pictures uploaded, temporarily put to 10

  res.send(infoList);
});

/** Points distribution based on confidence level */
function calculatePoints(confidence) {
  switch(roundUp(Math.pow(confidence, 4), 1)) {
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
    var imageInfo = createImageInfo(urlList[i]);
    if (imageInfo !== -1) {
      tagList.push(imageInfo);
    }
    // else need to change to another picture url
  }
  
  return Promise.all(tagList).then(values => {
    return values;
  });
};

/** Creates a dictionary of the image information given the image URL */
async function createImageInfo(url) {
  var imageDict = {};
  imageDict.url = url;
  const info = await tag(url);
  // Number on the list set to 8
  // If less than 8 guesses, return -1 to indicate change of picture
  if (info === -1 || info.length < 5) {
    console.log("length", info.length);
    return await createImageInfo(await addImage());
  }
  else {
    var i;
    info.splice(8); // remove anything more than 8
    for (i = 0; i < info.length; i++) {
      const confidence = info[i].confidence;
      info[i].confidence = calculatePoints(confidence);
      info[i].show = false;
    }
    imageDict.info = info;
    return imageDict;
  }
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
      console.log(response.data.tags);
      return response.data.tags;
    })
    .catch(function (error) {
      //console.log(error);
      return -1;
    });
};

router.get('/addimage/', async function (req, res, next) {
  console.log(await addImage()); // url
});

function addImage() {
//  return axios({
//    method: 'get',
//    url: 'https://api.unsplash.com/photos/random/?client_id=c1e57fbf194467701bd8f5c796fb308dacb7c45da1a7aa4d3cebea399e88f715',
//    responseType: 'json'
//})
//  .then(function (response) {
//    //console.log(response.data.urls.regular);
//    return response.data.urls.regular;
//  }).catch(() => console.log("ADD IMAGE ERROR"));

    return axios({
        method: 'get',
        url: 'http://www.splashbase.co/api/v1/images/random',
        reponseType: 'json'
    }).then(function (response) {
        return response.data.url;
    }).catch(() => console.log("ADD IMAGE ERROR"));
};

/** Returns the images url for a game of 10 images */
async function initialiseGameImages() {
  var i;
  var urlList = [];
  for (i = 0; i < 10; i++) {
    urlList.push(await addImage());
  }
  //console.log(urlList);
  return urlList;
}

module.exports = router;

