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
      speaker: {name: this.props.name},
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getSpeaker()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Edit Speaker</h1>
        { {
          'READY': this.renderEdit,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderEdit () {
    var months = this.state.speaker.dates.map(function (date) {
      var d = new Date(date).toString().split(' ')
      return `${d[1]} ${d[3]}`
    })

    return (
      <div>
        <TextField
          label='Name'
          name='name'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.speaker.name || ''}
          onChange={this.editSpeaker} />

        <TextField
          label='Email'
          name='email'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.speaker.email || ''}
          onChange={this.editSpeaker} />

        <TextField
          label='Github'
          name='github'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.speaker.github || ''}
          onChange={this.editSpeaker} />

        <TextField
          label='Twitter'
          name='twitter'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.speaker.twitter || ''}
          onChange={this.editSpeaker} />

        <TextField
          label='Avatar'
          name='avatar'
          margin='normal'
          style={{marginRight: 10}}
          value={this.state.speaker.avatar || ''}
          onChange={this.editSpeaker} />

        <br />

        <TextField
          label='Title'
          name='title'
          margin='normal'
          fullWidth
          value={this.state.speaker.title || ''}
          onChange={this.editSpeaker} />

        <TextField
          label='Abstract'
          name='abstract'
          margin='normal'
          multiline
          fullWidth
          value={this.state.speaker.abstract || ''}
          onChange={this.editSpeaker} />

        <TextField
          label='Dates Available'
          name='dates'
          margin='normal'
          fullWidth
          value={months.join(', ') || ''} />

        <br />

        <Button raised color='default' href={'#/speakers'} >
          Back
        </Button>

        <Button
          raised
          color='primary'
          onClick={this.updateSpeaker} >
          Update
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
            <Button raised color='primary' onClick={this.getSpeaker} >
              Retry?
            </Button>
          </p>
        </Paper>
      </div>
    )
  },

  getSpeaker () {
    var name = this.state.speaker.name
    this.setState({_status: 'LOADING'})
    api.getSpeaker(name, (err, speaker) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({speaker, _status: 'READY'})
    })
  },

  editSpeaker (event) {
    var speaker = this.state.speaker
    speaker[event.target.name] = event.target.value

    this.setState({ speaker })
  },

  updateSpeaker (event) {
    var speaker = this.state.speaker

    this.setState({_status: 'LOADING'})

    api.updateSpeaker(speaker, (err, updatedSpeaker) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({
        speaker: updatedSpeaker,
        _status: 'READY'
      })
    })
  }
})
