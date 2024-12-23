// @ts-ignore
import React, { useEffect } from "react";
import Image from "next/image";
import about from "../../public/assets/images/about1.png";
import { BsBuilding } from "react-icons/bs";
import { RxDimensions } from "react-icons/rx";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineArrowBack } from "react-icons/md";
import Link from "next/link";

import { client } from "../../lib/sanity.client";
import RichTextComponent from "../../components/RichTextComponent";
import { PortableText } from "@portabletext/react";
import Head from "next/head";

import urlFor from "../../lib/urlFor";

import { useState, useRef } from "react";
import { sendContactForm } from "../../services";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import toast, { Toaster } from "react-hot-toast";

import Map from "../../components/Map";
import { GetServerSideProps } from "next";

import Slider from "react-slick";

import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PropertyDetails({ property, images }: any) {
  const formRef = useRef();

  const submitContact = async (e) => {
    e.preventDefault();
    const newContact = {
      _type: "contactForm",
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[3].value,
      phone: e.target[2].value,
      message: e.target[4].value,
    };
    client
      .create(newContact)
      .then((result) => {
        toast.success("Thank you for your message. We will get back shortly!", {
          duration: 3000,
        });
        formRef.current.reset();
      })
      .catch((error) => {
        toast.error("Something went wrong! Please try again");
      });

    // const res = await sendContactForm({
    //   firstName: e.target[0].value,
    //   lastName: e.target[1].value,
    //   email: e.target[2].value,
    //   phone: e.target[3].value,
    //   comment: e.target[4].value,
    // });
    // if (res == 0) {
    //   toast.success("Thank you for your message. We will get back shortly!", {
    //     duration: 3000,
    //   });
    //   formRef.current.reset();
    // } else {
    //   toast.error("Something went wrong! Please try again", { duration: 3000 });
    // }
  };

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  });

  const settingsMain = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".slider-nav",
  };

  const settingsThumbs = {
    slidesToShow: property.images.length - 1,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: true,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: "10px",
    // nextArrow: (
    //   <AiFillRightCircle className="prev-slick-arrow" size={24} color="green" />
    // ),
    // prevArrow: (
    //   <AiFillLeftCircle className="prev-slick-arrow" size={24} color="green" />
    // ),
  };
  return (
    <div className="min-h-screen mt-10">
      <Head>
        <title>{property.title}</title>
      </Head>

      <div className="space-y-10 flex flex-col px-4 justify-center items-center">
        <div className="flex flex-col items-top justify-center xl:flex-row xl:space-x-4 max-w-7xl">
          <div className="">
            <div className="space-y-4">
              <Link href={"/sales"} className="flex items-center space-x-2">
                <MdOutlineArrowBack size={24} />
                <p className="text-lg">Back</p>
              </Link>
              <h1 className="text-[25px] leading-none sm:text-[35px] md:text-[35px] lg:text-[50px]">
                {property.title}
              </h1>
            </div>
            {/* Slider */}

            <div className="flex items-center justify-center">
              <div className="slider-wrapper">
                <Slider
                  {...settingsMain}
                  asNavFor={nav2}
                  ref={(slider) => setSlider1(slider)}
                >
                  {images.map((image) => (
                    <div className="slick-slide" key={image._ref}>
                      <Image
                        className="slick-slide-image"
                        src={urlFor(image.asset).url()}
                        alt=""
                        width={1920}
                        height={1080}
                      />
                      {/* <label className="slick-slide-label">{slide.label}</label> */}
                    </div>
                  ))}
                </Slider>
                <div className="thumbnail-slider-wrap">
                  <Slider
                    {...settingsThumbs}
                    asNavFor={nav1}
                    ref={(slider) => setSlider2(slider)}
                  >
                    {images.map((image) => (
                      <div className="slick-slide" key={image._ref}>
                        <Image
                          className="slick-slide-image"
                          src={urlFor(image.asset).url()}
                          alt=""
                          width={1920}
                          height={1080}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="flex justify-around">
              <div className="flex space-x-2 items-center">
                <BsBuilding size={40} />
                <p>{property.propertyType.typeName}</p>
              </div>
              <div className="flex space-x-2 items-center">
                <RxDimensions size={40} />
                <p>{property.area_total} m&#178;</p>
              </div>
              <div className="flex space-x-2 items-center">
                <SlLocationPin size={40} />
                <p>{property.location.locationName}</p>
              </div>
            </div>
            {/* Mortgage */}
            <div className="py-6 bg-[#F4F4F4] flex justify-between items-center rounded-md px-6 mt-6 mb-6">
              <div>
                <p>Estimated mortgage:</p>
                <h1>
                  {property.mortgage} {"USD"}/month
                </h1>
              </div>
              <Link href={"/contact"}>
                <button className="bg-btn text-white px-4 py-3.5 rounded-md">
                  Get Financing
                </button>
              </Link>
            </div>

            <PortableText
              value={property.overview}
              components={RichTextComponent}
            />

            {property.vrview ? (
              <iframe
                height="400px"
                width="100%"
                allowFullScreen="true"
                src={property.vrview}
              ></iframe>
            ) : (
              ""
            )}

            <Link href={"/contact"} className="underline block sm:hidden">
              Contact Us {">"}
            </Link>

            {/* Mapbox */}
            <div className="flex justify-center py-10">
              {property.maplocation ? (
                <Map location={property.maplocation} />
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mt-6 space-y-6 w-full mb-20">
            <div className="bg-[#F4F4F4] rounded p-6 text-[#143D30] hidden md:block">
              <h3>Contact Us</h3>
              <Toaster />
              <form
                className="space-y-4 mt-4"
                id="property"
                ref={formRef}
                onSubmit={submitContact}
              >
                <div className="flex flex-col">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+1(500) 000 000"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="your@company.com"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="comment">Message</label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={10}
                    placeholder="Leave us a message..."
                  ></textarea>
                </div>
                <button className="text-btn w-full py-3.5 border-[3px] rounded-md border-btn">
                  Send Message
                </button>
              </form>
            </div>
            <div className="bg-[#F4F4F4] rounded p-6 space-y-4">
              <h3 className="text-lg">Brief characteristics</h3>
              <div className="text-lg space-y-2">
                <div className="flex space-x-1">
                  <p className="font-bold">Price:</p>
                  <p>{property.sellPrice} USD</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">ID:</p>
                  <p>{property.propertyId}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">City:</p>
                  <p>{property.location.locationName}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Area:</p>
                  <p>{property.area_total} m&#178;</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Parking:</p>
                  <p>{property.parking}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Rooms:</p>
                  <p>{property.rooms}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Bathrooms:</p>
                  <p>{property.bathrooms}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Property Size:</p>
                  <p>{property.propertySize} m&#178;</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Lot Size:</p>
                  <p>{property.lotSize} m&#178;</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Beachfront:</p>
                  <p>{property.beachfront}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  const query = `*[ _type == "properties" && slug.current == $pageSlug][0]{
    ...,
    location->,
    propertyType->
  }`;

  const property = await client.fetch(query, { pageSlug });

  let allImages = property.images.concat(property.mainImage);

  if (!property) {
    return {
      props: null,
      notFound: true,
    };
  } else {
    return {
      props: {
        property,
        images: allImages,
        // images: property.images,
        // city: property.city,
        // location: property.location,
        // propertyType: property.propertyType,
        // mainImage: property.mainImage,
        // images: property.images,
        // pricePerNight: property.pricePerNight,
        // beds: property.beds,
        // bedrooms: property.bedrooms,
        // description: property.description,
        // host: property.host,
        // reviews: property.reviews,
      },
    };
  }
};

export default PropertyDetails;
