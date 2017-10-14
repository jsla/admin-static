import map from 'map-async'
import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'
import createReactClass from 'create-react-class'

import api from '../api'
import navigate from '../navigate'
import showDates from '../show-dates'

module.exports = createReactClass({
  getInitialState () {
    return {
      shows: [],
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getList()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Shows List</h1>

        { {
          'READY': this.renderTable,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderTable () {
    return (
      <Paper style={{overflowX: 'scroll'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Speaker 1</TableCell>
              <TableCell>Speaker 2</TableCell>
              <TableCell>Sponsor 1</TableCell>
              <TableCell>Sponsor 2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.state.shows.map((exp) => (
              <TableRow
                key={exp.date}
                hover
                style={{cursor: 'pointer'}} >
                <TableCell>{exp.date}</TableCell>
                <TableCell>{exp.host && exp.host.organization}</TableCell>
                <TableCell>{exp.speaker1 && exp.speaker1.name}</TableCell>
                <TableCell>{exp.speaker2 && exp.speaker2.name}</TableCell>
                <TableCell>{exp.sponsor1 && exp.sponsor1.organization}</TableCell>
                <TableCell>{exp.sponsor2 && exp.sponsor2.organization}</TableCell>
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

    var concepts = ['speaker', 'host', 'sponsor']
    map(concepts, api.list, (err, concepts) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      var [speakers, hosts, sponsors] = concepts

      var shows = showDates.map(function (date) {
        var speakerMatch = speakers.filter(function (speaker) {
          return (speaker.bookedShows || '').match(date)
        })

        var hostMatch = hosts.filter(function (host) {
          return (host.bookedShows || '').match(date)
        })

        var sponsorMatch = sponsors.filter(function (sponsor) {
          return (sponsor.bookedShows || '').match(date)
        })

        return {
          date: date,
          host: hostMatch[0],
          speaker1: speakerMatch[0],
          speaker2: speakerMatch[1],
          sponsor1: sponsorMatch[0],
          sponsor2: sponsorMatch[1]
        }
      })

      this.setState({shows: shows, _status: 'READY'})
    })
  },

  editShow (name) {
    navigate(`/shows/edit/${name}`)
  }
})
