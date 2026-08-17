# Teum public API report

> Generated from the TypeScript compiler. Do not edit directly.

- Entry point: `src/components/ui/index.ts`
- TypeScript: `6.0.3`
- Core components: `45`
- Product components: `15`
- Public exports: `345`
- Runtime exports: `197`

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

# Product components

## data-table

Declaration: [`data-table.d.ts`](./types/components/ui/data-table.d.ts)

- **DataTable** · function · `DataTable<TData extends object>({ ariaLabel, data, columns, getRowId, getRowLabel, className, selectable, selectedRowIds, defaultSelectedRowIds, onSelectedRowIdsChange, sorting, defaultSorting, onSortingChange, manualSorting, columnVisibil…`
- **DataTableColumn** · type · `DataTableColumn = { id: string; header: ReactNode; accessor?: keyof TData | ((row: TData) => unknown); cell?: (row: TData) => ReactNode; sortable?: boolean; sortType?: "alphanumeric" | "basic" | "datetime"; hideable?: boolean; resizable?: …`
- **DataTableColumnPinning** · type · `DataTableColumnPinning = DataViewColumnPinning`
- **DataTableProps** · type · `DataTableProps = { ariaLabel: string; data: readonly TData[]; columns: readonly DataTableColumn<TData>[]; getRowId: (row: TData, index: number) => string; getRowLabel?: (row: TData) => string; className?: string; selectable?: boolean; sele…`
- **DataTableSort** · type · `DataTableSort = DataViewSort`
- **DataTableVirtualization** · type · `DataTableVirtualization = { height?: number; estimateRowHeight?: number; overscan?: number; }`
- **teumDataTableFeatures** · const · `teumDataTableFeatures: { columnSizingFeature: import("@tanstack/table-core").TableFeature; columnResizingFeature: import("@tanstack/table-core").TableFeature; columnPinningFeature: import("@tanstack/table-core").TableFeature; columnVisibil…`

## filter-builder

Declaration: [`filter-builder.d.ts`](./types/components/ui/filter-builder.d.ts)

- **DataFilter** · type · `DataFilter = DataViewFilter`
- **FilterBuilder** · function · `FilterBuilder({ fields, filters, onFiltersChange, className, label }: FilterBuilderProps): import("react").JSX.Element`
- **FilterBuilderProps** · type · `FilterBuilderProps = { fields: readonly FilterField[]; filters: readonly DataFilter[]; onFiltersChange: (filters: readonly DataFilter[]) => void; className?: string; label?: string; }`
- **FilterField** · type · `FilterField = { id: string; label: string; kind?: "option" | "text" | "number"; values?: readonly { label: string; value: string }[]; operators?: readonly FilterOperator[]; placeholder?: string; }`
- **FilterOperator** · type · `FilterOperator = DataFilterOperator`

## data-toolbar

Declaration: [`data-toolbar.d.ts`](./types/components/ui/data-toolbar.d.ts)

- **ColumnManager** · function · `ColumnManager({ columns, onVisibilityChange, onResetSizing, label }: ColumnManagerProps): import("react").JSX.Element`
- **ColumnManagerColumn** · type · `ColumnManagerColumn = { id: string; label: string; visible: boolean; required?: boolean; }`
- **ColumnManagerProps** · type · `ColumnManagerProps = { columns: readonly ColumnManagerColumn[]; onVisibilityChange: (id: string, visible: boolean) => void; onResetSizing?: () => void; label?: string; }`
- **DataToolbar** · function · `DataToolbar({ label, start, end, className, ...props }: DataToolbarProps): import("react").JSX.Element`
- **DataToolbarProps** · type · `DataToolbarProps = HTMLAttributes<HTMLDivElement> & { label: string; start?: ReactNode; end?: ReactNode; }`
- **SavedView** · type · `SavedView = { id: string; label: string; description?: string; count?: number; scope?: "system" | "personal"; }`
- **SavedViews** · function · `SavedViews({ views, value, onValueChange, onSaveCurrent, onUpdateCurrent, onDeleteCurrent, label }: SavedViewsProps): import("react").JSX.Element`
- **SavedViewsProps** · type · `SavedViewsProps = { views: readonly SavedView[]; value: string; onValueChange: (value: string) => void; onSaveCurrent?: () => void; onUpdateCurrent?: () => void; onDeleteCurrent?: () => void; label?: string; }`

