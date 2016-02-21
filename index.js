"use strict";

let SEE = require('./see.js');

module.exports = function sequencer (chai, utils) {
    let Assertion = chai.Assertion;

    // check the first event
    Assertion.addMethod('sEmit',        emit);
    // check the next event
    Assertion.addMethod('sNext',        next);
    // check the next event of a few events
    Assertion.addMethod('sNextOneOf',   nextOneOf);
    // check number of calls of the current event
    Assertion.addMethod('sCallsCount',  callsCount);
    // check number of calls of the all events
    Assertion.addMethod('sAllCallsCount',  allCallsCount);
    // skip some events
    Assertion.addMethod('sSkip',        skip);
    // is the current event last of the events
    Assertion.addMethod('sIsLast',      isLast);

    function emit (eEvent) {
        checkEventName(eEvent);
        checkInstance(this._obj);

        let see = this._obj;
        let event = see.__getCurrentEvent__();

        checkCurrentEvent(event);
        checkEqualEvent(eEvent, event);
    }

    function next (eEvent) {
        checkEventName(eEvent);
        checkInstance(this._obj);

        let see = this._obj;
        let event = see.__getNextEvent__();

        checkCurrentEvent(event);
        checkEqualEvent(eEvent, event);
    }

    function nextOneOf () {
        checkInstance(this._obj);

        let eEvents = [...arguments];
        let see = this._obj;
        let event = see.__getNextEvent__();

        eEvents.forEach((event) => {
            checkEventName(event);
        });

        checkCurrentEvent(event);
        checkOneOf(eEvents, event);
    }

    function allCallsCount (eCount) {
        checkCountOfNumber(eCount);
        checkInstance(this._obj);

        let see = this._obj;
        let count = see.__getCountCallsEvents__();

        checkCount(eCount, count);
    }

    function callsCount (eCount) {
        checkCountOfNumber(eCount);
        checkInstance(this._obj);

        let see = this._obj;
        let count = see.__getCountCallsEvent__();

        checkCount(eCount, count);
    }

    function skip (count) {
        checkCountOfNumber(count);
        checkInstance(this._obj);

        let see = this._obj;

        see.__skipEvents__(count);

        let event = see.__getCurrentEvent__();
        checkCurrentEvent(event);
    }

    function isLast () {
        checkInstance(this._obj);

        let see = this._obj;

        let event = see.__getCurrentEvent__();
        let isLast = see.__currentIsLast__();

        checkIsLast(isLast, event);
    }

    function checkCurrentEvent (event) {
        return new Assertion(event).to.be.a('string', 'all events are checked');
    }

    function checkEventName (eEvent) {
        return new Assertion(eEvent).to.be.a('string', 'Event name to be a String');
    }

    function checkInstance (instance) {
        return new Assertion(instance).to.be.instanceof(SEE, 'expected emitter to be instance of SEE');
    }

    function checkEqualEvent(eEvent, event) {
        return new Assertion(eEvent).to.equal(event, `expected event '${eEvent}' to be a '${event}'`);
    }

    function checkCount (eCount, count) {
        return new Assertion(eCount).to.equal(count,  `expected event call number '${eCount}' to be a '${count}'`);
    }

    function checkOneOf (eEvents, event) {
        return new Assertion(event).to.be.oneOf(eEvents);
    }

    function checkCountOfNumber (count) {
        return new Assertion(count).to.be.a('number', `${count} to be a Number`);
    }

    function checkIsLast (isLast, event) {
        return new Assertion(isLast).to.equal(true, `${event} should be a last`, `${event} shouldn't be a last`);
    }
};