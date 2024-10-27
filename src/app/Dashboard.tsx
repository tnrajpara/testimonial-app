import { useState, useEffect } from "react";
import Link from "next/link";
import AllSpaces from "./components/AllSpaces";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FaPlus } from "react-icons/fa6";

const Dashboard = () => {
  const { user } = useUser();
  const userId = user?.sub?.split("|")[1];

  const [greeting, setGreeting] = useState("");
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setCurrentHour(hour);
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Night");
      }
    };

    // Initial update
    updateGreeting();

    // Update every minute
    const timer = setInterval(updateGreeting, 60000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <div className="w-3/4 mx-auto flex items-center flex-col justify-center max-w-[100rem] min-h-[85vh] text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-300 mb-2">
            {greeting}
            {user?.name ? `, ${user.name}` : ""}
            <span className="ml-2">
              {currentHour >= 5 && currentHour < 12 && "☀️"}
              {currentHour >= 12 && currentHour < 18 && "🌅"}
              {(currentHour >= 18 || currentHour < 5) && "🌙"}
            </span>
          </h2>
        </div>

        {/* <h1 className="text-3xl lg:text-6xl text-gray-100 font-bold">
          Welcome to the Testimonial App
        </h1>

        <p className="text-gray-300 mt-3 lg:mt-5 w-3/4 leading-9">
          Our platform makes it easy to collect, manage, and display
          testimonials, helping you connect with your audience and showcase the
          value of your products and services
        </p>
 */}
        <Link
          href="/create"
          className="bg-blue-600 text-text-primary space-x-4 px-5 py-2 rounded-full mt-5 font-bold hover:transition-all hover:delay-100 flex justify-center items-center "
        >
          <FaPlus className="text-center " />
          Create a new space
        </Link>
      </div>

      <div>
        <AllSpaces userId={userId ?? ""} />
      </div>
    </div>
  );
};

export default Dashboard;
