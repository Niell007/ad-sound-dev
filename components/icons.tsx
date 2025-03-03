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

export type Icon = typeof LucideIcon

export const Icons = {
  logo: Music2,
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