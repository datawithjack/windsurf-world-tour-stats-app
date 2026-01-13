# WWWTS Design System

Complete style guide and component library for the Windsurf World Tour Stats application.

---

## 🎯 Design Principles

### Show, Don't Tell (Apple Approach)

The interface should be self-explanatory through visual design rather than explicit labels. Let the UI communicate through layout, hierarchy, and intuitive controls.

**Core Philosophy:**
- Remove unnecessary instructional text
- Let visual hierarchy guide the user
- Make controls obvious through design, not labels
- Trust users to understand intuitive UI patterns

#### Examples

**✅ DO - Show through design:**
```jsx
// Filter dropdowns positioned top-right without label
<div className="flex items-center gap-3">
  <select>
    <option value="all">All Years</option>
    <option value="2025">2025</option>
  </select>
  <select>
    <option value="wave">Wave</option>
  </select>
</div>
```

**❌ DON'T - Tell with labels:**
```jsx
// Cluttered with unnecessary label text
<div className="flex items-center gap-4">
  <label>Filter by:</label>
  <label>Year:</label>
  <select>...</select>
  <label>Event Type:</label>
  <select>...</select>
</div>
```

#### When to Apply

**Remove labels when:**
- UI pattern is universally understood (dropdowns, search boxes, toggles)
- Visual positioning makes purpose clear (filters in top-right, search in header)
- Control has self-describing options (dropdown shows "All Years" as first option)
- Icon + placeholder text is sufficient context

**Keep labels when:**
- Form inputs require specific data (email, password, custom fields)
- Accessibility requires explicit labeling (use aria-label if hiding visual label)
- Control purpose isn't obvious from context alone
- Legal/compliance requires explicit instruction

#### Real-World Application

**Events Page Filters:**
- **Before:** "Filter by: Year: [dropdown] Event Type: [dropdown]"
- **After:** Two dropdowns positioned top-right, options are self-describing
- **Rationale:** Position (top-right) + dropdown content (All Years, Wave) communicates purpose

**Search Inputs:**
- **Before:** "Search for events" label above input
- **After:** Placeholder text "Search events..." inside input with search icon
- **Rationale:** Icon + placeholder provides sufficient context

#### Implementation Checklist

When designing UI controls:
- [ ] Can positioning replace a label? (top-right = filters, top-left = navigation)
- [ ] Do dropdown options explain the purpose? ("All Years" vs "Select...")
- [ ] Does an icon make the action clear? (magnifying glass = search)
- [ ] Is placeholder text sufficient? (vs external label)
- [ ] Would removing the label create confusion? (keep it if yes)
- [ ] Is the control standard/universal? (hamburger menu, shopping cart)

#### Accessibility Considerations

Always include accessibility labels even when hiding visual labels:

```jsx
<select
  aria-label="Filter events by year"
  className="..."
>
  <option value="all">All Years</option>
</select>
```

**Remember:** Show don't tell applies to *visual* design. Accessibility labels are essential for screen readers.

---

### Remove Until You Can't Remove Anymore

The interface should contain only essential elements. Every visual component, border, label, or decoration must justify its existence through function, not tradition.

**Core Philosophy:**
- Start with the minimum viable design
- Add elements only when they solve a specific problem
- Question every border, box, label, and decoration
- Trust that simplicity creates clarity

#### Examples

**✅ DO - Minimal essential design:**
```jsx
// Head-to-Head athlete cards - Image borders and colored names
<div className="flex flex-col items-center gap-3">
  <img
    src={athlete.image}
    alt={athlete.name}
    className="w-28 h-28 rounded-lg border-4 border-cyan-400"
  />
  <h3 className="text-xl font-bold text-cyan-400">{athlete.name}</h3>
  <p className="text-sm text-gray-400">{athlete.nationality}</p>
</div>
```

