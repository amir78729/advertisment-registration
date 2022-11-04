function sendResponse({res, data, message}) {
    const result = {
        result: 'OK',
        ...(message && { message }),
        data,
    };
    res.status(200).json(result);
}
  
module.exports = sendResponse;
