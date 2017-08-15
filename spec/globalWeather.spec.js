var soap = require('soap');
(function () {
  'use strict';
  xdescribe('Given', function () {
    let client = null;
    let descriptor = null;
    beforeEach(function (done) {

      // Here we assume the http://www.webservicex.com/globalweather.asmx?wsdl is accessible
      soap.createClient('http://www.webservicex.com/globalweather.asmx?wsdl', function (err, result) {
        expect(err).toBeNull();
        client = result;
        descriptor = result.describe();
        expect(descriptor).not.toBeNull();
        done();
      });
    });
    it('Global Weather Service is accessible', function () {
      expect(client).not.toBeNull();
      expect(descriptor).not.toBeNull();
    });

    it('We have a reliable place for XML prefix lookups', function () {
      expect(client.wsdl.definitions.xmlns).toBeTruthy();
      expect(client.wsdl.definitions.xmlns.s).toEqual("http://www.w3.org/2001/XMLSchema");
    });

    it('We have a GlobalWeather Service with 2 ports', function () {
      expect(descriptor.GlobalWeather).toBeTruthy();
      expect(Object.keys(descriptor.GlobalWeather)).toEqual(['GlobalWeatherSoap', 'GlobalWeatherSoap12']);
      // Apparently only SOAP 1.1 and SOAP 1.2 bindings are supported by ``soap``
    });

    it('GlobalWeatherSoap12 port has 2 methods', function () {
      expect(descriptor.GlobalWeather.GlobalWeatherSoap12).toBeTruthy();
      expect(Object.keys(descriptor.GlobalWeather.GlobalWeatherSoap12)).toEqual(['GetWeather', 'GetCitiesByCountry']);
    });

    it('GlobalWeatherSoap12 port has 2 methods', function () {
      expect(descriptor.GlobalWeather.GlobalWeatherSoap12).toBeTruthy();
      expect(Object.keys(descriptor.GlobalWeather.GlobalWeatherSoap12)).toEqual(['GetWeather', 'GetCitiesByCountry']);
    });

    it('GetWeather operation has input and output', function () {
      expect(descriptor.GlobalWeather.GlobalWeatherSoap12.GetWeather).toBeTruthy();
      expect(Object.keys(descriptor.GlobalWeather.GlobalWeatherSoap.GetWeather)).toEqual(['input', 'output']);
      expect(JSON.stringify(descriptor.GlobalWeather.GlobalWeatherSoap.GetWeather.input)).toEqual('{"CityName":"s:string","CountryName":"s:string"}');
    });

    it('GetWeather operation has input and output', function () {
      const operation = descriptor.GlobalWeather.GlobalWeatherSoap12.GetWeather;
      expect(operation).toBeTruthy();
      expect(Object.keys(operation)).toEqual(['input', 'output']);
      expect(JSON.stringify(operation.input)).toEqual('{"CityName":"s:string","CountryName":"s:string"}');
    });

    it('Collect ports', function() {
      let ops = [];
      for(let serviceName in descriptor) {
        console.log('Found service=%s', serviceName);
        const service = descriptor[serviceName];
        for(let portName in service) {
          console.log('Found port=%s', portName);
          const port = service[portName];
          for(let opName in port) {
            console.log('Found operation=%s', opName);
            ops.push(`${serviceName}/${portName}/${opName}`);
          }
        }
      }
      expect(ops).toEqual(['GlobalWeather/GlobalWeatherSoap/GetWeather', 'GlobalWeather/GlobalWeatherSoap/GetCitiesByCountry', 'GlobalWeather/GlobalWeatherSoap12/GetWeather', 'GlobalWeather/GlobalWeatherSoap12/GetCitiesByCountry']);
    });

    it('GetWeather operation can be called', function (done) {
      const operation = client.GlobalWeather.GlobalWeatherSoap12.GetWeather;
      expect(operation).toBeTruthy();
      expect(typeof operation).toEqual('function');
      operation({
        CityName: "New York",
        CountryName: "United States"
      }, (err, result) => {
        expect(err).toBeNull();
        expect(result).toBeTruthy();
        done();
      }, {timeout: 5000});
    });

  });
})();