**❌ DON'T - Over-designed with redundant elements:**
```jsx
// Unnecessary boxes, accent bars, and explicit labels
<div className="bg-slate-800/40 border-2 border-cyan-400/50 rounded-lg p-6 relative">
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400"></div>
  <div className="flex flex-col items-center gap-3">
    <div className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/50 rounded-full">
      <span className="text-xs font-bold text-cyan-400">CYAN</span>
    </div>
    <img
      src={athlete.image}
      className="w-24 h-24 rounded-lg border-2 border-cyan-400/50 ring-2 ring-cyan-400/20"
    />
    <h3 className="text-lg font-bold text-white">{athlete.name}</h3>
    <p className="text-sm text-gray-400">{athlete.nationality}</p>
  </div>
</div>
```

#### When to Apply

**Remove elements when:**
- They duplicate information already conveyed visually
- They're decorative without functional purpose
- A thicker border achieves the same as a full container
- Color alone can establish identity (no need for "Cyan" label)
- Users can infer the information from context

**Keep elements when:**
- They provide unique, essential information
- They establish critical visual hierarchy
- Removing them creates ambiguity or confusion
- They serve accessibility purposes
- They're the simplest solution to the problem

#### Real-World Application

**Head-to-Head Comparison:**
- **Before:** Large card boxes around athletes, accent bars, "Cyan"/"Green" text labels, multiple borders
- **After:** Thick colored borders (4px) on images, names colored cyan/teal, no container boxes
- **Rationale:** Border color + name color establishes identity without boxes or labels
- **Result:** Cleaner, more focused on the athletes themselves

**Stat Comparison Bars:**
- **Before:** Bars with full name labels underneath
- **After:** Surname on bar, value on right, no redundant label
- **Rationale:** Name appears on bar, no need to repeat it below

#### The Removal Process

When designing UI, follow this sequence:

1. **Build the minimum** - Start with only essential information
2. **Test for clarity** - Can users understand it?
3. **Add only if needed** - If confusion exists, add the smallest solution
4. **Remove the addition** - After adding, try removing it again
5. **Repeat** - Keep questioning every element

#### Implementation Checklist

When reviewing designs:
- [ ] Can this box be removed? (Use borders/spacing instead)
- [ ] Can this label be removed? (Is it visually obvious?)
- [ ] Can this decoration be removed? (Does it serve function?)
- [ ] Can this border be simplified? (Single border vs multiple layers)
- [ ] Can color replace explicit labeling? (Cyan name vs "Cyan" badge)
- [ ] Can thickness replace complexity? (4px border vs border + ring + background)
- [ ] Does every element justify its pixels?

#### Balancing Minimalism and Clarity

**Minimalism doesn't mean:**
- Removing essential information
- Creating confusion through oversimplification
- Sacrificing usability for aesthetics
- Hiding important context

**Minimalism does mean:**
- Every element has a clear purpose
- Visual noise is eliminated
- Users focus on content, not chrome
- Simple solutions are preferred over complex ones

#### Accessibility Considerations

Minimalism in visual design should never compromise accessibility:

```jsx
// Visual minimalism with accessibility maintained
<img
  src={athlete.image}
  alt={`${athlete.name} - Cyan team`}
  className="w-28 h-28 rounded-lg border-4 border-cyan-400"
  aria-label={`${athlete.name}, ${athlete.nationality}, representing Cyan team`}
/>
```

**Remember:** Remove visual redundancy, not semantic information. Screen readers still need full context.

#### Design Philosophy

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry

Applied to UI design:
- Every pixel should earn its place
- Simplicity creates focus
- Clarity through reduction, not addition
- Trust users to understand simple, well-designed interfaces

---

## 🎨 Brand Colors

### Primary Palette
- **Background**: `#0A0E1A` - Deep navy/black
- **Accent Primary**: `#38bdf8` (cyan-400) - Bright cyan for highlights and primary athlete
- **Accent Secondary**: `#2dd4bf` (teal-400) - Teal for secondary athlete comparisons
- **Accent Bright**: `#0ea5e9` (cyan-500) - Brighter cyan for active states

