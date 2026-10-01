import * as migration_20260920_152958_add_gcash_reference_number from './20260920_152958_add_gcash_reference_number';
import * as migration_20260920_155204_add_gcash_accounts from './20260920_155204_add_gcash_accounts';

export const migrations = [
  {
    up: migration_20260920_152958_add_gcash_reference_number.up,
    down: migration_20260920_152958_add_gcash_reference_number.down,
    name: '20260920_152958_add_gcash_reference_number',
  },
  {
    up: migration_20260920_155204_add_gcash_accounts.up,
    down: migration_20260920_155204_add_gcash_accounts.down,
    name: '20260920_155204_add_gcash_accounts'
  },
];
