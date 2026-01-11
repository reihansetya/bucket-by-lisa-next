import { Heart } from "lucide-react";

interface FooterProps {
  isAdmin: boolean;
}

export default function Footer({ isAdmin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* BOTTOM BAR: COPYRIGHT & CREDIT */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; {currentYear} Bucket by Lisa. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart
              size={12}
              className="text-red-500 fill-red-500 animate-pulse"
            />{" "}
            by
            <a
              href="https://github.com/reihansetya"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Reihan S
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
