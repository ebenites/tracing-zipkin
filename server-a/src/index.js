const express = require('express');
const app = express();

// const helmet = require('helmet');
// app.use(helmet());

// Import zipkin stuff
const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware;

const ZIPKIN_ENDPOINT = process.env.ZIPKIN_ENDPOINT || "http://localhost:9411";

// Get ourselves a zipkin tracer
const tracer = new Tracer({
  ctxImpl: new ExplicitContext(),
  //recorder: new ConsoleRecorder(),
  recorder: new BatchRecorder({
      logger: new HttpLogger({
          endpoint: `${ZIPKIN_ENDPOINT}/api/v2/spans`,
          jsonEncoder: jsonEncoder.JSON_V2,
      }),
  }),
  localServiceName: "server-a",
  // defaultTags: { project: 'api-core-ui', component: 'serverA', version: '1.0.0' }, //stackoverflow.com/a/10855054/2823916
});

// Add zipkin express middleware
app.use(zipkinMiddleware({ tracer }));


// Custom Logger Middleware https://expressjs.com/es/guide/writing-middleware.html
var loggerMiddleware = function (req, res, next) {
  tracer.writeIdToConsole(req.method + ' ' + req.url);  
  res.set('IdTransaccion', tracer.id.traceId);
  res.set('User-Agent', req.get('User-Agent'));
  
  // https://skonves.github.io/pages/correlation-ids.html
  // var correlationId = req.get('X-Correlation-Id') || uuid.v4(); // npm install uuid, var uuid = require('uuid');
  // res.set('X-Correlation-Id', correlationId);

  next();
};

app.use(loggerMiddleware);


app.get('/items', (req, res) => {

  // console.log(tracer.id.traceId) // Show traceId
  // console.log(tracer.id.spanId)  // Show spanId
  const traceId = tracer.id.traceId;

  // Tracing local operations: https://github.com/openzipkin/zipkin-js-example/blob/master/web/frontend.js
  // tracer.local("Tracing internal operation...", () => { console.log('Complete operation!') });

  // Import superagent rest client
  const superagent = require('superagent');

  // Import zipkin instrumentation for superagent rest client
  const zipkinPlugin = require('zipkin-instrumentation-superagent');

  superagent.get('http://localhost:5000/products')
    .use(zipkinPlugin({tracer, remoteServiceName: 'server-b'}))  // Add zipkin superagent plugin
    .then((response) => res.json({success: true, transactionid: traceId, data: response.body}))
    .catch((e) => res.status(e.response?e.response.status:500).json({success: false, transactionid: traceId, data: e.response?e.response.body:e.message})); // Si el servicio no está disponible e.response es undefined

});

app.listen(5001, () => {
  console.log('Server started!');
});