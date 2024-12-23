import React from 'react';
import about from '../public/assets/images/about.png';
import Image from 'next/image';
const About = () => {
  return (
    <section className='text-primary flex px-4 xl:justify-center py-14'>
      <div
        className='flex flex-col items-center lg:flex-row lg:space-x-10 mt-10 mb-10 max-w-7xl'
        id='about'
      >
        <Image
          src={about}
          alt='about'
          className='w-[350px] sm:w-[450px] md:w-[450px] lg:w-[500px] xl:w-[600px] 2xl:w-[650px] pb-4'
        />
        <div className='text-[17px] lg:w-[500px]'>
          <h2 className='text-[35px] lg:text-[50px]'>About Us</h2>
          <div className=''>
            <p className='text-justify'>
              Our team consists of experienced real estate agents, brokers,
              property managers, and consultants, each with a unique set of
              skills and expertise. We work collaboratively to provide our
              clients with a comprehensive range of real estate services,
              customized to meet their specific needs and goal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
