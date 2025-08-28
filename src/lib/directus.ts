import { createDirectus, graphql } from '@directus/sdk';

type Author = {
  directus_users_id: {
    display_name: string;
    slug: string;
  };
};

type ArticleTranslation = {
  title: string;
  body: string;
  feature_image: {
    id: string;
  };
  languages_id: {
    code: string,
  }
};

type ArticleTag = {
  id: string;
  tags_id: {
    slug: string;
    translations: {
      title: string;
      subtitle: string | undefined;
      languages_code: {
        code: string;
      };
    }[];
  };
};

type Article = {
  id: string;
  slug: string;
  published_date: string;
  authors: Author[];
  tags: ArticleTag[];
  translations: ArticleTranslation[];
};

type Schema = {
  articles: Article[];
};

const directus = createDirectus<Schema>('https://directus.katharostech.com').with(graphql());

export default directus;

export async function getArticles() {
  return await directus.query<{ articles: Article[] }>(`
    query {
  articles {
    id
    slug
    published_date
    authors {
    	directus_users_id {
        display_name
        slug
      }
    }
    tags {
      id
      tags_id {
        slug
        translations {
          title
          subtitle
          languages_code {
            code
          }
        }
      }
    }
    translations {
      title
      body 
      excerpt
      feature_image {
        id
      }
      languages_id {
        code
      }
    }
  }
}   
  `);
}

type Tag = {
  slug: string,
  translations: {
    title?: string,
    subtitle?: string,
    languages_code: {
      code: string
    },
  }[]
}

export async function getTags() {
  return await directus.query<{ tags: Tag[] }>(`
    query {
      tags {
        slug
        translations {
          title
          subtitle
          languages_code {
            code
          }
        }
      }
    }
  `);
}

type TextLink = {
  text: string,
  link: string,
}
type SiteAction = {
  text: string,
  link: string,
  icon?: string,
  variant: 'primary' | 'secondary' | 'tertiary'| 'link',
};

type StaffQuery = {
  studio_staff: {
    username: string,
    portrait: {
      id: string,
    };
    description: string,
    jobs: {
      title: string,
      description: string,
      icon: string,
    }[],
  }[];
  studio_staff_hero: {
    tagline: string,
    title: string,
    subtitle: string,
  };
}
const queryStudioStaff = `
  query {
    studio_staff {
      username
      portrait {
        id
      }
      description
      jobs {
        title
        description
        icon
      }
    }
    studio_staff_hero {
      tagline
      title,
      subtitle,
    }
  }
`;
export async function getStudioStaff() {
  return await directus.query<StaffQuery>(queryStudioStaff);
}


type AboutQuery = {
  studio_about: {
    tagline: string,
    header: string,
    content: string,
    actions: {
      site_actions_id: SiteAction,
    }[]
  };
}
const queryStudioAbout = `
  query {
    studio_about {
      tagline
      header
      content
      actions {
        site_actions_id {
          text
          icon
          variant
          link
        } 
      }
    } 
  }
`;
export async function getStudioAbout() {
  return await directus.query<AboutQuery>(queryStudioAbout);
}

type HomeQuery = {
    studio_hero: {
      title: string,
      description: string,
      tagline?: string,
      actions: {
        site_actions_id: SiteAction,
      }[]
    },
    studio_steps: {
      header: string,
      description: string,
      step_kind: "Steps" | "Steps2"
      steps: {
        title: string,
        icon_name: string,
        description: string,
      }[],
      action?: SiteAction,
    }[],
    studio_status: {
      title: string;
      description: string;
      action?: SiteAction,
    }[],
  };

const queryStudioHome = `
  query {
  studio_hero {
    title
    tagline
    description
    actions {
      site_actions_id {
        text
        link
        variant
        icon
      }
    }
  }
  studio_steps {
    header
    description
    action {
      text
      link
      variant
      icon
    }
    step_kind
    steps
  }
  studio_status {
    title
    description
    action {
      text
      link
      variant
      icon
    }
  }
}
`;
export async function getStudioHome() {
  return await directus.query<HomeQuery>(queryStudioHome);
}

type FooterQuery = {
    studio_footer: {
      primary_links: TextLink[],
    },
    studio_footer_groups: {
      header: string,
      links: TextLink[],
    }[]
};
const queryStudioFooter = `
  query {
    studio_footer {
      primary_links
    }
    studio_footer_groups {
      header
      links
    }
  }
`;
export async function getStudioFooter() {
  return await directus.query<FooterQuery>(queryStudioFooter);
}

type GameQuery = {
    studio_games: {
      title: string,
      excerpt: string,
      description: string,
      description_short: string,
      demo_link?: string,
      payment_link?: string,
      source_link?: string,
      download_link_linux?: string,
      download_link_windows?: string,
      download_link_mac?: string,
      tag: {
        slug: string,
      }
      image: {
        id: string,
      },
    }[]
};
const queryGames = `
  query {
    studio_games {
      title,
      excerpt,
      description,
      description_short,
      demo_link,
      payment_link,
      download_link_linux,
      download_link_windows,
      download_link_mac,
      source_link,
      tag {
        slug
      }
      image {
        id
      }
    }
  }
`;
export async function getGames() {
  return await directus.query<GameQuery>(queryGames);
}