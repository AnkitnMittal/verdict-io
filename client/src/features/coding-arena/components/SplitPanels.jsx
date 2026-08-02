import { Group, Panel, Separator } from 'react-resizable-panels';

export const SplitPanels = ({ leftPanel, rightPanelTop, rightPanelBottom }) => {
  return (
    <div className='h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950'>
      <Group orientation='horizontal' autoSaveId='coding-arena-main'>
        <Panel defaultSize={45} minSize={20} className='h-full overflow-hidden'>
          {leftPanel}
        </Panel>

        <Separator className='w-1.5 bg-slate-800/80 hover:bg-blue-500/80 active:bg-blue-600 transition-colors cursor-col-resize relative group flex items-center justify-center shrink-0'>
          <div className='w-0.5 h-8 bg-slate-600 group-hover:bg-white rounded-full transition-colors' />
        </Separator>

        <Panel defaultSize={55} minSize={20}>
          <Group orientation='vertical' autoSaveId='coding-arena-stack'>
            <Panel defaultSize={65} minSize={20} className='h-full overflow-hidden'>
              {rightPanelTop}
            </Panel>

            <Separator className='h-1.5 bg-slate-800/80 hover:bg-blue-500/80 active:bg-blue-600 transition-colors cursor-row-resize relative group flex items-center justify-center shrink-0'>
              <div className='h-0.5 w-8 bg-slate-600 group-hover:bg-white rounded-full transition-colors' />
            </Separator>

            <Panel defaultSize={35} minSize={15} className='h-full overflow-hidden'>
              {rightPanelBottom}
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
};
