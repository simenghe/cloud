addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  await MY_KV.put("key", "value")
  const value = await MK_KV.get("key")
  console.log(value)
  return new Response(`Hello worker! ${value}`, {
    headers: { 'content-type': 'text/plain' },
  })
}
