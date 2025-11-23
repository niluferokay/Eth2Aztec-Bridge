# Design Guidelines: Testnet USDC Faucet

## Design Approach
**System-Based Approach** using modern Web3 UI patterns inspired by bridge.human.tech and leading crypto interfaces (Uniswap, Rainbow, MetaMask). Prioritize clarity, trust, and seamless wallet integration.

## Core Design Principles
1. **Immediate Clarity**: Users understand the faucet purpose instantly
2. **Transaction Transparency**: Every blockchain interaction visible and trackable
3. **Error Prevention**: Clear network indicators and validation states
4. **Trust Through Design**: Professional aesthetics that inspire confidence

---

## Layout System

**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm

**Container Structure**:
- Max-width: `max-w-2xl` centered for focused interaction
- Vertical padding: `py-12` on mobile, `py-16` on desktop
- Card-based layout with single-column flow

**Page Structure** (no hero image - utility-focused):
1. Header with branding/network indicator
2. Main faucet card (centered, elevated)
3. Status/history section below
4. Footer with links/info

---

## Typography

**Font Stack**: 
- Primary: Inter or DM Sans (Google Fonts) - clean, modern readability
- Monospace: Roboto Mono for addresses, transaction hashes

**Hierarchy**:
- H1: `text-3xl md:text-4xl font-bold` (Main heading: "Testnet USDC Faucet")
- H2: `text-xl md:text-2xl font-semibold` (Section headers)
- Body: `text-base` (Instructions, labels)
- Small: `text-sm` (Helper text, secondary info)
- Mono: `text-sm font-mono` (Addresses - truncated with ellipsis)

---

## Component Library

### Primary Faucet Card
- Elevated card with subtle shadow (`shadow-xl`)
- Border radius: `rounded-2xl`
- Padding: `p-8 md:p-12`
- Background: Distinct from page background (layered depth)

**Internal Structure**:
1. Icon/Logo at top
2. Clear title: "Get Testnet USDC"
3. Amount badge: "1000 tUSDC per request" (pill-shaped badge)
4. Wallet connection status
5. Address input (auto-filled when connected)
6. Primary CTA button
7. Rate limit status indicator

### Wallet Connection Button
- When disconnected: "Connect Wallet" with wallet icon
- When connected: Truncated address with identicon/avatar
- Hover state with account dropdown (disconnect option)
- Size: `px-6 py-3 rounded-xl`

### Address Input Field
- Full-width input with mono font
- Placeholder: "0x... or connect wallet"
- Auto-filled when wallet connected (read-only state)
- Validation indicator (checkmark for valid address)
- Padding: `px-4 py-3`

### Faucet Request Button
- Full-width primary button
- Text: "Request 1000 tUSDC"
- Size: `py-4 rounded-xl font-semibold`
- Disabled states: Not connected, rate limited, wrong network
- Loading state with spinner icon

### Network Indicator
- Pill badge in header/top-right
- Shows current network (e.g., "Sepolia Testnet")
- Warning state if wrong network detected
- Icon + network name

### Transaction Status Display
- Appears below main card after request
- Status states:
  - Pending: Spinner + "Processing transaction..."
  - Success: Checkmark + "1000 tUSDC sent!" + transaction hash link
  - Error: X icon + error message
- Transaction hash: Mono font, truncated, external link to block explorer
- Dismissible with X button

### Rate Limit Indicator
- Small section showing "Next request available in: 23h 45m"
- Progress bar visual
- Countdown timer (live updating)

---

## State Management

**Connection States**:
1. Not Connected: Show connect button, input enabled
2. Connected: Show address, auto-fill input, enable request
3. Wrong Network: Warning banner, disable request button

**Request States**:
1. Idle: Primary button enabled
2. Loading: Button disabled with spinner
3. Success: Show success message with transaction link
4. Error: Show error message, allow retry
5. Rate Limited: Button disabled, show countdown

---

## Visual Enhancements

**Icons**: Use Heroicons via CDN
- Wallet icon (connect button)
- Check circle (success states)
- Exclamation circle (errors/warnings)
- Clock (rate limiting)
- External link (transaction hash links)

**Micro-interactions**:
- Button scale on hover: `transform hover:scale-105`
- Smooth transitions: `transition-all duration-200`
- Loading spinner rotation
- Success checkmark animation (scale in)

---

## Accessibility & UX

- High contrast text for readability
- Focus states on all interactive elements (visible outline)
- Keyboard navigation support
- Screen reader labels for icons
- Error messages with clear resolution steps
- Transaction hash links open in new tab with `rel="noopener"`

---

## Embedded Integration

Since embedding in bridge.human.tech:
- Seamless integration with host site navigation
- Consistent design language (reference bridge.human.tech's aesthetics)
- Compact header (no redundant branding if embedded)
- Responsive iframe-friendly layout

---

**Images**: None required - utility-focused interface prioritizes functionality over imagery.