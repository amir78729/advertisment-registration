const credentials = require('../credentials');
const fetch = require('node-fetch');

const processImage = async (_image) => {
  const image = 'https://amir78729.s3.ir-thr-at1.arvanstorage.com/car.jpeg'

  // const image = 'https://images.ctfassets.net/y6oq7udscnj8/4zKNtskONVxzqBnxfibMVg/8b4d23464674721e4ddca8653cbf4ead/Mailgun-Header.png'

  const response = await fetch(`https://api.imagga.com/v2/tags?image_url=${image}`, {
    headers: {
      Authorization: credentials.imagga.authorization,
    }
  })
  const processingData = await response.json();
  const vehicleData = processingData?.result?.tags?.filter(item => item.tag?.en === 'vehicle')[0];
  console.log({
    state: !!(vehicleData && vehicleData?.confidence > 50) ? 'APPROVED' : 'REJECTED',
    category: processingData?.result?.tags[0].tag?.en,
  })
  return {
    state: !!(vehicleData && vehicleData?.confidence > 50) ? 'APPROVED' : 'REJECTED',
    category: processingData?.result?.tags[0].tag?.en,
  }
}

processImage()

module.exports = { processImage };
