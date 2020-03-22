# Configurar zipkin js con nodejs/express
https://medium.com/trabe/tracing-express-services-with-zipkin-js-6e5c5680467e


# Zikin Home
https://zipkin.io/


#Download zipkin jar server
https://zipkin.io/pages/quickstart.html#java

Execute with:
java -jar zipkin.jar

Probar:
http://localhost:9411/


# zipkin transport and instrumentation
https://zipkin.io/pages/tracers_instrumentation.html

# zipkin-js
https://github.com/openzipkin/zipkin-js

# zipkin transport http
https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-transport-http

# zipkin instrumentation express
https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-instrumentation-express


# superagent Rest Client
https://www.npmjs.com/package/superagent
https://github.com/visionmedia/superagent
https://visionmedia.github.io/superagent/

# superagent tracing with zipkin-js
https://github.com/openzipkin/zipkin-js/tree/master/packages/zipkin-instrumentation-superagent


# Intall Test dependences
$ Test\server-b>npm install
$ Test\server-a>npm install

# Run Test
$ Test\server-b>node src\index.js
$ Test\server-a>node src\index.js

# Test url:
GET http://localhost:5001/items
