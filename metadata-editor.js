'use strict'

const events = require('events')

const moment = require('moment')

const makeFormEl = require('./make-form-el')

class MetadataEditor extends events.EventEmitter {
  constructor (parent) {
    super()
    const self = this
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

  updateRecord (evt) {
    const key = evt.target.dataset.key
    const val = evt.target.value
    const update = {}
    update[key] = val
    this.emit('change', update)
  }

  createForm () {
    this.titleEl = makeFormEl('Title', 'text', '', {dataset: {key: 'title'}, classList: ['js-title']})
    this.postOnEl = makeFormEl('Post on', 'datetime-local', '', {dataset: {key: 'posted'}, classList: ['js-datetime']})
    this.tagsEl = makeFormEl('Tags', 'text', '', {dataset: {key: 'tags'}, classList: ['js-tags']})
    this.el.appendChild(this.titleEl)
    this.el.appendChild(this.postOnEl)
    this.el.appendChild(this.tagsEl)
  }

  destroy () {
    this.parent.removeChild(this.el)
    while (this.el.hasChildNodes()) {
      this.el.removeChild(this.el.lastChild)
    }
  }
}

module.exports = MetadataEditor
