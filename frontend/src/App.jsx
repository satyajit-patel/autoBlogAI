import { useState } from "react";
import axios from "axios";
import { SparklesPreview } from "./components/sparkle/SparklesPreview";

function App() {

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [blogId, setBlogId] = useState("");

  const [isloading, setIsloading] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    setError("");
    setLink("");
    try {
      const response = await axios.post("/api/v1/auto-publish", {url, title, accessToken, blogId});
      setLink(response.data.link);
    } catch (err) {
      setError("Something went wrong, please try again.");
    } finally {
      setIsloading(false);
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center bg-black">
        <SparklesPreview />
        <div>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-6 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300"
          >

            <input
              type="url"
              placeholder="Website URL for Web Scraping"
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 transition-all duration-300 mb-3"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <input
              type="text"
              placeholder="Blog Title"
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 transition-all duration-300 mb-3"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Access Token"
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 transition-all duration-300 mb-3"
              required
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />

            <p className="text-gray-400 text-sm">
              Get it from{" "}
              <a
                className="text-blue-400 hover:text-blue-500"
                href="https://developers.google.com/oauthplayground"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </p>

            <input
              type="text"
              placeholder="Blogger ID"
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-400 transition-all duration-300 mb-3"
              required
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
            />

            <p className="text-gray-400 text-sm">
              Get it from{" "}
              <a
                className="text-blue-400 hover:text-blue-500"
                href="https://www.blogger.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </p>

            <p className="text-center">
              <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative text-center flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                  <span>
                    Publish Blog
                  </span>
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>
            </p>

            {isloading && (
              <p className="mt-4 text-center text-yellow-400 animate-pulse">
                Please wait... It's cooking!
              </p>
            )}

            {link && (
              <p className="mt-4 text-center text-green-400">
                Your blog is published!{" "}
                <a href={link} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                  View it here
                </a>
              </p>
            )}

            {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
