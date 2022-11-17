function sendError(res, error, message) {
  const codeString = error.codeString || error.code;
  const status = error?.status || 500;
  console.log('❌', error);
  const result = {
    result: 'ERR',
    data: {
      code: codeString || 'SERVER ERROR',
      ...(message && { message }),
    },
  };
  res.status(status).json(result);
}

module.exports = sendError;
