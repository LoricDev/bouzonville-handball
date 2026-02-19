"use client";

import { Fragment, ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { ALLOWED_ADMIN_ROLES } from "@/types/roles";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  Facebook,
  Instagram,
  Linkedin,
  Home,
  Users,
  Trophy,
  Calendar,
  GraduationCap,
  Handshake,
  Info,
  Store,
  BookOpen,
  Building,
  MapPin,
  HeartHandshake,
  Archive,
  ListChecks,
  Sparkles,
  UserCheck,
  Sun,
  Scale,
  Dumbbell,
  CalendarClock,
  FileText,
  FolderOpen,
  Newspaper,
  CalendarHeart,
  ImageIcon,
  User as UserIcon,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

// --- DÉFINITION DES TYPES ---

interface NavItem {
  label: string;
  href?: string;
  icon: ElementType;
  children?: NavItem[];
}

interface UserNavItem {
  name: string;
  icon: ElementType;
  href?: string;
  onClick?: () => void;
}

interface UIUser {
  name: string;
  email: string;
  imageUrl: string;
}

// --- CONFIGURATION ---

const navItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: Home },
  {
    label: "Actualités",
    icon: Newspaper,
    children: [
      { href: "/actualites", label: "Le Fil Info", icon: FileText },
      { href: "/evenements", label: "Événements Club", icon: CalendarHeart },
      { href: "/galerie", label: "Photos & Vidéos", icon: ImageIcon },
    ],
  },
  {
    label: "Le Club",
    icon: Users,
    children: [
      { href: "/club/histoire", label: "Histoire & Valeurs", icon: BookOpen },
      { href: "/club/personnel", label: "Personnel", icon: Building },
      { href: "/club/installations", label: "Nos Gymnases", icon: MapPin },
      {
        href: "/club/benevoles",
        label: "Devenir Bénévole",
        icon: HeartHandshake,
      },
      { href: "/club/archives", label: "Archives", icon: Archive },
    ],
  },
  {
    label: "Sportif",
    icon: Trophy,
    children: [
      { href: "/equipes", label: "Nos Équipes", icon: Users },
      {
        href: "/competition/calendrier",
        label: "Calendrier Week-end",
        icon: Calendar,
      },
      {
        href: "/competition/resultats",
        label: "Résultats & Classements",
        icon: ListChecks,
      },
    ],
  },
  {
    label: "Formation",
    icon: GraduationCap,
    children: [
      {
        href: "/formation/baby-hand",
        label: "Baby Hand (3-5 ans)",
        icon: Sparkles,
      },
      {
        href: "/formation/ecole-handball",
        label: "École de Hand",
        icon: UserCheck,
      },
      { href: "/formation/stages", label: "Stages Vacances", icon: Sun },
      { href: "/formation/arbitrage", label: "École d'Arbitrage", icon: Scale },
      { href: "/formation/handfit", label: "Handfit (Santé)", icon: Dumbbell },
    ],
  },
  {
    label: "Infos Pratiques",
    icon: Info,
    children: [
      {
        href: "/informations/entrainements",
        label: "Planning Entraînements",
        icon: CalendarClock,
      },
      {
        href: "/informations/licences",
        label: "Inscriptions & Tarifs",
        icon: FileText,
      },
      {
        href: "/informations/documents",
        label: "Documents à télécharger",
        icon: FolderOpen,
      },
    ],
  },
  { href: "/boutique", label: "Boutique", icon: Store },
  { href: "/partenaires", label: "Partenaires", icon: Handshake },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderUnified() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role
    ? ALLOWED_ADMIN_ROLES.includes(
        session.user.role as (typeof ALLOWED_ADMIN_ROLES)[number],
      )
    : false;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const userNavigation: UserNavItem[] = [
    ...(isAdmin
      ? [
          {
            name: "Administration",
            href: "/admin",
            icon: LayoutDashboard,
          },
        ]
      : []),
    { name: "Mon Profil", href: "/profil", icon: UserIcon },
    { name: "Paramètres", href: "/parametres", icon: Settings },
    {
      name: "Déconnexion",
      onClick: handleLogout,
      icon: ArrowRightOnRectangleIcon,
    },
  ];

  const user: UIUser | null = session?.user
    ? {
        name:
          session.user.name ||
          session.user.email?.split("@")[0] ||
          "Utilisateur",
        email: session.user.email || "",
        imageUrl: session.user.image || "",
      }
    : null;

  const isItemActive = (item: NavItem): boolean => {
    if (item.href === pathname) return true;
    if (item.children) {
      return item.children.some(
        (child) => child.href && pathname.startsWith(child.href),
      );
    }
    return false;
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Disclosure
      as="header"
      className="bg-blue-500 shadow-lg z-50 relative font-calibri"
    >
      {({ open }) => (
        <>
          {/* --- TOP BAR --- */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <Link href="/" className="flex shrink-0 items-center gap-3">
                  <Image
                    src="/images/common/ui/logos/logo-blanc.png"
                    alt="Logo Bouzonville Handball"
                    width={48}
                    height={48}
                    className="h-12 w-auto object-contain"
                  />
                  <div className="hidden sm:block text-left">
                    <h1 className="text-xl font-bluescreens font-bold text-white uppercase tracking-wide leading-none">
                      Bouzonville
                    </h1>
                    <p className="text-sm text-white/80 font-medium uppercase leading-none mt-1">
                      Handball
                    </p>
                  </div>
                </Link>
              </div>

              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                <div className="flex items-center space-x-4 border-r border-blue-400/50 pr-6">
                  <SocialLink
                    href="https://www.facebook.com/bouzonvillehb"
                    icon={Facebook}
                  />
                  <SocialLink
                    href="https://www.instagram.com/bouzonvillehb"
                    icon={Instagram}
                  />
                  <SocialLink
                    href="https://www.linkedin.com/company/bouzonvillehb"
                    icon={Linkedin}
                  />
                  <SocialLink
                    href="https://whatsapp.com/channel/0029VbAxvSw5EjxvE1aOKZ2F"
                    icon={FaWhatsapp}
                  />
                  <SocialLink
                    href="https://www.tiktok.com/@bouzonville.handb"
                    icon={FaTiktok}
                  />
                </div>

                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-5 py-1.5 rounded-md hover:bg-white hover:text-blue-600 transition-all font-bold text-sm uppercase tracking-wider"
                >
                  Contact
                </Link>

                {/* --- USER MENU / LOGIN (DESKTOP) --- */}
                <div className="relative ml-2">
                  {user ? (
                    <Menu as="div" className="relative shrink-0">
                      <div>
                        <MenuButton className="relative flex rounded-full bg-blue-500 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                          <span className="sr-only">
                            Ouvrir le menu utilisateur
                          </span>
                          <Avatar
                            alt={`Avatar de ${user.name}`}
                            src={user.imageUrl}
                            className="size-10"
                            initials={user.name.charAt(0).toUpperCase()}
                          />
                        </MenuButton>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          {userNavigation.map((item) => (
                            <MenuItem key={item.name}>
                              {({ focus }) =>
                                item.onClick ? (
                                  <button
                                    onClick={item.onClick}
                                    className={classNames(
                                      focus ? "bg-gray-100" : "",
                                      "flex w-full items-center px-4 py-2 text-sm text-gray-700 text-left",
                                    )}
                                  >
                                    <item.icon className="mr-2 h-4 w-4 text-gray-400" />
                                    {item.name}
                                  </button>
                                ) : (
                                  <Link
                                    href={item.href || "#"}
                                    className={classNames(
                                      focus ? "bg-gray-100" : "",
                                      "flex items-center px-4 py-2 text-sm text-gray-700",
                                    )}
                                  >
                                    <item.icon className="mr-2 h-4 w-4 text-gray-400" />
                                    {item.name}
                                  </Link>
                                )
                              }
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-white hover:text-orange-300 transition-colors group"
                    >
                      <div className="p-1.5 rounded-full bg-blue-400/30 group-hover:bg-blue-400/50 transition-colors">
                        <UserCircleIcon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium hidden xl:block">
                        Connexion
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="relative z-10 flex items-center lg:hidden gap-4">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Ouvrir le menu</span>
                  {open ? (
                    <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* --- NAVBAR DESKTOP --- */}
          <div className="hidden lg:block bg-blue-500 border-t border-blue-400/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-1 py-1 justify-center">
                {navItems.map((item) => {
                  const isActive = isItemActive(item);
                  const Icon = item.icon;

                  if (item.children) {
                    return (
                      <Popover key={item.label} className="relative">
                        {({ open: popoverOpen }) => (
                          <>
                            <PopoverButton
                              className={classNames(
                                isActive
                                  ? "bg-blue-600 text-white shadow-inner"
                                  : "text-white hover:bg-blue-400/50 hover:text-white",
                                popoverOpen ? "bg-blue-400/50" : "",
                                "group inline-flex items-center rounded-md px-3 py-3 text-sm font-medium focus:outline-none transition-colors",
                              )}
                            >
                              <Icon
                                className={classNames(
                                  isActive
                                    ? "text-orange-400"
                                    : "text-blue-200 group-hover:text-white",
                                  "mr-2 h-4 w-4 transition-colors",
                                )}
                              />
                              <span>{item.label}</span>
                              <ChevronDownIcon
                                className={classNames(
                                  popoverOpen ? "rotate-180" : "text-blue-200",
                                  "ml-1 h-4 w-4 transition-transform duration-200",
                                )}
                                aria-hidden="true"
                              />
                            </PopoverButton>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                            >
                              <PopoverPanel className="absolute left-1/2 z-50 mt-2 w-64 -translate-x-1/2 transform px-2 sm:px-0">
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                  <div className="relative grid gap-1 bg-white p-2">
                                    {item.children?.map((child) => (
                                      <Link
                                        key={child.href}
                                        href={child.href || "#"}
                                        className={classNames(
                                          pathname === child.href
                                            ? "bg-orange-50 text-orange-700"
                                            : "text-gray-900 hover:bg-gray-50",
                                          "flex items-center rounded-md px-4 py-3 transition duration-150 ease-in-out",
                                        )}
                                      >
                                        <child.icon
                                          className="h-5 w-5 shrink-0 text-orange-500"
                                          aria-hidden="true"
                                        />
                                        <div className="ml-4">
                                          <p className="text-sm font-medium">
                                            {child.label}
                                          </p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </PopoverPanel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href || "#"}
                      className={classNames(
                        isActive
                          ? "bg-blue-600 text-white shadow-inner"
                          : "text-white hover:bg-blue-400/50 hover:text-white",
                        "group inline-flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      )}
                    >
                      <Icon
                        className={classNames(
                          isActive
                            ? "text-orange-400"
                            : "text-blue-200 group-hover:text-white",
                          "mr-2 h-4 w-4 transition-colors",
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* --- MOBILE MENU --- */}
          <DisclosurePanel
            as="nav"
            className="lg:hidden bg-blue-600 shadow-inner"
            aria-label="Global"
          >
            <div className="border-b border-blue-500 bg-blue-700/30 pb-3 pt-4">
              {user ? (
                <Disclosure as="div" className="px-2">
                  {({ open: userMenuOpen }) => (
                    <>
                      <DisclosureButton className="group flex w-full items-center justify-between rounded-md py-2 pl-3 pr-3 text-base font-medium text-white hover:bg-blue-500">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <Avatar
                              alt={`Avatar de ${user.name}`}
                              src={user.imageUrl}
                              className="size-10"
                              initials={user.name.charAt(0).toUpperCase()}
                            />
                          </div>
                          <div className="ml-3 text-left">
                            <div className="text-base font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-sm font-medium text-blue-200">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <ChevronDownIcon
                          className={classNames(
                            userMenuOpen ? "rotate-180" : "",
                            "h-5 w-5 flex-none text-blue-200 transition-transform",
                          )}
                          aria-hidden="true"
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="space-y-1 pl-4 pr-2 mt-2">
                        {userNavigation.map((item) =>
                          item.onClick ? (
                            <DisclosureButton
                              key={item.name}
                              as="button"
                              onClick={item.onClick}
                              className="w-full flex items-center rounded-md px-3 py-2 text-base font-medium text-blue-100 hover:bg-blue-500 hover:text-white"
                            >
                              <item.icon className="mr-3 h-5 w-5 text-blue-300" />
                              {item.name}
                            </DisclosureButton>
                          ) : (
                            <DisclosureButton
                              key={item.name}
                              as={Link}
                              href={item.href || "#"}
                              className="flex items-center rounded-md px-3 py-2 text-base font-medium text-blue-100 hover:bg-blue-500 hover:text-white"
                            >
                              <item.icon className="mr-3 h-5 w-5 text-blue-300" />
                              {item.name}
                            </DisclosureButton>
                          ),
                        )}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              ) : (
                <div className="px-4">
                  <Link href="/login">
                    <button className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 font-bold py-2 px-4 rounded-md shadow-sm hover:bg-blue-50 transition-colors">
                      <UserCircleIcon className="h-6 w-6" />
                      Se connecter
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => {
                const isActive = isItemActive(item);
                if (item.children) {
                  return (
                    <Disclosure
                      as="div"
                      key={item.label}
                      className="space-y-1"
                      defaultOpen={isActive}
                    >
                      {({ open: subOpen }) => (
                        <>
                          <DisclosureButton
                            className={classNames(
                              isActive
                                ? "bg-blue-700 text-white"
                                : "text-white hover:bg-blue-500",
                              "group flex w-full items-center justify-between rounded-md py-2 pl-3 pr-3 text-base font-medium",
                            )}
                          >
                            <div className="flex items-center">
                              <item.icon className="mr-3 h-5 w-5 text-blue-200 group-hover:text-white" />
                              {item.label}
                            </div>
                            <ChevronDownIcon
                              className={classNames(
                                subOpen ? "rotate-180" : "",
                                "h-5 w-5 flex-none text-blue-200 transition-transform",
                              )}
                              aria-hidden="true"
                            />
                          </DisclosureButton>
                          <DisclosurePanel className="space-y-1 pl-4 pr-2">
                            {item.children?.map((child) => (
                              <DisclosureButton
                                key={child.label}
                                as={Link}
                                href={child.href || "#"}
                                className={classNames(
                                  pathname === child.href
                                    ? "bg-orange-500 text-white"
                                    : "text-blue-100 hover:bg-blue-500 hover:text-white",
                                  "group flex w-full items-center rounded-md py-2 pl-3 pr-2 text-sm font-medium",
                                )}
                              >
                                <child.icon className="mr-3 h-4 w-4 opacity-70" />
                                {child.label}
                              </DisclosureButton>
                            ))}
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  );
                }
                return (
                  <DisclosureButton
                    key={item.label}
                    as={Link}
                    href={item.href || "#"}
                    className={classNames(
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-white hover:bg-blue-500",
                      "group flex items-center rounded-md px-3 py-2 text-base font-medium",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-blue-200 group-hover:text-white" />
                    {item.label}
                  </DisclosureButton>
                );
              })}
            </div>

            <div className="border-t border-blue-500 pt-4 pb-6 bg-blue-600">
              <div className="flex items-center px-4 justify-between">
                <Link href="/contact" className="w-full">
                  <button className="w-full border-2 border-white text-white py-2 rounded-md hover:bg-white hover:text-blue-600 transition-colors font-bold uppercase">
                    Nous contacter
                  </button>
                </Link>
              </div>
              <div className="mt-4 flex justify-center space-x-6">
                <SocialLink
                  href="https://www.facebook.com/bouzonvillehb"
                  icon={Facebook}
                  mobile
                />
                <SocialLink
                  href="https://www.instagram.com/bouzonvillehb"
                  icon={Instagram}
                  mobile
                />
                <SocialLink
                  href="https://www.linkedin.com/company/bouzonvillehb"
                  icon={Linkedin}
                  mobile
                />
                <SocialLink
                  href="https://whatsapp.com/channel/0029VbAxvSw5EjxvE1aOKZ2F"
                  icon={FaWhatsapp}
                  mobile
                />
                <SocialLink
                  href="https://www.tiktok.com/@bouzonville.handb"
                  icon={FaTiktok}
                  mobile
                />
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

interface SocialLinkProps {
  href: string;
  icon: ElementType;
  mobile?: boolean;
}

function SocialLink({ href, icon: Icon, mobile }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-white hover:text-orange-400 transition-colors ${
        mobile ? "hover:scale-110 transform duration-200" : ""
      }`}
    >
      <Icon className="h-6 w-6" />
    </a>
  );
}
