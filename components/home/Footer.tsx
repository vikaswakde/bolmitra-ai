import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refund" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/legal/tnc" },
      { label: "Shipping and Delivery", href: "/legal/tnc" },
      { label: "Contact Us", href: "/legal/tnc" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-200  border-2 shadow-lg mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4">
              <Image
                src="/bolMitra.png"
                alt="bolMitra Logo"
                width={52}
                height={52}
                className="hover:rotate-12 transform transition duration-200 ease-in-out"
              />
              <span className="text-xl font-bold text-gray-800 -ml-2">
                BolMitra
              </span>
            </Link>
            <p className="text-gray-600">
              Your AI companion to master communication.
            </p>
          </div>
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-800 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-200/20 h-20 py-24 px-12 z-20 relative overflow-hidden">
          <p>All Rights Reserved, 2025</p>
          <p className="text-sm py-2">
            <a href="https://x.com/@vikaswakde42" target="_blank">
              Built 💚 by{" "}
              <span className="underline decoration-dashed underline-offset-2">
                Vikas
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
