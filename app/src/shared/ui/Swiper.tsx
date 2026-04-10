import { isBrowser } from "@builder.io/qwik/build";
import { register } from "swiper/element/bundle";

// Register Swiper custom elements in the browser as soon as the module is loaded.
if (isBrowser) {
	console.log("Swiper registered");
	register();
}

/**
 * SwiperContainer is a transparent tag name alias for <swiper-container>.
 */
export const SwiperContainer = "swiper-container" as any;

/**
 * SwiperSlide is a transparent tag name alias for <swiper-slide>.
 */
export const SwiperSlide = "swiper-slide" as any;
