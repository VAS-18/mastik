"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/footer";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      when: "beforeChildren",
    },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 100 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen [background:radial-gradient(125%_70%_at_50%_10%,#000_45%,#63e_100%)] bg-fixed">
      <motion.section
        className="h-screen flex flex-col items-center justify-center px-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          className="text-white font-panchang text-7xl md:text-8xl leading-tight"
          variants={itemUp}
          aria-label="MASTIK"
        >
          MASTIK
        </motion.h1>

        <motion.p
          className="text-white font-cabinet font-semibold mt-4 text-lg md:text-xl max-w-2xl"
          variants={itemUp}
        >
          Never forget anything ever again — quick capture, instant recall.
        </motion.p>

        <motion.div className="flex gap-6 mt-10" variants={itemUp}>
          <Button asChild>
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/sign-in">Join Now</Link>
            </motion.span>
          </Button>

          <Button asChild>
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/demo">Demo</Link>
            </motion.span>
          </Button>
        </motion.div>
      </motion.section>

      <motion.section
        className="min-h-screen flex items-center justify-center font-cabinet text-white px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Continue Exploring</h2>
          <p className="text-lg opacity-80">
            This is placeholder content that appears after the hero animation
            completes. Replace it with your product features, screenshots, or
            anything else.
          </p>

          <motion.div
            className="mt-6 flex justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Button asChild>
              <Link to="/features">Features</Link>
            </Button>
            <Button asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
      <section>
        <Footer />
      </section>
    </div>
  );
}
