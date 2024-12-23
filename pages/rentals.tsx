import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useId, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { client } from "../lib/sanity.client";
import urlFor from "../lib/urlFor";
import Image from "next/image";
import Select from "react-select";
import { getPropertiesRent } from "../lib/api";
import { useRouter } from "next/router";

export const getStaticProps = async () => {
  const rentals =
    await client.fetch(`*[_type == "propertiesRent" && _id in path("drafts.**") == false && _id in path("live.**")]{
    ...,
    propertyType->,
    location->
  }`);

  const features =
    await client.fetch(`*[_type == "features" && _id in path("drafts.**") == false]{
    ...,
  }`);

  const types =
    await client.fetch(`*[_type == "propertyType" && _id in path("drafts.**") == false]{
    ...,
  }`);

  const locations =
    await client.fetch(`*[_type == "locations" && _id in path("drafts.**") == false]{
    ...,
  }`);

  return {
    props: {
      rentals,
      features,
      types,
      locations,
    },
  };
};

const rentals = ({ rentals, features, types, locations }) => {
  const inputRef = useRef(null);
  const router = useRouter();

  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feature, setFeature] = useState(null);
  const [sortByPrice, setSortByPrice] = useState(null);
  const [sortDescending, setSortDescending] = useState(null);
  const [rentalsList, setRentalsList] = useState(rentals);
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(
    router.query ? router.query.loc : null
  );

  const [priceCategory, setPriceCategory] = useState(null);

  const [featuresList, setFeaturesList] = useState(features);

  useEffect(() => {
    async function fetchProperties() {
      const data = await getPropertiesRent({
        category,
        sortByPrice,
        sortDescending,
        searchQuery,
        priceMin,
        priceMax,
        location,
        feature,
        priceCategory,
      });
      setRentalsList(data);
    }
    fetchProperties();
  }, [
    category,
    sortByPrice,
    sortDescending,
    searchQuery,
    priceMin,
    priceMax,
    location,
    feature,
    priceCategory,
  ]);

  function handlePriceCategoryCahnge(event) {
    setPriceCategory(event.value);
  }

  function handleCategoryChange(event) {
    setCategory(event.value);
  }

  function handleLocationChange(event) {
    setLocation(event.value);
  }

  function handleSearchQuery(event) {
    setSearchQuery(inputRef.current.value);
    // setSearchQuery(event.target.value);
  }

  function handlePriceMinChange(event) {
    setPriceMin(parseInt(event.target.value) || null);
  }

  function handlePriceMaxChange(event) {
    setPriceMax(parseInt(event.target.value) || null);
  }

  function handleFeature(event) {
    setFeature(event.value);
  }

  function handleSortChange(event) {
    const value = event.value;
    setSortByPrice(value);
    setSortDescending(value);
  }

  const featureOptions = featuresList.map((item) => ({
    value: item.featureName,
    label: item.featureName,
  }));

  const typeOptions = types.map((item1) => ({
    value: item1.typeName,
    label: item1.typeName,
  }));

  const locationOptions = locations.map((item) => ({
    value: item.locationName,
    label: item.locationName,
    instanceId: useId(),
  }));

  const sortOptions = [
    // { value: "sort", label: "Sort" },
    { value: "price", label: "Price (low to high)" },
    { value: "price-desc", label: "Price (high to low)" },
  ];

  const priceCategories = [
    // { value: "sort", label: "Sort" },
    { value: "month", label: "Price / month" },
    { value: "day", label: "Price / day" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Head>
        <title>Rentals | Ingigante</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#F4F4F4] w-full flex justify-center px-4 py-14">
        <div className="max-w-7xl w-full px-4">
          <div className="flex flex-col items-center text-secondary">
            <h1 className="text-[35px]">Search for Rentals</h1>
            <p>Vacation and long-term rentals</p>
          </div>

          <div className="space-y-4 mt-4 md:flex md:flex-row md:items-center md:space-y-0 md:space-x-5">
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md  block w-full p-2.5"
              placeholder="Enter a keyword"
              ref={inputRef}
              // value={searchQuery || ""}
              // onChange={(event) =>
              //   setTimeout(() => setSearchQuery(event.target.value), 500)
              // }
            />
            <button
              // type="submit"
              onClick={handleSearchQuery}
              className="bg-btn text-white flex items-center justify-center py-2.5 rounded-md md:px-6 w-full md:w-1/6"
            >
              <span>
                <FiSearch className="mr-4" />
              </span>
              Search
            </button>
          </div>

          <p className="text-center mt-4 mb-4">Filter Settings</p>
          <div className="md:flex md:flex-row md:space-x-4">
            <div className="relative mb-6 md:mb-0 md:w-1/4">
              <Select
                defaultValue={category}
                onChange={handleCategoryChange}
                options={typeOptions}
                placeholder="Type"
                isSearchable={false}
              />
            </div>
            <div className="relative mb-6 md:mb-0 md:w-1/4">
              <Select
                defaultValue={feature}
                onChange={handleFeature}
                options={featureOptions}
                placeholder="Feature"
                isSearchable={false}
              />
            </div>
            <div className="relative mb-6 md:mb-0 md:w-1/4">
              <Select
                defaultValue={location}
                onChange={handleLocationChange}
                options={locationOptions}
                placeholder="Location"
                isSearchable={false}
                // value={loc}
              />
            </div>
            <div className="relative mb-6 md:mb-0 md:w-1/4">
              <Select
                defaultValue={priceCategory}
                onChange={handlePriceCategoryCahnge}
                options={priceCategories}
                placeholder="Price Category"
                isSearchable={false}
              />
              {/* <p className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-40">
                USD
              </p>
              <input
                type="number"
                placeholder="Price min."
                className="w-full pl-12 rounded-md border border-gray-300 "
                onChange={handlePriceMinChange}
              /> */}
            </div>
            <div className="relative mb-6 md:mb-0 md:w-1/4">
              <p className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-40">
                USD
              </p>
              <input
                type="number"
                placeholder="Price max."
                className="w-full pl-12 rounded-md border border-gray-300 "
                onChange={handlePriceMaxChange}
              />
            </div>

            <div className="relative mb-6 md:mb-0 md:w-1/4">
              <Select
                // defaultValue={feature}
                onChange={handleSortChange}
                options={sortOptions}
                placeholder="Sort"
                isSearchable={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl w-full mt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 px-4">
          {rentalsList.length > 0 ? (
            rentalsList.map((property) => (
              <Link href={`/rental/${property.slug.current}`}>
                <div
                  className="max-w-sm rounded overflow-hidden shadow-md mx-auto"
                  key={property._id}
                >
                  <Image
                    src={`${urlFor(
                      property.mainImage
                    ).url()}?w=390&h=290&fit=crop&crop=center`}
                    alt="card"
                    className="object-cover lg:object-center"
                    width={390}
                    height={290}
                    priority
                  />
                  <div className="px-6 py-4">
                    <h1 className="font-bold text-[20px]">{property.title}</h1>
                  </div>
                  <div className="px-6 py-4 text-[17px]">
                    <p className="text-secondary">
                      {property.price} {"USD/"}
                      {property.category === "month" ? "month" : "day"}
                    </p>
                    <p>{property.location.locationName}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <h1>No Result!</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default rentals;
