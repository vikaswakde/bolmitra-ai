"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Soham",
    role: "8th Grade Student",
    image: "/testimonials/soham.jpeg",
    content:
      "Dude, this app is so cool! I used to get super nervous during class presentations, but now I'm like a mini TED Talk speaker! My friends can't believe it's the same shy Soham. Even managed to nail that science project presentation without saying 'umm' a hundred times! 😎",
    rating: 5,
  },
  {
    name: "Bharat",
    role: "Farmer",
    image: "/testimonials/bharat.jpeg",
    content:
      "Hello, I am farmer. English is new for me but BolMitra helps me learn. Now I can say 'I grow wheat and rice' and 'My farm is beautiful' without fear! My son is proud when I practice. Small steps, but I am happy!",
    rating: 5,
  },
  {
    name: "Aisha",
    role: "Aspiring YouTuber",
    image: "/testimonials/Aisha.jpg",
    content:
      "From recording 50 takes for one video to nailing it in 2-3 tries - that's my BolMitra journey! The feedback on my pace and clarity was exactly what I needed. Now my cooking channel is growing, and I'm not just making great biryani, I'm confidently talking about it too!",
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
              Community
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
