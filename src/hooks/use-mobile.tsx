import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Default to false
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true); // Indicate that the component has mounted on the client

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value after mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    mql.addEventListener("change", onChange);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Until mounted, return the default value (false) to match server-side behavior
  if (!hasMounted) {
    return false;
  }

  return isMobile;
}
