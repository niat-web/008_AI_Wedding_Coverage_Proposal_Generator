# MySQL Database Schema

The AI Wedding Coverage Proposal Generator uses a MySQL database (`thereelshoot_db`) to store proposal metadata, inputs, and generated content for history tracking and admin analytics.

It is designed with a **Dual-Database Failover System**: if a remote or local MySQL instance is unavailable, the application automatically falls back to a lightweight local file-based database (`mockDb.json`) in the backend directory.

---

## Database: `thereelshoot_db`

### Table: `proposals`

Each record in this table represents a single generated wedding photography and videography proposal.

#### Columns Description

| Column Name | MySQL Data Type | Nullable | Key | Default | Description |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | `VARCHAR(50)` | No | PRI | *None* | Unique proposal identifier prefixed with `prop_` followed by epoch timestamp (e.g., `prop_1780904480856`). |
| `couple_names` | `VARCHAR(255)` | No | | *None* | Names of the wedding couple. |
| `wedding_date` | `VARCHAR(50)` | No | | *None* | Scheduled wedding date (stored in `YYYY-MM-DD` or custom text format). |
| `venue` | `VARCHAR(255)` | No | | *None* | Specific wedding venue name. |
| `city` | `VARCHAR(255)` | No | | *None* | City hosting the wedding celebrations. |
| `events` | `TEXT` | No | | *None* | JSON array string containing selected events (e.g., `["Wedding Ceremony", "Reception"]`). |
| `package_type` | `VARCHAR(50)` | No | | *None* | Package selected by the client (`Classic`, `Premium`, or `Luxury`). |
| `special_requests` | `TEXT` | Yes | | `NULL` | Custom requests or notes provided by the couple. |
| `theme` | `VARCHAR(20)` | No | | `'dark'` | Visual layout style selected for the PDF/web UI (`dark` or `light`). |
| `proposal` | `TEXT` | No | | *None* | JSON string mapping containing the 4 AI-generated proposal sections (`introduction`, `coveragePlan`, `whatToExpect`, `preWeddingConcept`). |
| `created_at` | `VARCHAR(100)` | No | | *None* | Creation date and time represented as an ISO 8601 string. |

---

## JSON Column Storage Schema

To maximize flexibility and keep schema definitions lightweight, complex configurations are stored as JSON-formatted text:

### 1. `events` Column Structure
```json
[
  "Wedding Ceremony",
  "Reception"
]
```

### 2. `proposal` Column Structure
```json
{
  "introduction": "Dearest Sarah and Michael...",
  "coveragePlan": "### 1. The Wedding Ceremony\n\n* Key Moments to Capture...",
  "whatToExpect": "### Premium Package Deliverables...",
  "preWeddingConcept": "### Pre-Wedding Concept: \"A Mumbai Love Letter\"..."
}
```

---

## Indexing & Performance Guidelines

To support administrative dashboard queries and history lookups, the following index strategies are applied:
1. **Primary Key Index**: Fast lookups on proposal ID (`id`).
2. **Date Ordering**: Query results are ordered by `created_at` in descending order to fetch recent records first.
3. **Analytics Aggregations**: Fields like `package_type` and `city` are scanned to aggregate package popularity and geographical distribution metrics.
