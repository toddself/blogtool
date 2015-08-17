'use strict'

var _debounce = require('lodash.debounce')

var conduit = require('./conduit')
var Editor = require('./editor')
var PostSelector = require('./post-selector')

var newPostEl = document.querySelector('.js-new')
var showPostsEl = document.querySelector('.js-list')
var publishEl = document.querySelector('.js-publish')
var settingsEl = document.querySelector('.js-settings')
var contentEl = document.querySelector('.js-content')
var currentEditor
var currentBrowser

function openEditor (postId) {
  console.log(postId)
  conduit.emit('close:browser')
  if (currentEditor) {
    return currentEditor.save().then(function () {
      currentEditor = new Editor(postId, contentEl)
    })
  }
  currentEditor = new Editor(postId, contentEl)
}

function closeEditor () {
  if (currentEditor) {
    return currentEditor.save().then(function () {
      currentEditor.destroy()
    })
  }
}

function openBrowser () {
  conduit.emit('close:editor')
  if (currentEditor) {
    return currentEditor.save().then(function () {
      currentBrowser = new PostSelector(contentEl)
      currentBrowser.init()
      currentEditor = undefined
    })
  }
  currentBrowser = new PostSelector(contentEl)
  currentBrowser.init()
}

function closeBrowser () {
  currentBrowser && currentBrowser.destroy()
}

function main () {
  document.body.style.height = window.innerHeight + 'px'
  conduit.on('open:editor', openEditor)
  conduit.on('close:editor', closeEditor)
  conduit.on('open:browser', openBrowser)
  conduit.on('close:browser', closeBrowser)

  window.addEventListener('resize', _debounce(function () {
    document.body.style.height = window.innerHeight + 'px'
  }, 25, {leading: true, trailing: true}))

  newPostEl.addEventListener('click', function () {
    conduit.emit('open:editor', null)
  })

  showPostsEl.addEventListener('click', function () {
    conduit.emit('open:browser')
  })

  publishEl.addEventListener('click', function () {
    if (typeof currentEditor !== 'undefined') {
      currentEditor.save().then(function () {
        console.log('publishing')
      })
    } else {
      console.log('publishing')
    }
  })

  settingsEl.addEventListener('click', function () {
    console.log('no dice')
  })
}

main()
