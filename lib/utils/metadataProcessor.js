/* eslint no-param-reassign: 0 */

class MetadataProcessor {
  constructor(logger) {
    this.logger = logger;
  }

  soapLibraryToEioJson(object) {
    const objectCopy = JSON.parse(JSON.stringify(object));
    this.processObject(objectCopy);
    return objectCopy;
  }

  processObject(object) {
    if (Object.keys(object).length > 0) {
      const keys = Object.keys(object);
      object.properties = {};
      keys.forEach((key) => {
        if (object.properties[key] !== 'targetNSAlias' && object.properties[key] !== 'targetNamespace') {
          object.properties[key] = object[key];
        }
        delete object[key];
      });

      const { properties } = object;
      const propertiesKeys = Object.keys(properties);
      propertiesKeys.forEach((key) => {
        const element = properties[key];
        if (typeof element === 'string') properties[key] = this.resolveField(element);
        else if (typeof element === 'object') this.processObject(element);
      });
    }

    object.type = 'object';
    object.required = false;
  }

  resolveField(soapLibraryType) {
    if (soapLibraryType.includes('string')) {
      return {
        type: 'string',
        required: false,
      };
    }

    if (soapLibraryType.includes('int') || soapLibraryType.includes('float') || soapLibraryType.includes('double')) {
      return {
        type: 'number',
        required: false,
      };
    }

    if (soapLibraryType.includes('boolean') || soapLibraryType.includes('bool')) {
      return {
        type: 'boolean',
        required: false,
      };
    }

    if (soapLibraryType.includes('s:')) {
      this.logger.warn(`uncommon type found ${soapLibraryType}. Set to 'string' by 's:'`);
      return {
        type: 'string',
        required: false,
      };
    }

    this.logger.warn(`Cant resolve type ${soapLibraryType}. Set to 'string' by default`);
    return {
      type: 'string',
      required: false,
    };
  }
}

module.exports.MetadataProcessor = MetadataProcessor;
