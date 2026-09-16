# 865Dev

High-Performance Static Websites for East Tennessee Businesses, Shops, and Service Providers.

🌐 **Live Website**: [https://865dev.com](https://865dev.com)  
📍 **Location**: Knoxville, TN  

---

## ⚡ Architecture & Tech Stack

* **Zero-Bloat Static Engine**: Semantic HTML5, modern CSS3, and vanilla JavaScript (no bulky frameworks, no WordPress database vulnerabilities).
* **Speed Performance**: 100/100 Google Lighthouse PageSpeed rating with sub-0.4 second load times.
* **Server**: LiteSpeed Web Server with `.htaccess` Brotli/Gzip compression, HTTPS enforcement, and aggressive browser caching.
* **CI/CD**: Automated GitHub Actions deployment pipeline syncing to cPanel hosting on push to `main`.

---

## 📂 Project Structure

```text
├── index.html              # Main landing page with interactive quote calculator
├── styles.css              # Custom CSS design system & responsive layout
├── script.js               # Client interactivity (quote calculator, animations, modal)
├── .htaccess               # Production LiteSpeed/Apache caching & security rules
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions automated FTP deployment
├── assets/                 # Photography and UI mockup assets
└── demos/                  # 7 Master Starter Architectures & Trade Demos
    ├── service-pro.html    # The Service Pro (utility & trust)
    ├── local-spot.html     # The Local Spot (eateries & cafes)
    ├── curator.html        # The Curator (boutiques & vintage retail)
    ├── consultant.html     # The Consultant (B2B, legal & finance)
    ├── maker.html          # The Maker (contractors, excavation & builders)
    ├── funnel.html         # The Funnel (direct response landing page)
    ├── dealership.html     # Dealership CMS (auto inventory & credit approvals)
    ├── plumber.html        # Showcase: East TN Plumbing & Drain
    ├── mechanic.html       # Showcase: Apex Auto Diagnostics
    └── restaurant.html     # Showcase: Honeybee Bakehouse
```

---

## 🚀 Deployment

Pushing changes to the `main` branch automatically triggers the `.github/workflows/deploy.yml` workflow, which connects via secure FTP to HoboHost cPanel and syncs changed files into `865dev.com`.
