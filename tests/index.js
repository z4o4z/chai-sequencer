"use strict";

let chai        = require('chai');
let expect      = chai.expect;
let sequencer   = require("../index");
let SEE         = require('../see.js');

chai.use(sequencer);

let see = new SEE();

describe('sequencer', function() {

    beforeEach(function() {
        see.on('test1', () => console.log('test1 called'))
    });

    afterEach(function() {
        see.removeAllListeners();
    });


    it('quick test', function () {
        see.emit('test1');
        see.emit('test2');
        see.emit('test3');
        see.emit('test4');
        see.emit('test4');
        see.emit('test6');
        see.emit('test8');
        see.emit('test9');

        expect(see).to
            .sEmit('test1')
            .sNext('test2')
            .sSkip(2)
            .sCallsCount(2)
            .sEmit('test4')
            .sNextOneOf('test5', 'test6', 'test7')
            .sNext('test8')
            .sNext('test9')
            .sIsLast();
    });
});