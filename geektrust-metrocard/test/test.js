const assert = require('assert');
globalThis.td = require('testdouble');

describe('Metrocard Unit Tests', () => {
  describe('Utils Tests', () => {
    let utils;
    beforeEach(() => {
      utils = require('../utils-module.js');
    });
    it('should return false if no trip', () => {
      assert.equal(utils.isRoundTrip('MC1'), false);
    });

    it('should return false if not round trip', () => {
      const st = td.replace('../initial-state.js');
      const trips = td.replace(st, 'trips');
      td.when(trips.get('MC1')).thenReturn(['CENTRAL']);
      assert.equal(utils.isRoundTrip('MC1'), false);
    });
    
    it('should return false if no sufficient balance', () => {
      assert.equal(utils.isCardBalanceSufficient(100, 'ADULT'), false);
    });

    it('should return true if sufficient balance', () => {
      assert.equal(utils.isCardBalanceSufficient(500, 'ADULT'), true);
    });

    it('should return zero card balance', () => {
      assert.equal(utils.getCurrentCardBalance('MC1'), 0);
    });

    it('should return non-zero card balance', () => {
      var st = td.replace('../initial-state.js');
      var cardsBal = td.replace(st, 'cardsBal');
      var card = 'MC1';
      //cardsBal["get"] = td.function();
      td.when(cardsBal.get(card)).thenReturn(400);
      var result = utils.getCurrentCardBalance(card);
      assert.equal(result, 400);
    });
  });
});