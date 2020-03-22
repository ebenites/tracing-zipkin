const express = require('express');
const app = express();


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
    localServiceName: "server-b",
    // defaultTags: { project: 'api-core-ui', component: 'serverB', version: '1.0.0' }, //stackoverflow.com/a/10855054/2823916
});

// Add zipkin express middleware
app.use(zipkinMiddleware({ tracer }));


app.get('/products', (req, res) => {

    // console.log(tracer.id.traceId) // Show traceId
    // console.log(tracer.id.spanId)  // Show spanId

    res.json([{id: 100, model: 'Galaxy S20', price: 2000.0}]);
    // res.status(404).json({message: 'Resource not found'});

});

app.listen(5000, () => {
    console.log('Server started!');
});