"use strict";

let EventEmitter = require('events');

const eventStack    = Symbol("eventStack");
const events        = Symbol("events");
const current       = Symbol("current");


const emit = EventEmitter.prototype.emit;

EventEmitter.prototype.emit = function (eventName) {
    this[eventStack] = this[eventStack] || [];
    this[events] = this[events] || {};
    this[current] = this[current] || 0;

    this.__addEventToStack__(eventName);

    emit.apply(this, arguments);
};

EventEmitter.prototype.__addEventToStack__ = function (eventName) {
    let event = this[events][eventName];

    if (!event) {
        event = {
            count: 0
        };

        this[events][eventName] = event;
    }

    this[eventStack].push(eventName);

    event.count += 1;
};

EventEmitter.prototype.__getCurrentEvent__ = function () {
    return this[eventStack][this[current]];
};

EventEmitter.prototype.__getNextEvent__ = function () {
    this[current] += 1;

    return this.__getCurrentEvent__();
};

EventEmitter.prototype.__getEventCallNumber__ = function () {
    return this[events][this[eventStack][this[current]]].count;
};

EventEmitter.prototype.__getCallNumberAllEvents__ = function () {
    return this[eventStack].length;
};

EventEmitter.prototype.__skipEvents__ = function (count) {
    this[current] += (count + 1);
};

EventEmitter.prototype.__currentIsLast__ = function () {
    return this[eventStack].length - 1 === this[current];
};
