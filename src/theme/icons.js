/**
 * SVGs exported from the Figma file ("Sin título", node 2:2).
 * Colourable icons carry the `%C%` placeholder so the tab bar / cards can tint them.
 */

export const tabHoy = `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.25 3.5H7C7.9665 3.5 8.75 4.2835 8.75 5.25V7C8.75 7.9665 7.9665 8.75 7 8.75H5.25C4.2835 8.75 3.5 7.9665 3.5 7V5.25C3.5 4.2835 4.2835 3.5 5.25 3.5Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
<path d="M14 3.5H15.75C16.7165 3.5 17.5 4.2835 17.5 5.25V7C17.5 7.9665 16.7165 8.75 15.75 8.75H14C13.0335 8.75 12.25 7.9665 12.25 7V5.25C12.25 4.2835 13.0335 3.5 14 3.5Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
<path d="M5.25 12.25H7C7.9665 12.25 8.75 13.0335 8.75 14V15.75C8.75 16.7165 7.9665 17.5 7 17.5H5.25C4.2835 17.5 3.5 16.7165 3.5 15.75V14C3.5 13.0335 4.2835 12.25 5.25 12.25Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
<path d="M14 12.25H15.75C16.7165 12.25 17.5 13.0335 17.5 14V15.75C17.5 16.7165 16.7165 17.5 15.75 17.5H14C13.0335 17.5 12.25 16.7165 12.25 15.75V14C12.25 13.0335 13.0335 12.25 14 12.25Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

export const tabProgreso = `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.5 16.625V7.875M10.5 16.625V3.5M17.5 16.625V10.5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

export const tabColeccion = `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.125 2.625H14.875V18.375L10.5 15.75L6.125 18.375V2.625Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

export const tabAjustes = `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.5 6.125H17.5M3.5 14.875H17.5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
<path d="M7.875 8.75C9.32475 8.75 10.5 7.57475 10.5 6.125C10.5 4.67525 9.32475 3.5 7.875 3.5C6.42525 3.5 5.25 4.67525 5.25 6.125C5.25 7.57475 6.42525 8.75 7.875 8.75Z" fill="#191720" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
<path d="M14 17.5C15.4497 17.5 16.625 16.3247 16.625 14.875C16.625 13.4253 15.4497 12.25 14 12.25C12.5503 12.25 11.375 13.4253 11.375 14.875C11.375 16.3247 12.5503 17.5 14 17.5Z" fill="#191720" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

/** 22x22 completed check — tinted with the habit's category colour. */
export const checkMark = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 11L9.16667 14.6667L16.5 7.33334" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

/** 27x27 delete affordance — includes its own glass circle, as exported. */
export const deleteIcon = `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="27" height="27" rx="13.5" fill="white" fill-opacity="0.035"/>
<rect x="0.5" y="0.5" width="26" height="26" rx="13" stroke="white" stroke-opacity="0.045"/>
<path d="M8.83333 10.5833H9.99999M9.99999 10.5833H11.75M9.99999 10.5833L10.5833 18.1667H16.4167L17 10.5833M11.75 10.5833H15.25M11.75 10.5833V8.83334H15.25V10.5833M15.25 10.5833H17M17 10.5833H18.1667M12.3333 12.3333V16.4167M14.6667 12.3333V16.4167" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

/** 27x27 edit (pencil) affordance — same glass circle as the delete icon. */
export const editIcon = `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="27" height="27" rx="13.5" fill="white" fill-opacity="0.035"/>
<rect x="0.5" y="0.5" width="26" height="26" rx="13" stroke="white" stroke-opacity="0.045"/>
<g transform="translate(5.1 5.1) scale(0.7)">
<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</g>
</svg>`;

/** Bell glyph only — the 46x46 glass button is drawn natively. */
export const bellGlyph = `<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.3333 29.5H24.6667M28 18.6667C28 17.3406 27.4732 16.0688 26.5355 15.1311C25.5979 14.1935 24.3261 13.6667 23 13.6667C21.6739 13.6667 20.4021 14.1935 19.4645 15.1311C18.5268 16.0688 18 17.3406 18 18.6667C18 24.5 15.5 24.5 15 26.1667H31C30.5 24.5 28 24.5 28 18.6667Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
<circle cx="31.5" cy="12.5" r="2.5" fill="#FFBF69"/>
</svg>`;

export const flameGlyph = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.125 1.875C8.125 1.875 8.75 5 6.25 6.25C6.25 6.25 5 5.625 5 4.375C2.5 6.875 1.875 9.375 3.75 11.25C4.26222 11.7456 4.87446 12.1259 5.54567 12.3655C6.21689 12.6051 6.93157 12.6984 7.64181 12.6392C8.35204 12.58 9.04142 12.3697 9.66372 12.0223C10.286 11.6749 10.8269 11.1985 11.25 10.625C12.5 7.5 10.625 5 8.125 1.875Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="%C%"/>
</svg>`;

/** Injects a colour into any icon that exposes the `%C%` placeholder. */
export function svg(xml, color) {
  return xml.split('%C%').join(color);
}
