function sendError(res, error, message) {
  const codeString = error.codeString || error.code;
  const status = error?.status || 500;
  
  const result = {
    result: 'OK',
    data: {
      code: codeString || 'SERVER ERROR',
      ...(message && { message }),
    },
  };
  res.status(status).json(result);
}

module.exports = sendError;
