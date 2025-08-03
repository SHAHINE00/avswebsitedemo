import * as React from "react";

// Test React import to isolate the issue
console.log('React object:', React);
console.log('useState:', React.useState);
console.log('useEffect:', React.useEffect);

export const testReact = () => {
  if (!React) {
    throw new Error('React is null or undefined');
  }
  if (!React.useState) {
    throw new Error('React.useState is not available');
  }
  return 'React imports working correctly';
};