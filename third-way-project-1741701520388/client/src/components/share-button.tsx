import { Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: description,
          url,
        })
        .catch(() => setIsOpen(true));
    } else {
      setIsOpen(true);
    }
  }, [title, description, url]);

  const shareButtons = [
    {
      Component: WhatsappShareButton,
      label: "WhatsApp",
      className: "bg-[#25D366] hover:bg-[#128C7E]",
    },
    {
      Component: TwitterShareButton,
      label: "Twitter",
      className: "bg-[#1DA1F2] hover:bg-[#1a91da]",
    },
    {
      Component: FacebookShareButton,
      label: "Facebook",
      className: "bg-[#4267B2] hover:bg-[#365899]",
    },
    {
      Component: TelegramShareButton,
      label: "Telegram",
      className: "bg-[#0088cc] hover:bg-[#0077b3]",
    },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Compartilhar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <AnimatePresence>
          <div className="grid gap-2">
            {shareButtons.map(({ Component, label, className }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Component url={url} title={title} className="w-full">
                  <Button
                    variant="ghost"
                    className={`w-full text-white ${className}`}
                  >
                    {label}
                  </Button>
                </Component>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
