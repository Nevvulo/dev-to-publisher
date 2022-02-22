"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./utils/parse");
function createPost(apiKey, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
        return yield axios_1.default
            .post("https://dev.to/api/articles", data, { headers })
            .then((r) => r.data);
    });
}
function updatePost(apiKey, id, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
        return yield axios_1.default
            .put(`https://dev.to/api/articles/${id}`, data, { headers })
            .then((r) => r.data);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const title = core.getInput("title", { required: true });
        if (title.length < 1)
            return fatalError("Title too short");
        const body = core.getInput("body", { required: true });
        const description = core.getInput("description");
        const image = core.getInput("main_image");
        const originalUrl = core.getInput("original_url");
        const draft = core.getBooleanInput("draft");
        const apiKey = core.getInput("api_key", { required: true });
        const existingId = core.getInput("id");
        const tags = (0, parse_1.parseAsStringArray)(core.getInput("tags")) || [];
        if (tags.length > 4)
            return fatalError("Cannot add more than 4 tags");
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
                const post = yield updatePost(apiKey, existingId, data);
                core.setOutput("id", post.id);
                core.setOutput("url", post.url);
            }
            else {
                const post = yield createPost(apiKey, data);
                core.setOutput("id", post.id);
                core.setOutput("url", post.url);
            }
        }
        catch (e) {
            console.debug(e);
            core.setFailed("Invalid API key provided");
            process.exit(1);
        }
    });
}
function fatalError(text) {
    core.setFailed(text);
    process.exit(1);
}
run();
