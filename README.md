# Product Search App

A simple Next.js + TypeScript product search tool with hardcoded sample product data.

## Features

- Home page title: **Product Search Tool**
- Search by SKU or product name
- Filters for:
  - Product Type
  - Speed
  - Cable Type
  - OEM Compatibility
- Product table columns:
  - SKU
  - Product Name
  - Product Type
  - Speed
  - Cable Type
  - Length
  - OEM Compatibility
- No database usage (all data is hardcoded)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app:

- http://localhost:3000

## Notes

- This project uses Next.js App Router.
- Product data is currently stored in `app/page.tsx` as sample hardcoded data.
