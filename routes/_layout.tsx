// Document https://fresh.deno.dev/docs/concepts/layouts

import { LayoutProps } from "$fresh/server.ts";

export default function Layout({ Component, state }: LayoutProps) {
  return (
    <div class="px-4 py-8 mx-auto max-w-7xl">
      <h1 class="text-3xl font-bold text-center text-gray-900">
        <a href="/">
          イベント開催くん
        </a>
      </h1>
      <Component />
    </div>
  );
}
