"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestPage() {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState("");

  const handleClick = () => {
    console.log("Button clicked");
    setCounter(counter + 1);
  };

  const handleChange = (e) => {
    console.log("Input changed");
    setText(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Click Test Page</h1>

      <div className="mb-6">
        <Link href="/" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6 p-4 border border-gray-300 rounded">
        <h2 className="text-xl mb-4">Click Test</h2>
        <button
          className="btn btn-primary mr-4"
          onClick={handleClick}
          style={{ pointerEvents: "auto" }}
        >
          Click Me ({counter})
        </button>

        <a
          href="#"
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            console.log("Link clicked");
            alert("Link clicked!");
          }}
          style={{ pointerEvents: "auto" }}
        >
          Test Link
        </a>
      </div>

      <div className="mb-6 p-4 border border-gray-300 rounded">
        <h2 className="text-xl mb-4">Input Test</h2>
        <input
          type="text"
          className="input input-bordered w-full mb-2"
          value={text}
          onChange={handleChange}
          placeholder="Type something..."
          style={{ pointerEvents: "auto" }}
        />
        <p>You typed: {text}</p>
      </div>
    </div>
  );
}