## bulk-action-bar

Declaration: [`bulk-action-bar.d.ts`](./types/components/ui/bulk-action-bar.d.ts)

- **BulkActionBar** · function · `BulkActionBar({ count, noun, actions, onClear, busy, className, ...props }: BulkActionBarProps): import("react").JSX.Element | null`
- **BulkActionBarProps** · type · `BulkActionBarProps = HTMLAttributes<HTMLDivElement> & { count: number; noun?: string; actions: ReactNode; onClear: () => void; busy?: boolean; }`

## date-range-filter

Declaration: [`date-range-filter.d.ts`](./types/components/ui/date-range-filter.d.ts)

- **DateRangeFilter** · function · `DateRangeFilter({ value, onValueChange, label, presets, minValue, maxValue, disabled, }: DateRangeFilterProps): import("react").JSX.Element`
- **DateRangeFilterProps** · type · `DateRangeFilterProps = { value: DataDateRange; onValueChange: (value: DataDateRange) => void; label?: string; presets?: readonly DateRangePreset[]; minValue?: DateValue; maxValue?: DateValue; disabled?: boolean; }`
- **DateRangePreset** · type · `DateRangePreset = { id: string; label: string; getValue: () => DataDateRange; }`

## data-export-menu

Declaration: [`data-export-menu.d.ts`](./types/components/ui/data-export-menu.d.ts)

- **DataExportMenu** · function · `DataExportMenu<TData>({ rows, selectedRows, columns, fileName, label, download, disabled, onExport, }: DataExportMenuProps<TData>): import("react").JSX.Element`
- **DataExportMenuProps** · type · `DataExportMenuProps = { rows: readonly TData[]; selectedRows?: readonly TData[]; columns: readonly DataExportColumn<TData>[]; fileName: string; label?: string; download?: boolean; disabled?: boolean; onExport?: (artifact: DataExportArtifac…`

## sparkline

Declaration: [`sparkline.d.ts`](./types/components/ui/sparkline.d.ts)

- **Sparkline** · function · `Sparkline({ values, label, width, height, tone, fill, decorative, className, style, ...props }: SparklineProps): import("react").JSX.Element`
- **SparklineProps** · type · `SparklineProps = Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height" | "fill" | "values"> & { values: readonly (number | null)[]; label?: string; width?: number; height?: number; tone?: AnalyticsSeriesTone; fill?: boolean; decora…`

## metric

Declaration: [`metric.d.ts`](./types/components/ui/metric.d.ts)

- **Metric** · function · `Metric({ label, value, trend, context, visual, loading, className, ...props }: MetricProps): import("react").JSX.Element`
- **MetricProps** · type · `MetricProps = HTMLAttributes<HTMLDivElement> & { label: string; value: ReactNode; trend?: MetricTrend; context?: ReactNode; visual?: ReactNode; loading?: boolean; }`
- **MetricTrend** · type · `MetricTrend = { label: string; value?: ReactNode; direction?: "up" | "down" | "flat"; sentiment?: "positive" | "negative" | "neutral"; }`

## chart

Declaration: [`chart.d.ts`](./types/components/ui/chart.d.ts)

- **Chart** · function · `Chart({ title, description, data, series, className, height, includeZero, domain, area, annotations, valueFormatter, activeIndex, defaultActiveIndex, onActiveIndexChange, visibleSeries, defaultVisibleSeries, onVisibleSeriesChange, onDatumA…`
- **ChartAnnotation** · type · `ChartAnnotation = { id: string; index: number; label: string; tone?: "neutral" | "danger"; }`
- **ChartProps** · type · `ChartProps = { title: string; description?: string; data: readonly AnalyticsDatum[]; series: readonly AnalyticsSeries[]; className?: string; height?: number; includeZero?: boolean; domain?: readonly [number, number]; area?: boolean; annota…`

## comparison

Declaration: [`comparison.d.ts`](./types/components/ui/comparison.d.ts)