### Comparison Colors
For head-to-head athlete comparisons, use:
- **Athlete 1**: Cyan (`#38bdf8`, cyan-400)
- **Athlete 2**: Teal (`#2dd4bf`, teal-400)

These colors work harmoniously together as both are cool, blue-based tones, creating visual cohesion while maintaining clear distinction.

### Ocean Color Scale
```css
ocean-50:  #f0f9ff
ocean-100: #e0f2fe
ocean-200: #bae6fd
ocean-300: #7dd3fc
ocean-400: #38bdf8 ← Primary Accent
ocean-500: #0ea5e9
ocean-600: #0284c7
ocean-700: #0369a1
ocean-800: #075985
ocean-900: #0c4a6e
ocean-950: #082f49
```

### Neutral Colors
- **White**: `#ffffff` - Primary text
- **Gray 300**: `#d1d5db` - Secondary text
- **Gray 400**: `#9ca3af` - Tertiary text
- **Slate 700**: `#334155` - Borders
- **Slate 800**: `#1e293b` - Card backgrounds (with opacity)
- **Slate 900**: `#0f172a` - Dark accents

---

## ✍️ Typography

### Font Families
```css
--font-bebas: 'Bebas Neue', sans-serif;  /* Headers */
--font-inter: 'Inter', sans-serif;       /* Body text */
```

### Display Sizes (Bebas Neue)
Use for hero sections and major page titles:
- **display-xl**: 96px (6rem) - Main hero titles
- **display-lg**: 72px (4.5rem) - Large page headers
- **display-md**: 60px (3.75rem) - Section headers

**Usage:**
```jsx
<h1 className="display-xl">WINDSURF WORLD TOUR STATS</h1>
```

### Heading Sizes (Bebas Neue)
Use for page titles, hero sections, and major navigation:
- **heading-xl**: 48px (3rem)
- **heading-lg**: 36px (2.25rem)
- **heading-md**: 30px (1.875rem)
- **heading-sm**: 24px (1.5rem)

**Exception:** For data-heavy components (stat cards, chart titles, analytics dashboards), use Inter font instead of Bebas Neue for better readability and professional data presentation.

### Body Text Sizes (Inter)
Use for descriptions, paragraphs, and content:
- **body-xl**: 20px (1.25rem)
- **body-lg**: 18px (1.125rem)
- **body-md**: 16px (1rem) ← Default
- **body-sm**: 14px (0.875rem)
- **body-xs**: 12px (0.75rem)

### Labels & Captions (Inter)
Use for metadata, tags, and UI labels:
- **label-lg**: 14px, uppercase, bold
- **label-md**: 12px, uppercase, bold
- **label-sm**: 10px, uppercase, bold

---

## 🔘 Buttons

### Button Variants

#### Primary Button
Use for main call-to-action elements.

```jsx
<Link
  to="/events"
  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
>
  Browse Events
  <ArrowRight size={18} />
</Link>
```

**Styling:**
- Background: `bg-cyan-500`
- Text: `text-white font-semibold`
- Padding: `px-6 py-3`
- Rounded: `rounded-md`
- Hover: `hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30`
- Transition: `transition-all duration-300`

#### Secondary Button (Outline)
Use for secondary actions or paired with primary button.

```jsx
<button
  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-cyan-500 text-cyan-400 font-semibold rounded-md hover:bg-cyan-500/10 transition-all duration-300"
>
  View Details
</button>
```

**Styling:**
- Border: `border-2 border-cyan-500`
- Text: `text-cyan-400 font-semibold`
- Padding: `px-6 py-3`
- Rounded: `rounded-md`
- Hover: `hover:bg-cyan-500/10`
- Transition: `transition-all duration-300`

#### Disabled Button
Use for unavailable actions or "coming soon" features.

```jsx
<button
  disabled
  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-cyan-500/50 text-cyan-400/70 font-semibold rounded-md cursor-not-allowed"
>
  Coming Soon
</button>
```

