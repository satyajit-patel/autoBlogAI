import { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    accessToken: "",
    blogId: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auto-publish", {
        url: formData.url,
        title: formData.title,
        bloggerCredentials: {
          accessToken: formData.accessToken,
          blogId: formData.blogId,
        },
      });

      setMessage(response.data.message, " ", response.data.link);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Auto Publish Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            name="url"
            placeholder="Website URL"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Blog title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            name="accessToken"
            placeholder="Blogger Access Token"
            value={formData.accessToken}
            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
            className="w-full p-3 border rounded"
            required
          />
          <p>get it from <a className="text-blue-600" href="https://developers.google.com/oauthplayground" target="_blank" rel="blogger site">here</a></p>
          <input
            type="text"
            name="blogId"
            placeholder="Blogger Blog ID"
            value={formData.blogId}
            onChange={(e) => setFormData({ ...formData, blogId: e.target.value })}
            className="w-full p-3 border rounded"
            required
          />
          <p>get it from <a className="text-blue-600" href="https://www.blogger.com/blog/posts/284950278942439578" target="_blank" rel="blogger site">here</a></p>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Publish Blog
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default App;
