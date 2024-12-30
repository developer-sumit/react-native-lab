const HookTemplates = {
  useDebounce: `
import { useState, useEffect } from "react";

/**
 * A hook that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @template T The type of the value to be debounced
 * @param {T} value - The value to be debounced.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {T} The debounced value.
 *
 * @example
 * // Usage in a functional component
 * import React, { useState } from 'react';
 * import useDebounce from './useDebounce';
 *
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // Perform search operation
 *       console.log('Searching for:', debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       type="text"
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
`,

  useResponsiveLayout: `
import { useState, useEffect } from "react";
import { Dimensions, ScaledSize } from "react-native";

type ScreenSize = "small" | "medium" | "large";

interface Breakpoints {
  small: number;
  medium: number;
}

interface ResponsiveLayout {
  screenSize: ScreenSize;
  width: number;
  height: number;
  isLandscape: boolean;
}

/**
 * A custom hook for creating responsive layouts in React Native.
 *
 * This hook provides information about the current screen size category
 * and specific dimensions, allowing for easy creation of responsive designs.
 * Users can optionally provide custom breakpoints.
 *
 * @param {Breakpoints} [customBreakpoints] - Optional custom breakpoints for screen sizes.
 * @param {number} customBreakpoints.small - The maximum width for small screens (default: 359).
 * @param {number} customBreakpoints.medium - The maximum width for medium screens (default: 767).
 * @returns {ResponsiveLayout} An object containing screen size information and dimensions.
 *
 * @example
 * // Using default breakpoints
 * const { screenSize, width, height, isLandscape } = useResponsiveLayout();
 *
 * @example
 * // Using custom breakpoints
 * const layout = useResponsiveLayout({ small: 400, medium: 800 });
 *
 * @example
 * // Using the returned values in a component
 * function MyComponent() {
 *   const { screenSize, isLandscape } = useResponsiveLayout();
 *
 *   return (
 *     <View>
 *       {screenSize === 'small' && <SmallScreenLayout />}
 *       {screenSize === 'medium' && <MediumScreenLayout />}
 *       {screenSize === 'large' && <LargeScreenLayout />}
 *       {isLandscape && <LandscapeOverlay />}
 *     </View>
 *   );
 * }
 */
function useResponsiveLayout(
  customBreakpoints?: Breakpoints
): ResponsiveLayout {
  const defaultBreakpoints: Breakpoints = {
    small: 359,
    medium: 767,
  };

  const breakpoints = customBreakpoints || defaultBreakpoints;

  const [screenSize, setScreenSize] = useState<ScreenSize>("medium");
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const determineScreenSize = (width: number) => {
      if (width <= breakpoints.small) {
        return "small";
      } else if (width <= breakpoints.medium) {
        return "medium";
      } else {
        return "large";
      }
    };

    const onChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
      setScreenSize(determineScreenSize(window.width));
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    // Initial screen size determination
    setScreenSize(determineScreenSize(dimensions.width));

    return () => subscription.remove();
  }, [breakpoints]);

  return {
    screenSize,
    width: dimensions.width,
    height: dimensions.height,
    isLandscape: dimensions.width > dimensions.height,
  };
}

export default useResponsiveLayout;
`,

  useOrientation: `
import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

type Orientation = "portrait" | "landscape";

/**
 * A hook that detects and responds to device orientation changes.
 *
 * @returns {Orientation} The current orientation of the device.
 *
 * @example
 * // Usage in a functional component
 * import React from 'react';
 * import { View, Text } from 'react-native';
 * import useOrientation from './useOrientation';
 *
 * function OrientationComponent() {
 *   const orientation = useOrientation();
 *
 *   return (
 *     <View>
 *       <Text>The current orientation is {orientation}</Text>
 *     </View>
 *   );
 * }
 */
function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get("window");
      setOrientation(width > height ? "landscape" : "portrait");
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateOrientation
    );
    updateOrientation();

    return () => subscription.remove();
  }, []);

  return orientation;
}

export default useOrientation;
`,

  usePrevious: `
import { useRef, useEffect } from "react";

/**
 * A hook that returns the previous value of a variable.
 *
 * @template T The type of the value to track
 * @param {T} value - The value to track.
 * @returns {T | undefined} The previous value.
 *
 * @example
 * // Usage in a functional component
 * import React, { useState, useEffect } from 'react';
 * import usePrevious from './usePrevious';
 *
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *
 *   useEffect(() => {
 *     console.log(\`Current count: \${count}, Previous count: \${prevCount}\`);
 *   }, [count]);
 *
 *   return (
 *     <div>
 *       <p>Current count: {count}</p>
 *       <p>Previous count: {prevCount}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
`,

  useThrottle: `
import { useState, useEffect } from "react";

/**
 * A hook that limits the rate at which a function can fire.
 *
 * @template T The type of the value to be throttled
 * @param {T} value - The value to be throttled.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {T} The throttled value.
 *
 * @example
 * // Usage in a functional component
 * import React, { useState } from 'react';
 * import useThrottle from './useThrottle';
 *
 * function ThrottleComponent() {
 *   const [value, setValue] = useState('');
 *   const throttledValue = useThrottle(value, 1000);
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={value}
 *         onChange={(e) => setValue(e.target.value)}
 *         placeholder="Type something..."
 *       />
 *       <p>Throttled value: {throttledValue}</p>
 *     </div>
 *   );
 * }
 */
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  useEffect(() => {
    const lastRan = Date.now();
    const handler = setTimeout(() => {
      if (Date.now() - lastRan >= limit) {
        setThrottledValue(value);
      }
    }, limit - (Date.now() - lastRan));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export default useThrottle;
`,
};

export default HookTemplates;
