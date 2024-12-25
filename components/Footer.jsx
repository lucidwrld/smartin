const Footer = () => {
  const menuItems = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "#hero" },
        { label: "Features", href: "#features" },
        { label: "Demo", href: "#demo" },
        { label: "Testimonials", href: "#testimonials" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Cookie Policy", href: "/legal/cookies" },
        { label: "GDPR", href: "/legal/gdpr" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Twitter", href: "https://twitter.com/smartinvites" },
        { label: "Facebook", href: "https://facebook.com/smartinvites" },
        { label: "Instagram", href: "https://instagram.com/smartinvites" },
        {
          label: "LinkedIn",
          href: "https://linkedin.com/company/smartinvites",
        },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Smart Invites</h3>
            <p className="text-gray-600">
              Making digital invitations simple and delightful
            </p>
          </div>
          {menuItems.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : "_self"}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : ""
                      }
                      className="text-gray-600 hover:text-brandPurple"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} Smart Invites. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
