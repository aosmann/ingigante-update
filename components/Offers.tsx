import Image from "next/image";
import Link from "next/link";
import urlFor from "../lib/urlFor";
import Slider from "react-slick";

const Offers = ({ properties }: any) => {
  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: properties.length >= 4 ? 4 : properties.length,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="text-primary flex flex-col bg-[#F4F4F4] justify-center items-center py-9 md:items-center">
      <div className="max-w-7xl mt-10 mb-10 px-4">
        <div className="mb-10 px-4">
          <h1 className="text-[35px] sm:text-[50px]">Featured Listings</h1>
          <p className="text-[16px] sm:text-[20px]">
            Fulfill your career dreams, enjoy all the achievements of the city
            center and luxury housing to the fullest.
          </p>
        </div>
        <div className="max-w-7xl w-screen">
          <Slider {...settings}>
            {properties.map((property) => (
              <Link
                href={`/property/${property.slug.current}`}
                key={property._id}
              >
                <div className="max-w-sm rounded overflow-hidden shadow-md mx-auto bg-white">
                  <Image
                    src={`${urlFor(
                      property.mainImage
                    ).url()}?w=390&h=290&fit=crop&crop=center`}
                    alt="card"
                    className="object-cover lg:object-center"
                    width={390}
                    height={290}
                  />
                  <div className="px-6 py-4">
                    <h1 className="font-bold text-[20px]">{property.title}</h1>
                  </div>
                  <div className="px-6 py-4 text-[17px]">
                    <p className="text-secondary">
                      {property.sellPrice} {"USD"}
                    </p>
                    <p>{property.location.locationName}</p>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
        <div className="flex items-center justify-center mt-10">
          <Link href={"/sales"}>
            <button className="py-2 px-4 border-primary border-2 rounded-md text-[16px]">
              Show Sale Listings
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Offers;
