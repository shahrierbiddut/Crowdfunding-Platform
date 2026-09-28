import Image from "next/image";
import { Quote } from "lucide-react";

interface TestimonialProps {
  testimonial: {
    id: string;
    name: string;
    role: string;
    photo: string;
    quote: string;
  };
}

export default function TestimonialCard({ testimonial }: TestimonialProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
      <Quote className="absolute top-6 right-6 text-primary/10" size={64} />
      
      <p className="text-foreground text-lg leading-relaxed flex-grow relative z-10 mb-8 italic">
        "{testimonial.quote}"
      </p>
      
      <div className="flex items-center gap-4 mt-auto">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
          <Image
            src={testimonial.photo}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-foreground text-base">{testimonial.name}</h4>
          <p className="text-primary font-medium text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
