function sendResponse(res, data) {
    const result = {
        result: 'OK',
        data,
    };
    res.status(200).json(result);
}
  
module.exports = sendResponse;