**Styling:**
- Border: `border-2 border-cyan-500/50` (50% opacity)
- Text: `text-cyan-400/70` (70% opacity)
- Cursor: `cursor-not-allowed`
- No hover effects

### Button Sizes

**Standard (Default):**
- Padding: `px-6 py-3`
- Text: `font-semibold`
- Icon: `size={18}`

**Compact:**
- Padding: `px-4 py-2`
- Text: `text-sm font-semibold`
- Icon: `size={16}`

**Large:**
- Padding: `px-8 py-4`
- Text: `text-lg font-bold`
- Icon: `size={20}`

### Button Groups

Use for multiple related actions.

```jsx
<div className="flex flex-col sm:flex-row gap-4">
  <Link to="/events" className="[primary button classes]">
    Browse Events
    <ArrowRight size={18} />
  </Link>
  <button disabled className="[disabled button classes]">
    Coming Soon: Athletes
  </button>
</div>
```

**Layout:**
- Container: `flex flex-col sm:flex-row gap-4`
- Mobile: Stacks vertically
- Desktop: Side-by-side with gap

### Icon Usage

- Place icons **after** text for forward actions (Browse, Next, Submit)
- Place icons **before** text for backward actions (Back, Return)
- Icon size: `18px` for standard buttons

```jsx
// Forward action
<Button>Continue <ArrowRight size={18} /></Button>

// Backward action
<Button><ArrowLeft size={18} /> Back</Button>
```

### Best Practices

#### DO ✅
- Use primary button for main action
- Use secondary button for alternative actions
- Show disabled state for unavailable features
- Include hover effects for interactive buttons
- Use icons to reinforce button meaning
- Make buttons fully responsive (stack on mobile)

#### DON'T ❌
- Use more than one primary button in a group
- Skip transition effects
- Use solid backgrounds for secondary buttons
- Make disabled buttons look clickable
- Use buttons for navigation without proper Link wrapper
- Forget to add gap between button groups

---

## 🧩 Components

### PageLayout
Main layout wrapper for all pages.

```jsx
import PageLayout from '@/components/PageLayout';

<PageLayout hero={<PageHero title="Athletes" />}>
  {/* Page content */}
</PageLayout>
```

### PageHero
Hero section with consistent styling.

```jsx
import PageHero from '@/components/PageHero';

// Left-aligned (default)
<PageHero
  title="WINDSURF WORLD TOUR STATS"
  description="Track every heat, jump, and wave..."
/>

// Centered with icon
<PageHero
  title="EVENTS"
  subtitle="Competition Calendar"
  description="Browse all windsurf events"
  icon={<Trophy size={40} />}
  centered
/>
```

**Props:**
- `title` (required): Main heading
- `subtitle` (optional): Small text above title
- `description` (optional): Tagline below title
- `icon` (optional): Icon component
- `centered` (optional): Center alignment (default: left)

### Section
Content section with consistent spacing.

```jsx
import Section from '@/components/Section';

<Section containerSize="lg">
  {/* Section content */}
</Section>
```

**Container Sizes:**
- `sm`: 640px max width
- `md`: 768px max width
- `lg`: 1024px max width
- `xl`: 1280px max width (default)
- `full`: 100% width

### Card
Frosted glass card with hover effects.

```jsx
import Card from '@/components/Card';

<Card hoverable clickable onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

**Props:**
- `hoverable` (default: true): Enable hover effects
- `clickable` (default: false): Show pointer cursor
- `onClick` (optional): Click handler
- `className` (optional): Additional classes

### FeatureCard
Specialized card for dashboard features.

```jsx
import FeatureCard from '@/components/FeatureCard';

<FeatureCard title="QUICK STATS" isLoading={loading}>
  {/* Card content */}
</FeatureCard>
```

### TableRowTooltip
Styled tooltip component for table rows that matches the frosted glass design system.

```jsx
import TableRowTooltip from '@/components/TableRowTooltip';

