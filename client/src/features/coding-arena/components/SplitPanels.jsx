export const SplitPanels = ({ leftPanel, rightPanelTop, rightPanelBottom }) => {
  return (
    <div className='flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-dark-bg'>
      {/* Left Pane (Problem Description) */}
      <div className='w-1/2 h-full border-r border-[#334155] overflow-y-auto'>{leftPanel}</div>

      {/* Right Pane (Editor & Console) */}
      <div className='w-1/2 h-full flex flex-col'>
        {/* Editor Section (Top Right) */}
        <div className='h-2/3 border-b border-[#334155]'>{rightPanelTop}</div>

        {/* Console Section (Bottom Right) */}
        <div className='h-1/3'>{rightPanelBottom}</div>
      </div>
    </div>
  );
};
