"use client";

import { motion } from "framer-motion";


type CardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
};

function Card({ title, description, icon, delay = 0 }: CardProps) {
  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2}}
      className="group rounded-2xl p-6 bg-gradient-to-tr from-white/10 via-white/20 to-black/10
                 text-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition relative overflow-hidden"
    >
              


      {icon && <div className="mb-4 text-3xl">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
    </>
  );
}

export default Card;
