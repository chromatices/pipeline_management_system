const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/submit',
    createProxyMiddleware({
      target: process.env.REACT_APP_YAML_MANAGER_SERVER,
      changeOrigin: true,
    })
  );

  app.use(
    '/api/v1/info',
    createProxyMiddleware({
      target: process.env.REACT_APP_MIDDLEWARE,
      changeOrigin: true,
    })
  );

  // 세 번째 엔드포인트
  app.use(
    '/api/v1/predict',
    createProxyMiddleware({
      target: process.env.REACT_APP_MIDDLEWARE,
      changeOrigin: true,
    })
  );
};