import { getBlogPermalink, getHomePermalink } from './utils/permalinks.ts';
import { getPermalink } from "./utils/permalinks.ts";
import { getStudioFooter } from "./lib/directus.ts";

const footerQuery = (await getStudioFooter());

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getHomePermalink(),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Status',
      href: getPermalink('/#status'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Games',
      href: getPermalink('/games'),
    },
  ],
  actions: [{ text: 'Support Us', href: getPermalink('/supportus'), variant: 'primary' }],
};

export const footerData = {
  secondaryLinks: footerQuery.studio_footer.primary_links.map((x)=>({
    text: x.text,
    href: getPermalink(x.link),
  })),
  links: footerQuery.studio_footer_groups.map((x)=>({
    title: x.header,
    links: x.links.map((x)=>({text: x.text, href:getPermalink(x.link)})),
  })),
  socialLinks: [
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/katharostech' },
  ],
  // footNote: `
  //   <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://onwidget.com/favicon/favicon-32x32.png" alt="onWidget logo" loading="lazy"></img>
  //   Made by <a class="text-blue-600 underline dark:text-muted" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
  // `,
};
