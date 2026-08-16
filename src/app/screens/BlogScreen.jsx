// BlogScreen.jsx
"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BlogListPage from "../Components/blog/BlogListPage";

const BlogScreen = () => {
  return (
    <div>
      <Navbar />
      <BlogListPage />
      <Footer />
    </div>
  );
};

export default BlogScreen;
