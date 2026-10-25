# All Display Wholesale Admin Dashboard (/admin)

A purpose-built, zero-clutter administrative suite for wholesale store owners and staff to manage WhatsApp-driven orders, bespoke retail fixture quotes, live product catalogs, homepage banners, and customer records with zero technical jargon and 3-click daily operations.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Access & Authentication**: The admin panel will be accessible via the path `/admin` (or a discrete toggle) secured by PIN `123456` with persistent browser session memory, role switching (Owner vs. Staff), and a quick storefront switch.

- **Confirmed Decision 1**: **PIN 123456 Security & Route Isolation**: Entering `/admin` displays a numeric keypad and PIN lock screen. Once authenticated with `123456`, the session persists in encrypted browser state. The storefront navigation remains uncluttered with a subtle discrete switch at the bottom of the page.
- **Confirmed Decision 2**: **Live Two-Way Data Synchronization**: Orders, products, stock levels, categories, and homepage banners are managed through a unified `StorefrontSyncManager` backed by persistent local storage. Edits made in the Admin immediately reflect on the live customer-facing catalog without requiring database redeployment.
- **Confirmed Decision 3**: **WhatsApp-First Workflow (Zero Gateway Friction)**: Every order and quote card features direct "Reply on WhatsApp" and "Send Bank/UPI Proforma" action buttons that construct ready-to-send messages for Indian wholesale workflows.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an ultra-simple, high-contrast, card-based management dashboard specifically designed for wholesale display fixture merchants in Hyderabad (Ranigunj / Begum Bazaar). Eliminates complex WordPress/WooCommerce menus in favor of large tactile buttons, clear status indicators, and plain language with helpful Hinglish tooltips ("Naya Order", "Payment Aaya", "Maal Dispatch").
- **Target Audience / Persona**: Wholesale store owners (e.g., Ramesh Sharma / Rajesh Kalyan) and warehouse dispatch staff who process 10–50 bulk inquiries daily via WhatsApp and phone calls, needing fast status tracking, invoice printing, and stock toggles.
- **Key Value**: Reduces the time to process a wholesale inquiry from 12 minutes of manual copying to 2 clicks (one click to view the manifest, one click to launch WhatsApp with a prefilled proforma).

---

## 2. User Experience & Visual Design

### Key User Flows & Screen Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN ROUTE (/admin)                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         [PIN Challenge: 123456]
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    ADMIN WORKSPACE (1440px / 390px)                    │
│                                                                        │
│  ┌───────────────┐ ┌────────────────────────────────────────────────┐  │
│  │ SIDEBAR MENU  │ │ TOP BAR: Storefront Link · Role Switch · Tour  │  │
│  │               │ ├────────────────────────────────────────────────┤  │
│  │ 1. Dashboard  │ │ ACTIVE SCREEN VIEW                             │  │
│  │ 2. Orders     │ │  • Big tactile buttons (min 44px tap target)   │  │
│  │ 3. Quotes     │ │  • High-contrast order status cards            │  │
│  │ 4. Products   │ │  • One-click WhatsApp action triggers          │  │
│  │ 5. Categories │ │  • Plain English + Hinglish operational hints  │  │
│  │ 6. Homepage   │ │  • Reversible actions & autosave toasts        │  │
│  │ 7. Customers  │ └────────────────────────────────────────────────┘  │
│  │ 8. Media      │                                                     │
│  │ 9. Settings   │                                                     │
│  │ 10. Team      │                                                     │
│  └───────────────┘                                                     │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Screen 1: PIN Login & Quick Switch**:
   - Clean luxury modal card with 6-dot PIN indicator, numeric keypad, "Forgot PIN?" hint (`Default: 123456`), and quick "Back to Storefront" button.
2. **Screen 2: Command Dashboard**:
   - 4 Action-Oriented Metric Cards: *New Today (Awaiting WhatsApp)*, *Payment Pending*, *Ready to Dispatch*, *Quotes to Price*.
   - 7/30-Day Wholesale Revenue & Order Volume sparkline bar visual.
   - Low Stock Alert List with 1-click "Mark In Stock" toggle.
   - Quick Action Bar: *+ New Product*, *+ Update Banner*, *View Urgent Orders*.
3. **Screen 3: Orders List**:
   - Filter chips: *All*, *New (Need Reply)*, *Confirmed*, *Payment Pending*, *Packed*, *Shipped*, *Delivered*.
   - Instant search by Customer Name, WhatsApp Number, Order Number, or City.
   - Bulk selection: Mark multiple as "Packed" or "Export to Excel/CSV".
4. **Screen 4: Order Detail & Action Hub**:
   - Customer ledger: Store name, proprietor, GSTIN, shipping address, transport depot.
   - Interactive Manifest Table: Item code, title, finish, gauge, pack size, quantity, subtotal.
   - **One-Click Action Bar**:
     - 🟢 **Reply on WhatsApp**: Prefilled with order summary and thank you.
     - 🟡 **Send Payment Details**: Prefilled with Ranigunj Factory Bank NEFT / QR UPI ID.
     - 🚚 **Mark Shipped & Send LR / Tracking**: Prompts for Lorry Receipt number and dispatches transport message.
     - 🖨️ **Print Tax Invoice & Packing Slip**: Printer-friendly format matching standard Indian GST trade slips.
