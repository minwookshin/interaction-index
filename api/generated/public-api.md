# Interaction Index public API report

> Generated from the TypeScript compiler. Do not edit directly.

- Entry point: `src/components/ui/index.ts`
- TypeScript: `6.0.3`
- Components: `45`
- Public exports: `210`

## button

Declaration: [`button.d.ts`](./types/components/ui/button.d.ts)

- **Button** · function · `Button({ className, variant, size, loading, leadingIcon, trailingIcon, disabled, focusableWhenDisabled, children, type, ...props }: ButtonProps): import("react").JSX.Element`
- **ButtonProps** · type · `ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { loading?: boolean; leadingIcon?: ReactNode; trailingIcon?: ReactNode; }`
- **buttonVariants** · const · `buttonVariants: (props?: ({ variant?: "primary" | "secondary" | "ghost" | "quiet" | null | undefined; size?: "small" | "medium" | "large" | null | undefined; } & import("class-variance-authority/types").ClassProp) | undefined) => string`

## icon-button

Declaration: [`icon-button.d.ts`](./types/components/ui/icon-button.d.ts)

- **IconButton** · function · `IconButton({ children, className, tooltip, ...props }: IconButtonProps): import("react").JSX.Element`
- **IconButtonProps** · type · `IconButtonProps = Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon"> & { children?: ReactNode; "aria-label": string; tooltip?: string; }`

## field

Declaration: [`field.d.ts`](./types/components/ui/field.d.ts)

