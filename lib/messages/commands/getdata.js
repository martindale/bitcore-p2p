'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore');
var utils = require('../utils');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;
var Inventory = require('../../inventory');
var _ = bitcore.deps._;

var magicNumber = bitcore.Networks.defaultNetwork.networkMagic.readUInt32LE(0);

/**
 * @param {Object|Array} - options - If options is an array will use as "inventory"
 * @param {Array} options.inventory - An array of inventory items
 * @extends Message
 * @constructor
 */
function GetdataMessage(options) {
  if (!(this instanceof GetdataMessage)) {
    return new GetdataMessage(options);
  }
  if(!options) {
    options = {};
  }
  Message.call(this, options);
  this.command = 'getdata';
  this.magicNumber = magicNumber;

  var inventory;
  if (_.isArray(options)) {
    inventory = options;
  } else {
    inventory = options.inventory;
  }

  utils.checkInventory(inventory);
  this.inventory = inventory;
}
inherits(GetdataMessage, Message);

GetdataMessage.fromBuffer = function(payload) {
  var obj = {
    inventory: []
  };

  var parser = new BufferReader(payload);
  var count = parser.readVarintNum();
  for (var i = 0; i < count; i++) {
    var type = parser.readUInt32LE();
    var hash = parser.read(32);
    obj.inventory.push({type: type, hash: hash});
  }

  utils.checkFinished(parser);
  return new GetdataMessage(obj);
};

GetdataMessage.prototype.getPayload = function() {
  var bw = new BufferWriter();
  utils.writeInventory(this.inventory, bw);
  return bw.concat();
};

module.exports = function(options) {
  magicNumber = options.magicNumber || magicNumber;
  return GetdataMessage;
};
