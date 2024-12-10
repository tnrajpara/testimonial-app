import { Suspense } from "react";
import TestimonialCard from "../components/TestimonialCard";
import dbConnect from "../../utils/dbConnect";

interface TestimonialType {
  _id: string;
  type: "text" | "video";
  rating: number;
  isLiked: boolean;
  message?: string;
  attachments?: string[];
  photo?: string;
  name: string;
  email?: string;
  spaceId: string;
  spaceImage?: string;
  spaceTitle?: string;
  extraQuestions?: Record<string, any>;
  link?: string;
  uploadedAt?: Date;
  extraQuestionValues?: Record<string, any>;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;



export default async function TestimonialEmbed({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    // Extract the ID from searchParams and handle the case where it might include theme
    const rawId = searchParams.id as string;
    const id = rawId?.split('?')[0];



    if (!id) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">No space ID provided</p>
        </div>
      );
    }

    const { db } = await dbConnect();

    const rawTestimonials = await db
      .collection("testimonial-data")
      .find({ spaceId: id })
      .sort({ uploadedAt: -1 })
      .toArray();

    // Serialize the MongoDB documents to plain objects
    const testimonials = rawTestimonials.map((doc: any) => ({
      _id: doc._id.toString(), // Convert ObjectId to string
      type: doc.type,
      rating: doc.rating,
      isLiked: doc.isLiked,
      message: doc.message,
      attachments: doc.attachments,
      photo: doc.photo,
      name: doc.name,
      email: doc.email,
      spaceId: doc.spaceId,
      spaceImage: doc.spaceImage,
      spaceTitle: doc.spaceTitle,
      extraQuestions: doc.extraQuestions,
      link: doc.link,
      uploadedAt: doc.uploadedAt ? doc.uploadedAt.toISOString() : undefined,
      extraQuestionValues: doc.extraQuestionValues,
    }));



    if (!testimonials || testimonials.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">No testimonials found</p>
        </div>
      );
    }

    // Split testimonials into columns for masonry layout
    const columns: TestimonialType[][] = [[], [], []];
    testimonials.forEach((testimonial: TestimonialType, index: number) => {
      columns[index % 3].push(testimonial);
    });

    const theme = rawId.split("?")[1].split("=")[1]


    return (
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-4`}>
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<TestimonialsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                  {column.map((testimonial: TestimonialType) => (
                    <div key={testimonial._id} className="break-inside-avoid">
                      <TestimonialCard {...testimonial} theme={theme} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading testimonials</p>
      </div>
    );
  }
}

function TestimonialsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((colIndex) => (
        <div key={colIndex} className="flex flex-col gap-4">
          {[1, 2, 3].map((rowIndex) => (
            <div
              key={`${colIndex}-${rowIndex}`}
              className="animate-pulse bg-gray-200 rounded-lg p-6 h-48"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
