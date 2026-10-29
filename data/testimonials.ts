// Testimonials. Intentionally empty: nothing is shown, and nothing is ever invented.
// The Testimonials component renders nothing while this list is empty. To add one,
// append a real quote that the person has approved, for example:
//   { quote: "…", name: "…", role: "…", organization: "…" }
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  organization: string;
}

export const testimonials: Testimonial[] = [];
