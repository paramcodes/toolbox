"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import QRCode from "qrcode";

type ShortLink = {
  code: string;
  longUrl: string;
  clicks: number;
  shortUrl: string;
  createdAt: string;
};

type ApiShortLink = Omit<ShortLink, "shortUrl">;

function withShortUrl(link: ApiShortLink, origin: string): ShortLink {
  return {
    ...link,
    shortUrl: `${origin}/go/${link.code}`,
  };
}

export function UrlShortenerTool() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const origin = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.origin;
  }, []);

  const updateQr = useCallback(async (link?: ShortLink) => {
    if (!link) {
      setQrDataUrl("");
      return;
    }

    const dataUrl = await QRCode.toDataURL(link.shortUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 8,
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
    });

    setQrDataUrl(dataUrl);
  }, []);

  const loadLinks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/short-links");
      const data = (await response.json()) as {
        links?: ApiShortLink[];
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not load short links.");
        return;
      }

      const nextLinks = (data.links ?? []).map((link) => withShortUrl(link, origin));
      setLinks(nextLinks);
      await updateQr(nextLinks[0]);
    } catch {
      setError("Could not connect to the short link database.");
    } finally {
      setIsLoading(false);
    }
  }, [origin, updateQr]);

  useEffect(() => {
    queueMicrotask(() => {
      if (!origin) {
        return;
      }

      void loadLinks();
    });
  }, [loadLinks, origin]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopiedCode("");
    setShareMessage("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/short-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl,
          customCode,
        }),
      });
      const data = (await response.json()) as {
        link?: ApiShortLink;
        error?: string;
      };

      if (!response.ok || !data.link) {
        setError(data.error ?? "Could not create short link.");
        return;
      }

      const nextLink = withShortUrl(data.link, origin);
      const nextLinks = [nextLink, ...links.filter((link) => link.code !== nextLink.code)].slice(0, 8);
      setLinks(nextLinks);
      await updateQr(nextLink);
      setLongUrl("");
      setCustomCode("");
    } catch {
      setError("Could not connect to the short link database.");
    } finally {
      setIsCreating(false);
    }
  }

  async function copyLink(link: ShortLink) {
    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedCode(link.code);
  }

  function downloadQr(link: ShortLink) {
    if (!qrDataUrl) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `${link.code}-qr.png`;
    anchor.click();
  }

  async function shareLink(link: ShortLink) {
    setShareMessage("");

    if (navigator.share) {
      await navigator.share({
        title: "Short link",
        text: link.longUrl,
        url: link.shortUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(link.shortUrl);
    setShareMessage("Sharing is not available here, so the link was copied.");
  }

  async function deleteLink(code: string) {
    setError("");

    try {
      const response = await fetch(`/api/short-links/${code}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Could not delete that short link.");
        return;
      }

      const nextLinks = links.filter((link) => link.code !== code);
      setLinks(nextLinks);
      await updateQr(nextLinks[0]);
    } catch {
      setError("Could not connect to the short link database.");
    }
  }

  const latestLink = links[0];

  return (
    <section className="shortener">
      <form className="shortener__form" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Neon + Prisma</span>
          <h2>Shorten a link</h2>
          <p>
            Links are saved in Postgres, so redirects work across browsers,
            devices, and QR scans.
          </p>
        </div>

        <label>
          Destination URL
          <input
            autoComplete="url"
            onChange={(event) => setLongUrl(event.target.value)}
            placeholder="https://example.com/very/long/path"
            type="text"
            value={longUrl}
          />
        </label>

        <label>
          Custom code
          <input
            autoComplete="off"
            onChange={(event) => setCustomCode(event.target.value)}
            placeholder="launch"
            type="text"
            value={customCode}
          />
        </label>

        {error ? <p className="shortener__error">{error}</p> : null}

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create short link"}
        </button>
      </form>

      <div className="shortener__result">
        <span className="eyebrow">Latest link</span>
        {latestLink ? (
          <>
            <a href={latestLink.shortUrl}>{latestLink.shortUrl}</a>
            <p>
              {latestLink.longUrl} · {latestLink.clicks} clicks
            </p>
            <div className="shortener__qr">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt={`QR code for ${latestLink.shortUrl}`} />
              ) : (
                <span>Generating QR...</span>
              )}
            </div>
            <div className="shortener__actions">
              <button type="button" onClick={() => copyLink(latestLink)}>
                {copiedCode === latestLink.code ? "Copied" : "Copy link"}
              </button>
              <button type="button" onClick={() => downloadQr(latestLink)}>
                Download QR
              </button>
              <button type="button" onClick={() => shareLink(latestLink)}>
                Share
              </button>
            </div>
            {shareMessage ? <p>{shareMessage}</p> : null}
          </>
        ) : (
          <p>{isLoading ? "Loading links..." : "Create your first short link to see the result here."}</p>
        )}
      </div>

      <div className="shortener__history">
        <div className="shortener__history-heading">
          <span className="eyebrow">Recent links</span>
          <strong>{links.length}</strong>
        </div>
        {isLoading ? (
          <p>Loading links...</p>
        ) : links.length ? (
          links.map((link) => (
            <article className="shortener__row" key={link.code}>
              <div>
                <a href={link.shortUrl}>{link.shortUrl}</a>
                <span>
                  {link.longUrl} · {link.clicks} clicks
                </span>
              </div>
              <button type="button" onClick={() => deleteLink(link.code)}>
                Delete
              </button>
            </article>
          ))
        ) : (
          <p>No links yet.</p>
        )}
      </div>
    </section>
  );
}
