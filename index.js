addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
  }
  console.log("Request Found.")
  console.log(url.pathname)
  if (url.pathname.toLowerCase() == "/posts") {

    if (request.method.toUpperCase() == "GET") {
      let posts = await STORED.get("posts", { type: "json" })
      if (posts) {
        console.log("Returning existing posts")
        return new Response(JSON.stringify(posts), {
          headers: headers,
          status: 200,
        })
      }
      return new Response(JSON.stringify("Error"), {
        headers: headers,
        status: 404,
      })
    }

    if (request.method.toUpperCase() == "POST") {
      try {
        console.log("POST REACHED.")
        const text = await request.text()
        console.log(`${text}, ${Object.keys(JSON.parse(text))}`)
        const body = JSON.parse(text)
        console.log(`Body : ${JSON.stringify(body)}`)
        let posts = await STORED.get("posts", { type: "json" })
        if (posts) {
          posts.push(body)
          console.log("Adding new entry to posts.", posts)
          await STORED.put("posts", JSON.stringify(posts))
          return new Response(JSON.stringify("success"), {
            headers: headers,
            status: 200,
          })
        }
        console.log("Creating Posts")
        const newPosts = []
        newPosts.push(body)
        console.log("NewPosts: , ", newPosts)
        await STORED.put("posts", JSON.stringify(newPosts))
        return new Response(JSON.stringify("success"), {
          headers: headers,
          status: 200,
        })

      } catch (err) {
        console.log(`Failure: ${err}`)
        console.error(err)
        return new Response(JSON.stringify(err), {
          headers: headers,
          status: 404,
        })
      }
    }
  }

  // Default Page Case.
  return new Response(`Hello worker!`, {
    headers: { 'content-type': 'text/plain' },
  })
}
