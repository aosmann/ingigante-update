import Head from "next/head";
import Hero from "../components/Hero";
import Offers from "../components/Offers";
import About from "../components/About";
import Reference from "../components/Reference";
import OurTeam from "../components/OurTeam";
import Faq from "../components/Faq";
import { client } from "../lib/sanity.client";

import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (context) => {
  const properties = await client.fetch(
    `*[_type == "properties" && _id in path("drafts.**") == false && featured == true]{
      ...,
      location->,
    } | order(_createdAt asc)`
  );
  const references = await client.fetch(
    `*[_type == "references" && _id in path("drafts.**") == false]`
  );
  const ourteam = await client.fetch(
    `*[_type == "team" && _id in path("drafts.**") == false]`
  );
  const faq = await client.fetch(
    `*[_type == "faq" && _id in path("drafts.**") == false]`
  );
  const propertyType =
    await client.fetch(`*[_type == "propertyType" && _id in path("drafts.**") == false]{
    ...,
    propertyType->,
    location->
  }`);

  const locations =
    await client.fetch(`*[_type == "locations" && _id in path("drafts.**") == false]{
    ...,
  }`);

  return {
    props: {
      properties,
      references,
      ourteam,
      faq,
      propertyType,
      locations,
    },
    revalidate: 10,
  };
};

function Home({
  properties,
  ourteam,
  references,
  faq,
  propertyType,
  locations,
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden	">
      <Head>
        <title>Ingigante</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col">
        <Hero propertyType={propertyType} locations={locations} />
        <Offers properties={properties} />
        <About />
        <OurTeam teamMembers={ourteam} />
        <Faq faqs={faq} />
        <Reference references={references} />
      </main>
    </div>
  );
}

export default Home;
