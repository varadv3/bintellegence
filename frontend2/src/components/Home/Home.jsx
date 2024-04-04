import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";

export default function AnimatedHomePage() {
  const [show, setShow] = useState(false);

  // Define animations
  const textAnimation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(20px)",
    config: { duration: 800 },
  });

  const imageAnimation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? "translateX(0)" : "translateX(-20px)",
    config: { duration: 800 },
  });

  // Set show to true after a delay to trigger animations
  setTimeout(() => setShow(true), 200);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <animated.div style={textAnimation} className="max-w-xl lg:mr-12">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Smart-Bin
            <span className="block text-4xl lg:hidden">Lorem Ipsum</span>
          </h2>
          <p className="text-lg lg:text-2xl mt-4 lg:mt-6">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, magnam eligendi non recusandae saepe quia veniam numquam libero ipsa aliquid?
          </p>
          <Link
            to="/status"
            className="inline-flex text-white items-center px-6 py-3 font-medium bg-green-900 rounded-lg mt-6 hover:opacity-75"
          >
            <svg
              fill="white"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04 10.011v-20.022l10.04 10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
            </svg>
            <span className="ml-2">Check garbage Status</span>
          </Link>
        </animated.div>
        <animated.div style={imageAnimation} className="lg:w-2/5 mt-10 lg:mt-0">
          <img
            className="w-full rounded-lg shadow-lg"
            src="https://plus.unsplash.com/premium_photo-1663076457597-41d96c7bbafd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Smart Bin"
          />
        </animated.div>
      </section>
      <div className="text-center py-10">
        <h1 className="text-2xl lg:text-5xl font-medium">Lorem Ipsum Yojo</h1>
      </div>
    </div>
  );
}
