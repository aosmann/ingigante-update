// lib/sanity.js

import { client } from "./sanity.client";

export async function getProperties1() {
  const query = `*[_type == "properties"] | order(_createdAt desc)`;
  const response = await client.fetch(query);
  return response;
}
