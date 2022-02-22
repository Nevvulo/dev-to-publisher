# Publish to dev.to GitHub Action

Inspired from [`dev-api`](https://github.com/codewithpom/dev-api)

A GitHub action that allows you to publish new posts and updating existing posts through the [dev.to](https://dev.to) API.

## Using the action

You can use the action in your workflow by adding a step with `uses: Nevvulo/dev-to-publisher@1.0.0`

```yaml
name: Create post
on: push
jobs:
  create_post:
    runs-on: ubuntu-latest

    steps:
      - uses: Nevvulo/dev-to-publisher@1.0.0
        with:
          title: Testing this great little action
          description: Wow, it actually works!
          main_image: "[link to .png image]"
          tags: '["testing"]'
          body: '# Testing with GitHub actions\nWelcome to the robot age'
          draft: false # drafts to true, change if you don't want your post live!
          api_key: "[your dev.to API key here]"
```

### Updating an existing post

Add an option for `id` to the action (in the `with` section) with a string relating to the ID of the post you want to update.

## Options

`title` (required)

Title of the post

`description` (required)

Description of the post

`main_image` (required)

The main image for the post

`tags` (required)

A JSON-valid array of strings to be used as tags for the post. Cannot have more than 4 tags, defaults to an empty array

`body` (required)

The body of the post, can include Markdown

`draft`

Whether or not the post should be publicly available or remain as a draft. Defaults to `true`

`api_key` (required)

The dev.to API key to publish the post using
