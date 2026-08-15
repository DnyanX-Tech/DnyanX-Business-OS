const { createApp } = require('../dist/app.js');

let app;

function getApp() {
  if (!app) {
    app = createApp();
  }
  return app;
}

module.exports = (req, res) => {
  try {
    const expressApp = getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error('Unhandled Vercel serverless invocation error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      error: 'Vercel Serverless Invocation Error',
      message: error && error.message ? error.message : String(error)
    }));
  }
};
