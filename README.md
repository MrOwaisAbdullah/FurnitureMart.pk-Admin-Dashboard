# FurnitureMart Admin Dashboard

FurnitureMart Admin Dashboard is a powerful platform designed for furniture sellers to manage their online stores efficiently. It provides tools to upload and edit products, manage orders, track analytics, and monitor sales performance.

## 🚀 Features

### 🛍️ Product Management
- Upload new products with images, descriptions, and pricing
- Edit existing products, including inventory and categories
- Manage product listings with an intuitive UI

### 📊 Dashboard & Analytics
- View total orders, pending orders, and total sales
- Track sales performance on a daily, weekly, monthly basis
- Interactive charts and insights for better decision-making

### 📦 Order Management
- View and manage customer orders
- Update order status (Pending, Shipped, Delivered, etc.)
- Filter and search orders easily

### 👤 Seller Profile Management
- Edit seller profile details, including shop name, address, and contact information
- Manage business types (Showroom, Workshop, Both)
- Secure profile settings with authentication

### 🔐 Authentication & Access Control
- Secure sign-in and sign-up using Clerk authentication
- Role-based access control for sellers and admins
- Pending verification for newly registered sellers before accessing the dashboard

### 📌 Additional Features
- Fully responsive UI for seamless experience on desktop and mobile
- Image cropping for optimized product images
- Secure API integration with Sanity for product and order management

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
- **Backend:** API Routes (Next.js), Sanity CMS
- **Authentication:** Clerk
- **Hosting & Deployment:** Vercel

## 📦 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/MrOwaisAbdullah/FurnitureMart.pk---Admin-Dashboard.git
   cd FurnitureMart.pk---Admin-Dashboard
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and add the required environment variables:
   ```sh
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=your-dataset
   SANITY_API_TOKEN=your-sanity-api-token
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://your-clerk-url/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://your-clerk-url/sign-up
   NEXT_PUBLIC_BASE_URL=https://your-deployed-url
   NEXT_PUBLIC_FURNITURE_MART_URL=https://your-display-site-url
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## 🚧 Challenges & Solutions

### 1️⃣ **Authentication Redirect Issues**
- **Problem:** Clerk was redirecting users to localhost even in production.
- **Solution:** Configured a custom domain and updated Clerk's allowed redirect URLs.

### 2️⃣ **Webhook Failures in Production**
- **Problem:** Clerk webhooks were failing due to missing or incorrect verification.
- **Solution:** Implemented proper webhook verification using `svix`, ensuring secure processing of webhook events.

### 3️⃣ **Sanity API Authorization Errors**
- **Problem:** Unauthorized errors when creating sellers via webhook.
- **Solution:** Updated API keys and ensured proper authentication when interacting with Sanity.

### 4️⃣ **Pending Seller Verification**
- **Problem:** Newly registered sellers could access the dashboard before verification.
- **Solution:** Implemented a pending verification page that restricts access until admin approval.

## 🌍 Deployment
The project is deployed on **Vercel** with a custom domain connected via **Namecheap**.

## 📜 License
This project is licensed under [MIT License](LICENSE).

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo and submit pull requests.

## 📞 Contact
For inquiries or support, reach out at [mrowaisabdullah@gmail.com](mailto:mrowaisabdullah@gmail.com).
