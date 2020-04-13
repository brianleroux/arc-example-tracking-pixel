let data = require('@begin/data')
let fs = require('fs')
let path = require('path')
let img = fs.readFileSync(path.join(__dirname, 'cute.gif')).toString('base64')

exports.handler = async function cute(req) {

  // tracking data by referer url
  let key = req.headers['Referer'] || req.headers['referer']
  if (!key) key = 'no-referer'

  let prop = 'totals'
  let year = new Date(Date.now()).getFullYear()
  let month = new Date(Date.now()).getMonth() + 1
  let day = new Date(Date.now()).getDate()
  
  // write everything in parallel as quick as we can
  await Promise.all([

    // all time hits
    data.incr({ table: 'alltime',  key,  prop  }),

    // past thirty days
    data.incr({ table: `month-${ year }-${ month }`, key, prop  }),

    // past day
    data.incr({ table: `day-${ year }-${ month }-${ day }`, key, prop  }),
  ])

  // always return the pic
  return {
    statusCode: 201,
    headers: {
      'access-control-allow-origin': '*',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'image/gif'
    },
    isBase64Encoded: true,
    body: img
  }
}
