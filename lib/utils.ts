/**
 * Lightweight classnames combiner — no external dependency.
 * Filters out falsy values so conditional classes read cleanly:
 *   cn("btn", isActive && "btn-active", className)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
  }
  
  /**
   * Builds a wa.me link from a phone number stored with a leading "+".
   */
  export function getWhatsAppLink(rawNumber: string): string {
    const digitsOnly = rawNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${digitsOnly}`;
  }
  
  /**
   * Formats a start/end year or date pair for timeline display.
   * "In Progress" / "Present" pass through unchanged.
   */
  export function formatDateRange(start: string, end: string): string {
    return `${start} — ${end}`;
  }
  
  /**
   * Turns a section id like "about" into a scroll target selector.
   */
  export function sectionId(id: string): string {
    return id.startsWith("#") ? id : `#${id}`;
  }