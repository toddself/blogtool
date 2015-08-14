'use strict';
global.document = window.document;
global.navigator = window.navigator;

var MediumEditor = require('medium-editor');
var DrSax = require('dr-sax');
var level = require('level');
var _throttle = require('lodash.throttle');

var db = level('blogtooldb', {valueEncoding: 'json'})

var dr = new DrSax();
var editor = new MediumEditor('.editor');
editor.subscribe('editableInput', _throttle(function () {
  var contents = editor.serialize()['element-0'].value;
  var markdown = dr.write(contents);
  db.put('test', {content: markdown}, function (err) {
    if (err) {
      console.log('no write', err)
    }
    console.log('wrote')
  })
}, 1000, true));
