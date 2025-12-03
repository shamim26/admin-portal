import { motion, AnimatePresence } from "framer-motion";
import React from "react";

export type Product = {
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  images: string[];
};

export default function ProductGallery({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = React.useState(product.images[0]);

  // --- Image Zoom Logic ---
  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    e.currentTarget.style.transformOrigin = `center center`;
  };
  return (
    <div className="flex w-7/12 flex-col gap-4">
      <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-transform duration-500 ease-in-out group-hover:scale-[2.5]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </AnimatePresence>
      </div>
      {/* Image Gallery Thumbnails */}
      <div
        ref={(el) => {
          if (el) {
            el.addEventListener("wheel", (e) => {
              if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollTo({
                  left: el.scrollLeft + e.deltaY * 2,
                  behavior: "smooth",
                });
              }
            });
          }
        }}
        className="flex items-center gap-2 overflow-x-auto pb-2 w-full hide-scrollbar cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          const slider = e.currentTarget;
          let isDown = true;
          let startX = e.pageX - slider.offsetLeft;
          let scrollLeft = slider.scrollLeft;

          const onMouseLeave = () => {
            isDown = false;
            slider.removeEventListener("mouseleave", onMouseLeave);
            slider.removeEventListener("mouseup", onMouseUp);
            slider.removeEventListener("mousemove", onMouseMove);
          };

          const onMouseUp = () => {
            isDown = false;
            slider.removeEventListener("mouseleave", onMouseLeave);
            slider.removeEventListener("mouseup", onMouseUp);
            slider.removeEventListener("mousemove", onMouseMove);
          };

          const onMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            slider.scrollLeft = scrollLeft - walk;
          };

          slider.addEventListener("mouseleave", onMouseLeave);
          slider.addEventListener("mouseup", onMouseUp);
          slider.addEventListener("mousemove", onMouseMove);
        }}
      >
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors select-none ${
              selectedImage === image
                ? "border-blue-500"
                : "border-transparent hover:border-gray-600"
            }`}
            onDragStart={(e) => e.preventDefault()}
          >
            <img
              src={image}
              alt={`${product.name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover pointer-events-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
