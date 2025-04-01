import Banner from "../shared/Banner";

import banner1 from "../assets/banner-05.png";


const Home = () => {
  return (
    <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-24">
      <Banner banner={banner1} heading="Develop Your Skills Without diligence" subheading="A Good Example Of Paragraph That Contain Simple Sentence. Many
            Animals Are Living On China, That Is, China Is Good Destination." btn1="Get Started" btn2="Discount" />
    </div>
  );
};

export default Home;
