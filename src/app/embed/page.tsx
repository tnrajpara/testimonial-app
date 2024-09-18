// app/embed/page.tsx

import Image from "next/image";
import TestimonialCard from "@/app/components/TestimonialCard";

interface TestimonialType {
  name: string;
  message: string;
  rating: number;
  photo: string;
  attachments: string[];
}

async function getTestimonials(id: string) {
  const res = await fetch(
    `https://testimonial-app-sable.vercel.app/api/getTestimonials?id=${id}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }
  return res.json();
}

export default async function Testimonial({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const { data: testimonials } = await getTestimonials(id);

  return (
    <div className="bg-white text-gray-950 min-h-screen flex  flex-col lg:flex-row">
      <div className="max-w-[calc(100vw-2rem)] mx-auto my-4 max-h-[80vh] md:max-h-[70vh] lg:max-h-[60vh] overflow-y-auto rounded-lg  p-4">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {testimonials.map((testimonial: TestimonialType, index: number) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
