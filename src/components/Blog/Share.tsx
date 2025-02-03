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

  // Definimos la URL base correcta
  const baseUrl = "https://readysetllc.com";

  // Construimos la URL completa
  const shareUrl = `${baseUrl}${pathname}`;
  const title = post.title;

  return (
    <>
      <h3 className="text-2xl sm:text-xl font-semibold text-black text-left my-10">
        Comparte este artículo en redes sociales:
      </h3>

      <div className="flex space-x-4">
        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <XIcon size={32} round />
        </TwitterShareButton>

        <FacebookShareButton
          url={shareUrl}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <FacebookMessengerShareButton
          url={shareUrl}
          appId="521270401588372"
          className="Demo__some-network__share-button"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="Mira este articulo, me pareció interesante:"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>

        <LinkedinShareButton
          url={shareUrl}
          className="Demo__some-network__share-button"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
    </>
  );
};

export default Share;