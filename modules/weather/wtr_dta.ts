async function getData(
  method: string,
  type: string,
  fields: Array<string>,
  timesteps: Array<string>,
  startTime: string,
  endTime: string
) {
  // Set up the options
  const options = {
    method: method,
    headers: {
      accept: "application/json",
      "Accept-Encoding": "gzip",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      location: "north sydney",
      fields: fields,
      units: "metric",
      timesteps: timesteps,
      startTime: startTime,
      endTime: endTime,
    }),
  };
  // Get our data
  let response = await fetch("https://api.tomorrow.io/v4/" + type, options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
  // Send our data
  return response;
}
