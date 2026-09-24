import { Language } from './preferences.models';

/**
 * page-level metadata
 */
export interface ContentMeta {
  lang: Language;
  dir: 'ltr' | 'rtl';
  htmlLang: string;
  pageTitle: string;
  pageDescription: string;
}

/**
 * accessible labels used across components
 */
export interface ContentA11y {
  openMenu: string;
  closeMenu: string;
  toggleTheme: string;
  close: string;
  switchLanguage: string;
}

/**
 * brand mark shown in the header, sidebar and footer
 */
export interface ContentBrand {
  name: string;
  tagline: string;
}

/**
 * desktop nav labels
 */
export interface ContentNav {
  itinerary: string;
  work: string;
  projects: string;
  writing: string;
  teaching: string;
  contact: string;
  hire: string;
}

/**
 * one link in the mobile sidebar
 */
export interface SidebarItem {
  href: string;
  label: string;
  glyph: string;
}

/**
 * mobile sidebar content
 */
export interface ContentSidebar {
  items: SidebarItem[];
  cta: string;
}

/**
 * hero section content
 */
export interface ContentHero {
  badge: string;
  title: string;
  lede: string;
  ctaHireDev: string;
  ctaTutor: string;
  ctaBlog: string;
  ctaTalk: string;
  stats: string[];
  imageCaption: string;
}

/**
 * one stop on the career timeline, preview card plus drawer detail
 */
export interface ItineraryStop {
  previewEyebrow: string;
  year: string;
  org: string;
  roleShort: string;
  dateShort: string;
  active: boolean;
  drawerKind: string;
  role: string;
  place: string;
  body: string;
  tags: string[];
}

/**
 * career itinerary section content
 */
export interface ContentItinerary {
  title: string;
  meta: string;
  stops: ItineraryStop[];
}

/**
 * one case study card
 */
export interface WorkItem {
  tags: string[];
  title: string;
  desc: string;
  linkLabel: string;
  imageCaption: string;
  icon?: WorkItemIcon;
}

/**
 * which inline glyph the media placeholder draws for a work item
 */
export type WorkItemIcon = 'plane' | 'gauge' | 'energy';

/**
 * selected work section content
 */
export interface ContentWork {
  title: string;
  meta: string;
  items: WorkItem[];
}

/**
 * one side-project "boarding pass" card
 */
export interface ProjectItem {
  eyebrow: string;
  title: string;
  code: string;
  desc: string;
  tags: string[];
  links: ProjectLink[];
}

/**
 * one repository a project card points at, two when the project is split
 * into a front end and a back end
 */
export interface ProjectLink {
  label: string;
  href: string;
}

/**
 * side projects section content
 */
export interface ContentProjects {
  title: string;
  meta: string;
  items: ProjectItem[];
}

/**
 * one article row
 */
export interface ArticleItem {
  title: string;
  tags: string[];
  read: string;
  date: string;
  href: string;
}

/**
 * the "Java explained in Darija" mini-series banner
 */
export interface ContentDarija {
  eyebrow: string;
  title: string;
  desc: string;
  tags: string[];
  cta: string;
  href: string;
}

/**
 * writing section content
 */
export interface ContentWriting {
  title: string;
  meta: string;
  columnArticle: string;
  columnRead: string;
  columnDate: string;
  items: ArticleItem[];
  allPostsLabel: string;
  allPostsHref: string;
  darija: ContentDarija;
}

/**
 * one 1-on-1 lesson offered
 */
export interface LessonItem {
  name: string;
  level: string;
}

/**
 * one highlight stat, e.g. "3 / interns mentored"
 */
export interface StatItem {
  num: string;
  label: string;
}

/**
 * teaching section content
 */
export interface ContentTeaching {
  title: string;
  lessonsEyebrow: string;
  lessons: LessonItem[];
  cta: string;
  languagesEyebrow: string;
  languages: string[];
  note: string;
  stats: StatItem[];
}

/**
 * a canned reply, matched by keyword against a visitor's question
 */
export interface AskAnswer {
  keywords: string[];
  text: string;
}

/**
 * "ask about me" banner and CV-assistant drawer content
 */
export interface ContentAsk {
  bannerEyebrow: string;
  bannerTitle: string;
  bannerDesc: string;
  openBtn: string;
  eyebrow: string;
  title: string;
  greeting: string;
  suggestions: string[];
  placeholder: string;
  send: string;
  fallback: string;
  answers: AskAnswer[];
}

/**
 * one certification card
 */
export interface CertItem {
  year: string;
  name: string;
  org: string;
}

/**
 * certifications section content
 */
export interface ContentCerts {
  title: string;
  meta: string;
  items: CertItem[];
}

/**
 * one contact channel
 */
export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

/**
 * contact section content
 */
export interface ContentContact {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  ctaHref: string;
  links: ContactLink[];
}

/**
 * footer content
 */
export interface ContentFooter {
  brand: string;
  meta: string;
}

/**
 * the full shape of one locale file, e.g. `i18n/en.json`
 */
export interface Content {
  meta: ContentMeta;
  a11y: ContentA11y;
  brand: ContentBrand;
  nav: ContentNav;
  sidebar: ContentSidebar;
  hero: ContentHero;
  itinerary: ContentItinerary;
  work: ContentWork;
  projects: ContentProjects;
  writing: ContentWriting;
  teaching: ContentTeaching;
  ask: ContentAsk;
  certs: ContentCerts;
  contact: ContentContact;
  footer: ContentFooter;
}
