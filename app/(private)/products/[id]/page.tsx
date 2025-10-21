"use client";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import React from "react";

export default function ProductDetailPage() {
  // --- Product Data ---
  const product = {
    name: "Aura Drone X4",
    price: "$1,299.99",
    originalPrice: "$1,499.99",
    description:
      "Experience the future of aerial photography with the Aura Drone X4. Featuring a 4K HDR camera, 30-minute flight time, and advanced obstacle avoidance, it's the perfect companion for creators and adventurers alike.",
    features: [
      "4K HDR Video",
      "30-Min Flight Time",
      "Obstacle Sensing",
      "Foldable Design",
    ],
    images: [
      "https://images.pexels.com/photos/2100075/pexels-photo-2100075.jpeg",
      "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg",
      "https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg",
      "https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg",
    ],
    imagePlaceholder:
      "https://placehold.co/800x800/171717/ffffff?text=Aura+Drone+X4",
  };

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
    <div className="bg-white min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full mx-auto">
        <div className="flex items-start gap-10 mx-auto md:flex-row flex-col">
          {/* Left Column: Product Image Gallery */}
          <div className="flex w-7/12 flex-col gap-4 h-[600px]">
            <div className="overflow-hidden rounded group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded transform transition-transform duration-500 ease-in-out group-hover:scale-[2.5] cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            {/* Image Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === image
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-600"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="w-[700px] flex flex-col gap-6">
            <Badge className="bg-blue-600 text-white border-blue-600 w-fit">
              New Arrival
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-blue-400">
                {product.price}
              </span>
              <span className="text-xl  line-through">
                {product.originalPrice}
              </span>
            </div>

            <p className=" leading-relaxed">{product.description}</p>

            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 text-base font-semibold gap-2">
                <EditIcon className="w-5 h-5" />
                Edit Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300 ${className}`}
  >
    {children}
  </div>
);
