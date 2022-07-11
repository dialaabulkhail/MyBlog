import {
  createCurrentUserHook,
  createClient,
} from "next-sanity";

import createImageUrlBuilder from '@sanity/image-url'

export const config = {
  // sanity id is found on sanity.json in the sanity project
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
};

// to fetch data
export const sanityClient = createClient(config);

// to extract the image urls
export const urlFor = (source) => createImageUrlBuilder(config).image(source);
