const screenshot = require('desktop-screenshot');
const jimp = require('jimp');
const fs = require('fs');

module.exports = async function getScreenshotAsync() {
  const screenshotName = 'temp';
  await takeScreenshotAsync(screenshotName);
  const image = await readImageAsync(screenshotName);
  deleteScreenshot(screenshotName);
  return image;
};

async function takeScreenshotAsync(name) {
  return new Promise((resolve, reject) => {
    screenshot(`${name}.png`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function readImageAsync(name) {
  return new Promise((resolve, reject) => {
    jimp.read(`${name}.png`, (err, image) => {
      if (err) reject(err);
      else resolve(image);
    });
  });
}

function deleteScreenshot(name) {
  fs.unlinkSync(`${name}.png`);
}
