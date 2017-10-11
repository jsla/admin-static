import React from 'react'
import ReactDOM from 'react-dom'
import googleFonts from 'google-fonts'

import Main from './main.jsx'

googleFonts.add({'Roboto': true})
document.body.style.margin = 0
document.body.style.background = '#fbfbfb'
document.body.style.fontFamily = 'Roboto'

var main = document.createElement('div')
document.body.appendChild(main)
ReactDOM.render(React.createElement(Main), main)
