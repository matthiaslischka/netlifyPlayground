const faunadb = require("faunadb");
import fetch from "node-fetch";

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

  let userData = await fetch("https://ipinfo.io/?token=" + process.env.IP_INFO_TOKEN);

  await client.query(
    q.Create(q.Collection("request_logs"), {
      data: userData,
    })
  );

  return { statusCode: 200 };
};
