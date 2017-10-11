import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import createReactClass from 'create-react-class'
import { CircularProgress } from 'material-ui/Progress'

import api from '../api'

module.exports = createReactClass({
  getInitialState () {
    return {
      host: {name: this.props.name},
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getHost()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Edit Host</h1>
        { {
          'READY': this.renderEdit,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderEdit () {
    var months = this.state.host.dates.map(function (date) {
      var d = new Date(date).toString().split(' ')
      return `${d[1]} ${d[3]}`
    })

    return (
      <div>
        <TextField
          label='Organization'
          name='organization'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.organization || ''} />

        <TextField
          label='Name'
          name='name'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.name || ''} />

        <TextField
          label='Email'
          name='email'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.email || ''} />

        <TextField
          label='Capacity'
          name='capacity'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.capacity || ''} />

        <TextField
          label='Microphone'
          name='hasMicrophone'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.hasMicrophone || ''} />

        <TextField
          label='Projector'
          name='hasProjector'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.hasProjector || ''} />

        <TextField
          label='Refreshments'
          name='refreshments'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.refreshments || ''} />

        <TextField
          label='Logo'
          name='logo'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.logo || ''} />

        <TextField
          label='Link'
          name='link'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.link || ''} />

        <TextField
          label='Address'
          name='address'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.host.address || ''} />

        <br />

        <TextField
          label='Parking Info'
          name='parking'
          margin='normal'
          fullWidth
          value={this.state.host.parking || ''} />

        <TextField
          label='Goal'
          name='goal'
          margin='normal'
          multiline
          fullWidth
          value={this.state.host.goal || ''} />

        <TextField
          label='Dates Available'
          name='dates'
          margin='normal'
          fullWidth
          value={months.join(', ') || ''} />

        <br />

        <Button raised color='default' href={'#/hosts'} >
          Back
        </Button>
      </div>
    )
  },

  renderLoading () {
    return (
      <div style={{textAlign: 'center', padding: 50}}>
        <CircularProgress size={100} />
      </div>
    )
  },

  renderError () {
    return (
      <div style={{textAlign: 'center'}}>
        <Paper style={{width: 300, padding: 20, margin: '0 auto'}}>
          <Typography type='headline' component='h1'>
            We're Sorry!
          </Typography>
          <p>Something went wrong...</p>
          <p>
            <Button raised color='primary' onClick={this.getHost} >
              Retry?
            </Button>
          </p>
        </Paper>
      </div>
    )
  },

  getHost () {
    var name = this.state.host.name
    this.setState({_status: 'LOADING'})
    api.getHost(name, (err, host) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({host, _status: 'READY'})
    })
  }
})
