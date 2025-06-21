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

type Tag = {
  id: string;
  tags_id: {
    slug: string;
    translations: {
      title: string;
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
  tags: Tag[];
  translations: ArticleTranslation[];
};

type KtechStudioStatusBlock = {
  title: string;
  subtitle: string;
  action_name: string;
  action_variant: 'primary' | 'secondary' | 'tertiary'| 'link';
  action_link: string;
  action_icon: string;
};

type KtechStudioStaff = {
  username: string;
  description?: string;
  portrait?: {
    id: string,
  };
  jobs: KtechStudioStaffJob[];
};

type KtechStudioStaffJob = {
  ktech_studio_staff_jobs_id: {
    title: string;
    icon: string;
    description: string;
  };
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

export async function getStatusBlocks() {
  return await directus.query<{ ktech_studio_status_blocks: KtechStudioStatusBlock[] }>(`
    query {
  ktech_studio_status_blocks {
    id
    title
    subtitle
    action_name
    action_variant
    action_link
    action_icon
  }
}   
  `);
}

export async function getStaff() {
  return await directus.query<{ ktech_studio_staff: KtechStudioStaff[] }>(`
 query {
	ktech_studio_staff {
    username
    description
    portrait {
      id
    }
    jobs {
    	ktech_studio_staff_jobs_id {
        title
        icon
        description
        }
        }
  }
}
  `);
}
