const faunadb = require("faunadb");

exports.handler = async (event, context) => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET_KEY,
  });

  console.log("event: ");
  console.log(event);

  console.log("userinfo:");
  console.log("IP:" + getHeaderInfo(event, "x-bb-ip"));
  console.log("User Agent: " + getHeaderInfo(event, "user-agent"));
  console.log("Country: " + getHeaderInfo(event, "x-country"));

  const { slug } = event.queryStringParameters;
  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "slug not provided",
      }),
    };
  }

  await client.query(
    q.Create(q.Collection("request_logs"), {
      data: {
        ip: getHeaderInfo(event, "x-bb-ip"),
        useragent: getHeaderInfo(event, "user-agent"),
        country: getHeaderInfo(event, "x-country"),
        time: new Date().toISOString(),
      },
    })
  );

  return { statusCode: 200 };
};

function getHeaderInfo(event, key) {
  if (event && event.headers) return event.headers[key];
}