- **Comparison** · function · `Comparison({ label, current, previous, currentLabel, previousLabel, formatter, positiveDirection, className, ...props }: ComparisonProps): import("react").JSX.Element`
- **ComparisonProps** · type · `ComparisonProps = HTMLAttributes<HTMLDListElement> & { label: string; current: number; previous: number; currentLabel?: string; previousLabel?: string; formatter?: (value: number) => string; positiveDirection?: "up" | "down" | "neutral"; }`

## breakdown

Declaration: [`breakdown.d.ts`](./types/components/ui/breakdown.d.ts)

- **Breakdown** · function · `Breakdown({ label, items, formatter, max, selectedId, onSelect, className, ...props }: BreakdownProps): import("react").JSX.Element`
- **BreakdownItem** · type · `BreakdownItem = { id: string; label: string; value: number; detail?: ReactNode; tone?: "primary" | "secondary" | "tertiary"; }`
- **BreakdownProps** · type · `BreakdownProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & { label: string; items: readonly BreakdownItem[]; formatter?: (value: number, item: BreakdownItem) => string; max?: number; selectedId?: string; onSelect?: (item: Breakd…`

## goal

Declaration: [`goal.d.ts`](./types/components/ui/goal.d.ts)

- **Goal** · function · `Goal({ label, value, target, formatter, description, className, ...props }: GoalProps): import("react").JSX.Element`
- **GoalProps** · type · `GoalProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & { label: string; value: number; target: number; formatter?: (value: number) => string; description?: ReactNode; }`

## funnel

Declaration: [`funnel.d.ts`](./types/components/ui/funnel.d.ts)

- **Funnel** · function · `Funnel({ label, stages, formatter, selectedId, onSelect, className, ...props }: FunnelProps): import("react").JSX.Element`
- **FunnelProps** · type · `FunnelProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & { label: string; stages: readonly FunnelStage[]; formatter?: (value: number, stage: FunnelStage) => string; selectedId?: string; onSelect?: (stage: FunnelStage) => void; }`
- **FunnelStage** · type · `FunnelStage = { id: string; label: string; value: number; detail?: ReactNode; }`

## cohort

Declaration: [`cohort.d.ts`](./types/components/ui/cohort.d.ts)

- **Cohort** · function · `Cohort({ label, periods, rows, formatter, showSize, className, ...props }: CohortProps): import("react").JSX.Element`
- **CohortProps** · type · `CohortProps = HTMLAttributes<HTMLDivElement> & { label: string; periods: readonly string[]; rows: readonly CohortRow[]; formatter?: (value: number) => string; showSize?: boolean; }`
- **CohortRow** · type · `CohortRow = { id: string; label: string; size?: number; values: readonly (number | null)[]; }`

## timeline

Declaration: [`timeline.d.ts`](./types/components/ui/timeline.d.ts)

- **Timeline** · function · `Timeline({ label, items, activeId, onSelect, className, ...props }: TimelineProps): import("react").JSX.Element`
- **TimelineItem** · type · `TimelineItem = { id: string; label: string; timestamp: ReactNode; description?: ReactNode; value?: ReactNode; tone?: "neutral" | "accent" | "danger"; }`
- **TimelineProps** · type · `TimelineProps = Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> & { label: string; items: readonly TimelineItem[]; activeId?: string; onSelect?: (item: TimelineItem) => void; }`

# Contracts

## motion-contract

Declaration: [`motion-contract.d.ts`](./types/lib/motion-contract.d.ts)

- **teumMotionContract** · const · `teumMotionContract: { readonly version: "1.0.0"; readonly principles: readonly ["Respond at the moment of input.", "Use motion only to explain origin, continuity, state, or recovery.", "Keep repeated keyboard paths instant.", "Let interrup…`
- **TeumMotionContract** · type · `TeumMotionContract = typeof teumMotionContract`
- **TeumMotionFrequency** · type · `TeumMotionFrequency = "constant" | "frequent" | "occasional" | "rare"`
- **TeumMotionRule** · type · `TeumMotionRule = { frequency: TeumMotionFrequency; treatment: "instant" | "tonal" | "spatial" | "expressive"; rationale: string; }`

