import map from 'map-async'
import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import AddIcon from 'material-ui-icons/Add'
import Typography from 'material-ui/Typography'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import List, { ListItem, ListItemAvatar } from 'material-ui/List'
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
      allSpeakers: [],
      allSponsors: [],
      allHosts: [],
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
          'READY': this.renderMain,
          'ERROR': this.renderError,
          'LOADING': this.renderLoading
        }[this.state._status]() }
      </div>
    )
  },

  renderMain () {
    return (
      <div>
        { this.renderTable() }
        { this.renderDialog() }
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
                <TableCell>{this.renderContributor('hosts', exp.host, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('speakers', exp.speaker1, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('speakers', exp.speaker2, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('sponsors', exp.sponsor1, exp.date)}</TableCell>
                <TableCell>{this.renderContributor('sponsors', exp.sponsor2, exp.date)}</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </Paper>
    )
  },

  renderDialog (type, date) {
    var fn = {
      'speakers': this.renderSpeakerDialog
    }[this.state.addType]

    if (!fn) return <div />

    return fn(this.state.addDate)
  },

  renderSpeakerDialog (date) {
    var speakers = this.state.allSpeakers.filter(function (speaker) {
      return !speaker.bookedShows
    })

    return (
      <Dialog onRequestClose={this.closeAddDialog} open>
        <DialogTitle>Select Speaker</DialogTitle>
        <div style={{overflowY: 'scroll'}}>
          <List>
            { speakers.map((speaker, i) => {
              return (
                <ListItem
                  button
                  key={speaker.name}
                  onClick={this.bookContributor.bind(this, 'speaker', speaker, date)} >
                  <ListItemAvatar style={{marginRight: 20}}>
                    <Avatar><img src={speaker.avatar} /></Avatar>
                  </ListItemAvatar>
                  {speaker.name}: "{truncate(speaker.title)}"
                </ListItem>
              )
            })}
          </List>
        </div>
      </Dialog>
    )
  },

  renderContributor (type, contributor, date) {
    if (!contributor) {
      return (
        <Button style={{opacity: 0.3}} onClick={() => {
          this.setState({
            addType: type,
            addDate: date
          })
        }} >
          <AddIcon />
        </Button>
      )
    }

    return (
      <div>
        <a href={`#/${type}/edit/${contributor.id}`}>
          {contributor.organization || contributor.name}
        </a>
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

    var conceptNames = ['speaker', 'host', 'sponsor']
    map(conceptNames, api.list, (err, concepts) => {
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

      this.setState({
        shows: shows,
        allSpeakers: speakers,
        allSponsors: sponsors,
        allHosts: hosts,
        _status: 'READY'
      })
    })
  },

  editShow (name) {
    navigate(`/shows/edit/${name}`)
  },

  closeAddDialog () {
    this.setState({
      addType: null,
      addDate: null
    })
  },

  bookContributor (type, contributor, date) {
    var bookedDates = (contributor.bookedShows || '').split('\n')
    bookedDates.push(date)

    contributor.bookedShows = Object.keys(
      bookedDates.reduce(function (memo, key) {
        if (key) memo[key] = true
        return memo
      }, {})
    ).join('\n')

    this.setState({_status: 'LOADING', addDate: null, addType: null})
    api.update(type, contributor, (err, updated) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.getList()
    })
  }
})

function truncate (str, len) {
  len = len || 50
  if (str.length <= len) return str

  return str.slice(0, len - 3) + '...'
}
