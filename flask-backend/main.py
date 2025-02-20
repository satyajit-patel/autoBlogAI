import os
import requests
import time
from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv
from flask_cors import CORS
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

def scrape(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        content_section = soup.article if soup.article else soup.body
        scrape_content = "\n".join(tag.get_text(strip=True) for tag in content_section.find_all(['h1', 'h2', 'h3', 'p', 'ol', 'ul']))
        result = scrape_content[:2500] if len(scrape_content) > 2500 else scrape_content
        print(result)
        print("\n***\n", "[SUCCESS] Scraping completed", "\n***\n")
        return result
    except requests.exceptions.RequestException as e:
        error_msg = f"[ERROR] Scraping failed: {e}"
        print(error_msg)
        return error_msg

def generate_blog_content(title, scrape_content):
    if not scrape_content or "[ERROR]" in scrape_content:
        return "[ERROR] Invalid scrape content"
    try:
        client = Groq()
        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": "You are a professional blog writer. Format content with markdown."},
                {"role": "user", "content": f"Write a well-structured blog post about: {title} based on this content:\n{scrape_content}"}
            ],
            temperature=0.08,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
        
        content = completion.choices[0].message.content
        print(content)
        print("\n***\n", "[SUCCESS] Blog content generated", "\n***\n")
        return content
    except Exception as e:
        error_msg = f"[ERROR] Blog generation failed: {e}"
        print(error_msg)
        return error_msg

def publish_blog(credentials, title, content):
    if not content or "[ERROR]" in content:
        return "[ERROR] Invalid blog content"
    try:
        creds = Credentials(token=credentials["accessToken"])
        blogger = build("blogger", "v3", credentials=creds)
        post = blogger.posts().insert(
            blogId=credentials["blogId"],
            body={"title": title, "content": content}
        ).execute()
        blog_link = f"https://www.blogger.com/blog/posts/{post['id']}"
        print("\n***\n", f"[SUCCESS] Blog published at: {blog_link}", "\n***\n")
        return blog_link
    except Exception as e:
        error_msg = f"[ERROR] Blogger API failed: {e}"
        print(error_msg)
        return error_msg

@app.route("/auto-publish", methods=["POST"])
def auto_publish():
    try:
        data = request.json
        url, title, blogger_credentials = (
            data.get("url"), data.get("title"), data.get("bloggerCredentials")
        )

        print("\n***\n", url, "\n***\n")
        print("\n***\n", title, "\n***\n")
        print("\n***\n", blogger_credentials, "\n***\n")
        
        if not all([url, title, blogger_credentials]):
            return jsonify({"error": "[ERROR] Missing required fields"}), 400
        
        print("\n***\n", "[INFO] Starting blog auto-publish process", "\n***\n")
        scrape_content = scrape(url)
        blog_content = generate_blog_content(title, scrape_content)
        blog_link = publish_blog(blogger_credentials, title, blog_content)
        
        return jsonify({"message": "Blog published successfully", "link": blog_link})
    except Exception as e:
        error_msg = f"[ERROR] Auto-publishing failed: {e}"
        print(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"msg": "pong"})

@app.route("/", methods=["GET"])
def default():
    return jsonify({"msg": "running"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[INFO] Server running on port {port}")
    app.run(debug=True, port=port)
