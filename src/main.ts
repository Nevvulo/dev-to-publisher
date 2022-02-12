import * as core from "@actions/core";
import axios from "axios";
import { parseAsStringArray } from "./utils/parse";

async function createPost(
  apiKey: string,
  title: string,
  body: string,
  draft: boolean,
  tags: string[]
) {
  const published = !draft;
  const data = {
    article: {
      title,
      body_markdown: body,
      published,
      tags,
    },
  };

  const headers = {
    "api-key": apiKey,
  };

  await axios.post("https://dev.to/api/articles", data, { headers: headers });
}

async function run() {
  const title = core.getInput("title", { required: true });
  if (title.length < 1) return fatalError("Title too short");

  const body = core.getInput("body", { required: true });
  const isDraft = core.getBooleanInput("draft", { required: true });
  const apiKey = core.getInput("api_key", { required: true });

  const tags = parseAsStringArray(core.getInput("tags")) || [];
  if (tags.length > 4) return fatalError("Cannot add more than 4 tags");

  try {
    await createPost(apiKey, title, body, isDraft, tags);
  } catch (e) {
    core.setFailed("Invalid API key provided");
    process.exit(1);
  }
}

function fatalError(text: string) {
  core.setFailed(text);
  process.exit(1);
}

run();
