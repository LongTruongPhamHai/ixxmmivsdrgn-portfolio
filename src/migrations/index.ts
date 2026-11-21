import * as migration_20261121_003827_initial from './20261121_003827_initial';
import * as migration_20261121_142053_posts_drop_localization from './20261121_142053_posts_drop_localization';
import * as migration_20261121_142106_blog_categories_tags from './20261121_142106_blog_categories_tags';

export const migrations = [
  {
    up: migration_20261121_003827_initial.up,
    down: migration_20261121_003827_initial.down,
    name: '20261121_003827_initial',
  },
  {
    up: migration_20261121_142053_posts_drop_localization.up,
    down: migration_20261121_142053_posts_drop_localization.down,
    name: '20261121_142053_posts_drop_localization',
  },
  {
    up: migration_20261121_142106_blog_categories_tags.up,
    down: migration_20261121_142106_blog_categories_tags.down,
    name: '20261121_142106_blog_categories_tags'
  },
];
