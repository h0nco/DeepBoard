import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

interface NodeContextMenuProps {
  children: React.ReactNode;
  onDelete: () => void;
  onCopy: () => void;
  onToggleLock: () => void;
  isLocked: boolean;
}

export default function NodeContextMenu({
  children,
  onDelete,
  onCopy,
  onToggleLock,
  isLocked,
}: NodeContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg p-1 border border-gray-200 dark:border-gray-700">
          <ContextMenuPrimitive.Item
            className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onClick={onDelete}
          >
             Удалить
          </ContextMenuPrimitive.Item>
          <ContextMenuPrimitive.Item
            className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onClick={onCopy}
          >
             Копировать
          </ContextMenuPrimitive.Item>
          <ContextMenuPrimitive.Item
            className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onClick={onToggleLock}
          >
            {isLocked ? ' Разблокировать' : ' Заблокировать'}
          </ContextMenuPrimitive.Item>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
}