<table>
  <tbody>
    {data.map((entry, index) => (
      <TableRowTooltip
        key={index}
        content={`Heat ${entry.heatNo}`}
        className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors duration-200 cursor-help"
      >
        <td>{entry.rank}</td>
        <td>{entry.rider}</td>
        <td>{entry.score}</td>
      </TableRowTooltip>
    ))}
  </tbody>
</table>
```

**Props:**
- `children` (required): Table row cells (`<td>` elements)
- `content` (required): Tooltip text to display on hover
- `className` (optional): CSS classes for the table row

**Styling:**
- Frosted glass background: `bg-slate-800/95 backdrop-blur-sm`
- Border: `border border-cyan-500/50` (cyan accent for tooltips)
- Rounded corners: `rounded-lg`
- Padding: `px-3 py-2`
- Shadow: `shadow-lg`
- Text: `text-xs text-gray-300 whitespace-nowrap`
- Positioning: Fixed, follows mouse cursor (10px right, 35px above)
- Z-index: `z-50` (ensures tooltip appears above all content)
- Pointer events: `pointer-events-none` (tooltip doesn't interfere with mouse)

**Implementation Details:**
- Uses React Portal (`createPortal`) to render tooltip at document body level
- Tracks mouse position with `clientX` and `clientY` for accurate positioning
- Updates position on `onMouseMove` for smooth cursor tracking
- Small offset (10px right, 35px up) prevents tooltip from blocking content

**Use Cases:**
- Showing heat numbers in score tables without dedicating a column
- Displaying additional context on hover (timestamps, IDs, metadata)
- Reducing table clutter while maintaining accessibility
- Any scenario where supplementary info shouldn't be always visible

**Design Philosophy:**
Follows "Show, Don't Tell" - hide non-essential data by default, reveal on interaction. Maintains consistent frosted glass aesthetic with cyan accent border to match interactive elements.

### ShowMoreButton
Progressive disclosure pattern for tables - shows initial rows and allows loading more.

```jsx
// ShowMoreButton component (defined in EventStatsTabContent.tsx)
const ShowMoreButton = ({
  currentCount,
  totalCount,
  increment = 10,
  onShowMore,
}: {
  currentCount: number;
  totalCount: number;
  increment?: number;
  onShowMore: () => void;
}) => {
  const remaining = totalCount - currentCount;
  if (remaining <= 0) return null;

  return (
    <button
      onClick={onShowMore}
      className="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/40 transition-colors rounded-b-lg border-t border-slate-700/30"
    >
      Show More ({Math.min(remaining, increment)} more, {remaining} remaining)
    </button>
  );
};

// Usage with table
const [limit, setLimit] = useState(10);
const INCREMENT = 10;

<FeatureCard title="Top Scores">
  <table>...</table>
  <ShowMoreButton
    currentCount={Math.min(limit, data.length)}
    totalCount={data.length}
    increment={INCREMENT}
    onShowMore={() => setLimit((prev) => prev + INCREMENT)}
  />
</FeatureCard>
```

**Props:**
- `currentCount` (required): Number of items currently shown
- `totalCount` (required): Total number of items available
- `increment` (optional, default: 10): How many more items to show on click
- `onShowMore` (required): Callback function to increase the limit

**Styling:**
- Full width: `w-full`
- Text: `text-xs text-cyan-400 hover:text-cyan-300`
- Background on hover: `hover:bg-slate-800/40`
- Border: `border-t border-slate-700/30`
- Rounded bottom: `rounded-b-lg`
- Transition: `transition-colors`

**Behavior:**
- Button only appears when there are more items to show
- Displays count of items to load and total remaining
- Increments visible count by a fixed amount (default 10)
- Disappears automatically when all items are shown

**Design Philosophy:**
Replaces dropdown selectors (10/25/50 rows) with progressive disclosure. Better UX because:
- Single clear action instead of choosing numbers
- Lower cognitive load
- Mobile-friendly (buttons > selects)
- Consistent with "Show, Don't Tell" principle

**When to Use:**
- Tables with more than 10 potential rows
- Lists where users may want to see more data
- Any paginated content within a card

**When NOT to Use:**
- Tables with < 10 rows (no benefit)
- When users typically need all data at once
- When server-side pagination is required (use proper pagination instead)

### Stat Cards (Data Visualization)
For displaying individual metrics and statistics.

```jsx
<div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 hover:bg-slate-800/60 transition-all duration-300">
  <h3 className="text-base font-medium text-white mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
    Best Heat Score
  </h3>
  <p className="text-5xl font-bold text-white mb-2">
    23.58 <span className="text-2xl text-gray-400">pts</span>
  </p>
  <p className="text-xs text-gray-400">Heat 23a</p>
