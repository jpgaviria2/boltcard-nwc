# Boltcard + NWC

Boltcard + NWC is an open-source platform for creating, managing and serving Boltcard payments. Users can connect their own Nostr Wallet Connect (NWC) and configure lightning addresses to enable seamless NFC card payments. The platform provides a complete solution for managing Boltcard infrastructure while letting users maintain control of their payment channels.

## Features

### Admin

- Create and manage Boltcard designs
- Create and manage Lightning Addresses
- Create and manage Boltcard cards (NFC)

### User

- Webapp Wallet
- Create and manage Lightning Addresses
- Manage Boltcard cards (NFC)
- Setup with NWC

### Landing page

- Fully responsive
- Instructions
- Waitlist from (Sendy subscription)

## Tech Stack

- **TypeScript** 🔷 [v5.0+](https://www.typescriptlang.org/) - Typed JavaScript
- **React** ⚛️ ([Next.js](https://nextjs.org/) v13.4+) - Web framework
- **Tailwind CSS** 🎨 [v3.3+](https://tailwindcss.com/) - Utility-first CSS
- **shadcn/ui** 🎯 [v0.4+](https://ui.shadcn.com/) - UI component library
- **Prisma** 💾 [v4.16+](https://www.prisma.io/) - Database ORM
- **Alby lib** ⚡ [v1.6+](https://github.com/getAlby/js-sdk) - NWC library
- **UI**:
  - [Radix UI](https://www.radix-ui.com/) 🎨 - Headless UI primitives
  - [Lucide Icons](https://lucide.dev/) 🎯 - Icon library
  - And more...

## Open Standards

This project is built on and interoperates with the following open standards:

- **NWC** 🔑 [Nostr Wallet Connect](https://nwc.getalby.com/)
- **BoltCard** 💳 [NFC Lightning card standard](https://github.com/boltcard/boltcard)
- **LUD-16** ⚡ [Lightning Address](https://github.com/lnurl/luds/blob/luds/16.md)
- **LUD-21** 🔗 [LNURL](https://github.com/lnurl/luds/blob/luds/21.md)
- **NIP-46** 🔏 [Nostr remote signing](https://github.com/nostr-protocol/nips/blob/master/46.md)
- **NIP-07** 🔌 [Nostr browser extension API](https://github.com/nostr-protocol/nips/blob/master/07.md)

## Getting Started

1. **Install dependencies:**

```bash
pnpm install
```

2. **Run the development server:**

```bash
pnpm dev
```

3. **Open your browser:**

Visit [https://lnbucks.com](https://lnbucks.com) to see the app.

## License

MIT
