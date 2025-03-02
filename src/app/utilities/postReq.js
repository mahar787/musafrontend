export default async function postReq(endpoint, data) {
  let request = await fetch(`${endpoint}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let statusCode = request.status;
  let response = await request.json();
  return { response, statusCode };
}
