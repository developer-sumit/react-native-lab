const ComponentTemplates = {
  ConsoleRemover: `
import React, { useEffect } from "react";

interface ConsoleRemoverProps {
  children: React.ReactNode;
}

/**
 * ConsoleRemover Component
 * 
 * This component disables all console methods in production builds to enhance
 * security and slightly reduce app size. In development mode, console functionality
 * remains unchanged.
 * 
 * @example
 * // Wrap your root component with ConsoleRemover
 * import ConsoleRemover from './components/ConsoleRemover';
 * 
 * const App = () => (
 *   <ConsoleRemover>
 *     <YourRootComponent />
 *   </ConsoleRemover>
 * );
 * 
 * export default App;
 */
const ConsoleRemover: React.FC<ConsoleRemoverProps> = ({ children }) => {
  useEffect(() => {
    if (!__DEV__) {
      // Disable console in production
      if (!global.console) global.console = {} as Console;
      const noop = () => {};
      const methods = [
        "assert",
        "clear",
        "count",
        "debug",
        "dir",
        "dirxml",
        "error",
        "exception",
        "group",
        "groupCollapsed",
        "groupEnd",
        "info",
        "log",
        "profile",
        "profileEnd",
        "table",
        "time",
        "timeEnd",
        "timeStamp",
        "trace",
        "warn",
      ];
      methods.forEach(method => {
        (global.console as any)[method] = noop;
      });
    }
  }, []);

  return <>{children}</>;
};

export default ConsoleRemover;
`,
};

export default ComponentTemplates;
