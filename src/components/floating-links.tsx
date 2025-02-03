import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export function FloatingLinks({
  className = '',
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, 'children'>) {
  return (
    <footer
      className={`fixed bottom-12 left-1/2 flex -translate-x-1/2 transform gap-4 ${className}`}
      {...props}
    >
      <Anchor
        href="https://github.com/birzgalisn"
        target="_blank"
        icon={<Github aria-label="GitHub icon" className="size-4" />}
        aria-label="View Niks Birzgalis on GitHub"
      >
        GitHub
      </Anchor>

      <Anchor
        href="https://linkedin.com/in/birzgalisn"
        target="_blank"
        icon={<Linkedin aria-label="LinkedIn icon" className="size-4" />}
        aria-label="View Niks Birzgalis on LinkedIn"
      >
        LinkedIn
      </Anchor>

      <Anchor
        href="mailto:hello@niksbirzgalis.com"
        icon={<Mail aria-label="Email icon" className="size-4" />}
        aria-label="Send an email to Niks Birzgalis"
      >
        Email
      </Anchor>
    </footer>
  );
}

function Anchor({
  href,
  icon,
  children,
  className = '',
  ...props
}: {
  href: string;
  icon: React.ReactNode;
} & React.HTMLProps<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 ${className}`}
      {...props}
    >
      <span>{children}</span>

      <div className="relative size-4 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-180deg)]">
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {icon}
        </div>

        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <ExternalLink className="size-4" aria-label="View external link" />
        </div>
      </div>
    </Link>
  );
}
