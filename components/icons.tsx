import {
  Loader2,
  LucideProps,
  Music2,
  Github,
  Mail,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  type Icon as LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type Icon = typeof LucideIcon

export const Icons = {
  logo: function Logo({ className, ...props }: React.ComponentProps<"svg">) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-6 w-6", className)}
        {...props}
      >
        {/* Main outer circle */}
        <circle cx="12" cy="12" r="10" className="opacity-20" />
        {/* Inner sound waves */}
        <path d="M12 7v10" className="opacity-90" />
        <path d="M9 9v6" className="opacity-70" />
        <path d="M15 9v6" className="opacity-70" />
        <path d="M6 11v2" className="opacity-50" />
        <path d="M18 11v2" className="opacity-50" />
        {/* Center dot */}
        <circle cx="12" cy="12" r="1" className="fill-current" />
      </svg>
    );
  },
  spinner: Loader2,
  gitHub: Github,
  google: Mail, // Using Mail as a temporary Google icon since Lucide doesn't have a Google icon
  menu: Menu,
  social: {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
  },
}

export type IconProps = LucideProps 