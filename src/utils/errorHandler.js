function sendError(res, error, message) {
  const codeString = error.codeString || error.code;
  const status = error?.status || 500;
  res.status(status).json({
    result: 'ERR',
    data: {
      code: codeString,
      message,
    },
  });
}

module.exports = sendError;
