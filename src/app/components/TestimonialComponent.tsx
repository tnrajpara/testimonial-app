import React from "react";

interface TestimonialComponentProps {
  data: any;
}
const TestimonialComponent: React.FC<TestimonialComponentProps> = ({
  data,
}: TestimonialComponentProps) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {data?.map((item: any) => {
        return (
          <>
            <div className="text-white">
              <h1 className="text-2xl mt-3 mb-4 font-bold">{item.title}</h1>
              <span className="text-start  mb-4  text-sm ">{item.message}</span>
            </div>
          </>
        );
      })}
    </React.Suspense>
  );
};

export default TestimonialComponent;
