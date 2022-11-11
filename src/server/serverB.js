const http = require('http');
const subscribeFromQueue = require('../services/ampq/subscriber');
const { processImage } = require('../services/imagga');
const { sendMail } = require('../services/mailgun');
const { updateAdById } = require('../dataaccess/Advertisement');


const handleResponse = async (msg) => {
  const id = msg.content.toString()
  console.log(`[ServerB/RabbitMQ] received message: ${id}`);
  console.log(`[ServerB/RabbitMQ] processing image for ad ${id}...`);
  
  const { state, category } = await processImage('https://www.wallpapertip.com/wmimgs/0-3060_ferrari-car-wallpaper-ferrari-car-images-hd.jpg');
  console.log(`[ServerB/RabbitMQ] results for ad ${id}: state: ${state}${state === 'APPROVED' ? `, category: ${category}` : ''}`);

  const { email } = await updateAdById(Number(id), { state, ...(state === 'APPROVED' && { category }) });
  console.log(`[MongoDB] ad ${id} status was update`);
  
  await sendMail(
    email,
    `اعلام وضعیت آگهی : «${state === 'APPROVED' ? 'تایید شده ✅' : 'رد شده ❌'}»`,
    state === 'APPROVED' ? `
    با سلام.
    آگهی شما با شناسه ${id} تایید شد!
    دسته‌بندی آگهی: ${category}
    ` : `
    با سلام.
    متاسفانه آگهی شما با شناسه ${id} رد شد.
    `
  )
};

const requestListener = function (req, res) {
  subscribeFromQueue(handleResponse);
  res.writeHead(200);
  res.end('');
};

const serverB = http.createServer(requestListener);

module.exports = {
  core: serverB,
  name: 'ServerB',
  port: 3002,
};