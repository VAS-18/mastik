import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';


export const getLinkMetadata = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(html);

    const getMetaTag = (name: string) => {
      return (
        $(`meta[property="og:${name}"]`).attr('content') ||
        $(`meta[name="twitter:${name}"]`).attr('content') ||
        $(`meta[name="${name}"]`).attr('content')
      );
    };

    const metadata = {
      title: getMetaTag('title') || $('title').first().text(),
      description: getMetaTag('description'),
      image: getMetaTag('image'),
      url: getMetaTag('url') || url,
    };

    res.status(200).json(metadata);

  } catch (error) {
    
    if (axios.isAxiosError(error)) {
        console.error(`Axios error fetching metadata for ${url}:`, error.message);
    } else {
        console.error(`Error processing metadata for ${url}:`, error);
    }
    res.status(500).json({ message: 'Failed to fetch or process metadata from the URL' });
  }
};

