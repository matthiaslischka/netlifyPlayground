const faunadb = require("faunadb");

exports.handler = async (event, context) => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  const { pathname } = event.queryStringParameters;
  if (!pathname) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "pathname not provided",
      }),
    };
  }

  var data = {
    ip: anonymizeIp(getHeaderInfo(event, "x-bb-ip")),
    country: getHeaderInfo(event, "x-country"),
    time: new Date().toISOString(),
    pathname: pathname,
  };

  await client.query(
    q.Create(q.Collection("request_logs"), {
      data,
    })
  );

  return { statusCode: 200 };
};

function getHeaderInfo(event, key) {
  if (event && event.headers) return event.headers[key];
}

function anonymizeIp(ip: string) {
  return ip.slice(0, ip.lastIndexOf("."));
}
