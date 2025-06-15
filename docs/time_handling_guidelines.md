# Time & Time‑Zone Handling Guidelines

A concise reference for **every new coding project** at Toot'n Totum. Share this with every engineer, contractor, or AI agent before work begins.

---

## 1. Philosophy

- **Single Source‑of‑Truth ⇒ UTC.** All persisted timestamps **must** be stored in Coordinated Universal Time (UTC).
- **Convert at the edges.** Change to local time only when interacting with users, logs, or external systems that insist on local time.
- **Be explicit.** Every timestamp should either embed its offset (e.g. `2025‑06‑04T17:30:00Z`) or travel with a separate `timezone` field.

> **Central Time Reminder**  
> Our primary business zone is **America/Chicago**, which oscillates between **CST (UTC‑6)** and **CDT (UTC‑5)**.

---

## 2. Golden Rules

1. **Store TZ‑aware timestamps** (`TIMESTAMP WITH TIME ZONE`, `datetimeoffset`, ISO‑8601 with offset, etc.).
2. **Never do math on strings.** Convert to a timezone‑aware `DateTime`/`Moment`/`ZonedDateTime` object first.
3. **Label everything.** UI and logs must show the timezone abbreviation or offset.
4. **Test the DST walls.** Always include cases around the second Sunday in March & first Sunday in November.
5. **Keep it consistent.** A field is *always* UTC or *always* local – never mixed.

---

## 3. Database Patterns

| RDBMS      | Column Type                 | Recommendation                           |
| ---------- | --------------------------- | ---------------------------------------- |
| PostgreSQL | `TIMESTAMP WITH TIME ZONE`  | Preferred (stores UTC, converts on read) |
| SQL Server | `datetimeoffset`            | Avoid `datetime` (naïve)                 |
| MySQL 8+   | `TIMESTAMP` w/ `CONVERT_TZ` | Ensure `time_zone` tables are loaded     |

**Add an index** on timestamp columns used for range queries (`WHERE timestamp BETWEEN …`).

---

## 4. Application Layer

### Backend

- **Always keep objects timezone‑aware.** In Python: `pytz.timezone('UTC')` or `zoneinfo`.
- Provide helpers:
  ```python
  def to_ct(dt_utc):
      return dt_utc.astimezone(zoneinfo.ZoneInfo("America/Chicago"))
  ```
- **Schedule jobs in UTC** (e.g. cron `0 12 * * *` = noon UTC).

### Frontend / JS

- Ship ISO‑8601 strings with offset.
- Use **Luxon** or **date‑fns‑tz** (avoid Moment.js for new code).
- Example:
  ```js
  import { DateTime } from 'luxon';
  const local = DateTime.fromISO(apiStamp).setZone("America/Chicago");
  ```

#### Next.js + Supabase + Neon quick‑start

- **Server Components / API Routes:** Treat all Supabase timestamp columns as UTC (`TIMESTAMP WITH TIME ZONE`). Convert to Central only at render time:

  ```ts
  import { DateTime } from 'luxon';
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  export const dynamic = 'force-dynamic'; // Next.js ISR example
  export async function GET() {
    const { data } = await supabase
      .from('events')
      .select('id, starts_at'); // returns UTC strings

    const withCT = data.map(e => ({
      ...e,
      starts_at_ct: DateTime.fromISO(e.starts_at).setZone('America/Chicago').toISO(),
    }));

    return Response.json(withCT);
  }
  ```

- **Client Components:** Pass ISO strings to the browser and localize with Luxon/date‑fns‑tz so CSR and SSR match.

- **Environment:** Set `TZ=UTC` in Vercel/Supabase/Neon project settings to ensure Node & Postgres keep consistent UTC behavior.

- **Supabase RLS / Policies:** Use `now()` (UTC) for comparisons. Example policy to allow updates only before an event starts:

  ```sql
  CREATE POLICY before_start ON events
    USING (now() < starts_at);
  ```

- **Neon (Postgres):** Cluster defaults to UTC. For ad‑hoc Central‑Time reports, use:
  ```sql
  SELECT starts_at AT TIME ZONE 'America/Chicago' AS starts_at_ct
  FROM events;
  ```

---

## 5. APIs & JSON Contracts

- **Outbound:** Always send UTC with `Z` or explicit offset.
- **Inbound:** Accept offset; if none, assume UTC and log a warning.
- Document like:
  ```jsonc
  {
    "created_at": "2025-06-04T23:15:42Z", // UTC
    "timezone": "America/Chicago"          // optional context
  }
  ```

---

## 6. UI & Reporting

- **Show the zone.** e.g. `Mar 15, 2025 · 2:00 PM CDT`.
- Offer a user setting for preferred timezone; default to America/Chicago.
- For CSV/Excel exports, include a header note: `Times shown in Central Time (CST/CDT)`.

---

## 7. Testing & CI Checklist

- [ ] Unit tests for UTC ↔ CT conversion.
- [ ] Tests around DST “spring forward” & “fall back”.
- [ ] End‑to‑end test with browser locale set to Central Time.
- [ ] Fuzz tests with random global timezones if multi‑region.

---

## 8. Common Pitfalls

| Pitfall                               | Antidote                              |
| ------------------------------------- | ------------------------------------- |
| Naïve `datetime` objects              | Always attach a zone (`timezone.utc`) |
| Storing local time in DB              | Store UTC only; convert on fetch      |
| Frontend adds offset twice            | Serialize once, convert once          |
| Cron job fires an hour late after DST | Schedule in UTC                       |

---

## 9. Library Cheat Sheet

- **Python:** `zoneinfo`, `pytz`, `pendulum`
- **JavaScript/TS:** `Luxon`, `date‑fns‑tz`, `dayjs with utc+timezone` plugins
- **SQL (Postgres):** `AT TIME ZONE`, `DATE_TRUNC('day', ts AT TIME ZONE 'America/Chicago')`

---

## 10. Further Reading

- IANA Time Zone Database <https://www.iana.org/time-zones>
- “Falsehoods Programmers Believe About Time” – infinite list ☺️
- RFC 3339 / ISO 8601 Timestamp formats

---

> **Remember:** *Time is hard. Being disciplined up‑front saves days of debugging later.*
