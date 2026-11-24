import * as migration_20261121_003827_initial from './20261121_003827_initial';
import * as migration_20261121_142053_posts_drop_localization from './20261121_142053_posts_drop_localization';
import * as migration_20261121_142106_blog_categories_tags from './20261121_142106_blog_categories_tags';
import * as migration_20261124_013448_daily_log from './20261124_013448_daily_log';
import * as migration_20261124_024154_remove_daily_log from './20261124_024154_remove_daily_log';
import * as migration_20261124_033306_site_stats from './20261124_033306_site_stats';
import * as migration_20261124_033724_daily_visits from './20261124_033724_daily_visits';
import * as migration_20261124_041608_post_translation from './20261124_041608_post_translation';
import * as migration_20261124_041618_bilingual_meaning from './20261124_041618_bilingual_meaning';

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
    name: '20261121_142106_blog_categories_tags',
  },
  {
    up: migration_20261124_013448_daily_log.up,
    down: migration_20261124_013448_daily_log.down,
    name: '20261124_013448_daily_log',
  },
  {
    up: migration_20261124_024154_remove_daily_log.up,
    down: migration_20261124_024154_remove_daily_log.down,
    name: '20261124_024154_remove_daily_log',
  },
  {
    up: migration_20261124_033306_site_stats.up,
    down: migration_20261124_033306_site_stats.down,
    name: '20261124_033306_site_stats',
  },
  {
    up: migration_20261124_033724_daily_visits.up,
    down: migration_20261124_033724_daily_visits.down,
    name: '20261124_033724_daily_visits',
  },
  {
    up: migration_20261124_041608_post_translation.up,
    down: migration_20261124_041608_post_translation.down,
    name: '20261124_041608_post_translation',
  },
  {
    up: migration_20261124_041618_bilingual_meaning.up,
    down: migration_20261124_041618_bilingual_meaning.down,
    name: '20261124_041618_bilingual_meaning'
  },
];
