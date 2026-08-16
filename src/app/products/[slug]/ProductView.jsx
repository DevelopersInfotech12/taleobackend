"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductView({ product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    // hook into your cart store here
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImg(i)}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                  activeImg === i
                    ? "border-rose-500 ring-2 ring-rose-200"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
              {product.material}
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-gray-900 md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span className="text-amber-500">{"★".repeat(Math.round(product.rating))}</span>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </p>

          <p className="leading-relaxed text-gray-600">{product.description}</p>

          {/* Size selector */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Ring Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 rounded-full border text-sm font-medium transition ${
                    size === s
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-gray-300 text-gray-700 hover:border-rose-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-gray-700">Quantity</p>
            <div className="flex items-center rounded-full border border-gray-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg text-gray-600 hover:text-rose-500"
              >
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 text-lg text-gray-600 hover:text-rose-500"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleAdd}
            className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-amber-500 py-4 text-base font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={added ? "added" : "add"}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="block"
              >
                {added ? "✓ Added to bag" : "Add to bag"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Highlights */}
          <ul className="grid gap-2 border-t pt-4">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-rose-500">✦</span> {h}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </main>
  );
}
