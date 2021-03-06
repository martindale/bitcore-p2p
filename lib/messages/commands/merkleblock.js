'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore');
var BufferUtil = bitcore.util.buffer;
var $ = bitcore.util.preconditions;
var _ = bitcore.deps._;

var MerkleBlock = bitcore.MerkleBlock;
var magicNumber = bitcore.Networks.defaultNetwork.networkMagic.readUInt32LE(0);

/**
 * Contains information about a MerkleBlock
 * @see https://en.bitcoin.it/wiki/Protocol_documentation
 * @param {Object} options
 * @param {MerkleBlock} options.merkleBlock
 */
function MerkleblockMessage(options) {
  if (!(this instanceof MerkleblockMessage)) {
    return new MerkleblockMessage(options);
  }
  if(!options) {
    options = {};
  }
  Message.call(this, options);
  this.magicNumber = magicNumber;
  this.command = 'merkleblock';
  $.checkArgument(
    _.isUndefined(options.merkleBlock) ||
      options.merkleBlock instanceof MerkleBlock
  );
  this.merkleBlock = options.merkleBlock;
}
inherits(MerkleblockMessage, Message);

MerkleblockMessage.fromBuffer = function(payload) {
  var obj = {};
  $.checkArgument(BufferUtil.isBuffer(payload));
  obj.merkleBlock = MerkleBlock.fromBuffer(payload);
  return new MerkleblockMessage(obj);
};

MerkleblockMessage.prototype.getPayload = function() {
  return this.merkleBlock ? this.merkleBlock.toBuffer() : BufferUtil.EMPTY_BUFFER;
};

module.exports = function(options) {
  magicNumber = options.magicNumber || magicNumber;
  MerkleBlock = options.MerkleBlock || MerkleBlock;
  return MerkleblockMessage;
};
