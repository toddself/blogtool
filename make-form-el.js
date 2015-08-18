'use strict'

module.exports = function makeFormEl (label, type, value, inputAttr, labelAttr) {
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
