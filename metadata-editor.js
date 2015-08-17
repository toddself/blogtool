'use strict'

var util = require('util')
var events = require('events')

var moment = require('moment')

function makeFormEl (label, type, value, inputAttr, labelAttr) {
  inputAttr = inputAttr || {}
  labelAttr = labelAttr || {}
  var formEl = document.createElement('input')
  formEl.setAttribute('type', type)
  formEl.setAttribute('value', value)
  inputAttr.classList && formEl.classList.add(inputAttr.classList)
  delete inputAttr.classList
  Object.keys(inputAttr.dataset).forEach(function (key) {
    formEl.dataset[key] = inputAttr.dataset[key]
  })
  delete inputAttr.dataset
  Object.keys(inputAttr).forEach(function (key) {
    formEl.setAttribute(key, inputAttr[key])
  })

  var labelEl = document.createElement('label')
  labelEl.innerHTML = label
  labelEl.appendChild(formEl)
  labelAttr.classList && labelEl.classList.add(labelAttr.classList)
  delete labelAttr.classList
  Object.keys(labelAttr).forEach(function (key) {
    labelEl.setAttribute(key, labelAttr[key])
  })

  return labelEl
}

function MetadataEditor (parent) {
  var self = this
  this.parent = parent
  this.el = document.createElement('div')
  this.el.classList.add('metadata-editor', 'new')
  this.createForm()
  this.parent.appendChild(this.el)
  this.on('reset', function (content) {
    self.titleEl.querySelector('input').value = content.title
    self.postOnEl.querySelector('input').value = moment(content.posted).format('YYYY-MM-DDTHH:mm')
    self.tagsEl.querySelector('input').value = content.tags.join(' ,')
  })

  this.el.addEventListener('input', this.updateRecord.bind(this))
}

util.inherits(MetadataEditor, events.EventEmitter)

MetadataEditor.prototype.updateRecord = function (evt) {
  var key = evt.target.dataset.key
  var val = evt.target.value
  var update = {}
  update[key] = val
  this.emit('change', update)
}

MetadataEditor.prototype.createForm = function () {
  this.titleEl = makeFormEl('Title', 'text', '', {dataset: {key: 'title'}, classList: ['js-title']})
  this.postOnEl = makeFormEl('Post on', 'datetime-local', '', {dataset: {key: 'posted'}, classList: ['js-datetime']})
  this.tagsEl = makeFormEl('Tags', 'text', '', {dataset: {key: 'tags'}, classList: ['js-tags']})
  this.el.appendChild(this.titleEl)
  this.el.appendChild(this.postOnEl)
  this.el.appendChild(this.tagsEl)
}

MetadataEditor.prototype.destroy = function () {
  this.parent.removeChild(this.el)
  while (this.el.hasChildNodes()) {
    this.el.removeChild(this.el.lastChild)
  }
}

module.exports = MetadataEditor
