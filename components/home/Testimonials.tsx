"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Public Speaking Coach",
    image: "/testimonials/sarah.jpg", // Add these images to your public folder
    content:
      "BolMitra has revolutionized how I prepare my clients. The AI feedback is incredibly detailed and spot-on.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Sales Director",
    image: "/testimonials/michael.jpg",
    content:
      "My team's presentation skills have improved dramatically since we started using BolMitra. The real-time feedback is invaluable.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Graduate Student",
    image: "/testimonials/priya.jpg",
    content:
      "Perfect for interview preparation! The detailed analysis helped me identify and improve my communication weaknesses.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Loved by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Communication Experts
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            See how BolMitra is helping people improve their speaking skills
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative p-8 bg-white rounded-2xl border border-purple-100 shadow-xl shadow-purple-100/10 hover:border-purple-200 transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-purple-200">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Content */}
                <p className="text-gray-600 mb-6">{testimonial.content}</p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
