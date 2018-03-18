var screenshot = require('desktop-screenshot');
var jimp = require('jimp');
var fs = require('fs');

module.exports = async function getScreenshotAsync() {
  var screenshotName = 'temp';
  await takeScreenshotAsync(screenshotName);
  var image = await readImageAsync(screenshotName);
  deleteScreenshot(screenshotName);
  return image;
}

async function takeScreenshotAsync(name) {
  return new Promise((resolve, reject) => {
    screenshot(name + '.png', function(error, complete) {
      if(error) reject(error);
      else resolve();
    });   
  });
}

async function readImageAsync(name) {
  return new Promise((resolve, reject) => {
    jimp.read(name + '.png', function (err, image) {
      if (err) reject(err);
      else resolve(image);
    });
  });
}

function deleteScreenshot(name){
  fs.unlinkSync(name + '.png');
}
