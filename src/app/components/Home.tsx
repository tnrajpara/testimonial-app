import Navbar from "./Navbar";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <div className="w-3/4 mx-auto mt-5 lg:mt-16 flex items-center flex-col justify-center max-w-[120rem] text-center">
        <h1 className="text-3xl lg:text-6xl text-gray-100 font-bold">
          Welcome to the Testimonial App
        </h1>

        <p className="text-gray-300 mt-3 lg:mt-5 w-3/4 leading-9">
          Collecting testimonials is hard, we get it! So we built Testimonial.
          In minutes, you can collect text testimonials from your customers with
          no need for a developer or website hosting.
        </p>

        <Link
          href="/api/auth/login"
          className=" bg-blue-600 text-white px-5 py-2 rounded-md mt-5"
        >
          Get Started
        </Link>
      </div>
    </>
  );
};

export default Home;
