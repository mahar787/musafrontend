export default async function getReq(endpoint) {
  let request = await fetch(`${endpoint}`);
  let statusCode = request.status;
  let response = await request.json();
  return { response, statusCode };
}
