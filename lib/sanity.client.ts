import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
export const token =
  "sklqDXsmC4xrTH0GSWGcIovFQZRlNb5BlRBjdMoJQ4L73hMBONzVSfhkB4amNHRMxIm8HsObCNTatD1nz1ipz1n6CxJDy1ptA4XzhozYWTPgUpgwKYkfX5N4SwcqfME7MKgIlOuoHi5KsU5r64bwhFQSyHibBKE5sdgKQ8KRMUIW9i9RvYCs";

// console.log({projectId,dataset,apiVersion})

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // token,
  useCdn: false,
});

export const client_with_token = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
