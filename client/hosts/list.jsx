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
      hosts: [],
      _status: 'READY'
    }
  },

  componentWillMount () {
    this.getList()
  },

  render () {
    return (
      <div style={{padding: 40}}>
        <h1>Hosts List</h1>

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
              <TableCell>Contact Number</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Projector</TableCell>
              <TableCell>Microphone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.state.hosts.map((host) => (
              <TableRow
                key={host.id}
                hover
                style={{cursor: 'pointer'}}
                onClick={this.editHost.bind(this, host.id)} >
                <TableCell>
                  <img src={host.logo} style={{width: 50}} />
                </TableCell>
                <TableCell>{host.organization}</TableCell>
                <TableCell>{host.number}</TableCell>
                <TableCell>{(host.capacity || '').slice(0, 9)}</TableCell>
                <TableCell>{host.hasProjector}</TableCell>
                <TableCell>{host.hasMicrophone}</TableCell>
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
    api.listHosts((err, hosts) => {
      if (err) {
        this.setState({_status: 'ERROR'})
        return console.error(err)
      }

      this.setState({hosts: hosts, _status: 'READY'})
    })
  },

  editHost (name) {
    navigate(`/hosts/edit/${name}`)
  }
})
