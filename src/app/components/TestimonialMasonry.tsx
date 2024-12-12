"use client";

import React, { useEffect, useState } from 'react';
import TestimonialCard from './TestimonialCard';

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
    extraQuestions?: Record<string, string>;
    link?: string;
    uploadedAt?: Date;
    extraQuestionValues?: Record<string, string>;
}

const TestimonialMasonry = ({
    testimonials,
    theme = 'light'
}: {
    testimonials: TestimonialType[];
    theme?: string;
}) => {
    const [columns, setColumns] = useState<TestimonialType[][]>([[], [], []]);

    useEffect(() => {
        const organizeTestimonials = () => {
            // Initialize columns
            const newColumns: TestimonialType[][] = [[], [], []];

            // Separate video and text testimonials
            const videoTestimonials = testimonials.filter(t => t.type === 'video');
            const textTestimonials = testimonials.filter(t => t.type === 'text');

            // Distribute videos first (they're typically larger)
            videoTestimonials.forEach((testimonial, index) => {
                newColumns[index % 3].push(testimonial);
            });

            // Then distribute text testimonials to balance columns
            textTestimonials.forEach((testimonial) => {
                // Find the column with the least items
                const shortestColumnIndex = newColumns
                    .map((col, index) => ({ length: col.length, index }))
                    .sort((a, b) => a.length - b.length)[0].index;

                newColumns[shortestColumnIndex].push(testimonial);
            });

            setColumns(newColumns);
        };

        organizeTestimonials();
    }, [testimonials]);

    return (
        <div className={`w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} p-4`}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {columns.map((column, columnIndex) => (
                        <div
                            key={columnIndex}
                            className="flex flex-col gap-4"
                        >
                            {column.map((testimonial) => (
                                <div
                                    key={testimonial._id}
                                    className="break-inside-avoid"
                                >
                                    <TestimonialCard {...testimonial} theme={theme} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialMasonry;