</div>
```

**Key Patterns:**
- Title: Inter font (not Bebas Neue), `text-base font-medium text-white`, sentence case
- Value: Large bold number (`text-5xl font-bold text-white`)
- Unit: Smaller gray text (`text-2xl text-gray-400`)
- Metadata: Extra small gray text (`text-xs text-gray-400`)

**Color Hierarchy:**
- `text-white` - Titles and primary values (what/how much)
- `text-gray-400` - Metadata and context (when/where/who)
- `text-gray-500` - Tertiary information

---

## 🎭 Effects & Styling Patterns

### Frosted Glass Cards
```css
bg-slate-800/40
backdrop-blur-sm
border border-slate-700/50
```

### Hover Effects (Cyan Accent)
```css
hover:bg-slate-800/60
hover:border-cyan-500/50
hover:shadow-lg
hover:shadow-cyan-500/10
```

### Background Overlay
```css
background:
  linear-gradient(to bottom, rgba(10, 14, 26, 0.85), rgba(10, 14, 26, 0.95)),
  url('/images/background-1.jpg');
```

### Smooth Transitions
```css
transition-all duration-300
```

---

## 📐 Spacing System

### Spacing Scale
Consistent spacing values used throughout the application:

```css
/* Section Spacing (space-y-*) */
space-y-8   /* 32px - Primary spacing between major sections */
space-y-6   /* 24px - Secondary spacing within sections */
space-y-4   /* 16px - Tertiary spacing within components */

/* Grid Gaps (gap-*) */
gap-6       /* 24px - Standard card grid gap */
gap-4       /* 16px - Compact grid gap */
gap-8       /* 32px - Large grid gap */

/* Padding/Margin */
p-6         /* 24px - Standard card padding */
py-12 md:py-16  /* Section vertical spacing (48px → 64px) */
px-4 sm:px-6 lg:px-8  /* Horizontal padding (16px → 24px → 32px) */
mb-8        /* 32px - Bottom margin for major sections */
mb-6        /* 24px - Bottom margin between elements */
mb-4        /* 16px - Bottom margin within components */
```

### Container Max Widths
```
max-w-7xl  /* Main container (1280px) */
max-w-4xl  /* Content container (896px) */
```

### Gap Spacing Rationale

| Gap | Value | Usage |
|-----|-------|-------|
| `gap-3` | 12px | Tight groupings (icon + text, small badges) |
| `gap-4` | 16px | Compact grids (mobile cards, dense lists) |
| `gap-6` | 24px | **Standard** - Card grids, feature sections |
| `gap-8` | 32px | Large separation (major sections) |

**Rule of thumb:**
- `gap-6` is the default for card grids and component spacing
- `gap-4` for tighter layouts or mobile views
- `gap-3` only for inline elements

### Shadow Patterns

| Context | Shadow Classes | Purpose |
|---------|----------------|---------|
| Interactive cards on hover | `hover:shadow-lg hover:shadow-cyan-500/10` | Subtle colored glow |
| Primary buttons on hover | `hover:shadow-lg hover:shadow-cyan-500/30` | Strong colored glow |
| Chart tooltips | `shadow-lg` or `shadow-xl` | Elevation above content |
| Dropdowns/floating | `shadow-lg shadow-black/20` | Dark shadow for separation |

**Rule of thumb:**
- Interactive elements get colored shadows (`cyan-500/10` or `/30`)
- Floating/overlay elements use dark shadows (`black/20`)
- Use `shadow-lg` for standard elevation, `shadow-xl` for tooltips

### Usage Guidelines

**Page Layout Pattern:**
```jsx
<section className="px-4 sm:px-6 lg:px-8 py-6 pb-20">
  <div className="max-w-7xl mx-auto">
    <div className="space-y-8">
      {/* Major sections with 32px vertical spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cards with 24px gap */}
      </div>
    </div>
  </div>
