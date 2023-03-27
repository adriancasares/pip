import React, { useState } from "react";

export default function JoinNewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-xl w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 text-left relative">
        <div className="w-24 ml-4 hidden sm:block absolute top-1/2 -translate-y-1/2 left-full">
          <img
            src="/image/arrows/arrows-pointing-left.svg"
            alt=""
            className="select-none animate-3-arrows"
          />
        </div>
        <div className="w-24 mr-4 hidden md:block absolute top-1/2 -translate-y-1/2 right-full">
          <img
            src="/image/arrows/arrows-pointing-right.svg"
            alt=""
            className="select-none animate-3-arrows"
          />
        </div>
        <div className="block sm:hidden absolute bottom-full mb-4 right-0">
          <img
            src="/image/arrows/curved-arrow-down.svg"
            alt=""
            className="w-20 select-none"
          />
        </div>
        <p>Join our Newsletter</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            location.href = `/subscribe?email=${email}`;
            return false;
          }}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="py-2 px-4 border-2 border-mono-border-light rounded-lg font-os"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="from-slate-700 to-slate-800 bg-gradient-to-b text-white rounded-lg font-sans uppercase py-2"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
