import { randomBytes } from "node:crypto";

export type MetaAccount = {
  id: string;
  name: string;
  accountStatus: number;
  currency: string;
  amountSpent: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  roas: number | null;
};

type OAuthState = {
  expiresAt: number;
};

type MetaSession = {
  accessToken: string;
  expiresAt: number;
  accounts: MetaAccount[];
};

const oauthStates = new Map<string, OAuthState>();
const sessions = new Map<string, MetaSession>();

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v26.0";
const MARKETING_VERSION = process.env.META_MARKETING_VERSION || "v25.0";
const APP_ID = process.env.META_APP_ID || "";
const APP_SECRET = process.env.META_APP_SECRET || "";
const REDIRECT_URI =
  process.env.META_REDIRECT_URI || "http://localhost:3000/auth/callback";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

function graphUrl(version: string, path: string) {
  return new URL(`https://graph.facebook.com/${version}/${path.replace(/^\//, "")}`);
}

function parseCookies(header: string | undefined) {
  const cookies: Record<string, string> = {};
  for (const part of (header || "").split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function appendCookie(res: import("express").Response, cookie: string) {
  const current = res.getHeader("Set-Cookie");
  const values = Array.isArray(current)
    ? current.map(String)
    : current
      ? [String(current)]
      : [];
  values.push(cookie);
  res.setHeader("Set-Cookie", values);
}

function setCookie(
  res: import("express").Response,
  name: string,
  value: string,
  maxAge: number,
) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  appendCookie(
    res,
    `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`,
  );
}

function clearCookie(res: import("express").Response, name: string) {
  appendCookie(
    res,
    `${name}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
  );
}

function errorMessage(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const maybe = value as { error?: { message?: string }; message?: string };
    return maybe.error?.message || maybe.message || "Meta API hatası";
  }
  return "Meta API hatası";
}

async function readJson(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(errorMessage(payload));
  }
  return payload as Record<string, any>;
}

async function exchangeCodeForToken(code: string) {
  const url = graphUrl(GRAPH_VERSION, "/oauth/access_token");
  url.searchParams.set("client_id", APP_ID);
  url.searchParams.set("client_secret", APP_SECRET);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("code", code);

  const shortLived = await readJson(await fetch(url));

  const longUrl = graphUrl(GRAPH_VERSION, "/oauth/access_token");
  longUrl.searchParams.set("grant_type", "fb_exchange_token");
  longUrl.searchParams.set("client_id", APP_ID);
  longUrl.searchParams.set("client_secret", APP_SECRET);
  longUrl.searchParams.set("fb_exchange_token", shortLived.access_token);

  const longLived = await readJson(await fetch(longUrl));

  return {
    accessToken: String(longLived.access_token || shortLived.access_token),
    expiresIn: Number(longLived.expires_in || 60 * 24 * 60 * 60),
  };
}

async function fetchAccounts(accessToken: string): Promise<MetaAccount[]> {
  const accountsUrl = graphUrl(MARKETING_VERSION, "/me/adaccounts");
  accountsUrl.searchParams.set(
    "fields",
    "id,name,account_status,currency,amount_spent",
  );
  accountsUrl.searchParams.set("limit", "100");
  accountsUrl.searchParams.set("access_token", accessToken);

  const accountsResponse = await readJson(await fetch(accountsUrl));
  const rawAccounts: any[] = Array.isArray(accountsResponse.data)
    ? accountsResponse.data
    : [];

  return Promise.all(
    rawAccounts.map(async (account) => {
      const accountId = String(account.id);
      const insightsUrl = graphUrl(
        MARKETING_VERSION,
        `/${accountId}/insights`,
      );
      insightsUrl.searchParams.set(
        "fields",
        "spend,impressions,clicks,ctr,purchase_roas",
      );
      insightsUrl.searchParams.set("date_preset", "this_month");
      insightsUrl.searchParams.set("level", "account");
      insightsUrl.searchParams.set("access_token", accessToken);

      let insight: any = {};
      try {
        const insightResponse = await readJson(await fetch(insightsUrl));
        insight = Array.isArray(insightResponse.data)
          ? insightResponse.data[0] || {}
          : {};
      } catch {
        // Some ad accounts can be visible while insights access is unavailable.
      }

      const roasValue = Array.isArray(insight.purchase_roas)
        ? insight.purchase_roas[0]?.value
        : null;

      return {
        id: accountId,
        name: String(account.name || accountId),
        accountStatus: Number(account.account_status || 0),
        currency: String(account.currency || ""),
        amountSpent: Number(account.amount_spent || 0),
        spend: Number(insight.spend || 0),
        impressions: Number(insight.impressions || 0),
        clicks: Number(insight.clicks || 0),
        ctr: Number(insight.ctr || 0),
        roas:
          roasValue === null || roasValue === undefined
            ? null
            : Number(roasValue),
      };
    }),
  );
}

function cleanup() {
  const now = Date.now();

  for (const [state, value] of oauthStates) {
    if (value.expiresAt <= now) oauthStates.delete(state);
  }

  for (const [sessionId, value] of sessions) {
    if (value.expiresAt <= now) sessions.delete(sessionId);
  }
}

setInterval(cleanup, 60_000).unref();

export function registerMetaRoutes(app: import("express").Express) {
  app.get("/api/meta/login", (req, res) => {
    if (!APP_ID || !APP_SECRET) {
      res.status(500).json({
        error:
          "Meta ayarları eksik. META_APP_ID ve META_APP_SECRET tanımlanmalı.",
      });
      return;
    }

    const state = randomBytes(32).toString("hex");
    oauthStates.set(state, {
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    setCookie(res, "meta_oauth_state", state, 600);

    const url = graphUrl(GRAPH_VERSION, "/dialog/oauth");
    url.searchParams.set("client_id", APP_ID);
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("state", state);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "ads_read,business_management");

    res.redirect(url.toString());
  });

  app.get("/auth/callback", async (req, res) => {
    const { code, state, error, error_description } = req.query;

    if (error) {
      clearCookie(res, "meta_oauth_state");
      res.redirect(
        `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(
          String(error_description || error),
        )}`,
      );
      return;
    }

    if (typeof code !== "string" || typeof state !== "string") {
      res.redirect(
        `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(
          "Meta geri dönüşünde code veya state bulunamadı.",
        )}`,
      );
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    const savedState = oauthStates.get(state);

    if (!savedState || savedState.expiresAt <= Date.now()) {
      oauthStates.delete(state);
      res.redirect(
        `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(
          "OAuth oturumu geçersiz veya süresi dolmuş.",
        )}`,
      );
      return;
    }

    if (cookies.meta_oauth_state !== state) {
      oauthStates.delete(state);
      clearCookie(res, "meta_oauth_state");
      res.redirect(
        `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(
          "OAuth state doğrulaması başarısız.",
        )}`,
      );
      return;
    }

    oauthStates.delete(state);
    clearCookie(res, "meta_oauth_state");

    try {
      const { accessToken, expiresIn } = await exchangeCodeForToken(code);
      const accounts = await fetchAccounts(accessToken);

      const sessionId = randomBytes(32).toString("hex");
      sessions.set(sessionId, {
        accessToken,
        accounts,
        expiresAt: Date.now() + expiresIn * 1000,
      });

      setCookie(res, "meta_session", sessionId, Math.max(300, expiresIn));

      res.redirect(`${FRONTEND_URL}/auth/callback?success=1`);
    } catch (error) {
      res.redirect(
        `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(
          error instanceof Error ? error.message : "Meta bağlantısı başarısız.",
        )}`,
      );
    }
  });

  app.get("/api/meta/status", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const session = cookies.meta_session
      ? sessions.get(cookies.meta_session)
      : undefined;

    if (!session || session.expiresAt <= Date.now()) {
      if (cookies.meta_session) clearCookie(res, "meta_session");
      res.json({ connected: false, accounts: [] });
      return;
    }

    res.json({
      connected: true,
      accounts: session.accounts,
      expiresAt: session.expiresAt,
    });
  });

  app.get("/api/meta/accounts", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const session = cookies.meta_session
      ? sessions.get(cookies.meta_session)
      : undefined;

    if (!session || session.expiresAt <= Date.now()) {
      res.status(401).json({ error: "Meta bağlantısı bulunamadı." });
      return;
    }

    res.json({
      accounts: session.accounts,
      expiresAt: session.expiresAt,
    });
  });

  app.post("/api/meta/logout", (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.meta_session) sessions.delete(cookies.meta_session);
    clearCookie(res, "meta_session");
    res.json({ success: true });
  });
}
