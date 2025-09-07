import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";

export const getLinkMetadata = async (req: Request, res: Response) => {
  const { url } = req.body;

  //if the link does not exists.
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  //if the link is from reddit.
  if (url.includes("reddit.com")) {
    const data = await fetchFromReddit(url);
    return res.status(200).json({
      data,
    });
  }

  //TODO: add fetch function for twitter using twitter API
  if (url.includes("x.com")) {
    const data = await fetchFromTwitter(url);

    return res.status(200).json({
      data,
    });
  }

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mastik",
      },
    });

    const $ = cheerio.load(html);

    const getMetaTag = (name: string) => {
      return (
        $(`meta[property="og:${name}"]`).attr("content") ||
        $(`meta[name="twitter:${name}"]`).attr("content") ||
        $(`meta[name="${name}"]`).attr("content")
      );
    };

    const metadata = {
      title: getMetaTag("title") || $("title").first().text(),
      description: getMetaTag("description"),
      image: getMetaTag("image"),
      url: getMetaTag("url") || url,
    };

    res.status(200).json({data: metadata});
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error fetching metadata for ${url}:`, error.message);
    } else {
      console.error(`Error processing metadata for ${url}:`, error);
    }
    res
      .status(500)
      .json({ message: "Failed to fetch or process metadata from the URL" });
  }
};

//function to fetch metadata from reddit 
const fetchFromReddit = async (url: string) => {
  const redditUrl = url.endsWith("/") ? `${url}.json` : `${url}/.json`;
  const { data } = await axios.get(redditUrl, {
    headers: { "User-Agent": "Mastik" },
  });

  const post = data[0].data.children[0].data;

  let image: string | null = null;

  if (post.url_overridden_by_dest?.match(/\.(jpg|png|gif)$/)) {
    image = post.url_overridden_by_dest;
  } else if (post.preview?.images?.[0]?.source?.url) {
    image = post.preview.images[0].source.url.replace(/&amp;/g, "&");
  } else if (post.media_metadata) {
    const firstMedia = Object.values(post.media_metadata)[0] as any;
    if (firstMedia?.s?.u) {
      image = firstMedia.s.u.replace(/&amp;/g, "&");
    }
  }

  return {
    title: post.title,
    description: post.selftext || null,
    image,
    url: `https://www.reddit.com${post.permalink}`,
  };
};


//function to fetch metadata from twitter (not working currently)
const fetchFromTwitter = async (url: string) => {
  try {
    const tweetId = url.split("/")[5];

    if (!tweetId) {
      console.log("Could not extract post_id");
    }

    console.log(tweetId);

    const apiUrl = `https://api.twitter.com/2/tweets/${tweetId}?expansions=attachments.media_keys&media.fields=url,preview_image_url&tweet.fields=created_at,author_id`;

    const token = process.env.X_TOKEN;

    const { data } = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(data);
  } catch (error) {
    console.error(`Something went wrong while fetching X meta data ${error}`);
  }
};