5. **Screen 5: Custom Quote Requests**:
   - Bespoke requirements (e.g. 1500 sq.ft showroom CAD layout, gold finish pipe racks).
   - "Convert to Wholesale Order" button that migrates quote specs into an active order.
6. **Screen 6 & 7: Products & Product Editor**:
   - High-density table with product image thumbnail, SKU, price, stock toggle, MOQ, and quick edit.
   - Comprehensive Add/Edit modal: Name, Category, Finish swatches, Height/Gauge variants, Bulk Price Tiers (1-3 units, 4-9 units, 10+ units), MOQ, Specs, Visibility toggle, and Live Storefront Card Preview.
   - CSV bulk export & duplicate product features.
7. **Screen 8: Categories Manager**:
   - Reorder categories, update banner images, toggle storefront visibility.
8. **Screen 9: Homepage Manager**:
   - Edit Top Hero Banner headline, subtext, and background image.
   - Reorder featured category icons and toggle "Real Store Setups" video reels.
9. **Screen 10: Customer Directory**:
   - List of repeat boutique owners, order count, total value, city, and WhatsApp history.
10. **Screen 11: Media Library**:
    - Image gallery with copyable CDN URLs, image optimization status badges, and asset tags.
11. **Screen 12: Business & WhatsApp Settings**:
    - Manage WhatsApp numbers (+91 73961 27273), UPI ID (`alldisplay@icici`), Bank NEFT details, WhatsApp message templates with live `{name}`, `{order_no}`, `{total}` token replacements.
    - Export full database backup as JSON or restore factory defaults.
12. **Screen 13: Team & Roles**:
    - Switch between **Store Owner** (Full access) and **Warehouse Staff** (Orders and Stock only; Settings and Pricing protected).
13. **Screen 14: Onboarding Tour & Interactive Feedback**:
    - Step-by-step 3-bubble guided tour on first login explaining where new orders arrive and how to reply on WhatsApp in 1 click.

### Visual Identity & Theme Tokens

- **Palette**: Strict storefront continuity:
  - Deep Matte Charcoal (`#1A1C20`) for navigation, headers, and primary buttons.
  - Warm Sand Off-White (`#FDF9F3` and `#FFFFFF`) for crisp card surfaces and canvas.
  - Warm Wood / Amber Accent (`#FECE57` and `#775A00`) for pending highlights, badges, and active states.
  - WhatsApp Green (`#25D366` and `#128C7E`) for primary communication triggers.
  - Slate Gray hairline borders (`#E6E2DC`).
- **Typography**: Clean display sans (`Plus Jakarta Sans` / `Outfit`) for bold numbers and headings; tabular figures (`tabular-nums`) for currency (₹) and timestamps.
- **Accessibility & Touch**: All buttons $\ge 44\text{px}$ touch height; zero tiny icons without labels; high contrast ratio $\ge 5:1$.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Persistent Storage with State Sync**:
  - *Chosen Approach*: Store live products, orders, categories, and settings in `localStorage` with a reactive event bus that updates the customer storefront in real time.
  - *Why*: Instant loading, zero server latency, works offline, and requires no database migrations while allowing full create/read/update/delete operations.
  - *Fallback*: Provide an instant "Reset to Factory Catalog" button so the shop owner can never break the application.
- **Decision 2: Seamless Route Switcher**:
  - *Chosen Approach*: Support both URL path `/admin` and an in-app discrete floating toggle for seamless switching between Storefront and Admin views during evaluation.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION DATA BUS                            │
├────────────────────────────────────────────────────────────────────────┤
│  src/data/catalog.ts (Defaults)  ◄──►  src/services/storeManager.ts     │
│                                                │                       │
│                                       ┌────────┴────────┐              │
│                                       ▼                 ▼              │
│                              Storefront Views      Admin Views         │
│                              • HomeView            • DashboardView     │
│                              • CatalogView         • OrdersView        │
│                              • ProductDetailView   • OrderDetailView   │
│                              • OrderListView       • ProductEditorView │
│                              • CustomQuoteView     • SettingsView      │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Structure
- `src/admin/AdminApp.tsx`: Main admin container handling PIN auth, active screen tab, role switcher, and toast notifications.
- `src/admin/components/AdminHeader.tsx`: Top bar with breadcrumb trail, role toggle (Owner/Staff), notification drawer, and storefront link.
- `src/admin/components/AdminSidebar.tsx`: Tactile left navigation with notification counter pills and plain icons.
- `src/admin/views/AdminDashboardView.tsx`: Overview KPI metrics, low-stock warnings, and 3-click quick actions.
- `src/admin/views/AdminOrdersView.tsx`: Comprehensive order search, filter, status update, and export.
- `src/admin/views/AdminOrderDetailView.tsx`: Detailed manifest, WhatsApp triggers, and invoice printer.
- `src/admin/views/AdminQuotesView.tsx`: Bespoke showroom inquiry tracker.
- `src/admin/views/AdminProductsView.tsx`: Inventory, price slabs, variants, and live preview modal.
- `src/admin/views/AdminHomepageView.tsx`: Banners, category ordering, and reels.
- `src/admin/views/AdminSettingsView.tsx`: WhatsApp templates, UPI details, and backup export.
- `src/services/storeManager.ts`: Unified service managing orders, catalog items, and settings with localStorage persistence.
