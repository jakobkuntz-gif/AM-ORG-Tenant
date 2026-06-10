# AM Icons

Source: `Guidelines/DesignGuides/Icons` — catalogue of icon systems currently used in the app. There are four; know which to use where.

## 1. App SVG icons (`Icons.tsx`) — repo only

`<Icon name="..." size={28} />` from `@/components/ui/icons/DotsIcon`. Names: `chat`, `send-arrow`, `error`, `search`, `filter`, `arrow-up`, `arrow-down`, `chevron-left`, `chevron-right`, `check`. Helper components: `DotsIcon`, `EditIcon`, `DeleteIcon` (same module, `size` prop).

## 2. Fontello classes (`icons-*`) — repo only

`<i className="icons icons-icon-edit" aria-hidden />`. Available: icons-attention, icons-cancel-circled, icons-crown, icons-down-open, icons-icon-cog, icons-icon-edit, icons-icon-home, icons-icon-import, icons-icon-message, icons-icon-phone, icons-icon-plus-circle, icons-icon-trash, icons-icon-user, icons-icon-user-o, icons-key, icons-lock, icons-ok, icons-ok-circled, icons-right-open, icons-sort, icons-sort-alt-down, icons-sort-alt-up, icons-sort-name-down, icons-sort-name-up, icons-user.

## 3. Image background classes (`icon-*`) — repo only

Fixed-size background-image divs: icon-check (20×20), icon-close (20×20), icon-close-orange, icon-close-pink, icon-email (38×38), icon-external-link (16×16), icon-lock (10×14).

## 4. FontAwesome — repo and standalone

Used in the app via `@fortawesome/react-fontawesome` (free-solid): faEnvelope, faUsers, faBullseye, faClipboardList, faChartLine, faFolderOpen, faPhoneVolume, faPlug — plus toast icons faCircleCheck, faCircleExclamation, faCircleInfo, faTriangleExclamation, faXmark.

## Standalone mockups

Use FontAwesome as the lingua franca — either the CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`, e.g. `<i class="fa-solid fa-circle-check"></i>`) or inline SVGs / lucide-react in React artifacts. Pick icons matching the semantic roles above (envelope for email, phone-volume for calls, magnifying glass for search, pen for edit, trash for delete). Icon color follows the context color (blue for interactive, variant color in toasts).
