import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, BarChart, ShieldCheck, DollarSign, Star } from "lucide-react";

export const metadata = {
  title: "FurnitureMart Sellers - Grow Your Furniture Business",
  description: "Join FurnitureMart as a seller and reach thousands of customers. Easy setup, powerful tools, and maximum profits.",
};

const features = [
  {
    icon: DollarSign,
    title: "Maximize Profits",
    description: "Enjoy competitive commission rates and reach thousands of potential buyers",
    stat: "15% Higher",
    statDesc: "average profit margin",
    gradient: "from-success to-meta-3"
  },
  {
    icon: BarChart,
    title: "Growth Tools",
    description: "Access advanced analytics and marketing tools to boost your sales",
    stat: "2.5x",
    statDesc: "average sales growth",
    gradient: "from-primary to-secondary"
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description: "Benefit from our secure payment system and seller protection",
    stat: "100%",
    statDesc: "payment protection",
    gradient: "from-meta-5 to-secondary"
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Furniture Store Owner",
    content: "Since joining FurnitureMart, our online sales have doubled. The platform's tools and support are exceptional.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Independent Craftsman",
    content: "The analytics tools helped me understand my customers better and optimize my pricing strategy.",
    rating: 5
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-2 via-whiter to-gray overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px] animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-meta-5/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="hidden lg:block absolute top-40 -left-20 w-80 h-80 bg-meta-5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-6 py-2 mb-8 text-primary bg-primary/10 rounded-full text-lg font-bold tracking-wide shadow-lg hover:shadow-xl transition-shadow duration-300">
            Seller Platform
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold text-black mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-meta-5 animate-gradient">
              Sell More,
              <br />
              Earn More
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-black font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the fastest-growing furniture marketplace and transform your business with our powerful seller tools
          </p>

          {/* Dynamic Authentication Buttons */}
          <div className="space-x-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-lg hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl"
              >
                Seller Dashboard
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="https://fast-foal-29.accounts.dev/sign-in"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-lg hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl"
              >
                Start Selling
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-black mb-16">
            Why Sell on FurnitureMart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.1)] hover:shadow-[0_0_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-body mb-6">{feature.description}</p>
                <div className="pt-6 border-t border-stroke">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-1">
                    {feature.stat}
                  </div>
                  <div className="text-sm text-bodydark">
                    {feature.statDesc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-2 via-whiter to-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-black mb-16">
            Seller Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-meta-6 fill-meta-6" />
                  ))}
                </div>
                <p className="text-body mb-6 italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <div className="font-semibold text-black">{testimonial.name}</div>
                  <div className="text-sm text-bodydark">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-secondary to-meta-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:20px_20px]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Scale Your Business?
          </h2>
          <p className="text-xl text-bodydark1 mb-12 max-w-2xl mx-auto">
            Join thousands of successful furniture sellers who have grown their business with FurnitureMart
          </p>
          <SignedOut>
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <Link
                href="https://fast-foal-29.accounts.dev/sign-in"
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Become a Seller
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-primary/20 text-white font-semibold rounded-lg hover:bg-primary/30 transition duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                Contact Sales
              </Link>
            </div>
          </SignedOut>
        </div>
      </section>
    </main>
  );
}