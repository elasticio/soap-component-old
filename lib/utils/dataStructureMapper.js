/* eslint no-param-reassign: 0 */

class DataStructureMapper {
  constructor(logger) {
    this.logger = logger;
  }

  mapInputObjectStructure(structure, object) {
    this.processObject(structure, object);
    return object;
  }

  processObject(structure, object) {
    if (structure.targetNSAlias) object.targetNSAlias = structure.targetNSAlias;
    if (structure.targetNamespace) object.targetNamespace = structure.targetNamespace;
    Object.keys(object).forEach((key) => {
      if (typeof object[key] === 'object') this.processObject(structure[key], object[key]);
    });
  }
}

module.exports.DataStructureMapper = DataStructureMapper;
