import { PortableText } from "@portabletext/react";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BsBuilding } from "react-icons/bs";
import { MdOutlineArrowBack } from "react-icons/md";
import { RxDimensions } from "react-icons/rx";
import { SlLocationPin } from "react-icons/sl";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RichTextComponent from "../../components/RichTextComponent";
import { client } from "../../lib/sanity.client";
import urlFor from "../../lib/urlFor";
import Map from "../../components/Map";
import Image from "next/image";

import Slider from "react-slick";

import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug;

  const query = `*[ _type == "propertiesRent" && slug.current == $pageSlug][0]{
      ...,
      location->,
      propertyType->
    }`;

  const rentals = await client.fetch(query, { pageSlug });

  let allImages = rentals.images.concat(rentals.mainImage);

  if (!rentals) {
    return {
      props: null,
      notFound: true,
    };
  } else {
    return {
      props: {
        rentals,
        allImages,
      },
    };
  }
};

const RentalDetails = ({ rentals, imagaes }: any) => {
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
    slidesToShow: rentals.images.length - 1,
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
  };

  return (
    <div className="min-h-screen mt-10">
      <Head>
        <title>{rentals.title}</title>
      </Head>

      <div className="space-y-10 flex flex-col px-4 justify-center items-center">
        <div className="flex flex-col items-top justify-center xl:flex-row xl:space-x-4 max-w-7xl">
          <div className="w-full">
            <div className="space-y-4">
              <Link href={"/rentals"} className="flex items-center space-x-2">
                <MdOutlineArrowBack size={24} />
                <p className="text-lg">Back</p>
              </Link>
              <h1 className="text-[25px] leading-none sm:text-[35px] md:text-[35px] lg:text-[50px]">
                {rentals.title}
              </h1>
            </div>
            {/* Slider */}

            <div className="slider-wrapper">
              <Slider
                {...settingsMain}
                asNavFor={nav2}
                ref={(slider) => setSlider1(slider)}
              >
                {rentals.images.map((image) => (
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
                  {rentals.images.map((image) => (
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

            {/* Icons */}
            <div className="flex justify-around">
              <div className="flex space-x-2 items-center">
                <BsBuilding size={40} />
                <p>{rentals.propertyType.typeName}</p>
              </div>
              <div className="flex space-x-2 items-center">
                <RxDimensions size={40} />
                <p>{rentals.area_usable} m&#178;</p>
              </div>
              <div className="flex space-x-2 items-center">
                <SlLocationPin size={40} />
                <p>{rentals.location.locationName}</p>
              </div>
            </div>
            {/* Mortgage */}
            <div className="py-6 bg-[#F4F4F4] flex justify-between items-center rounded-md px-6 mt-6 mb-6">
              <h1>
                {rentals.price} {"USD/"}
                {rentals.category === "month" ? "month" : "day"}
              </h1>
              <Link href={"/contact"}>
                <button className="bg-btn text-white px-4 py-3.5 rounded-md">
                  Contact Us
                </button>
              </Link>
            </div>

            <PortableText
              value={rentals.overview}
              components={RichTextComponent}
            />

            {rentals.vrview ? (
              <iframe
                height="400px"
                width="100%"
                allowFullScreen="true"
                src={rentals.vrview}
              ></iframe>
            ) : (
              ""
            )}

            <Link href={"/contact"} className="underline block sm:hidden">
              Contact Us {">"}
            </Link>

            {/* Mapbox */}
            <div className="flex justify-center py-10">
              {/* <Image src={map} alt='map' /> */}
              <Map location={rentals.maplocation} />
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
                  <p>
                    {rentals.price} {"USD/"}
                    {rentals.category === "month" ? "month" : "day"}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">ID:</p>
                  <p>{rentals.propertyId}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">City:</p>
                  <p>{rentals.location.locationName}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Area:</p>
                  <p>{rentals.area_total} m&#178;</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Parking:</p>
                  <p>{rentals.parking}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Rooms:</p>
                  <p>{rentals.rooms}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Bathrooms:</p>
                  <p>{rentals.bathrooms}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Property Size:</p>
                  <p>{rentals.propertySize} m&#178;</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Lot Size:</p>
                  <p>{rentals.lotSize} m&#178;</p>
                </div>
                <div className="flex space-x-1">
                  <p className="font-bold">Beachfront:</p>
                  <p>{rentals.beachfront}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
