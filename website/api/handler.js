export default async function handler(request, response) {
  console.log(request);
  response.status(200).json({
    body: await request.body(),
    query: request.query,
    cookies: request.cookies,
  });
}
