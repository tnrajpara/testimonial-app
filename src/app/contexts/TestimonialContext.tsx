import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
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

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await axios.get(`/api/getTestimonials?id=${spaceId}`);
      setTestimonials(response.data.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }, [spaceId]);

  useEffect(() => {
    if (spaceId) {
      fetchTestimonials();
    }
    return () => {
      setTestimonials([]);
    };
  }, [spaceId, fetchTestimonials]);

  const updateTestimonial = async (updatedTestimonial: any) => {
    try {
      await axios.put(`/api/updateTestimonial/${updatedTestimonial._id}`, {
        id: updatedTestimonial._id,
        data: updatedTestimonial,
      });
      setTestimonials((prevTestimonials) =>
        prevTestimonials.map((testimonial) =>
          testimonial._id === updatedTestimonial._id
            ? updatedTestimonial
            : testimonial
        )
      );
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  return (
    <TestimonialContext.Provider
      value={{ testimonials, updateTestimonial, fetchTestimonials }}
    >
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => useContext(TestimonialContext);
