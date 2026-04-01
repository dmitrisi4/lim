import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import "~/global.css";
import "swiper/css/bundle";
import { register } from "swiper/element/bundle";
import { RouterHead } from "~/shared/ui/RouterHead";

export default component$(() => {
	useVisibleTask$(() => {
		console.log("Swiper registered from root.tsx");
		register();
	});

	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<RouterHead />
			</head>
			<body lang="ru">
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	);
});
