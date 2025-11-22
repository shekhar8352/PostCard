# Postcard

<div align="center">
  <img src="public/assets/logo_new.svg" alt="Postcard Logo" width="100" height="100">
  <h3 align="center">Postcard</h3>
  <p align="center">
    A modern, vibrant social media application built for communities and conversations.
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://postcard-app.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/yourusername/postcard/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/postcard/issues">Request Feature</a>
  </p>
</div>

---

## 🚀 Introduction

**Postcard** is a next-generation social media platform designed to foster meaningful connections. Built with the latest web technologies, it offers a seamless and interactive experience for users to share thoughts, join communities, and engage in deep conversations.

With a focus on **performance**, **aesthetics**, and **usability**, Postcard leverages the power of Next.js 13's App Router and Server Actions to deliver a fast and responsive application. The vibrant orange theme and smooth animations create an inviting atmosphere for users.

## ✨ Key Features

- **📝 Interactive Threads**: Create rich text posts, reply to others, and engage in deeply nested conversations.
- **👥 Communities**: Create and manage communities (groups) centered around specific interests or topics.
- **🏷️ Trending Tags**: Discover what's popular with real-time trending hashtags and filter posts by tags.
- **🔍 Smart Search**: Easily find other users and communities with a powerful search functionality.
- **🔔 Activity Feed**: Stay updated with real-time notifications for likes, replies, and mentions.
- **👤 User Profiles**: Customize your profile, view your post history, and manage your account settings.
- **🎨 Modern UI/UX**: A fully responsive design featuring a glassmorphic aesthetic, smooth transitions, and a "wow" factor.
- **📱 Mobile First**: Optimized for all devices, ensuring a great experience on phones, tablets, and desktops.

## 🛠️ Tech Stack

Postcard is built using a robust and modern technology stack:

### Frontend
- **[Next.js 13](https://nextjs.org/)**: The React framework for the web, utilizing the **App Router** for routing and **Server Components** for performance.
- **[React](https://react.dev/)**: A JavaScript library for building user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
- **[Radix UI](https://www.radix-ui.com/)**: Unstyled, accessible components for building high-quality design systems.

### Backend & Data
- **[MongoDB](https://www.mongodb.com/)**: A flexible, document-based NoSQL database.
- **[Mongoose](https://mongoosejs.com/)**: Elegant MongoDB object modeling for Node.js.
- **[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)**: Seamlessly call server-side functions from client components.

### Authentication & Services
- **[Clerk](https://clerk.com/)**: Complete user management and authentication (Google, GitHub, Email).
- **[UploadThing](https://uploadthing.com/)**: The easiest way to add file uploads to your full-stack TypeScript application.

### Validation & Forms
- **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation.
- **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible and extensible forms with easy-to-use validation.

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (for database)
- **Clerk** account (for authentication)
- **UploadThing** account (for file uploads)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/postcard.git
    cd postcard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    NEXT_CLERK_WEBHOOK_SECRET=whsec_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    # MongoDB
    MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/postcard?retryWrites=true&w=majority

    # UploadThing
    UPLOADTHING_SECRET=sk_live_...
    UPLOADTHING_APP_ID=...
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the environment variables (from step 3 above) in the Vercel dashboard.
4.  Click **Deploy**.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/yourusername/postcard](https://github.com/yourusername/postcard)
