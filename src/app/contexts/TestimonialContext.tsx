import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const TestimonialContext = createContext<any>(null);

export const TestimonialProvider = ({
  children,
  spaceId,
}: {
  children: React.ReactNode;
  spaceId: string | null;
}) => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const router = useRouter();

  const fetchTestimonials = useCallback(async () => {
    if (!spaceId) {
      console.error("No spaceId provided to fetch testimonials");
      return;
    }
    try {
      const response = await axios.get(`/api/getTestimonials?id=${spaceId}`);
      setTestimonials(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          console.error(
            "Unauthorized access to this space. Redirecting to home..."
          );
          router.push("/");
        } else {
          console.error(
            "Error fetching testimonials:",
            error.response.data.error
          );
        }
      } else {
        console.error("Error fetching testimonials:", error);
      }
    }
  }, [spaceId, router]);

  useEffect(() => {
    if (spaceId) {
      fetchTestimonials();
    }
    return () => {
      setTestimonials([]);
    };
  }, [spaceId, fetchTestimonials]);

  return (
    <TestimonialContext.Provider
      value={{ testimonials, fetchTestimonials, setTestimonials }}
    >
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  console.log(context);
  if (context === null) {
    throw new Error(
      "useTestimonials must be used within a TestimonialProvider"
    );
  }
  return context;
};
