import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Editor } from '@tinymce/tinymce-react';
import { useState, useEffect } from 'react';

const API_BASE = 'https://backend-kve8.onrender.com/api';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      loadInitialData();
    } else {
      toast({ title: "Invalid credentials", variant: "destructive" });
    }
  };

  const loadInitialData = async () => {
    await Promise.all([
      loadSubscriptions(),
      loadProducts(),
      loadBlogs()
    ]);
  };

  const loadSubscriptions = async () => {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/`);
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      toast({ title: "Error loading subscriptions", variant: "destructive" });
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({ title: "Error loading products", variant: "destructive" });
    }
  };

  const loadBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/blogs/`);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast({ title: "Error loading blogs", variant: "destructive" });
    }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/subscriptions/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          description: e.target.description.value
        })
      });
      
      if (response.ok) {
        toast({ title: "Subscription created successfully" });
        loadSubscriptions();
        e.target.reset();
      }
    } catch (error) {
      toast({ title: "Error creating subscription", variant: "destructive" });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/products/create-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          description: e.target.description.value
        })
      });
      
      if (response.ok) {
        toast({ title: "Product created successfully" });
        loadProducts();
        e.target.reset();
      }
    } catch (error) {
      toast({ title: "Error creating product", variant: "destructive" });
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/blogs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: e.target.title.value,
          content: e.target.content.value,
          author: e.target.author.value
        })
      });
      
      if (response.ok) {
        toast({ title: "Blog created successfully" });
        loadBlogs();
        e.target.reset();
      }
    } catch (error) {
      toast({ title: "Error creating blog", variant: "destructive" });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input name="username" placeholder="Username" />
              <Input name="password" type="password" placeholder="Password" />
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
          </TabsList>

          {/* Subscriptions Tab Content */}
          <TabsContent value="subscriptions">
            {/* Subscription management components */}
          </TabsContent>

          {/* Products Tab Content */}
          <TabsContent value="products">
            {/* Product management components */}
          </TabsContent>

          {/* Blogs Tab Content */}
          <TabsContent value="blogs">
            {/* Blog management components */}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent.title}</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: modalContent.content }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}