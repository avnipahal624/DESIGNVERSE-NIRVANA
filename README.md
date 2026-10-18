# DesignVerse --- The Impossible Edition

An experimental website concept for **DesignVerse: A Student Design &
Innovation Fest**. The experience combines high-fashion editorial art
direction, a monumental sculptural book, and oversized interactive
typography.

The goal is to make the website feel like entering a physical art
installation---not a conventional event landing page.

> **Project status:** Creative/implementation brief. Update this README
> to reflect the actual code and tested features as development
> progresses. Do not claim features are implemented until they have been
> tested in the running project.

## Concept

**A monumental sculptural book × typography that escapes the page × an
immersive editorial universe.**

The visual language combines cinematic architecture, dramatic lighting,
tactile paper and fabric, oversized serif typography, and restrained
editorial layouts. Visitors move through a series of chapters
introducing the event, its experiences, programme, practical details,
and registration.

## Visual direction

### Palette

  Purpose          Colour                Hex
  ---------------- --------------------- -----------
  Primary dark     Ink black             `#11100F`
  Primary light    Warm ivory            `#F2EDE3`
  Accent           Deep oxblood          `#651D2B`
  Neutral          Architectural stone   `#B7AA96`
  Neutral          Muted silver          `#B9B5AE`
  Secondary dark   Charcoal              `#292725`

### Typography

-   **Display:** Bodoni Moda, Cormorant Garamond, or another
    high-contrast editorial serif.
-   **Interface:** Inter or Helvetica Neue.
-   Use dramatic scale contrast, intentional cropping, generous negative
    space, and clear functional labels.

Avoid neon gradients, generic SaaS layouts, repetitive rounded cards,
decorative 3D objects without a purpose, and motion that makes the site
difficult to use.

## Website chapters

1.  **The Manifesto** --- "A New Way to See"
2.  **The Creative Process** --- "Where Ideas Take Form"
3.  **The Experience** --- possible activities such as Design Sprint,
    Build Lab, and Idea Arena
4.  **The Programme** --- an accessible, editable schedule
5.  **Event Details** --- date, time, venue, organiser, eligibility, and
    visitor information
6.  **Registration** --- a clear, validated registration form

Event activities are provisional concepts. Replace them with the
confirmed programme. Keep unconfirmed event details as placeholders
rather than inventing information.

## Signature interactions

-   A monumental book as the central visual object.
-   A cover-opening interaction with convincing depth and page
    thickness.
-   Large typography that changes composition as the visitor scrolls.
-   Carefully controlled pointer parallax on supported devices.
-   Editorial photographs revealed through negative space and
    letterforms.
-   Distinct visual treatments for each chapter.

The 3D and scroll-driven effects should enhance the content, not
obstruct it. Keep normal scrolling usable and provide alternatives for
touchscreens and reduced-motion preferences.

## Suggested technology

Use this as the intended stack; adjust it to match the actual
implementation.

-   React
-   TypeScript
-   Vite
-   Three.js with React Three Fiber and Drei for 3D scenes
-   GSAP with ScrollTrigger, or an equivalent scroll-animation system
-   Framer Motion for interface transitions
-   CSS for layout, typography, textures, and responsive styling
-   Lucide icons where needed

## Getting started

These steps assume the project uses **Node.js, npm, and Vite**. Adapt
them if the repository uses a different setup.

### Prerequisites

-   A current LTS version of Node.js
-   npm
-   Git (optional, for version control)

### Install dependencies

``` bash
npm install
```

### Start the development server

``` bash
npm run dev
```

Open the local URL printed in the terminal by Vite.

### Create a production build

``` bash
npm run build
```

### Preview the production build

``` bash
npm run preview
```

Check `package.json` for the scripts actually available in the
repository.

## Suggested project structure

A possible structure for the implementation:

``` text
designverse/
├── public/
│   ├── images/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── SculpturalBook.tsx
│   │   ├── TypographyScene.tsx
│   │   ├── ChapterSection.tsx
│   │   └── RegistrationForm.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Manifesto.tsx
│   │   ├── CreativeProcess.tsx
│   │   ├── Experience.tsx
│   │   ├── Programme.tsx
│   │   ├── EventDetails.tsx
│   │   └── Registration.tsx
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

This is a suggested structure, not a claim about the current repository.

## Event content to confirm

Before launch, replace placeholders with verified information:

-   [ ] Event date and time
-   [ ] Venue and address
-   [ ] Organising team or institution
-   [ ] Confirmed activities and schedule
-   [ ] Eligibility and registration requirements
-   [ ] Contact email or other official contact channel
-   [ ] Privacy notice and consent language, if collecting personal data

## Registration and data handling

A form that only runs in the browser does **not** store or submit
registrations by itself.

Before accepting real registrations:

1.  Connect the form to an approved backend or registration service.
2.  Validate inputs on both the client and server.
3.  Show accurate success and failure messages.
4.  Explain how submitted information will be used.
5.  Avoid collecting unnecessary personal data.
6.  Never expose API secrets or private credentials in frontend code.

If no backend is configured, label the form clearly as a demo and do not
show a false success state.

## Accessibility and responsive behaviour

-   Support keyboard navigation and visible focus states.
-   Give form fields persistent, accessible labels.
-   Maintain readable contrast and sensible text sizes.
-   Respect `prefers-reduced-motion`.
-   Provide touch-friendly interactions on mobile.
-   Simplify or replace WebGL effects on low-powered devices.
-   Include a usable fallback when WebGL or 3D assets fail to load.
-   Keep navigation and event information accessible without completing
    animations.

## Performance checklist

-   Optimise and appropriately size images.
-   Lazy-load below-the-fold photography and nonessential 3D assets.
-   Avoid unnecessary render loops and expensive post-processing.
-   Pause or reduce nonessential animation when the page is not visible.
-   Test on a mid-range laptop and a real mobile device.
-   Check loading, error, and fallback states.

## Testing checklist

Before calling the site complete, verify:

-   [ ] The project installs and starts successfully.
-   [ ] The production build completes without errors.
-   [ ] Navigation links reach the correct sections.
-   [ ] The book-opening interaction works with pointer, keyboard, and
    touch where applicable.
-   [ ] Scroll animations do not trap or block normal scrolling.
-   [ ] The layout works at desktop, tablet, and mobile widths.
-   [ ] Reduced-motion preferences are respected.
-   [ ] Registration validation and submission states behave honestly.
-   [ ] No unconfirmed event facts, fake testimonials, or invented
    partners appear.
-   [ ] The site remains usable if 3D rendering is unavailable.

## Contributing

For a team project:

1.  Create a branch for your change.
2.  Keep components focused and reusable.
3.  Test the affected interactions and responsive layouts.
4.  Update this README when setup steps, scripts, or implemented
    features change.
5.  Open a pull request describing the change and how it was tested.

## License

Add the project's chosen license before public distribution. Do not
assume that third-party fonts, photography, textures, or other assets
are free for unrestricted use; verify their licences and attribution
requirements.

------------------------------------------------------------------------

**Design principle:** Make visitors remember the opening, the movement
of the letters, and the feeling of entering DesignVerse---not merely
that the website had animations.