## data-view-state

Declaration: [`data-view-state.d.ts`](./types/lib/data-view-state.d.ts)

- **createBrowserDataViewLocationAdapter** · function · `createBrowserDataViewLocationAdapter(): DataViewLocationAdapter | null`
- **createBrowserDataViewStorageAdapter** · function · `createBrowserDataViewStorageAdapter(): DataViewStorageAdapter | null`
- **createDataViewState** · function · `createDataViewState(input?: DataViewStateInput): DataViewState`
- **DATA_VIEW_STATE_VERSION** · const · `DATA_VIEW_STATE_VERSION: 1`
- **DataDateRange** · type · `DataDateRange = { from: string | null; to: string | null; }`
- **DataFilterOperator** · type · `DataFilterOperator = | "is" | "is-not" | "contains" | "does-not-contain" | "greater-than" | "less-than" | "is-empty" | "is-not-empty"`
- **DataFilterValue** · type · `DataFilterValue = string | number | boolean | readonly string[] | DataDateRange | null`
- **DataRequest** · type · `DataRequest = Pick<DataViewState, "query" | "filters" | "sorting" | "pagination" | "dateRange">`
- **DataSavedView** · type · `DataSavedView = { id: string; label: string; description?: string; state: DataViewState; scope: "system" | "personal"; createdAt: string; updatedAt: string; }`
- **DataViewCodecOptions** · type · `DataViewCodecOptions = { prefix?: string; baseline?: DataViewStateInput; }`
- **DataViewColumnPinning** · type · `DataViewColumnPinning = { start: readonly string[]; end: readonly string[]; }`
- **DataViewFilter** · type · `DataViewFilter = { id: string; fieldId: string; operator: DataFilterOperator; value: DataFilterValue; }`
- **DataViewLocationAdapter** · type · `DataViewLocationAdapter = { read: () => string; write: (search: string, mode: "push" | "replace") => void; subscribe: (listener: () => void) => () => void; }`
- **DataViewPagination** · type · `DataViewPagination = { page: number; pageSize: number; }`
- **DataViewSort** · type · `DataViewSort = { id: string; direction: "asc" | "desc"; }`
- **DataViewState** · type · `DataViewState = { version: typeof DATA_VIEW_STATE_VERSION; query: string; filters: readonly DataViewFilter[]; sorting: readonly DataViewSort[]; pagination: DataViewPagination; columnVisibility: Readonly<Record<string, boolean>>; columnSizi…`
- **DataViewStateInput** · type · `DataViewStateInput = Partial<Omit<DataViewState, "version" | "pagination" | "columnPinning" | "dateRange">> & { pagination?: Partial<DataViewPagination>; columnPinning?: Partial<DataViewColumnPinning>; dateRange?: Partial<DataDateRange>; }`
- **DataViewStorageAdapter** · type · `DataViewStorageAdapter = { read: (key: string) => string | null; write: (key: string, value: string) => void; remove: (key: string) => void; }`
- **getDataRequestKey** · function · `getDataRequestKey(state: DataViewState): string`
- **mergeDataViewSearch** · function · `mergeDataViewSearch(currentSearch: string, state: DataViewState, options?: DataViewCodecOptions): string`
- **parseDataViewState** · function · `parseDataViewState(search: string, fallback?: DataViewStateInput, options?: DataViewCodecOptions): DataViewState`
- **parseSavedViews** · function · `parseSavedViews(serialized: string | null): readonly DataSavedView[]`
- **patchDataViewState** · function · `patchDataViewState(current: DataViewState, patch: DataViewStateInput, options?: { resetPage?: boolean; }): DataViewState`
- **serializeDataViewState** · function · `serializeDataViewState(state: DataViewState, options?: DataViewCodecOptions): string`
- **serializeSavedViews** · function · `serializeSavedViews(views: readonly DataSavedView[]): string`
- **toDataRequest** · function · `toDataRequest(state: DataViewState): DataRequest`
- **useDataViewState** · function · `useDataViewState({ initialState, syncToUrl, location, historyMode, parameterPrefix, onStateChange, }?: UseDataViewStateOptions): UseDataViewStateResult`
- **UseDataViewStateOptions** · type · `UseDataViewStateOptions = { initialState?: DataViewStateInput; syncToUrl?: boolean; location?: DataViewLocationAdapter | null; historyMode?: "push" | "replace"; parameterPrefix?: string; onStateChange?: (state: DataViewState) => void; }`
- **UseDataViewStateResult** · type · `UseDataViewStateResult = { state: DataViewState; setState: Dispatch<SetStateAction<DataViewState>>; patchState: (patch: DataViewStateInput, options?: { resetPage?: boolean }) => void; resetState: () => void; isHydrated: boolean; }`
- **useSavedViews** · function · `useSavedViews({ storageKey, systemViews, storage, now, createId, onStorageError, }: UseSavedViewsOptions): { views: DataSavedView[]; personalViews: readonly DataSavedView[]; isHydrated: boolean; saveView: (label: string, state: DataViewSta…`
- **UseSavedViewsOptions** · type · `UseSavedViewsOptions = { storageKey: string; systemViews?: readonly DataSavedView[]; storage?: DataViewStorageAdapter | null; now?: () => Date; createId?: () => string; onStorageError?: (error: unknown) => void; }`

