var auth = require('./auth')

var API = process.env.API_ENDPOINT || 'https://admin.apps.js.la'

module.exports = {
  getSpeaker,
  listSpeakers
}

function listSpeakers (cb) {
  var url = `${API}/api/list/speaker`
  auth.get(url, function (err, speakersById) {
    if (err) return cb(err)

    cb(null, Object.keys(speakersById).reduce(function (memo, key) {
      speakersById[key].id = key
      speakersById[key].dates = Object.values(speakersById[key].dates || {})
      memo.push(speakersById[key])

      return memo
    }, []))
  })
}

function getSpeaker (id, cb) {
  var url = `${API}/api/list/speaker`
  auth.get(url, function (err, speakersById) {
    if (err) return cb(err)

    speakersById[id].dates = Object.values(speakersById[id].dates || {})
    cb(null, speakersById[id])
  })
}
