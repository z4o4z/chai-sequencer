"use strict";

let EventEmitter = require('events');

const eventStack    = Symbol("eventStack");
const events        = Symbol("events");


const emit = EventEmitter.prototype.emit;

EventEmitter.prototype.emit = function (eventName) {
    this[eventStack] = this[eventStack] || [];
    this[events] = this[events] || {};

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

EventEmitter.prototype.__getEventsStack__ = function () {
    return this[eventStack];
};

EventEmitter.prototype.__getEventCallNumber__ = function (eventName) {

    return this[events][eventName].count;
};