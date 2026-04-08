import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

interface CanvasContextMenuProps {
  children: React.ReactNode;
  onAddText: () => void;
  onPasteImage: () => void;
  onFreeDraw: () => void;
}

export default function CanvasContextMenu({
  children,
  onAddText,
  onPasteImage,
  onFreeDraw,
}: CanvasContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content className="min-w-[180px] bg-white dark:bg-gray-800 rounded-md shadow-lg p-1 border border-gray-200 dark:border-gray-700">
          <ContextMenuPrimitive.Item
            className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onClick={onAddText}
          >
             Новый текст
          </ContextMenuPrimitive.Item>
          <ContextMenuPrimitive.Item
            className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onClick={onPasteImage}
          >
             Вставить изображение
          </ContextMenuPrimitive.Item>
          <ContextMenuPrimitive.Item
            className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onClick={onFreeDraw}
          >
             Свободное рисование
          </ContextMenuPrimitive.Item>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
}