## data-export

Declaration: [`data-export.d.ts`](./types/lib/data-export.d.ts)

- **buildDataExport** · function · `buildDataExport<TData>({ rows, columns, format, fileName, includeBom, }: DataExportOptions<TData>): DataExportArtifact`
- **DataExportArtifact** · type · `DataExportArtifact = { content: string; fileName: string; mimeType: string; rowCount: number; format: DataExportFormat; }`
- **DataExportColumn** · type · `DataExportColumn = { id: string; header: string; value: keyof TData | ((row: TData) => unknown); format?: (value: unknown, row: TData) => string | number | boolean | null; }`
- **DataExportFormat** · type · `DataExportFormat = "csv" | "json"`
- **DataExportOptions** · type · `DataExportOptions = { rows: readonly TData[]; columns: readonly DataExportColumn<TData>[]; format: DataExportFormat; fileName: string; includeBom?: boolean; }`
- **downloadDataExport** · function · `downloadDataExport(artifact: DataExportArtifact): void`

## teum-data-contract

Declaration: [`teum-data-contract.d.ts`](./types/lib/teum-data-contract.d.ts)

- **auditLogContract** · const · `auditLogContract: { readonly id: "audit-log"; readonly intent: "Inspect and export a large immutable event collection without rendering every row."; readonly taskSequence: readonly ["Choose a date range", "Search or filter", "Compare event…`
- **customerDirectoryContract** · const · `customerDirectoryContract: { readonly id: "customer-directory"; readonly intent: "Find and compare a server-owned customer collection without losing a shareable view."; readonly taskSequence: readonly ["Search or restore a view", "Filter r…`
- **issuesWorkspaceContract** · const · `issuesWorkspaceContract: { readonly id: "issues-workspace"; readonly intent: "Find, compare, inspect, mutate, and recover work from one shared issue collection."; readonly taskSequence: readonly ["Search or filter", "Sort and compare", "Se…`
- **TeumDataComponentContract** · type · `TeumDataComponentContract = { id: string; intent: string; useWhen: readonly string[]; avoidWhen: readonly string[]; requires: readonly string[]; states: readonly string[]; compositionRules: readonly string[]; accessibility: readonly string…`
- **teumDataComponentContracts** · const · `teumDataComponentContracts: readonly [{ readonly id: "data-table"; readonly intent: "Compare and act on structured records without hiding the underlying table semantics."; readonly useWhen: readonly ["Rows share comparable attributes.", "S…`
- **teumDataRecipeContracts** · const · `teumDataRecipeContracts: readonly [{ readonly id: "issues-workspace"; readonly intent: "Find, compare, inspect, mutate, and recover work from one shared issue collection."; readonly taskSequence: readonly ["Search or filter", "Sort and com…`
- **teumDataViewStateContract** · const · `teumDataViewStateContract: { readonly version: 1; readonly serverOwned: readonly ["query", "filters", "sorting", "pagination", "dateRange"]; readonly viewOwned: readonly ["columnVisibility", "columnSizing", "columnPinning", "viewId"]; read…`

