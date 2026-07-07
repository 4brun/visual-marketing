import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default"
declare module "../../../../node_modules/.pnpm/nuxt@3.15.4_@parcel+watcher@2.5.6_@types+node@22.19.21_cac@6.7.14_db0@0.3.4_ioredis@5.11.1_ma_uvnf5wzokwvqztazeovmvxelgq/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}