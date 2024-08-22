import React from "react";

interface WidgetProps {
  data: any[];
  loading: boolean;
  error: string | null;
}

const Widget: React.FC<WidgetProps> = ({ data, loading, error }) => {
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {data.length > 0 && (
        <div className="widget">
          {data.map((testimonial: any) => (
            <div key={testimonial.id} className="testimonial">
              <p>{testimonial.message}</p>
              <p>Rating: {testimonial.rating}</p>
            </div>
          ))}
          <style jsx>{`
            .widget {
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .testimonial {
              margin-bottom: 10px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Widget;
