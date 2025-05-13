
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'UX Designer at Google',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    quote: 'After 3 months of job searching with minimal responses, I started using JobStalker and landed 5 interviews in just 2 weeks. The AI resume optimization was a game-changer.',
  },
  {
    name: 'David Chen',
    position: 'Software Engineer at Meta',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    quote: 'The interview preparation feature helped me practice for questions I never would have anticipated. When those exact questions came up during my actual interview, I was fully prepared.',
  },
  {
    name: 'Maya Rodriguez',
    position: 'Marketing Manager at Spotify',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    quote: 'JobStalker\'s AI helped me discover opportunities that matched my skills but in industries I hadn\'t considered. This expanded my search and led to a job that pays 20% more than I expected.',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600">
            Thousands of job seekers have increased their interview rates and landed their dream jobs with JobStalker.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm card-hover"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-600 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-50 p-6 md:p-10 rounded-xl inline-flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3x</div>
              <p className="font-semibold">More Interviews</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">75%</div>
              <p className="font-semibold">Faster Hiring</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">92%</div>
              <p className="font-semibold">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
