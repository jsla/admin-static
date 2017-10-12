var auth = require('./auth')

var API = process.env.API_ENDPOINT || 'https://admin.apps.js.la'

module.exports = {
  getHost,
  listHosts,
  getSpeaker,
  listSpeakers,
  getSponsor,
  listSponsors,
  updateSpeaker
}

function getHost (id, cb) { get('host', id, cb) }
function listHosts (cb) { list('host', cb) }
function getSpeaker (id, cb) { get('speaker', id, cb) }
function listSpeakers (cb) { list('speaker', cb) }
function updateSpeaker (speaker, cb) { update('speaker', speaker, cb) }
function getSponsor (id, cb) { get('sponsor', id, cb) }
function listSponsors (cb) { list('sponsor', cb) }

function list (type, cb) {
  var url = `${API}/api/list/${type}`
  auth.get(url, function (err, itemsById) {
    if (err) return cb(err)

    cb(null, Object.keys(itemsById).reduce(function (memo, key) {
      itemsById[key].id = key
      itemsById[key].dates = Object.values(itemsById[key].dates || {})
      memo.push(itemsById[key])

      return memo
    }, []))
  })
}

function get (type, id, cb) {
  var url = `${API}/api/get/${type}/${id}`
  auth.get(url, function (err, item) {
    if (err) return cb(err)

    item.id = id
    item.dates = Object.values(item.dates || {})

    cb(null, item)
  })
}

function update (type, item, cb) {
  var url = `${API}/api/update/${type}/${item.id}`
  auth.post(url, item, cb)
}
