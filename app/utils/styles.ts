export const styles = {
    light: {
      background: "bg-white",
      text: "text-gray-900",
      button: "rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
      buttonXs: "rounded-lg px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
      buttonSm: "rounded-lg px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
      buttonSelected: "rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 bg-gray-200",
      buttonSelectedXs: "rounded-lg px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 bg-gray-200",
      buttonSelectedSm: "rounded-lg px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 bg-gray-200",
      highlightRow: "even:bg-gray-50"
    },
    dark: {
      background: "bg-gray-900",
      text: "text-gray-200",
      button: "rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-700",
      buttonXs: "rounded-lg px-2 py-1 text-xs font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-700",
      buttonSm: "rounded-lg px-2 py-1 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-700",
      buttonSelected: "rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-400 bg-gray-600",
      buttonSelectedXs: "rounded-lg px-2 py-1 text-xs font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-400 bg-gray-600",
      buttonSelectedSm: "rounded-lg px-2 py-1 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-400 bg-gray-600",
      highlightRow: "even:bg-gray-800"
    },
    // Common styles that don't change with theme
    common: {
      buttonBase: "rounded-lg font-semibold"
    }
  } as const;
  
  // Helper function to get styles based on theme
  export const getStyles = (theme: 'light' | 'dark') => {
    return {
      ...styles.common,
      ...styles[theme]
    };
  };