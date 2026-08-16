"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

export const AnimatedTestimonialsDemo = () => {
  const [active, setActive] = useState(testimonials[0]);

  const handleprev = () => {
    const i = testimonials.indexOf(active);
    setActive(testimonials[(i - 1 + testimonials.length) % testimonials.length]);
  };
  const handlenext = () => {
    const i = testimonials.indexOf(active);
    setActive(testimonials[(i + 1) % testimonials.length]);
  };
  const isActive = (index) => testimonials[index] === active;
  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  const fade = (delay = 0) => ({});

  return (
    <section className="py-16 px-6 bg-[#faf7f2] transition-colors duration-300" style={{ position: "relative", zIndex: 0 }}>

      {/* ── Section Header (unified pattern) ── */}
      <div className="flex flex-col items-center text-center mb-12 gap-3">

        {/* Eyebrow row: gold rule + label */}
        <div className="flex items-center gap-3 ">
          <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
          <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
            What our customers say
          </span>
        </div>

        <div style={fade(0.3)}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(2.4rem, 4.2vw, 3.2rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              margin: 0,
              color: "#3d1f10",
              letterSpacing: "-0.02em",
            }}
            className=""
          >
            What Our{" "}
            <span
              style={{
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.01em",
              }}
              className="text-[#a67c2e] dark:text-[#c9a96e]"
            >
              Clients Say
            </span>
          </h2>
        </div>
      </div>

      {/* Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto bg-white dark:bg-[#1e1510] rounded-2xl p-8 border border-[#e8d5b0]/10 dark:border-[#c9a96e]/10 transition-colors duration-300">

        {/* Image stack */}
        <div className="relative h-80 w-full">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9, z: -100, rotateY: randomRotateY() }}
                animate={{ opacity: isActive(index) ? 1 : 0.7, scale: isActive(index) ? 1 : 0.95, z: isActive(index) ? 0 : -100, rotate: isActive(index) ? 0 : randomRotateY(), zIndex: isActive(index) ? 10 : testimonials.length + 2 - index, y: isActive(index) ? [0, -80, 0] : 0 }}
                exit={{ opacity: 0, scale: 0.9, z: 100, rotate: randomRotateY() }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 origin-bottom"
              >
                <Image src={testimonial.src} alt={testimonial.name} width={400} height={400} draggable={false} className="rounded-3xl h-full w-full object-cover object-center" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-between py-4">
          <motion.div key={active.name} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            {/* Name — Cormorant Garamond */}
            <h3 style={{ fontFamily: DISPLAY, fontSize: "1.9rem", fontWeight: 700, margin: 0 }} className="text-[#2c2317] dark:text-[#f5efe8]">{active.name}</h3>
            {/* Designation — Inter */}
            <p style={{ fontFamily: BODY, fontSize: 12, marginTop: 4, fontWeight: 300 }} className="text-[#7a6a5a] dark:text-[#a89880]">{active.designation}</p>

            {/* Opening quote — Cormorant Garamond */}
            <span style={{ fontFamily: DISPLAY, fontSize: "4rem", lineHeight: 1, opacity: 0.3, display: "block", marginTop: "1rem" }} className="text-[#a67c2e] dark:text-[#c9a96e]">"</span>

            {/* Quote — Inter */}
            <motion.p
              style={{
                fontFamily: BODY,
                fontSize: 15,
                lineHeight: 1.75,
                marginTop: -16,
                fontWeight: 700,
                textAlign: "justify",
                textAlignLast: "left",
                width: "95%",
                text: "#837d77"
              }}
              className="text-[#837d77] dark:text-[#afa9a2]"
            >
              {active.quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  style={{
                    display: "inline fontWeight: 800",
                  }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </motion.p>          </motion.div>

          {/* Nav */}
          <div className="flex gap-4 mt-8">
            <button onClick={handleprev} className="h-9 w-9 rounded-full border border-[#a67c2e]/40 dark:border-[#c9a96e]/40 text-[#a67c2e] dark:text-[#c9a96e] flex items-center justify-center hover:bg-[#a67c2e]/10 dark:hover:bg-[#c9a96e]/10 hover:border-[#a67c2e]/70 dark:hover:border-[#c9a96e]/70 transition-all duration-300"><ArrowLeft size={16} /></button>
            <button onClick={handlenext} className="h-9 w-9 rounded-full border border-[#a67c2e]/40 dark:border-[#c9a96e]/40 text-[#a67c2e] dark:text-[#c9a96e] flex items-center justify-center hover:bg-[#a67c2e]/10 dark:hover:bg-[#c9a96e]/10 hover:border-[#a67c2e]/70 dark:hover:border-[#c9a96e]/70 transition-all duration-300"><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedTestimonialsDemo;

const testimonials = [
  {
    quote:
      "Spectrum UI is a game-changer! Its components are so well-designed and customizable that it made our app look polished and professional in no time. The seamless developer experience helped us launch faster than expected.",
    name: "Ananya Gupta",
    designation: "Frontend Engineer, NovaTech",
    src: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb",
  },
  {
    quote:
      "I love the simplicity and minimalism of Spectrum UI. The components are intuitive and fit seamlessly into our existing projects. It reduced design inconsistencies across our entire platform.",
    name: "Sophia Allen",
    designation: "UI/UX Designer, Creatify",
    src: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb",
  },
  {
    quote:
      "As a junior developer, Spectrum UI has been a lifesaver. The documentation is straightforward, and the components work flawlessly with Tailwind CSS. I was able to build production-ready interfaces with confidence.",
    name: "Ethan Rodriguez",
    designation: "Software Engineer, CodeWorks",
    src: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb",
  },
  {
    quote:
      "The integration with Shadcn made it super easy to customize the components. Spectrum UI is now a must-have in our tech stack. Its flexibility allows us to maintain a unique brand identity effortlessly.",
    name: "Priya Sharma",
    designation: "Full Stack Developer, Innovate Labs",
    src: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb",
  },
];