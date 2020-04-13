let data = require('@begin/data')

exports.handler = async function http(req) {

  // defaults to query alltime db
  let query = 'alltime'

  // if month/day are defined get those results
  if (req.queryParametere && req.queryParameters.month && req.queryParameters.day) {
    query = `day-${req.queryParameters.month }-${ req.queryParameters.day}`  
  }

  // if only month is on the url use that
  if (req.queryParametere && req.queryParameters.month) {
    query = `month-${ req.queryParameters.month }`  
  }

  let result = await data.get({ table: query })

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: `<!doctype html>

    <h1>hit counter page</h1>
    <img width=200 src=/cute.gif>
    <hr>

    <section>
      <h2>${ query }</h2>
      <pre>${ JSON.stringify(result, null, 2) }</pre>
    </section>

    <section>
      <h2>this request</h2>
      <pre>${ JSON.stringify(req, null, 2) }</pre>
    </section>
    `
  }
}
