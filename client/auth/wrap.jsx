import React from 'react'
import createReactClass from 'create-react-class'

module.exports = function (fn, ...args) {
  return createReactClass({
    componentDidMount: function () {
      var el = fn(...args) || document.createElement('div')
      return this.element.appendChild(el)
    },
    render: function () {
      return <div ref={e => { this.element = e }} />
    }
  })
}