## analytics

Declaration: [`analytics.d.ts`](./types/lib/analytics.d.ts)

- **AnalyticsDatum** · type · `AnalyticsDatum = { id: string; label: string; values: Readonly<Record<string, AnalyticsValue>>; }`
- **AnalyticsDomainOptions** · type · `AnalyticsDomainOptions = { includeZero?: boolean; paddingRatio?: number; domain?: readonly [number, number]; }`
- **AnalyticsPlotBox** · type · `AnalyticsPlotBox = { width: number; height: number; left: number; right: number; top: number; bottom: number; }`
- **AnalyticsPointPosition** · type · `AnalyticsPointPosition = { x: number; y: number; value: number; }`
- **AnalyticsSeries** · type · `AnalyticsSeries = { id: string; label: string; tone?: AnalyticsSeriesTone; lineStyle?: "solid" | "dashed" | "dotted"; }`
- **AnalyticsSeriesTone** · type · `AnalyticsSeriesTone = "primary" | "secondary" | "tertiary"`
- **AnalyticsValue** · type · `AnalyticsValue = number | null`
- **clampAnalyticsIndex** · function · `clampAnalyticsIndex(index: number | null | undefined, length: number): number | null`
- **createAnalyticsAreaPath** · function · `createAnalyticsAreaPath(data: readonly AnalyticsDatum[], seriesId: string, domain: readonly [number, number], box: AnalyticsPlotBox): string`
- **createAnalyticsPath** · function · `createAnalyticsPath(data: readonly AnalyticsDatum[], seriesId: string, domain: readonly [number, number], box: AnalyticsPlotBox): string`
- **createAnalyticsTicks** · function · `createAnalyticsTicks(domain: readonly [number, number], tickCount?: number): readonly number[]`
- **describeAnalyticsDatum** · function · `describeAnalyticsDatum(datum: AnalyticsDatum, series: readonly AnalyticsSeries[], valueFormatter?: (value: number, series: AnalyticsSeries) => string): string`
- **formatAnalyticsValue** · function · `formatAnalyticsValue(value: number, options?: Intl.NumberFormatOptions): string`
- **getAnalyticsDomain** · function · `getAnalyticsDomain(data: readonly AnalyticsDatum[], seriesIds: readonly string[], { includeZero, paddingRatio, domain }?: AnalyticsDomainOptions): readonly [number, number]`
- **getAnalyticsPointPosition** · function · `getAnalyticsPointPosition(data: readonly AnalyticsDatum[], index: number, seriesId: string, domain: readonly [number, number], box: AnalyticsPlotBox): AnalyticsPointPosition | null`
- **getPercentChange** · function · `getPercentChange(current: number, previous: number): number | null`
- **summarizeAnalyticsSeries** · function · `summarizeAnalyticsSeries(data: readonly AnalyticsDatum[], series: AnalyticsSeries, valueFormatter?: (value: number, series: AnalyticsSeries) => string): string`

## teum-analytics-contract

Declaration: [`teum-analytics-contract.d.ts`](./types/lib/teum-analytics-contract.d.ts)

- **TeumAnalyticsComponentContract** · type · `TeumAnalyticsComponentContract = { id: string; intent: string; useWhen: readonly string[]; avoidWhen: readonly string[]; requires: readonly string[]; states: readonly string[]; compatibleWith: readonly string[]; dataSchema: string; interac…`
- **teumAnalyticsComponentContracts** · const · `teumAnalyticsComponentContracts: readonly [{ readonly id: "metric"; readonly intent: "State one important value, its direction, and comparison context without turning a dashboard into a card grid."; readonly useWhen: readonly ["One value c…`
- **teumAnalyticsRecipeContracts** · const · `teumAnalyticsRecipeContracts: readonly [{ readonly id: "saas-overview"; readonly intent: "Review recurring revenue, growth, target progress, and expansion drivers from one calm overview."; readonly taskSequence: readonly ["Choose range", "…`
- **teumAnalyticsStateContract** · const · `teumAnalyticsStateContract: { readonly version: 1; readonly controlled: readonly ["date range", "comparison period", "visible series", "active datum", "selected segment"]; readonly derived: readonly ["domain", "ticks", "percent change", "c…`

