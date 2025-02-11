"use client";

import React from "react";
import type { PostDocument } from "@/sanity/schemaTypes/seo";
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  XIcon,
  EmailIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  TelegramShareButton,
} from "react-share";
import { usePathname } from "next/navigation";

const Share = ({ post }: { post: PostDocument }) => {
  const pathname = usePathname();

  if (!post || !post.title) {
    return null; // o algún mensaje de error
  }

  const baseUrl = "https://readysetllc.com";
  const shareUrl = `${baseUrl}${pathname}`;
  const title = post.title;

  return (
    <>
      <h3 className="text-2xl sm:text-xl font-semibold text-black text-left my-10">
        Share this article
      </h3>

      <div className="flex space-x-4">
        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="share-button"
          aria-label="Compartir en Twitter"
        >
          <XIcon size={32} round />
        </TwitterShareButton>

        <FacebookShareButton
          url={shareUrl}
          className="share-button"
          aria-label="Compartir en Facebook"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <FacebookMessengerShareButton
          url={shareUrl}
          appId="521270401588372"
          className="share-button"
          aria-label="Compartir en Facebook Messenger"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="share-button"
          aria-label="Compartir en Telegram"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=" - "
          className="share-button"
          aria-label="Compartir en WhatsApp"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="Mira este artículo, me pareció interesante:"
          className="share-button"
          aria-label="Compartir por correo electrónico"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>

        <LinkedinShareButton
          url={shareUrl}
          className="share-button"
          aria-label="Compartir en LinkedIn"
        >
          <LinkedinIcon size={32} round />
          
        </LinkedinShareButton>
      </div>
    </>
  );
};

export default Share;