import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Switch from 'material-ui/Switch'
import Typography from 'material-ui/Typography'
import { FormControlLabel, FormGroup } from 'material-ui/Form'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'
import createReactClass from 'create-react-class'

import api from '../api'
import navigate from '../navigate'

module.exports = createReactClass({
  getInitialState () {
    return {
      speakers: [],
      filters: {
        hideBooked: true,
        hideArchived: true,
        hideUnsubmitted: true,
        onlyBooked: false,
        onlyArchived: false,
        onlyUnsubmitted: false
      },
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getList()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Speakers List</h1>

        { {
          'READY': this.renderList,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderList () {
    return (
      <div>
        {this.renderFilters()}
        {this.renderTable()}
      </div>
    )
  },

  renderFilters () {
    var filters = this.state.filters

    return (
      <FormGroup>
        <div style={{float: 'left', marginRight: 20}}>
          <FormControlLabel
            control={
              <Switch
                name='hideBooked'
                checked={filters.hideBooked}
                onChange={this.changeFilter}
                />
            }
            label='Hide Booked'
            />
          <FormControlLabel
            control={
              <Switch
                name='hideArchived'
                checked={filters.hideArchived}
                onChange={this.changeFilter}
                />
            }
            label='Hide Archived'
            />
          <FormControlLabel
            control={
              <Switch
                name='hideUnsubmitted'
                checked={filters.hideUnsubmitted}
                onChange={this.changeFilter}
                />
            }
            label='Hide Unsubmitted'
            />
        </div>

        <div>
          <FormControlLabel
            control={
              <Switch
                name='onlyBooked'
                checked={filters.onlyBooked}
                onChange={this.changeFilter}
                />
            }
            label='Only Booked'
            />
          <FormControlLabel
            control={
              <Switch
                name='onlyArchived'
                checked={filters.onlyArchived}
                onChange={this.changeFilter}
                />
            }
            label='Only Archived'
            />
          <FormControlLabel
            control={
              <Switch
                name='onlyUnsubmitted'
                checked={filters.onlyUnsubmitted}
                onChange={this.changeFilter}
                />
            }
            label='Only Unsubmitted'
            />
        </div>
      </FormGroup>
    )
  },

  renderTable () {
    var speakers = this.filterSpeakers(this.state.speakers)

    return (
      <Paper style={{overflowX: 'scroll'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { speakers.map((speaker) => (
              <TableRow
                key={speaker.id}
                hover
                style={{cursor: 'pointer'}}
                onClick={this.editSpeaker.bind(this, speaker.id)} >
                <TableCell>
                  <img src={speaker.avatar} style={{width: 50}} />
                </TableCell>
                <TableCell>{speaker.name}</TableCell>
                <TableCell>{speaker.title}</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </Paper>
    )
  },

  renderError () {
    return (
      <div style={{textAlign: 'center'}}>
        <Paper style={{width: 300, padding: 20, margin: '0 auto'}}>
          <Typography type='headline' component='h1'>
            We're Sorry!
          </Typography>
          <p>We couldn't load the list...</p>
          <p>
            <Button raised color='primary' onClick={this.getList} >
              Retry?
            </Button>
          </p>
        </Paper>
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

  getList () {
    this.setState({_status: 'LOADING'})
    api.listSpeakers((err, speakers) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({ speakers: speakers, _status: 'READY' })
    })
  },

  filterSpeakers (speakers) {
    var { hideBooked,
      hideArchived,
      hideUnsubmitted,
      onlyBooked,
      onlyArchived,
      onlyUnsubmitted} = this.state.filters

    return speakers
      .sort(function (a, b) { return a.name > b.name })
      .filter(function (speaker) {
        var visible = true
        if (hideBooked && speaker.bookedShows) visible = false
        if (hideArchived && speaker.isArchived) visible = false
        if (hideUnsubmitted && speaker.submitState !== 'done') visible = false
        if (onlyBooked && !speaker.bookedShows) visible = false
        if (onlyArchived && !speaker.isArchived) visible = false
        if (onlyUnsubmitted && speaker.submitState === 'done') visible = false
        return visible
      })
  },

  editSpeaker (name) {
    navigate(`/speakers/edit/${name}`)
  },

  changeFilter (evt, enabled) {
    var {filters} = this.state
    filters[evt.target.name] = enabled
    this.setState({filters})
  }
})