## teum-product-patterns-contract

Declaration: [`teum-product-patterns-contract.d.ts`](./types/lib/teum-product-patterns-contract.d.ts)

- **billingUsageContract** · const · `billingUsageContract: { readonly id: "billing-usage"; readonly intent: "Compare plan usage, limits, and invoices before changing a subscription or exporting a receipt."; readonly roles: readonly ["Workspace owner", "Billing admin", "Financ…`
- **customerWorkspaceContract** · const · `customerWorkspaceContract: { readonly id: "customer-workspace"; readonly intent: "Find an account, inspect its health and activity, then complete a follow-up without losing the customer list."; readonly roles: readonly ["Customer success",…`
- **membersPermissionsContract** · const · `membersPermissionsContract: { readonly id: "members-permissions"; readonly intent: "Invite people, change roles, and audit permission boundaries without separating membership from access policy."; readonly roles: readonly ["Workspace owner…`
- **TeumProductPatternContract** · type · `TeumProductPatternContract = { id: string; intent: string; roles: readonly string[]; taskSequence: readonly string[]; components: readonly string[]; stateOwnership: { shareable: readonly string[]; persisted: readonly string[]; transient: r…`
- **teumProductPatternContracts** · const · `teumProductPatternContracts: readonly [{ readonly id: "customer-workspace"; readonly intent: "Find an account, inspect its health and activity, then complete a follow-up without losing the customer list."; readonly roles: readonly ["Custom…`
- **teumProductPatternSystemContract** · const · `teumProductPatternSystemContract: { readonly version: 1; readonly layers: readonly ["Core controls", "Data state", "Analytics context", "Product task"]; readonly rules: readonly ["Patterns compose public Teum components and keep product st…`

## teum-agent-contract

Declaration: [`teum-agent-contract.d.ts`](./types/lib/teum-agent-contract.d.ts)

- **selectTeumRecipe** · function · `selectTeumRecipe(task: string): TeumAgentPlan | null`
- **teumAgentForbiddenRules** · const · `teumAgentForbiddenRules: readonly ["Do not invent undocumented props, exports, registry items, or private CSS selectors.", "Do not merge components because their closed shapes look similar; preserve task, focus, and recovery boundaries.", …`
- **TeumAgentPlan** · type · `TeumAgentPlan = { recipe: TeumAgentRecipeContract; score: number; matchedSignals: readonly string[]; }`
- **TeumAgentRecipeContract** · type · `TeumAgentRecipeContract = { id: TeumAgentRecipeId; title: string; domain: "data" | "analytics" | "product"; intent: string; signals: readonly string[]; registryItem: "teum-data" | "teum-analytics" | "teum-product-patterns"; modulePath: str…`
- **teumAgentRecipeContracts** · const · `teumAgentRecipeContracts: readonly [{ readonly id: "issues-workspace"; readonly title: "Issues Workspace"; readonly domain: "data"; readonly intent: "Triage, inspect, mutate, and recover issue work from one shared collection."; readonly si…`
- **TeumAgentRecipeId** · type · `TeumAgentRecipeId = | "issues-workspace" | "customer-directory" | "audit-log" | "saas-overview" | "product-usage" | "conversion-retention" | "customer-workspace" | "billing-usage" | "members-permissions"`
- **TeumAgentSelectionRule** · type · `TeumAgentSelectionRule = { task: string; choose: string; insteadOf: readonly string[]; when: readonly string[]; rejectWhen: readonly string[]; }`
- **teumAgentSelectionRules** · const · `teumAgentSelectionRules: readonly [{ readonly task: "Choose one submitted value"; readonly choose: "Select"; readonly insteadOf: readonly ["Combobox", "ContextSwitcher"]; readonly when: readonly ["The values are short and predefined."]; re…`
- **teumAgentSystemContract** · const · `teumAgentSystemContract: { readonly schemaVersion: 1; readonly product: "Teum"; readonly principles: readonly ["stable geometry", "shared origin", "reversible completion"]; readonly workflow: readonly ["inspect project", "classify task", "…`
