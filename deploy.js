import {accountId, apiToken} from './config.js'

let script = await Deno.readTextFile('index.js')
let metadata = {
  main_module: 'index.js',
  bindings: [{
    type: 'durable_object_namespace',
    name: 'durableObjects',
    namespace_id: '3a64fec20a9344fe9feff621916323af'
  }]
}

let result = await deploy('where-durableobjects-live', script, metadata)
console.log(result)

async function deploy(name, script, metadata) {
  let body = new FormData()
  let json = JSON.stringify(metadata)

  body.append(
    'script',
    new Blob([script], {type: 'application/javascript+module'}),
    metadata.main_module
  )

  body.append(
    'metadata',
    new Blob([json], {type: 'application/json'}),
    'metadata.json'
  )

  return fetch(`scripts/${name}`, {method: 'PUT', body})
}

async function fetch(path, init) {
  if (!init) init = {}
  if (!init.headers) init.headers = {}
  init.headers.authorization = `Bearer ${apiToken}`

  let endpoint = 'https://api.cloudflare.com/client/v4/'
  let baseUrl = new URL(`accounts/${accountId}/workers/`, endpoint)
  let url = new URL(path, baseUrl)

  let res = await self.fetch(url, init)
  let {success, result, errors} = await res.json()
  if (success) return result

  let {code, message} = errors[0]
  let error = new Error(message)
  error.code = code
  throw error
}
