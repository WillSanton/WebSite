import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { MainNav } from "@/components/nav/main-nav";
import { WitchAssistant } from "@/components/witch-assistant/witch-assistant";
import { StarryBackground } from "@/components/starry-background";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import PostPage from "@/pages/post-page";
import ProfilePage from "@/pages/profile-page";
import CreatePost from "@/pages/admin/create-post";
import ManagePosts from "@/pages/admin/manage-posts";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <StarryBackground />
            <MainNav />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/post/:slug" component={PostPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/admin/create-post" component={CreatePost} />
                <Route path="/admin/manage-posts" component={ManagePosts} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <WitchAssistant />
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}