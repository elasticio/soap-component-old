# soap-component [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

# DEPRECATED please use https://github.com/openintegrationhub/soap-component instead

> Generic SOAP / WebServices integration component

# soap-component
SOAP component component for the [elastic.io platform](http://www.elastic.io &#34;elastic.io platform&#34;)

## Authentication

This component currently supports Baisc authentication, so credentials are like this:

![image](https://user-images.githubusercontent.com/56208/29668549-ed6ef326-88e0-11e7-9a56-67193056ada8.png)

As you may see you need following data:
* WSDL URL - this field is mandatory. WSDL is required if you want to call a SOAP service. It should be a readable URL.
* Username - optional username
* Password - optional password

Only if both ``username`` and ``password`` will be given, then Basic authentication header 
[will be added](https://github.com/elasticio/soap-component/blob/master/lib/actions/call.js#L32) to the SOAP call. 
You may also extend this component and add more authentication methods, see 
[node-soap documentation](https://github.com/vpulim/node-soap#security) on that topic

## Calling a SOAP Web-Service

You may try this component using a [sample SOAP service](https://github.com/elasticio/soap-sample) deployed 
[on Heroku](https://eio-soap-sample.herokuapp.com/ws/countries.wsdl). WSDL of that service you can find here:

```
https://eio-soap-sample.herokuapp.com/ws/countries.wsdl
```

This is how XML Request looks like:

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">
   <soapenv:Header/>
   <soapenv:Body>
      <gs:getCountryRequest>
         <gs:name>Spain</gs:name>
      </gs:getCountryRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

and response:

```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
   <SOAP-ENV:Header/>
   <SOAP-ENV:Body>
      <ns2:getCountryResponse xmlns:ns2="http://spring.io/guides/gs-producing-web-service">
         <ns2:country>
            <ns2:name>Spain</ns2:name>
            <ns2:population>46704314</ns2:population>
            <ns2:capital>Madrid</ns2:capital>
            <ns2:currency>EUR</ns2:currency>
         </ns2:country>
      </ns2:getCountryResponse>
   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

It's easy to try to call it from elastic.io, just place a WSDL in credentials, no authentication is needed, and then send
a message with following body:

```json
{
  "name":"Spain"
}
```

following body will also work:

```json
"body": {
  "_xml": "<getCountryRequest xmlns=\"http://spring.io/guides/gs-producing-web-service\"><name>Spain</name></getCountryRequest>"
}
```

more samples you can find in the [integration test](https://github.com/elasticio/soap-component/blob/master/spec-integration/eio-soap-sample.spec.js#L10).

## Known issues & limitations

There are following limitations & known issues:
* Only SOAP bindings are supported, HTTP bindings are not supported

See more documentation on [node-soap](https://github.com/vpulim/node-soap).


## License

Apache-2.0 © [elastic.io GmbH](https://elastic.io)


[npm-image]: https://badge.fury.io/js/soap-component.svg
[npm-url]: https://npmjs.org/package/soap-component
[travis-image]: https://travis-ci.org/elasticio/soap-component.svg?branch=master
[travis-url]: https://travis-ci.org/elasticio/soap-component
[daviddm-image]: https://david-dm.org/elasticio/soap-component.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/elasticio/soap-component
