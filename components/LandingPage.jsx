import React, { useState } from "react";
import {
  Gift,
  Send,
  Calendar,
  CheckCircle,
  Play,
  Menu,
  X,
  TableProperties,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import {
  appscreenshots,
  appstore,
  mobilescreenshot,
  playstore,
} from "@/public/images";
import InputWithFullBoarder from "./InputWithFullBoarder";
import { validateCompletePhoneNumber } from "@/utils/validateCompletePhoneNumber";
import CustomButton from "./Button";
import { SendTestNotificationManager } from "@/app/notifications/controllers/sendTestNotificationController";
import VideoPlayer from "./VideoPlayer";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const route = useRouter();
  const { sendTestNotification, isLoading } = SendTestNotificationManager();

  const handleInviteSend = (e) => {
    e.preventDefault();
    // Use the custom validator directly
    const validationResult = validateCompletePhoneNumber(phone);

    if (!validationResult.isValid) {
      // Force the input to show its error state by triggering validation
      const phoneInput = document.getElementById("phone_number");
      if (phoneInput) {
        phoneInput.focus();
        // This will trigger the InputWithFullBoarder's error display
        phoneInput.blur();
      }
      return;
    }

    sendTestNotification({
      phone: phone,
    });
  };

  return (
    <div className="text-brandBlack">
      <Header isLandingPage={true} />

      <main className="pt-16">
        <section
          id="hero"
          className="relative bg-gradient-to-b from-backgroundPurple/10 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Modern Digital Invitations
                  <span className="text-brandPurple"> Made Simple</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Create stunning digital invites, track RSVPs instantly, and
                  manage your guest list effortlessly. With integrated gift
                  registry and table management, planning your event has never
                  been easier.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/auth/create-account"
                    className="bg-brandPurple text-white px-8 py-4 rounded-lg text-lg hover:bg-backgroundPurple"
                  >
                    Start Now - It's Free
                  </Link>
                  <Link
                    href="#demo"
                    className="border border-brandPurple text-brandPurple px-8 py-4 rounded-lg text-lg hover:bg-brandPurple hover:text-white"
                  >
                    See how it works
                  </Link>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={appscreenshots.src}
                  alt="Smart Invites Dashboard"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="try-it"
          className="bg-white py-16 relative overflow-hidden"
        >
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
              onSubmit={handleInviteSend}
              className="flex flex-col md:flex-row gap-4 items-center justify-center"
            >
              <InputWithFullBoarder
                id="phone_number"
                isRequired={true}
                placeholder="e.g. +1 for US, +44 for UK"
                value={phone}
                type="tel"
                none={true}
                customValidator={validateCompletePhoneNumber}
                onChange={(e) => {
                  let value = e.target.value;
                  // Ensure the + is always there
                  if (!value.startsWith("+")) {
                    value = "+" + value;
                  }
                  // Remove any non-digit characters except the +
                  value = value.replace(/[^\d+]/g, "");

                  setPhone(value);
                }}
              />
              <CustomButton
                type={"submit"}
                buttonText={"Get Test Invite"}
                isLoading={isLoading}
              />
            </form>
            <p className="text-xs text-gray-500 mt-4">
              By clicking "Get Test Invite", you agree to receive a one-time
              sample invitation via SMS.
            </p>
          </div>
        </section>

        {/* <section id="social-proof" className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <p>Trusted by event planners from:</p>
              <img src="/api/placeholder/100/40" alt="Company 1" />
              <img src="/api/placeholder/100/40" alt="Company 2" />
              <img src="/api/placeholder/100/40" alt="Company 3" />
            </div>
          </div>
        </section> */}

        <section id="mobile-app" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <div className="relative">
                  <div className="bg-backgroundPurple/10 rounded-3xl p-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white w-64">
                      <img
                        src={mobilescreenshot.src}
                        alt="Mobile App Screenshot"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center mb-4">
                  <Smartphone className="text-brandPurple mr-3" size={28} />
                  <h2 className="text-3xl font-bold">
                    Manage Events On The Go
                  </h2>
                </div>
                <p className="text-xl text-gray-600 mb-6">
                  Download our mobile app to create and manage your events from
                  anywhere. Send invitations, track RSVPs, and update your guest
                  list - all from your smartphone.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://apps.apple.com/kz/app/smart-invites/id6742789707"
                    className="inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={appstore.src}
                      alt="Download on App Store"
                      className="h-12"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=xyz.smartinvites.smartinvites"
                    className="inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={playstore.src}
                      alt="Get it on Google Play"
                      className="h-12"
                    />
                  </a>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  <p>Available for iOS and Android devices</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for Successful Events
              </h2>
              <p className="text-xl text-gray-600">
                Powerful features to make event planning a breeze
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
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
                  description:
                    "Create and manage your gift registry, allowing guests to easily choose and purchase gifts",
                },
                {
                  icon: Calendar,
                  title: "RSVP Management",
                  description:
                    "Track responses and manage guest lists automatically",
                },
                {
                  icon: TableProperties,
                  title: "Table Management",
                  description:
                    "Effortlessly organize seating arrangements and manage table assignments",
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

        <section
          id="demo"
          className="bg-backgroundPurple text-white py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See Digital Invites in Action
              </h2>
              <p className="text-xl opacity-90">
                Watch how easy it is to create and send beautiful invitations
              </p>
            </div>

            <VideoPlayer />
          </div>
        </section>

        <section id="testimonials" className="py-16 md:py-24">
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
              {[
                {
                  name: "Emily Rodriguez",
                  role: "Wedding Planner",
                  image:
                    "https://res.cloudinary.com/skillseeds-limited/image/upload/v1703723458/avatars/bm6iuhnsv3qzol3elvkc.png",
                  quote:
                    "The gift registry and table management features are game-changers! My clients love how easy it is to manage everything in one place. Saved me countless hours of coordination.",
                },
                {
                  name: "Michael Chen",
                  role: "Corporate Event Manager",
                  image:
                    "https://res.cloudinary.com/skillseeds-limited/image/upload/v1703723457/avatars/cwe1awh4bggfekuxfiex.png",
                  quote:
                    "Finally, a platform that handles everything from invites to seating arrangements! The RSVP tracking is incredibly accurate, and the interface is intuitive. Highly recommended!",
                },
                {
                  name: "Jessica Thompson",
                  role: "Birthday Party Host",
                  image:
                    "https://res.cloudinary.com/skillseeds-limited/image/upload/v1703723455/avatars/y6rjqpdm74wygnzsd7lz.png",
                  quote:
                    "I was blown away by how simple it was to set up my event. The digital invitations looked stunning, and my guests loved being able to RSVP with just one click!",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-full h-12 w-12"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="bg-gradient-to-r from-brandPurple to-backgroundPurple text-white py-16"
        >
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Event Planning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start your free trial today - no credit card required
            </p>
            <Link
              href="/auth/create-account"
              className="bg-white text-brandPurple px-8 py-4 rounded-lg text-lg hover:bg-gray-100 inline-block"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        <section id="stats" className="py-16">
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

      <Footer />
    </div>
  );
};

export default LandingPage;
