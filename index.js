async function getColo() {
  let traceUrl = 'https://www.cloudflare.com/cdn-cgi/trace'
  let res = await fetch(traceUrl)
  let trace = await res.text()
  return trace.match(/^colo=(.+)/m)[1]
}

async function getColos() {
  if (getColos.value) return getColos.value
  let coloUrl = 'https://speed.cloudflare.com/locations'
  let colos = await fetch(coloUrl).then(r => r.json())
  let entries = colos.map(colo => [colo.iata, colo])
  return getColos.value = Object.fromEntries(entries)
}

export default {
  async fetch(request, env) {
    let {pathname} = new URL(request.url)
    if (pathname !== '/') return new Response(null, {status: 404})

    let {colo: worker, city} = request.cf
    let id = env.durableObjects.newUniqueId()
    return env.durableObjects.get(id).fetch(null, {
      method: 'POST',
      body: JSON.stringify({city, worker})
    })
  }
}

export class DurableObject {
  constructor(state, env) {
    this.storage = state.storage
    this.env = env
  }

  async fetch(request) {
    let {city, worker, object} = await request.json()

    if (!object) {
      let object = await getColo()
      let id = this.env.durableObjects.idFromName('/')
      return this.env.durableObjects.get(id).fetch(null, {
        method: 'POST',
        body: JSON.stringify({city, worker, object})
      })
    }

    try {
      if (!this.colos) {
        let list = await this.storage.list()
        this.colos = Object.fromEntries(list)
      }

      let objects = this.colos[worker]
      if (!objects) objects = this.colos[worker] = {}
      objects[object] = (objects[object] || 0) + 1
      await this.storage.put(worker, objects)

      let rollup = Object.entries(this.colos)
        .sort((a, b) => (a[0] > b[0]) - (a[0] < b[0]))
        .map(([worker, objects]) => {
          let total = Object.values(objects)
            .reduce((sum, n) => sum + n)

          let totals = Object.entries(objects)
            .sort((a, b) => b[1] - a[1])
            .map(([colo, n]) => [colo, (100 * n / total).toFixed(1)])

          return [worker, totals]
        })

      let colos = await getColos()

      let rows = rollup.reduce((html, [worker, totals]) => {
        if (!colos[worker]) return html

        let objs = totals
          .filter(t => t[0] in colos)
          .map(t => `<b>${t[1]}%</b> ${colos[t[0]].city} (${t[0]})`).join(', ')

        return html + `<tr><td class="pv3 pr3 bb b--black-20">${colos[worker].city} (${worker})</td><td class="pv3 pr3 bb b--black-20">${objs}</td></tr>`
      }, '')

      return new Response(template(city, colos[worker], colos[object], rows), {
        headers: {'content-type': 'text/html;charset=utf-8'}
      })
    }

    catch (e) {
      return new Response(e.stack)
    }
  }
}


let template = (city, worker, object, rows) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css">
    <link rel="icon" href="data:,">
  </head>
  <body class="sans-serif">
    <div class="pa5">
      <h1 class="f3 f2-m f1-l">Where Durable Objects Live</h1>

      <p class="measure lh-copy">
        <a href="https://developers.cloudflare.com/workers/learning/using-durable-objects" class="link blue">Cloudflare Durable Objects</a> are a novel approach to stateful compute based on <a href="https://workers.cloudflare.com/" class="link blue">Cloudflare Workers</a>. They aim to locate both compute <i>and</i> state closest to end users.
        This page tracks where new durable objects are created; for example, when you loaded this page from ${city}, a worker in ${worker.city} (${worker.iata}) created a durable object in ${object.city} (${object.iata}).
      </p>

      <br><br>

      <div class="overflow-auto">
        <table class="f6 w-100 mw8" cellspacing="0">
          <thead>
            <tr>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">Workers run here...</th>
              <th class="fw6 bb b--black-20 tl pb3 pr3 bg-white">...create durable objects here</th>
            </tr>
          </thead>
          <tbody class="lh-copy">${rows}</tbody>
        </table>
      </div>
    </div>
  </body>
</html>`
