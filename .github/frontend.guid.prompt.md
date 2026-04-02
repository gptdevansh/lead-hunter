> **Act as a Senior Frontend Architect and Elite UI/UX Designer.** Read the following design system and architecture guidelines and use them strictly for all future code generation.

# 🎯 Frontend Design System & Philosophy (Premium SaaS UI)

## 🧠 Overview

This document defines the **design philosophy and UI/UX principles** for our product.

Our goal is to build a **premium, mature, and professional SaaS interface** tailored for:

* Founders
* Executives
* Decision-makers
* Apple ecosystem users (Mac, iPhone, iPad)

> The product should feel **calm, intelligent, and trustworthy** — never flashy or cluttered.

---

# 🧠 1. Core Philosophy

### Guiding Principles

* **Clarity over complexity**
* **Consistency over creativity**
* **Subtlety over loudness**
* **Function over decoration**

### Product Feel

> “This product is reliable, intelligent, and built for serious work.”

---

# 💭 2. Emotional Design

The UI should evoke:

* 🧘 Calm → reduce cognitive load
* 🧠 Control → user feels in charge
* ⚡ Speed → fast interactions
* 🤝 Trust → critical for automation tools

---

# 🎨 3. Color System

## Light Theme (Primary)

### Base Colors

* Background: `#F8FAFC`
* Surface: `#FFFFFF`
* Layer: `#F1F5F9`

### Text Colors

* Primary: `#0F172A`
* Secondary: `#475569`
* Muted: `#94A3B8`

### Accent Colors

* Primary Accent (Indigo): `#4F46E5`
* Hover: `#4338CA`
* Success (Green): `#10B981`

---

## Design Rules

* Avoid pure white overload
* Maintain subtle contrast between layers
* Limit color palette (max 3–4 primary tones)

---

# 🧱 4. Layout & Spacing

## Layout Structure

* Left Sidebar (minimal navigation)
* Top Bar (clean, low density)
* Main Content (card/grid-based)

## Spacing System

* Section spacing: `32px–48px`
* Card padding: `16px–24px`
* Element spacing: consistent scale (8px grid)

> White space is intentional and critical for premium feel.

---

# 🔘 5. Buttons

## Primary Button

* Background: Indigo
* Radius: `12px`
* Font weight: 500–600

Examples:

* “Start Campaign”
* “Generate Leads”

## Secondary Button

* Light background
* Subtle border
* Minimal hover effect

## Interaction

* Hover → slight elevation/glow
* Click → scale down (0.98)

## Rules

* Maximum 1 primary action per section
* Buttons = actions, not decoration

---

# 📐 6. Borders & Edges

## Border Radius System

* Cards: `12px–16px`
* Buttons: `10px–14px`
* Inputs: `8px–10px`

## Philosophy

* Slight rounding = modern
* Over-rounding = childish

---

# 🧱 7. Surfaces & Depth

## Approach

Use **layered surfaces instead of heavy borders**

### Example

* Soft shadows
* Minimal borders
* Floating card feel

```css
box-shadow: 0 1px 2px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.06);
border-radius: 14px;
```

---

# 🔤 8. Typography

## Font

* Primary: **Inter**

## Rules

* Headings: 600 weight
* Body: 400–500
* Letter spacing: ~0.2px

## Philosophy

* Clean
* Readable
* No decorative fonts

---

# 🍎 9. Icons

## Style

* Outline icons
* Thin stroke
* Minimalistic

## Libraries

* Lucide (preferred)
* Heroicons

## Rules

* Consistent sizing
* No mixed styles
* No filled + outline mix

---

# ✨ 10. Motion & Interaction

## Animation Style

* Duration: 200–300ms
* Easing: ease-in-out

## Effects

* Hover → lift
* Click → press
* Modal → fade + scale
* Page → smooth transition

## Avoid

* Bouncing animations
* Flashy transitions

---

# 📱 11. Responsiveness

## Devices

* Mac (primary)
* iPhone
* iPad

## Rules

* Touch-friendly spacing
* No cramped UI
* Tablet = desktop-lite experience

---

# ⚙️ 12. Tech Stack

## Core

* Next.js 
* Tailwind CSS
* TypeScript

## UI System

* ShadCN UI

## Animation

* Framer Motion

## Icons

* Lucide

---

# 🧠 13. Design Principles Checklist

Before shipping any UI, verify:

* [ ] Is it clean and uncluttered?
* [ ] Is spacing consistent?
* [ ] Is there only one primary action?
* [ ] Does it feel calm (not loud)?
* [ ] Are colors minimal and consistent?
* [ ] Does it feel fast and smooth?
* [ ] Would a CEO trust this UI?

---

# 🚫 14. Anti-Patterns (Avoid These)

* Too many colors
* Inconsistent spacing
* Overuse of shadows
* Heavy borders
* Flashy gradients
* Random animations
* Cheap icon styles

---

# 🧠 Final Principle

> “Remove everything that does not improve clarity.”

---

# 🚀 Goal

Build a frontend that feels like:

> **Apple × Stripe × Linear**

* Premium
* Professional
* Fast
* Trustworthy

---

## ✅ This document is the single source of truth

All design and frontend decisions must align with this system.
