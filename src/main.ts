import * as core from "@actions/core";
import axios from "axios";
import { parseAsStringArray } from "./utils/parse";

interface PostOptions {
  title: string;
  description: string;
  image: string;
  body: string;
  draft: boolean;
  tags: string[];
  originalUrl: string;
}

interface PostResponse {
  id: number;
  url: string;
}

async function createPost(apiKey: string, options: PostOptions) {
  const { title, body, description, image, originalUrl, tags, draft } = options;
  const headers = { "api-key": apiKey };
  const published = !draft;
  const data = {
    article: {
      title,
      description,
      main_image: image,
      body_markdown: body,
      canonical_url: originalUrl,
      published,
      tags,
    },
  };

  return await axios
    .post("https://dev.to/api/articles", data, { headers })
    .then((r) => r.data as PostResponse);
}

async function updatePost(apiKey: string, id: string, options: PostOptions) {
  const { title, body, description, image, originalUrl, tags, draft } = options;

  const headers = { "api-key": apiKey };
  const published = !draft;
  const data = {
    article: {
      title,
      description,
      main_image: image,
      body_markdown: body,
      canonical_url: originalUrl,
      published,
      tags,
    },
  };

  return await axios
    .put(`https://dev.to/api/articles/${id}`, data, { headers })
    .then((r) => r.data as PostResponse);
}

async function run() {
  const title = core.getInput("title", { required: true });
  if (title.length < 1) return fatalError("Title too short");

  const body = core.getInput("body", { required: true });
  const description = core.getInput("description");
  const image = core.getInput("main_image");
  const originalUrl = core.getInput("original_url");
  const draft = core.getBooleanInput("draft", { required: true });
  const apiKey = core.getInput("api_key", { required: true });
  const existingId = core.getInput("id");

  const tags = parseAsStringArray(core.getInput("tags")) || [];
  if (tags.length > 4) return fatalError("Cannot add more than 4 tags");

  try {
    const data = {
      title,
      description,
      image,
      body,
      originalUrl,
      draft,
      tags,
    };
    if (existingId) {
      const post = await updatePost(apiKey, existingId, data);
      core.setOutput("id", post.id);
      core.setOutput("url", post.url);
    } else {
      const post = await createPost(apiKey, data);
      core.setOutput("id", post.id);
      core.setOutput("url", post.url);
    }
  } catch (e) {
    console.debug(e);
    core.setFailed("Invalid API key provided");
    process.exit(1);
  }
}

function fatalError(text: string) {
  core.setFailed(text);
  process.exit(1);
}

run();
