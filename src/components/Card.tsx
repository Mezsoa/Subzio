"use client";

import { motion } from "framer-motion";


type CardProps = {
  title: string | string[];
  description: string | string[];
  icon?: React.ReactNode;
  delay?: number;
};

function Card({ title: [title1, title2, title3], description: [description1, description2, description3], icon, delay = 0 }: CardProps) {
  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="group min-w-[600px] rounded-lg border border-border bg-background/40 p-5 transition-colors hover:bg-background/60"
    >
              <div className="flex flex-col gap-2 w-full">
                {icon && <div className="mb-3 text-2xl text-foreground/80">{icon}</div>}
                <ul className="list-disc list-inside">
                  <h5 className="mt-2 text-base sm:text-lg text-foreground font-regular text-center">{title1}</h5>
                  <li className="mt-4 text-sm text-muted font-light text-center">{description1}</li>
                  <h5 className="mt-2 text-base sm:text-lg text-foreground font-regular text-center">{title2}</h5>
                  <li className="mt-4 text-sm text-muted font-light text-center">{description2}</li>
                  <h5 className="mt-2 text-base sm:text-lg text-foreground font-regular text-center">{title3}</h5>
                  <li className="mt-4 text-sm text-muted font-light text-center">{description3}</li>
                </ul>
              </div>
    </motion.div>
    </>
  );
}

export default Card;
