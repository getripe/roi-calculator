import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full bg-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative">
      <svg
        className="absolute inset-0 w-full h-full -ml-0.5"
        viewBox="0 0 1199 1199"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M874.699 57.3349L616.96 358.503C659.215 396.93 685.745 452.381 685.745 514.002C685.745 630.046 591.722 724.115 475.735 724.115C425.807 724.115 379.991 706.659 343.949 677.534L87.7411 976.934C341.56 1194.36 723.483 1164.74 940.806 910.794C1158.13 656.851 1128.52 274.741 874.699 57.311V57.3349Z"
          fill="#FB5DA5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M923.866 0C1209.58 244.744 1242.91 674.894 998.281 960.75C753.656 1246.6 323.717 1279.95 38 1035.2L137.482 918.953C359.021 1108.73 692.402 1082.87 882.09 861.219C1071.77 639.572 1045.93 306.028 824.384 116.247L923.866 0Z"
          fill="#07D2C3"
        />
      </svg>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }