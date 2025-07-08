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
  QrCode,
  Users,
  CreditCard,
  BarChart3,
  Clock,
  MessageSquare,
  Shield,
  Globe,
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
                  Complete Event Management
                  <span className="text-brandPurple"> Platform</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Create stunning digital invitations, manage ticketed events, track RSVPs in real-time, 
                  and handle everything from gift registries to seating arrangements. The all-in-one solution 
                  for weddings, corporate events, and celebrations of all sizes.
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
                Professional Event Management Made Simple
              </h2>
              <p className="text-xl text-gray-600">
                From intimate gatherings to large corporate events - we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Send,
                  title: "Multi-Channel Invitations",
                  description:
                    "Send via email, SMS, WhatsApp, or voice calls. QR codes and access codes for secure entry",
                },
                {
                  icon: Gift,
                  title: "Event Monetization",
                  description:
                    "Sell tickets, manage gift registries, and process payments with multi-currency support",
                },
                {
                  icon: Calendar,
                  title: "Real-Time Analytics",
                  description:
                    "Track RSVPs, attendance, revenue, and engagement with comprehensive reporting",
                },
                {
                  icon: TableProperties,
                  title: "Complete Event Tools",
                  description:
                    "Table management, vendor coordination, program scheduling, and guest check-in systems",
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

        <section id="all-features" className="py-16 md:py-24 bg-gradient-to-b from-white to-backgroundPurple/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need in One Powerful Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                No more juggling multiple tools. Smart Invites brings together everything you need to create memorable events.
              </p>
            </div>

            <div className="space-y-16">
              {/* First Row - Core Features */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-brandPurple to-backgroundPurple text-white p-8 rounded-2xl shadow-xl">
                  <Send className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Smart Invitations</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Multi-channel delivery (Email, SMS, WhatsApp)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Beautiful custom templates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Automated reminders & thank you notes</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <Users className="w-12 h-12 mb-4 text-brandPurple" />
                  <h3 className="text-2xl font-bold mb-4">Guest Excellence</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Real-time RSVP tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Bulk import & categorization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Guest preferences & profiles</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-xl border border-purple-100">
                  <Shield className="w-12 h-12 mb-4 text-brandPurple" />
                  <h3 className="text-2xl font-bold mb-4">Secure Check-In</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <QrCode className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>QR code verification</span>
                    </li>
                    <li className="flex items-start">
                      <QrCode className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Facial recognition option</span>
                    </li>
                    <li className="flex items-start">
                      <QrCode className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Access code protection</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Second Row - Business Features */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-xl border border-green-100">
                  <CreditCard className="w-12 h-12 mb-4 text-green-600" />
                  <h3 className="text-2xl font-bold mb-4">Revenue Tools</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">$</span>
                      <span>Sell tickets with tiered pricing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">$</span>
                      <span>Multi-currency payments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">$</span>
                      <span>Integrated gift registry</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <BarChart3 className="w-12 h-12 mb-4 text-brandPurple" />
                  <h3 className="text-2xl font-bold mb-4">Smart Analytics</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Real-time event dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Revenue & engagement tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-brandPurple mr-2 mt-0.5 flex-shrink-0" size={16} />
                      <span>Custom report exports</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-brandPurple to-backgroundPurple text-white p-8 rounded-2xl shadow-xl">
                  <Globe className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Pro Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="mr-2">★</span>
                      <span>Table & seating management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">★</span>
                      <span>Vendor coordination tools</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">★</span>
                      <span>Virtual & hybrid events</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Additional Features Banner */}
              <div className="bg-gradient-to-r from-backgroundPurple/10 to-brandPurple/10 p-8 rounded-2xl">
                <div className="text-center">
                  <h4 className="text-xl font-semibold mb-4">Plus Many More Features</h4>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <span className="bg-white px-4 py-2 rounded-full shadow">Voice Call Invites</span>
                    <span className="bg-white px-4 py-2 rounded-full shadow">Multi-Day Events</span>
                    <span className="bg-white px-4 py-2 rounded-full shadow">Program Scheduling</span>
                    <span className="bg-white px-4 py-2 rounded-full shadow">Photo Galleries</span>
                    <span className="bg-white px-4 py-2 rounded-full shadow">Broadcast Messaging</span>
                    <span className="bg-white px-4 py-2 rounded-full shadow">Mobile Apps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Smart Invites Works
              </h2>
              <p className="text-xl text-gray-600">
                Get your event up and running in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Create Your Event",
                  description: "Add event details, upload media, and customize your invitation design"
                },
                {
                  step: "2",
                  title: "Import Guests",
                  description: "Add guests individually or bulk import via CSV. Organize into categories"
                },
                {
                  step: "3",
                  title: "Send Invitations",
                  description: "Choose delivery method and send personalized invitations instantly"
                },
                {
                  step: "4",
                  title: "Manage & Track",
                  description: "Monitor RSVPs, check in guests, and access real-time analytics"
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-brandPurple text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Every Celebration
              </h2>
              <p className="text-xl text-gray-600">
                One platform, endless possibilities
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Personal Events",
                  description: "Weddings, birthdays, anniversaries, and family gatherings",
                  color: "bg-purple-50"
                },
                {
                  title: "Corporate Events", 
                  description: "Conferences, team meetings, product launches, and networking",
                  color: "bg-blue-50"
                },
                {
                  title: "Community Events",
                  description: "Fundraisers, religious gatherings, festivals, and social causes",
                  color: "bg-green-50"
                }
              ].map((category, index) => (
                <div key={index} className={`${category.color} p-8 rounded-2xl`}>
                  <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                  <p className="text-gray-700">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Flexible Pricing for Every Event
              </h2>
              <p className="text-xl text-gray-600">
                Choose the perfect plan for your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "forever",
                  features: ["3 events per month", "50 guests per event", "Basic templates", "Email support"],
                  cta: "Start Free",
                  highlighted: false,
                },
                {
                  name: "Premium",
                  price: "$29.99",
                  period: "per month",
                  features: ["10 events per month", "200 guests per event", "Premium templates", "Gift registry", "Priority support"],
                  cta: "Choose Premium",
                  highlighted: true,
                },
                {
                  name: "VIP",
                  price: "$99.99",
                  period: "per month",
                  features: ["Unlimited events", "Unlimited guests", "Custom branding", "Advanced analytics", "24/7 support"],
                  cta: "Go VIP",
                  highlighted: false,
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-xl shadow-lg ${
                    plan.highlighted ? 'ring-2 ring-brandPurple transform scale-105' : ''
                  }`}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/create-account"
                    className={`w-full py-3 px-6 rounded-lg text-center block transition-colors ${
                      plan.highlighted
                        ? 'bg-brandPurple text-white hover:bg-backgroundPurple'
                        : 'border border-brandPurple text-brandPurple hover:bg-brandPurple hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
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
                { value: "25k+", label: "Events Hosted" },
                { value: "500k+", label: "Invitations Sent" },
                { value: "99%", label: "Uptime Guarantee" },
                { value: "Global", label: "Multi-Currency Support" },
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
