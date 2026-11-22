import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ImagemsTipe {

  url:string

}

interface Props {
  images: ImagemsTipe[];
}

export function Gallery({ images }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);


  return (
    <div className="w-full">

      {/* Imagem principal */}
      <Swiper
        modules={[Thumbs, Navigation]}
        navigation={{
          nextEl: ".nextEl",
          prevEl: ".prevEl",
        }}
        thumbs={{
          swiper:
            thumbsSwiper && !thumbsSwiper.destroyed
              ? thumbsSwiper
              : null,
        }}
        className="w-full h-[500px]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.url}
              className="w-full h-full object-cover rounded-md"
              alt={`Imagem ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="
        nextEl absolute right-2 top-1/2 z-10
        -translate-y-1/2
        p-3 rounded-full bg-preto/50 text-branco shadow-md
      ">
        <FaChevronRight />
      </button>

      <button className="
        prevEl absolute left-2 top-1/2 z-10
        -translate-y-1/2
        p-3 rounded-full bg-preto/50 text-branco shadow-md
      ">
        <FaChevronLeft />
      </button>

      {/* Miniaturas */}
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        slidesPerView={5}
        spaceBetween={8}
        className="mt-2"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.url}
              className="w-full h-20 object-cover cursor-pointer rounded"
              alt={`Miniatura ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}