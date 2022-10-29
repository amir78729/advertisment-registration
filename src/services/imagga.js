const credentials = require('../credentials');
const fetch = require('node-fetch');

const processImage = async (image) => {
  const response = await fetch(`https://api.imagga.com/v2/tags?image_url=${image}`, {
    headers: {
      Authorization: credentials.imaggaAuthorization,
    }
  })
  const processingData = await response.json();
  const vehicleData = processingData?.result?.tags?.filter(item => item.tag?.en === 'vehicle')[0];
  return {
    isVehicleValid: !!(vehicleData && vehicleData?.confidence > 50),
    category: processingData?.result?.tags[0].tag?.en,
  }
}

module.exports = { processImage };
