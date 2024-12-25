import React, { useState } from "react";
import { Gift, Send, Calendar, CheckCircle, Play, Menu, X } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle invite sending logic
  };

  return (
    <div className="text-brandBlack">
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-brandPurple">
              Smart Invites
            </h1>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            <div className="hidden md:flex gap-4">
              <Link
                href="/login"
                className="text-brandPurple hover:text-backgroundPurple"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-brandPurple text-white px-4 py-2 rounded-lg hover:bg-backgroundPurple"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4 px-4 bg-white">
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="text-brandPurple hover:text-backgroundPurple"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-brandPurple text-white px-4 py-2 rounded-lg hover:bg-backgroundPurple text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        <section className="relative bg-gradient-to-b from-backgroundPurple/10 to-white">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Modern Digital Invitations
                  <span className="text-brandPurple"> Made Simple</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Create stunning digital invites, track RSVPs instantly, and
                  manage your guest list effortlessly. The smarter way to send
                  invitations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-brandPurple text-white px-8 py-4 rounded-lg text-lg hover:bg-backgroundPurple">
                    Start Free Trial
                  </button>
                  <button className="border border-brandPurple text-brandPurple px-8 py-4 rounded-lg text-lg hover:bg-brandPurple hover:text-white">
                    Watch Demo
                  </button>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="/api/placeholder/600/400"
                  alt="Smart Invites Dashboard"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(107, 33, 168, 0.2) 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="max-w-xl mx-auto px-4 text-center relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Experience Smart Digital Invites
            </h2>
            <p className="text-gray-600 mb-8">
              Enter your phone number to receive a sample digital invitation
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 justify-center"
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandPurple"
              />
              <button
                type="submit"
                className="bg-brandPurple text-white px-6 py-3 rounded-lg hover:bg-backgroundPurple"
              >
                Get Test Invite
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              By clicking "Get Test Invite", you agree to receive a one-time
              sample invitation via SMS.
            </p>
          </div>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <p>Trusted by event planners from:</p>
              <img src="/api/placeholder/100/40" alt="Company 1" />
              <img src="/api/placeholder/100/40" alt="Company 2" />
              <img src="/api/placeholder/100/40" alt="Company 3" />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for Successful Events
              </h2>
              <p className="text-xl text-gray-600">
                Powerful features to make event planning a breeze
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Send,
                  title: "Digital Invitations",
                  description:
                    "Create stunning invites and track responses in real-time",
                },
                {
                  icon: Gift,
                  title: "Gift Registry",
                  description: "Organize gifts and let guests choose with ease",
                },
                {
                  icon: Calendar,
                  title: "RSVP Management",
                  description:
                    "Track responses and manage guest lists automatically",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-backgroundPurple/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="text-brandPurple" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-backgroundPurple text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See Digital Invites in Action
              </h2>
              <p className="text-xl opacity-90">
                Watch how easy it is to create and send beautiful invitations
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/api/placeholder/1200/675"
                alt="Video thumbnail"
                className="w-full"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <Play className="text-brandPurple w-8 h-8" />
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Event Planners
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of satisfied hosts
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="/api/placeholder/48/48"
                      alt="User"
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <p className="text-gray-500 text-sm">Wedding Planner</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "Smart Invites made organizing my client's wedding so much
                    easier. The RSVP tracking alone saved hours of work!"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-brandPurple to-backgroundPurple text-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Event Planning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start your free trial today - no credit card required
            </p>
            <button className="bg-white text-brandPurple px-8 py-4 rounded-lg text-lg hover:bg-gray-100">
              Get Started Free
            </button>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10k+", label: "Events Hosted" },
                { value: "50k+", label: "Invitations Sent" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "24/7", label: "Customer Support" },
              ].map((stat, index) => (
                <div key={index}>
                  <h4 className="text-3xl font-bold mb-2">{stat.value}</h4>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Smart Invites</h3>
              <p className="text-gray-600">
                Making event planning simple and delightful
              </p>
            </div>
            {["Product", "Company", "Resources"].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section}</h4>
                <ul className="space-y-2">
                  {["Features", "Pricing", "About", "Contact"].map(
                    (item, idx) => (
                      <li key={idx}>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-brandPurple"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>© 2024 Smart Invites. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