- **Field** · function · `Field({ className, ...props }: FieldProps): import("react").JSX.Element`
- **FieldControl** · function · `FieldControl({ className, ...props }: FieldControlProps): import("react").JSX.Element`
- **FieldControlProps** · type · `FieldControlProps = FieldPrimitive.Control.Props`
- **FieldDescription** · function · `FieldDescription({ className, ...props }: FieldDescriptionProps): import("react").JSX.Element`
- **FieldDescriptionProps** · type · `FieldDescriptionProps = FieldPrimitive.Description.Props`
- **FieldError** · function · `FieldError({ className, match, ...props }: FieldErrorProps): import("react").JSX.Element`
- **FieldErrorProps** · type · `FieldErrorProps = FieldPrimitive.Error.Props`
- **FieldGroup** · function · `FieldGroup({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **FieldLabel** · function · `FieldLabel({ className, ...props }: FieldLabelProps): import("react").JSX.Element`
- **FieldLabelProps** · type · `FieldLabelProps = FieldPrimitive.Label.Props`
- **FieldProps** · type · `FieldProps = FieldPrimitive.Root.Props`
- **Fieldset** · function · `Fieldset({ className, ...props }: FieldsetProps): import("react").JSX.Element`
- **FieldsetLegend** · function · `FieldsetLegend({ className, ...props }: FieldsetLegendProps): import("react").JSX.Element`
- **FieldsetLegendProps** · type · `FieldsetLegendProps = FieldsetPrimitive.Legend.Props`
- **FieldsetProps** · type · `FieldsetProps = FieldsetPrimitive.Root.Props`

## input-group

Declaration: [`input-group.d.ts`](./types/components/ui/input-group.d.ts)

- **InputGroup** · function · `InputGroup({ className, invalid, disabled, ...props }: InputGroupProps): import("react").JSX.Element`
- **InputGroupAddon** · function · `InputGroupAddon({ className, side, ...props }: InputGroupAddonProps): import("react").JSX.Element`
- **InputGroupAddonProps** · type · `InputGroupAddonProps = ComponentPropsWithRef<"span"> & { side?: "start" | "end"; }`
- **InputGroupButton** · function · `InputGroupButton({ className, variant, size, disabled, ...props }: InputGroupButtonProps): import("react").JSX.Element`
- **InputGroupButtonProps** · type · `InputGroupButtonProps = ButtonProps`
- **InputGroupInput** · function · `InputGroupInput({ className, disabled, "aria-invalid": ariaInvalid, ...props }: InputGroupInputProps): import("react").JSX.Element`
- **InputGroupInputProps** · type · `InputGroupInputProps = ComponentPropsWithRef<"input">`
- **InputGroupProps** · type · `InputGroupProps = ComponentPropsWithRef<"div"> & { invalid?: boolean; disabled?: boolean; }`

## kbd

Declaration: [`kbd.d.ts`](./types/components/ui/kbd.d.ts)

- **Kbd** · function · `Kbd({ className, ...props }: KbdProps): import("react").JSX.Element`
- **KbdGroup** · function · `KbdGroup({ className, ...props }: KbdGroupProps): import("react").JSX.Element`
- **KbdGroupProps** · type · `KbdGroupProps = ComponentPropsWithRef<"span">`
- **KbdProps** · type · `KbdProps = ComponentPropsWithRef<"kbd">`

## button-group

Declaration: [`button-group.d.ts`](./types/components/ui/button-group.d.ts)

- **ButtonGroup** · function · `ButtonGroup({ className, orientation, attached, role, ...props }: ButtonGroupProps): import("react").JSX.Element`
- **ButtonGroupProps** · type · `ButtonGroupProps = ComponentPropsWithRef<"div"> & { orientation?: "horizontal" | "vertical"; attached?: boolean; }`
- **ButtonGroupSeparator** · function · `ButtonGroupSeparator({ className, orientation, ...props }: ButtonGroupSeparatorProps): import("react").JSX.Element`
- **ButtonGroupSeparatorProps** · type · `ButtonGroupSeparatorProps = ComponentPropsWithRef<"span"> & { orientation?: "horizontal" | "vertical"; }`

## toolbar

Declaration: [`toolbar.d.ts`](./types/components/ui/toolbar.d.ts)

- **Toolbar** · function · `Toolbar({ className, ...props }: ToolbarProps): import("react").JSX.Element`
- **ToolbarButton** · function · `ToolbarButton({ className, ...props }: ToolbarButtonProps): import("react").JSX.Element`
- **ToolbarButtonProps** · type · `ToolbarButtonProps = ToolbarPrimitive.Button.Props`
- **ToolbarGroup** · function · `ToolbarGroup({ className, ...props }: ToolbarGroupProps): import("react").JSX.Element`
- **ToolbarGroupProps** · type · `ToolbarGroupProps = ToolbarPrimitive.Group.Props`
- **ToolbarInput** · function · `ToolbarInput({ className, ...props }: ToolbarInputProps): import("react").JSX.Element`
- **ToolbarInputProps** · type · `ToolbarInputProps = ToolbarPrimitive.Input.Props`
- **ToolbarLink** · function · `ToolbarLink({ className, ...props }: ToolbarLinkProps): import("react").JSX.Element`
- **ToolbarLinkProps** · type · `ToolbarLinkProps = ToolbarPrimitive.Link.Props`
- **ToolbarProps** · type · `ToolbarProps = ToolbarPrimitive.Root.Props`
- **ToolbarSeparator** · function · `ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps): import("react").JSX.Element`
- **ToolbarSeparatorProps** · type · `ToolbarSeparatorProps = ToolbarPrimitive.Separator.Props`

## text-field

Declaration: [`text-field.d.ts`](./types/components/ui/text-field.d.ts)

- **TextField** · function · `TextField({ id: providedId, label, description, error, leading, trailing, className, fieldClassName, ref, ...props }: TextFieldProps): import("react").JSX.Element`
- **TextFieldProps** · type · `TextFieldProps = Omit<ComponentPropsWithRef<"input">, "size"> & { label?: string; description?: string; error?: string; leading?: ReactNode; trailing?: ReactNode; fieldClassName?: string; }`

## number-field

Declaration: [`number-field.d.ts`](./types/components/ui/number-field.d.ts)

- **NumberField** · function · `NumberField({ id: providedId, label, description, error, suffix, className, inputClassName, inputProps, ...props }: NumberFieldProps): import("react").JSX.Element`
- **NumberFieldProps** · type · `NumberFieldProps = Omit<NumberFieldPrimitive.Root.Props, "children" | "className" | "id"> & { id?: string; label?: string; description?: string; error?: string; suffix?: ReactNode; className?: string; inputClassName?: string; inputProps?: …`

## segmented-control

Declaration: [`segmented-control.d.ts`](./types/components/ui/segmented-control.d.ts)

- **SegmentedControl** · function · `SegmentedControl({ options, label, value, defaultValue, onValueChange, allowEmpty, disabled, orientation, size, className, }: SegmentedControlProps): import("react").JSX.Element`
- **SegmentedControlOption** · type · `SegmentedControlOption = { value: string; label: ReactNode; accessibleLabel?: string; icon?: ReactNode; disabled?: boolean; }`
- **SegmentedControlProps** · type · `SegmentedControlProps = { options: readonly SegmentedControlOption[]; label: string; value?: string; defaultValue?: string; onValueChange?: (value: string | null) => void; allowEmpty?: boolean; disabled?: boolean; orientation?: "horizontal…`

## date-picker

Declaration: [`date-picker.d.ts`](./types/components/ui/date-picker.d.ts)

- **Calendar** · function · `Calendar<T extends DateValue>({ className, ...props }: CalendarProps<T>): import("react").JSX.Element`
- **CalendarProps** · type · `CalendarProps = Omit<AriaCalendarProps<T>, "children" | "className"> & { className?: string; }`
- **DatePicker** · function · `DatePicker<T extends DateValue>({ label, "aria-label": ariaLabel, description, errorMessage, className, ...props }: DatePickerProps<T>): import("react").JSX.Element`
- **DatePickerProps** · type · `DatePickerProps = Omit<AriaDatePickerProps<T>, "children" | "className"> & { label?: ReactNode; "aria-label"?: string; description?: ReactNode; errorMessage?: ReactNode; className?: string; }`

## checkbox

Declaration: [`checkbox.d.ts`](./types/components/ui/checkbox.d.ts)

- **Checkbox** · function · `Checkbox({ className, label, description, id: providedId, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy, ...props }: CheckboxProps): import("react").JSX.Element`
- **CheckboxProps** · type · `CheckboxProps = CheckboxPrimitive.Root.Props & { label?: string; description?: string; }`

## switch

Declaration: [`switch.d.ts`](./types/components/ui/switch.d.ts)

- **Switch** · function · `Switch({ className, label, description, id: providedId, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy, ...props }: SwitchProps): import("react").JSX.Element`
- **SwitchProps** · type · `SwitchProps = SwitchPrimitive.Root.Props & { label?: string; description?: string; }`

## tooltip

Declaration: [`tooltip.d.ts`](./types/components/ui/tooltip.d.ts)

- **Tooltip** · function · `Tooltip(props: TooltipPrimitive.Root.Props): import("react").JSX.Element`
- **TooltipContent** · function · `TooltipContent({ className, side, sideOffset, align, alignOffset, children, ...props }: TooltipContentProps): import("react").JSX.Element`
- **TooltipContentProps** · type · `TooltipContentProps = TooltipPrimitive.Popup.Props & Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">`
- **TooltipProvider** · function · `TooltipProvider({ delay, ...props }: TooltipPrimitive.Provider.Props): import("react").JSX.Element`
- **TooltipTrigger** · function · `TooltipTrigger(props: TooltipPrimitive.Trigger.Props): import("react").JSX.Element`

## popover

Declaration: [`popover.d.ts`](./types/components/ui/popover.d.ts)

- **Popover** · function · `Popover(props: PopoverPrimitive.Root.Props): import("react").JSX.Element`
- **PopoverContent** · function · `PopoverContent({ className, side, sideOffset, align, alignOffset, ...props }: PopoverContentProps): import("react").JSX.Element`
- **PopoverContentProps** · type · `PopoverContentProps = PopoverPrimitive.Popup.Props & Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">`
- **PopoverDescription** · const · `PopoverDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").PopoverDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>`
- **PopoverTitle** · const · `PopoverTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").PopoverTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>`
- **PopoverTrigger** · function · `PopoverTrigger(props: PopoverPrimitive.Trigger.Props): import("react").JSX.Element`

## menu

Declaration: [`menu.d.ts`](./types/components/ui/menu.d.ts)

- **Menu** · const · `Menu: <Payload>(props: MenuPrimitive.Root.Props<Payload>) => import("react").JSX.Element`
- **MenuCheckboxItem** · function · `MenuCheckboxItem({ className, children, ...props }: MenuPrimitive.CheckboxItem.Props): import("react").JSX.Element`
- **MenuContent** · function · `MenuContent({ className, align, alignOffset, collisionAvoidance, side, sideOffset, ...props }: MenuContentProps): import("react").JSX.Element`
- **MenuContentProps** · type · `MenuContentProps = MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "collisionAvoidance" | "side" | "sideOffset">`
- **MenuItem** · function · `MenuItem({ className, ...props }: MenuPrimitive.Item.Props): import("react").JSX.Element`
- **MenuLabel** · function · `MenuLabel({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **MenuRadioGroup** · const · `MenuRadioGroup: import("react").NamedExoticComponent<Omit<import("@base-ui/react").ContextMenuRadioGroupProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>`
- **MenuRadioItem** · function · `MenuRadioItem({ className, children, closeOnClick, ...props }: MenuPrimitive.RadioItem.Props): import("react").JSX.Element`
- **MenuSeparator** · function · `MenuSeparator(props: MenuPrimitive.Separator.Props): import("react").JSX.Element`
- **MenuTrigger** · function · `MenuTrigger(props: MenuPrimitive.Trigger.Props): import("react").JSX.Element`

## dialog

Declaration: [`dialog.d.ts`](./types/components/ui/dialog.d.ts)

- **Dialog** · const · `Dialog: <Payload>(props: DialogPrimitive.Root.Props<Payload>) => import("react").JSX.Element`
- **DialogClose** · const · `DialogClose: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogCloseProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>`
- **DialogContent** · function · `DialogContent({ className, children, showClose, initialFocus, ref, ...props }: DialogContentProps): import("react").JSX.Element`
- **DialogContentProps** · type · `DialogContentProps = DialogPrimitive.Popup.Props & { showClose?: boolean }`
- **DialogDescription** · const · `DialogDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>`
- **DialogFooter** · function · `DialogFooter({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **DialogHeader** · function · `DialogHeader({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **DialogTitle** · const · `DialogTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>`
- **DialogTrigger** · const · `DialogTrigger: DialogPrimitive.Trigger`

## context-menu

Declaration: [`context-menu.d.ts`](./types/components/ui/context-menu.d.ts)

- **ContextMenu** · const · `ContextMenu: (props: ContextMenuPrimitive.Root.Props) => import("react").JSX.Element`
- **ContextMenuCheckboxItem** · function · `ContextMenuCheckboxItem({ className, children, ...props }: ContextMenuPrimitive.CheckboxItem.Props): import("react").JSX.Element`
- **ContextMenuContent** · function · `ContextMenuContent({ className, align, alignOffset, collisionAvoidance, side, sideOffset, ...props }: ContextMenuContentProps): import("react").JSX.Element`
- **ContextMenuContentProps** · type · `ContextMenuContentProps = ContextMenuPrimitive.Popup.Props & Pick<ContextMenuPrimitive.Positioner.Props, "align" | "alignOffset" | "collisionAvoidance" | "side" | "sideOffset">`
- **ContextMenuItem** · function · `ContextMenuItem({ className, ...props }: ContextMenuPrimitive.Item.Props): import("react").JSX.Element`
- **ContextMenuLabel** · function · `ContextMenuLabel({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **ContextMenuRadioGroup** · const · `ContextMenuRadioGroup: import("react").NamedExoticComponent<Omit<import("@base-ui/react").ContextMenuRadioGroupProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>`
- **ContextMenuRadioItem** · function · `ContextMenuRadioItem({ className, children, closeOnClick, ...props }: ContextMenuPrimitive.RadioItem.Props): import("react").JSX.Element`
- **ContextMenuSeparator** · function · `ContextMenuSeparator(props: ContextMenuPrimitive.Separator.Props): import("react").JSX.Element`
- **ContextMenuTrigger** · function · `ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props): import("react").JSX.Element`

## sheet

Declaration: [`sheet.d.ts`](./types/components/ui/sheet.d.ts)

- **Sheet** · const · `Sheet: <Payload>(props: DialogPrimitive.Root.Props<Payload>) => import("react").JSX.Element`
- **SheetBody** · function · `SheetBody({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **SheetClose** · const · `SheetClose: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogCloseProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>`
- **SheetContent** · function · `SheetContent({ className, children, side, showClose, ...props }: SheetContentProps): import("react").JSX.Element`
- **SheetContentProps** · type · `SheetContentProps = DialogPrimitive.Popup.Props & { side?: SheetSide; showClose?: boolean; }`
- **SheetDescription** · const · `SheetDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>`
- **SheetFooter** · function · `SheetFooter({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **SheetHeader** · function · `SheetHeader({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **SheetSide** · type · `SheetSide = "top" | "right" | "bottom" | "left"`
- **SheetTitle** · const · `SheetTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>`
- **SheetTrigger** · const · `SheetTrigger: DialogPrimitive.Trigger`

## alert-dialog

Declaration: [`alert-dialog.d.ts`](./types/components/ui/alert-dialog.d.ts)

- **AlertDialog** · const · `AlertDialog: <Payload>(props: AlertDialogPrimitive.Root.Props<Payload>) => import("react").JSX.Element`
- **AlertDialogClose** · const · `AlertDialogClose: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogCloseProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>`
- **AlertDialogContent** · function · `AlertDialogContent({ className, children, ...props }: AlertDialogPrimitive.Popup.Props): import("react").JSX.Element`
- **AlertDialogDescription** · const · `AlertDialogDescription: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogDescriptionProps, "ref"> & import("react").RefAttributes<HTMLParagraphElement>>`
- **AlertDialogFooter** · function · `AlertDialogFooter({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **AlertDialogHeader** · function · `AlertDialogHeader({ className, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **AlertDialogTitle** · const · `AlertDialogTitle: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").AlertDialogTitleProps, "ref"> & import("react").RefAttributes<HTMLHeadingElement>>`
- **AlertDialogTrigger** · const · `AlertDialogTrigger: AlertDialogPrimitive.Trigger`

## tabs

Declaration: [`tabs.d.ts`](./types/components/ui/tabs.d.ts)

- **Tabs** · function · `Tabs({ className, ...props }: TabsPrimitive.Root.Props): import("react").JSX.Element`
- **TabsContent** · function · `TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): import("react").JSX.Element`
- **TabsList** · function · `TabsList({ className, activateOnFocus, ...props }: TabsPrimitive.List.Props): import("react").JSX.Element`
- **TabsTrigger** · function · `TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props): import("react").JSX.Element`

## toast

Declaration: [`toast.d.ts`](./types/components/ui/toast.d.ts)

- **toast** · const · `toast: ToastApi`
- **ToastApi** · type · `ToastApi = { (message: ToastMessage, options?: ToastOptions): ToastId; success: (message: ToastMessage, options?: ToastOptions) => ToastId; info: (message: ToastMessage, options?: ToastOptions) => ToastId; warning: (message: ToastMessage, …`
- **Toaster** · function · `Toaster({ className, position, visibleToasts, expand, closeButton, duration, gap, offset, toastOptions, ...props }: ToasterProps): import("react").JSX.Element`
- **ToastId** · type · `ToastId = string | number`
- **ToastMessage** · type · `ToastMessage = ReactNode | (() => ReactNode)`
- **ToastOptions** · type · `ToastOptions = ExternalToast`

## inline-edit

Declaration: [`inline-edit.d.ts`](./types/components/ui/inline-edit.d.ts)

- **InlineEdit** · function · `InlineEdit({ value, onSave, label, placeholder, className, disabled, validate }: InlineEditProps): import("react").JSX.Element`
- **inlineEditContract** · const · `inlineEditContract: BehaviorContract`
- **InlineEditProps** · type · `InlineEditProps = { value: string; onSave: (value: string) => void | Promise<void>; label?: string; placeholder?: string; className?: string; disabled?: boolean; validate?: (value: string) => string | undefined; }`

## reorderable-list

Declaration: [`reorderable-list.d.ts`](./types/components/ui/reorderable-list.d.ts)

- **ReorderableItem** · type · `ReorderableItem = { id: Key; label: string; description?: string; disabled?: boolean; }`
- **ReorderableList** · function · `ReorderableList({ items: controlledItems, defaultItems, onItemsChange, className, layout, ...props }: ReorderableListProps): import("react").JSX.Element`
- **ReorderableListProps** · type · `ReorderableListProps = Omit<GridListProps<ReorderableItem>, "children" | "className" | "dragAndDropHooks" | "items"> & { items?: readonly ReorderableItem[]; defaultItems?: readonly ReorderableItem[]; onItemsChange?: (items: ReorderableItem…`

## action-list

Declaration: [`action-list.d.ts`](./types/components/ui/action-list.d.ts)

- **ActionList** · function · `ActionList({ items, onAction, placeholder, emptyMessage, className, autoFocus, defaultQuery }: ActionListProps): import("react").JSX.Element`
- **actionListContract** · const · `actionListContract: BehaviorContract`
- **ActionListItem** · type · `ActionListItem = { id: string; label: string; description?: string; icon?: ReactNode; shortcut?: string; disabled?: boolean; loading?: boolean; variant?: "default" | "danger"; inactiveReason?: string; }`
- **ActionListProps** · type · `ActionListProps = { items: readonly ActionListItem[]; onAction: (item: ActionListItem) => void; placeholder?: string; emptyMessage?: string; className?: string; autoFocus?: boolean; defaultQuery?: string; }`

## shared-detail

Declaration: [`shared-detail.d.ts`](./types/components/ui/shared-detail.d.ts)

- **getSharedDetailMotionPreset** · function · `getSharedDetailMotionPreset(id: SharedDetailMotionPresetId): SharedDetailMotionPreset`
- **selectedSharedDetailMotionPreset** · const · `selectedSharedDetailMotionPreset: "continuity"`
- **SharedDetail** · function · `SharedDetail({ items, className, selectedId: selectedIdProp, defaultSelectedId, onSelectedIdChange, motionPreset, focusOnOpen, regionLabel, renderDetail, }: SharedDetailProps): import("react").JSX.Element`
- **sharedDetailContract** · const · `sharedDetailContract: BehaviorContract`
- **SharedDetailItem** · type · `SharedDetailItem = { id: string; title: string; meta: string; description: string; status?: string; }`
- **SharedDetailMotionPreset** · type · `SharedDetailMotionPreset = { id: SharedDetailMotionPresetId; label: string; description: string; panelInitial: Record<string, string | number>; panelExit: Record<string, string | number>; panelTransition: { duration?: number; ease?: Bezier…`
- **SharedDetailMotionPresetId** · type · `SharedDetailMotionPresetId = | "continuity" | "quiet" | "soft-scale" | "spring" | "reveal" | "crossfade" | "stagger" | "direct"`
- **sharedDetailMotionPresets** · const · `sharedDetailMotionPresets: readonly SharedDetailMotionPreset[]`
- **SharedDetailProps** · type · `SharedDetailProps = { items: readonly SharedDetailItem[]; className?: string; selectedId?: string | null; defaultSelectedId?: string; onSelectedIdChange?: (id: string | null) => void; motionPreset?: SharedDetailMotionPresetId; focusOnOpen?…`

## undo-stack

Declaration: [`undo-stack.d.ts`](./types/components/ui/undo-stack.d.ts)

- **UndoAction** · type · `UndoAction = { id?: string; label: string; undo: () => void; }`
- **UndoBar** · function · `UndoBar(): import("react").JSX.Element | null`
- **UndoContextValue** · type · `UndoContextValue = { pushUndo: (action: UndoAction) => void; undoLatest: () => void; canUndo: boolean; latestLabel?: string; count: number; }`
- **undoStackContract** · const · `undoStackContract: BehaviorContract`
- **UndoStackProvider** · function · `UndoStackProvider({ children }: { children: ReactNode; }): import("react").JSX.Element`
- **useUndoStack** · function · `useUndoStack(): UndoContextValue`

## badge

Declaration: [`badge.d.ts`](./types/components/ui/badge.d.ts)

- **Badge** · function · `Badge({ className, variant, leadingIcon, removable, onRemove, removeLabel, children, ...props }: BadgeProps): import("react").JSX.Element`
- **BadgeProps** · type · `BadgeProps = ComponentPropsWithRef<"span"> & { variant?: "neutral" | "strong" | "outline" | "success" | "warning" | "danger"; leadingIcon?: ReactNode; removable?: boolean; onRemove?: () => void; removeLabel?: string; }`

## avatar

Declaration: [`avatar.d.ts`](./types/components/ui/avatar.d.ts)

- **Avatar** · function · `Avatar({ className, src, alt, fallback, size, status, ...props }: AvatarProps): import("react").JSX.Element`
- **AvatarGroup** · function · `AvatarGroup({ className, children, ...props }: ComponentPropsWithRef<"div">): import("react").JSX.Element`
- **AvatarProps** · type · `AvatarProps = ComponentPropsWithRef<"span"> & { src?: string; alt?: string; fallback: string; size?: "small" | "medium" | "large"; status?: "online" | "away" | "busy" | "offline"; }`

## textarea

Declaration: [`textarea.d.ts`](./types/components/ui/textarea.d.ts)

- **Textarea** · function · `Textarea({ id: providedId, label, description, error, showCount, maxLength, className, value, defaultValue, onChange, ref, ...props }: TextareaProps): import("react").JSX.Element`
- **TextareaProps** · type · `TextareaProps = ComponentPropsWithRef<"textarea"> & { label?: string; description?: string; error?: string; showCount?: boolean; }`

## radio-group

Declaration: [`radio-group.d.ts`](./types/components/ui/radio-group.d.ts)

- **RadioGroup** · function · `RadioGroup({ className, label, description, error, options, orientation, ...props }: RadioGroupProps): import("react").JSX.Element`
- **RadioGroupProps** · type · `RadioGroupProps = Omit<RadioGroupPrimitive.Props<string>, "children"> & { label: string; description?: string; error?: string; options: readonly RadioOption[]; orientation?: "vertical" | "horizontal"; }`
- **RadioOption** · type · `RadioOption = { value: string; label: string; description?: string; disabled?: boolean; }`

## select

Declaration: [`select.d.ts`](./types/components/ui/select.d.ts)

- **Select** · function · `Select({ label, "aria-label": ariaLabel, description, error, placeholder, options, className, ref, ...props }: SelectProps): import("react").JSX.Element`
- **SelectOption** · type · `SelectOption = { label: string; value: string; disabled?: boolean }`
- **SelectProps** · type · `SelectProps = Omit<SelectPrimitive.Root.Props<string>, "children" | "items" | "aria-label"> & { label?: string; "aria-label"?: string; description?: string; error?: string; placeholder?: string; options: readonly SelectOption[]; className?…`

## context-switcher

Declaration: [`context-switcher.d.ts`](./types/components/ui/context-switcher.d.ts)

- **ContextSwitcher** · function · `ContextSwitcher({ options, value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, "aria-label": ariaLabel, disabled, highlightItemOnHover, placeholder, className, ref, ...rootProps }: ContextSwitcherProps): import("react").JS…`
- **ContextSwitcherOption** · type · `ContextSwitcherOption = { value: string; label: string; description: string; icon: ReactNode; disabled?: boolean; }`
- **ContextSwitcherProps** · type · `ContextSwitcherProps = Omit<SelectPrimitive.Root.Props<string>, "children" | "items"> & { options: readonly ContextSwitcherOption[]; "aria-label": string; placeholder?: string; className?: string; ref?: SelectPrimitive.Trigger.Props["ref"]…`

## combobox

Declaration: [`combobox.d.ts`](./types/components/ui/combobox.d.ts)

- **Combobox** · function · `Combobox({ label, "aria-label": ariaLabel, description, error, placeholder, options, className, ref, ...props }: ComboboxProps): import("react").JSX.Element`
- **ComboboxOption** · type · `ComboboxOption = { label: string; value: string; description?: string; disabled?: boolean }`
- **ComboboxProps** · type · `ComboboxProps = Omit<ComboboxPrimitive.Root.Props<ComboboxOption>, "children" | "items" | "aria-label"> & { label?: string; "aria-label"?: string; description?: string; error?: string; placeholder?: string; options: readonly ComboboxOption…`

## search-input

Declaration: [`search-input.d.ts`](./types/components/ui/search-input.d.ts)

- **SearchInput** · const · `SearchInput: import("react").ForwardRefExoticComponent<Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string; loading?: boolean; onClear?: () => void; shortcut?: string; } & import("react").RefAttributes<HTMLInputElement>>`
- **SearchInputProps** · type · `SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string; loading?: boolean; onClear?: () => void; shortcut?: string; }`

## breadcrumbs

Declaration: [`breadcrumbs.d.ts`](./types/components/ui/breadcrumbs.d.ts)

- **BreadcrumbItem** · type · `BreadcrumbItem = { label: string; href?: string; icon?: ReactNode }`
- **Breadcrumbs** · function · `Breadcrumbs({ items, maxItems, label, className, ...props }: BreadcrumbsProps): import("react").JSX.Element`
- **BreadcrumbsProps** · type · `BreadcrumbsProps = ComponentPropsWithRef<"nav"> & { items: readonly BreadcrumbItem[]; maxItems?: number; label?: string }`

## pagination

Declaration: [`pagination.d.ts`](./types/components/ui/pagination.d.ts)

- **Pagination** · function · `Pagination({ page, totalPages, onPageChange, siblingCount, className, label, ...props }: PaginationProps): import("react").JSX.Element`
- **PaginationProps** · type · `PaginationProps = Omit<ComponentPropsWithRef<"nav">, "children"> & { page: number; totalPages: number; onPageChange: (page: number) => void; siblingCount?: number; className?: string; label?: string; }`

## collapsible

Declaration: [`collapsible.d.ts`](./types/components/ui/collapsible.d.ts)

- **Collapsible** · const · `Collapsible: import("react").ForwardRefExoticComponent<Omit<import("@base-ui/react").CollapsibleRootProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>`
- **CollapsibleContent** · function · `CollapsibleContent({ className, children, ...props }: CollapsibleContentProps): import("react").JSX.Element`
- **CollapsibleContentProps** · type · `CollapsibleContentProps = CollapsiblePrimitive.Panel.Props & { children?: ReactNode }`
- **CollapsibleTrigger** · function · `CollapsibleTrigger({ className, children, ...props }: CollapsiblePrimitive.Trigger.Props): import("react").JSX.Element`

## skeleton

Declaration: [`skeleton.d.ts`](./types/components/ui/skeleton.d.ts)

- **Skeleton** · function · `Skeleton({ className, width, height, radius, style, ...props }: SkeletonProps): import("react").JSX.Element`
- **SkeletonProps** · type · `SkeletonProps = ComponentPropsWithRef<"div"> & { width?: number | string; height?: number | string; radius?: "small" | "medium" | "round"; }`
- **SkeletonText** · function · `SkeletonText({ lines }: { lines?: number; }): import("react").JSX.Element`

## progress

Declaration: [`progress.d.ts`](./types/components/ui/progress.d.ts)

- **Progress** · function · `Progress({ label, "aria-label": ariaLabel, showValue, size, className, value, min, max, style, ...props }: ProgressProps): import("react").JSX.Element`
- **ProgressProps** · type · `ProgressProps = Omit<ProgressPrimitive.Root.Props, "children"> & { label?: string; "aria-label"?: string; showValue?: boolean; size?: "small" | "medium"; className?: string; }`

## spinner

Declaration: [`spinner.d.ts`](./types/components/ui/spinner.d.ts)

- **Spinner** · function · `Spinner({ className, size, label, ...props }: SpinnerProps): import("react").JSX.Element`
- **SpinnerProps** · type · `SpinnerProps = ComponentPropsWithRef<"span"> & { size?: "small" | "medium" | "large"; label?: string; }`

## alert

Declaration: [`alert.d.ts`](./types/components/ui/alert.d.ts)

- **Alert** · function · `Alert({ variant, title, icon, action, live, dismissLabel, onDismiss, className, children, role, ...props }: AlertProps): import("react").JSX.Element`
- **AlertProps** · type · `AlertProps = Omit<ComponentPropsWithRef<"div">, "title"> & { variant?: "neutral" | "critical"; title: ReactNode; icon?: ReactNode; action?: ReactNode; live?: "polite" | "assertive"; dismissLabel?: string; onDismiss?: () => void; }`

## empty-state

Declaration: [`empty-state.d.ts`](./types/components/ui/empty-state.d.ts)

- **EmptyState** · function · `EmptyState({ title, description, icon, primaryAction, secondaryAction, size, className, ...props }: EmptyStateProps): import("react").JSX.Element`
- **EmptyStateProps** · type · `EmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & { title: ReactNode; description?: ReactNode; icon?: ReactNode; primaryAction?: ReactNode; secondaryAction?: ReactNode; size?: "compact" | "default"; }`

## table

Declaration: [`table.d.ts`](./types/components/ui/table.d.ts)

- **Table** · function · `Table({ className, containerClassName, ...props }: TableProps): import("react").JSX.Element`
- **TableBody** · function · `TableBody({ className, ...props }: ComponentPropsWithRef<"tbody">): import("react").JSX.Element`
- **TableCaption** · function · `TableCaption({ className, ...props }: ComponentPropsWithRef<"caption">): import("react").JSX.Element`
- **TableCell** · function · `TableCell({ className, ...props }: ComponentPropsWithRef<"td">): import("react").JSX.Element`
- **TableFooter** · function · `TableFooter({ className, ...props }: ComponentPropsWithRef<"tfoot">): import("react").JSX.Element`
- **TableHead** · function · `TableHead({ className, scope, ...props }: ComponentPropsWithRef<"th">): import("react").JSX.Element`
- **TableHeader** · function · `TableHeader({ className, ...props }: ComponentPropsWithRef<"thead">): import("react").JSX.Element`
- **TableProps** · type · `TableProps = ComponentPropsWithRef<"table"> & { containerClassName?: string; }`
- **TableRow** · function · `TableRow({ className, ...props }: ComponentPropsWithRef<"tr">): import("react").JSX.Element`

## tree

Declaration: [`tree.d.ts`](./types/components/ui/tree.d.ts)

- **Tree** · function · `Tree({ items, className, selectionMode, ...props }: TreeProps): import("react").JSX.Element`
- **TreeNode** · type · `TreeNode = { id: Key; label: string; description?: string; icon?: ReactNode; children?: readonly TreeNode[]; disabled?: boolean; }`
- **TreeProps** · type · `TreeProps = Omit<AriaTreeProps<TreeNode>, "children" | "className" | "items"> & { items: readonly TreeNode[]; className?: string; }`
