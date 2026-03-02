import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import "~/global.css";
import { RouterHead } from "~/shared/ui/RouterHead";

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="module" src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js" />
        <RouterHead />
      </head>
      <body lang="ru">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
