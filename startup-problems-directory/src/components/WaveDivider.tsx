import { motion } from "framer-motion";

interface WaveDividerProps {
  color: string;
  position: 'top' | 'bottom';
}

export function WaveDivider({ color, position }: WaveDividerProps) {
  return (
    <div className={`absolute left-0 right-0 w-full overflow-hidden leading-none z-30 ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'}`}>
      <motion.svg
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        className="relative block w-[200%] h-[60px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.78,193.9,98.6,236.4,84.34,279.16,72.48,321.39,56.44Z"
          fill={color}
        ></path>
        <path
          d="M1521.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C2023.78,31,2106.67,72,2185.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C1259.71,118.08,1330.83,119.78,1393.9,98.6,1436.4,84.34,1479.16,72.48,1521.39,56.44Z"
          fill={color}
          transform="translate(-1200, 0)"
        ></path>
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.78,193.9,98.6,236.4,84.34,279.16,72.48,321.39,56.44Z"
          fill={color}
          transform="translate(1200, 0)"
        ></path>
      </motion.svg>
    </div>
  );
}
