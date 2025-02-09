// Document https://fresh.deno.dev/docs/concepts/layouts

import { LayoutProps } from "$fresh/server.ts";

export default function Layout({ Component, state }: LayoutProps) {
  return (
    <div class="px-4 py-8 mx-auto max-w-5xl">
      <h1 class="text-xl font-bold text-gray-900">
        <a href="/">
          イベント開催くん
        </a>
      </h1>

      <div class="mt-16">
        <Component />
      </div>
    </div>
  );
}
