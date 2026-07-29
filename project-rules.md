# Project Rules

All future Cursor work in this repository must follow `project-rules.md`.

## Technical Stack

- Use Next.js with the App Router.
- Use TypeScript with strict mode enabled.
- Use Tailwind CSS for minimal utility styling.
- Use Server Components by default.
- Use Client Components only when interactivity, browser APIs, or client state require them.
- Use the Next.js Metadata API for page metadata.
- Use `next/image` for product, collection, and editorial imagery.
- Use ESLint and keep lint/build errors fixed.

## Folder Conventions

- `src/app`: App Router routes, route groups, route layouts, metadata files, `robots.ts`, and `sitemap.ts`.
- `src/components/ui`: Reusable presentational primitives.
- `src/components/layout`: Shared site layout components.
- `src/components/navigation`: Shared navigation components and isolated navigation interactivity.
- `src/components/ecommerce`: Product, collection, and ecommerce-specific UI components.
- `src/components/collections`: Modular collection page section components.
- `src/components/blog`: Blog article UI components.
- `src/components/guides`: Guide-specific UI components.
- `src/components/home`: Modular homepage section components.
- `src/lib/data`: Data-access modules that can later swap mock data for Supabase calls.
- `src/lib/seo`: Metadata, canonical URL, breadcrumbs, and structured data utilities.
- `src/lib/utils`: Small generic helper functions.
- `src/types`: Shared TypeScript domain types and unions.
- `src/constants`: Site-wide constants and route definitions.
- `src/mock`: Small neutral mock data only.
- `public`: Static assets that are safe to serve publicly.

## File Naming Conventions

- Use PascalCase for React component files.
- Use kebab-case or descriptive lowercase names for route segments.
- Use lowercase utility and data module filenames.
- Keep one primary component, utility, or data-access concern per file.
- Avoid large monolithic files.

## Component Rules

- Prefer small, reusable components with typed props.
- Keep components semantic and accessible.
- Avoid final visual identity decisions during foundation work.
- Do not add animations unless explicitly approved in a later phase.
- Do not add cart, checkout, filters, search, authentication, or admin UI in this phase.

## Server And Client Component Rules

- Components are Server Components unless a `"use client"` directive is required.
- Do not add Client Components for static rendering.
- Keep data fetching in server-side data-access modules or route-level server code.
- Isolate future client interactivity behind small client components.
- Keep mobile navigation state isolated in the smallest possible Client Component.

## TypeScript Rules

- Keep `strict` TypeScript enabled.
- Use explicit domain types and unions for ecommerce and publishing concepts.
- Avoid `any`; use narrow types or `unknown` with validation when needed.
- Keep imports clean and use the `@/*` alias for source imports.

## SEO Rules

- Every public route should define appropriate metadata.
- Use the root metadata title template and default description.
- Use canonical URLs through the SEO URL helper.
- Keep sitemap entries limited to known routes until dynamic data is connected.
- Do not invent organization, product, review, or policy schema values.
- Add structured data only when the underlying real content exists.
- Preserve clear internal linking paths between shop, collections, products, guides, and blog content.

## Accessibility Rules

- Use semantic HTML landmarks and headings.
- Each page must have one clear `h1`.
- Navigation must have accessible labels.
- Images must include meaningful alt text or be omitted when decorative.
- Interactive controls must be keyboard-accessible.

## Performance Rules

- Prefer Server Components and static rendering where possible.
- Use `next/image` for content images.
- Avoid unnecessary dependencies.
- Avoid large client bundles and broad client state.
- Do not add expensive runtime work to shared layouts.

## Reusability Rules

- Avoid duplicated page scaffolding by using shared layout and placeholder primitives.
- Keep global navigation data centralized in `src/constants/navigation.ts`.
- Do not duplicate shared navigation links inside Header, Footer, or mobile navigation components.
- Page routes should compose reusable section components instead of containing large page layouts.
- Homepage ecommerce and editorial sections must receive data from data-access modules.
- Add abstractions only when they reduce real duplication or clarify ownership.
- Keep ecommerce, editorial, SEO, and utility concerns separated.

## Data-Access Rules

- Route components should call data-access modules instead of importing mock data directly.
- Mock data must remain small, neutral, and clearly temporary.
- Do not connect Supabase or any database until the backend integration phase.
- Future Supabase integration should preserve existing domain types where practical.
- Data-access modules should be the boundary for future caching, preview, and publishing logic.

## Prohibited Practices

- Do not add unnecessary libraries.
- Do not add a CMS in this phase.
- Do not connect a database in this phase.
- Do not create checkout, payment, cart state, authentication, filters, search, or admin dashboards in this phase.
- Do not use real luxury brand names, copyrighted assets, or misleading product claims in mock data.
- Do not create final homepage design, colors, fonts, visual identity, or animations in this phase.
- Do not hardcode fake company, legal, organization, or policy claims.

## Future Backend Integration Principles

- Add Supabase through dedicated server-side data-access modules.
- Keep public route contracts stable when switching from mocks to real data.
- Use typed mapping functions between backend records and domain types.
- Add schema markup only from verified real product, organization, article, and policy data.
- Plan admin publishing around draft, published, and archived states.
- Keep checkout, cart, and payment logic isolated from catalog and editorial foundations.
