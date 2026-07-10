# SERPJET MCP Server

Give your AI agent Google Search. **1,000 free searches/month — recurring, no credit card.**

An MCP (Model Context Protocol) server for [SERPJET](https://serpjet.io) — a Google SERP API that returns clean, structured JSON for 10 result types: web search, images, videos, news, **shopping (with prices)**, maps, places, scholar, patents, and autocomplete.

## Why SERPJET

- **1,000 searches/month free, forever** — quota resets monthly (not a one-time trial credit)
- **No credit card required** — sign up with just an email
- **10 result types** in one tool, including Google Shopping with price fields
- **Country targeting** via `gl` parameter (`us`, `de`, `jp`, ...)
- Paid plans from $5, billed per successful request only

## Quick start

1. Get a free API key at [serpjet.io/signup](https://serpjet.io/signup)
2. Add to your MCP client config:

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "serpjet": {
      "command": "npx",
      "args": ["-y", "serpjet-mcp"],
      "env": {
        "SERPJET_API_KEY": "sj_your_key_here"
      }
    }
  }
}
```

### Cursor / Windsurf

Same config shape — add the `serpjet` entry to your MCP settings with `SERPJET_API_KEY` in `env`.

## Tool

### `google_search`

| Parameter | Type | Description |
|---|---|---|
| `q` | string (required) | Search query |
| `type` | enum | `search` (default), `images`, `videos`, `news`, `shopping`, `maps`, `places`, `scholar`, `patents`, `autocomplete` |
| `gl` | string | Country code for geo-targeting, e.g. `us`, `de`, `jp` |
| `hl` | string | Language, e.g. `en`, `zh-cn` |
| `num` | number | Number of results (1–100) |
| `page` | number | Result page |

Returns the raw SERPJET JSON response. Example — ask your agent:

> "What does an Anker 20000mAh power bank cost right now in the US?"

The agent calls `google_search` with `{"q": "anker 20000mah power bank", "type": "shopping", "gl": "us"}` and gets back 40 offers with live prices and sellers.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SERPJET_API_KEY` | yes | Your API key from [serpjet.io](https://serpjet.io) |
| `SERPJET_API_BASE` | no | Override API base URL (default `https://api.serpjet.io`) |

## Links

- [SERPJET](https://serpjet.io) — pricing, playground, dashboard
- [API docs](https://serpjet.io/docs.html)

## License

MIT
