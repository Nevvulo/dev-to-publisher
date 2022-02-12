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

  await axios.post("https://dev.to/api/articles", data, { headers });
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

  await axios.put(`https://dev.to/api/articles/${id}`, data, { headers });
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
    const post = {
      title,
      description,
      image,
      body,
      originalUrl,
      draft,
      tags,
    };
    if (existingId) {
      await updatePost(apiKey, existingId, post);
    } else {
      await createPost(apiKey, post);
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
