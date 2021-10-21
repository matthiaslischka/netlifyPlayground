const faunadb = require("faunadb");
exports.handler = async (event) => {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET_KEY,
  });

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
      data: { slug: slug, time_utc: new Date().getUTCDate() },
    })
  );

  return { statusCode: 200 };
};