</section>
```

**Component Internal Spacing:**
```jsx
<div className="space-y-4">
  {/* Elements within component with 16px vertical spacing */}
  <div className="p-6">
    {/* Standard card padding (24px) */}
  </div>
</div>
```

**Best Practices:**
- Use `space-y-8` between major sections (summary cards → chart → tables)
- Use `gap-6` for card grids (3-column layouts, feature cards)
- Use `space-y-4` within individual components (chart legend → chart, table → button)
- Use `p-6` for standard card content padding
- Maintain responsive padding: `px-4 sm:px-6 lg:px-8`

---

## 📱 Responsive Breakpoints

```
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

**Mobile-First Approach:**
```jsx
<h1 className="text-6xl md:text-8xl">Title</h1>
// Mobile: 6xl (60px), Desktop: 8xl (96px)
```

---

## 🎯 Usage Examples

### Standard Page Template

```jsx
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import Section from '@/components/Section';
import Card from '@/components/Card';
import { Trophy } from 'lucide-react';

export default function EventsPage() {
  return (
    <PageLayout
      hero={
        <PageHero
          title="EVENTS"
          description="Browse all windsurf competition events"
          icon={<Trophy size={40} />}
        />
      }
    >
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>Event 1</Card>
          <Card>Event 2</Card>
          <Card>Event 3</Card>
        </div>
      </Section>
    </PageLayout>
  );
}
```

### Typography Usage

```jsx
{/* Hero title */}
<h1 className="display-xl">MAIN TITLE</h1>

{/* Section heading */}
<h2 className="heading-lg mb-4">Section Title</h2>

{/* Body text */}
<p className="body-md text-gray-300">Description text...</p>

{/* Label/metadata */}
<span className="label-md text-cyan-400">NEW</span>
```

---

## 🚀 Best Practices

### DO ✅
- Use `PageHero` for all page headers
- Left-align hero sections (matches brand aesthetic)
- Use Bebas Neue for page titles, heroes, and navigation
- Use Inter for body text AND data visualization components (stat cards, chart titles)
- Apply frosted glass effect to cards
- Use cyan (`#38bdf8`) for accents and highlights
- Maintain consistent spacing with `Section` component
- Add smooth transitions to interactive elements

### DON'T ❌
- Mix font families within the same component
- Center-align unless explicitly designed for it
- Use colors outside the defined palette
- Skip hover effects on interactive cards
- Forget responsive text sizing (`md:text-*`)
- Override the background on individual pages
- Use solid backgrounds (always use transparency)

---

## 🔧 Component Checklist

When creating new pages/components:

- [ ] Use `PageLayout` wrapper
- [ ] Add `PageHero` for page title
- [ ] Use `Section` for content areas
- [ ] Apply appropriate typography classes
- [ ] Add hover effects to interactive elements
- [ ] Test on mobile (responsive sizing)
- [ ] Use `Card` component for content blocks
- [ ] Ensure text is readable over background
- [ ] Add loading states where appropriate
- [ ] Apply smooth transitions

---

## 📦 Component Exports

```typescript
// Layout
export { default as PageLayout } from '@/components/PageLayout';
export { default as PageHero } from '@/components/PageHero';
export { default as Section } from '@/components/Section';

// UI Components
export { default as Card } from '@/components/Card';
export { default as FeatureCard } from '@/components/FeatureCard';
export { default as Navigation } from '@/components/Navigation';
```

---

**Questions?** See the component source files for detailed implementation examples.
