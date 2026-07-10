#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.SERPJET_API_BASE || "https://api.serpjet.io";
const API_KEY = process.env.SERPJET_API_KEY;

const RESULT_TYPES = [
  "search",
  "images",
  "videos",
  "news",
  "shopping",
  "maps",
  "places",
  "scholar",
  "patents",
  "autocomplete",
] as const;

const server = new McpServer({ name: "serpjet", version: "0.1.0" });

server.registerTool(
  "google_search",
  {
    title: "Google Search",
    description:
      "Search Google and get structured JSON results via SERPJET (serpjet.io). " +
      "Supports 10 result types: web search, images, videos, news, shopping (with prices), " +
      "maps, places, scholar, patents, and autocomplete. " +
      "Free tier: 1,000 searches/month, recurring. Each successful call uses 1 credit.",
    inputSchema: {
      q: z.string().describe("Search query"),
      type: z
        .enum(RESULT_TYPES)
        .optional()
        .describe("Result type (default: search). Use 'shopping' for product prices."),
      gl: z
        .string()
        .length(2)
        .optional()
        .describe("Country code for geo-targeted results, e.g. 'us', 'de', 'jp'"),
      hl: z.string().optional().describe("Interface language, e.g. 'en', 'zh-cn'"),
      num: z.number().int().min(1).max(100).optional().describe("Number of results"),
      page: z.number().int().min(1).optional().describe("Result page (default: 1)"),
    },
  },
  async ({ q, type, gl, hl, num, page }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text" as const,
            text:
              "SERPJET_API_KEY is not set. Get a free API key (1,000 searches/month, no card) " +
              "at https://serpjet.io/signup and set it in this MCP server's env config.",
          },
        ],
        isError: true,
      };
    }
    const params = new URLSearchParams({ q });
    if (type) params.set("type", type);
    if (gl) params.set("gl", gl);
    if (hl) params.set("hl", hl);
    if (num) params.set("num", String(num));
    if (page) params.set("page", String(page));

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/v1/search?${params}`, {
        headers: { "X-API-KEY": API_KEY },
        signal: AbortSignal.timeout(30_000),
      });
    } catch (e) {
      return {
        content: [{ type: "text" as const, text: `SERPJET request failed: ${e}` }],
        isError: true,
      };
    }
    const body = await res.text();
    if (!res.ok) {
      return {
        content: [{ type: "text" as const, text: `SERPJET API error (HTTP ${res.status}): ${body}` }],
        isError: true,
      };
    }
    return { content: [{ type: "text" as const, text: body }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SERPJET MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
