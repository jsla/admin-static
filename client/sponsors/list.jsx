import React from 'react'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'
import createReactClass from 'create-react-class'

import api from '../api'
import navigate from '../navigate'

module.exports = createReactClass({
  getInitialState () {
    return {
      sponsors: [],
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getList()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Sponsors List</h1>

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
              <TableCell>Logo</TableCell>
              <TableCell>Organization</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.state.sponsors.map((sponsor) => (
              <TableRow
                key={sponsor.id}
                hover
                style={{cursor: 'pointer'}}
                onClick={this.editSponsor.bind(this, sponsor.id)} >
                <TableCell>
                  <img src={sponsor.logo} style={{width: 50}} />
                </TableCell>
                <TableCell>{sponsor.organization}</TableCell>
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
    api.listSponsors((err, sponsors) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({sponsors: sponsors, _status: 'READY'})
    })
  },

  editSponsor (name) {
    navigate(`/sponsors/edit/${name}`)
  }
})
