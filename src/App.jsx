
import { useState, useMemo } from "react";
import {
  ShoppingCart, Package, LayoutDashboard, Settings, Home,
  ChevronRight, Star, Shield, Truck, RefreshCw, Search,
  Plus, Minus, Trash2, Calendar, MapPin, Bell, LogOut,
  CheckCircle, Clock, Wrench, TrendingUp, Users, Box,
  ArrowRight, Filter, X, AlertCircle, BarChart2, ChevronDown,
  Sofa, Tv, Wind, Refrigerator, WashingMachine, BedDouble,
  UtensilsCrossed, Armchair, BookOpen, Zap
} from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Queen Bed Frame", category: "furniture", icon: "🛏️", monthlyRent: 649, deposit: 1299, tenureOptions: [3,6,12,24], available: 8, rating: 4.7, description: "Premium solid wood queen bed frame with headboard. Easy assembly, sturdy build.", tags: ["Popular"] },
  { id: 2, name: "3-Seater Sofa", category: "furniture", icon: "🛋️", monthlyRent: 899, deposit: 1799, tenureOptions: [3,6,12,24], available: 5, rating: 4.8, description: "Comfortable fabric sofa with cushioned armrests. Perfect for living rooms.", tags: ["Bestseller"] },
  { id: 3, name: "Dining Table Set", category: "furniture", icon: "🪑", monthlyRent: 549, deposit: 1099, tenureOptions: [3,6,12,24], available: 4, rating: 4.5, description: "4-seater dining table set with chairs. Modern design in walnut finish.", tags: [] },
  { id: 4, name: "Study Desk & Chair", category: "furniture", icon: "📚", monthlyRent: 399, deposit: 799, tenureOptions: [3,6,12,24], available: 12, rating: 4.6, description: "Ergonomic study setup with adjustable chair and spacious desk.", tags: ["New"] },
  { id: 5, name: "Wardrobe (3-door)", category: "furniture", icon: "🚪", monthlyRent: 749, deposit: 1499, tenureOptions: [6,12,24], available: 6, rating: 4.4, description: "Spacious 3-door wardrobe with mirror and internal shelving system.", tags: [] },
  { id: 6, name: "Single Bed Frame", category: "furniture", icon: "🛏️", monthlyRent: 449, deposit: 899, tenureOptions: [3,6,12,24], available: 10, rating: 4.5, description: "Compact single bed frame, ideal for PGs and studio apartments.", tags: [] },
  { id: 7, name: "Double Door Fridge", category: "appliance", icon: "🧊", monthlyRent: 999, deposit: 1999, tenureOptions: [6,12,24], available: 7, rating: 4.8, description: "260L double-door refrigerator with frost-free technology.", tags: ["Bestseller"] },
  { id: 8, name: "Front Load Washer", category: "appliance", icon: "🫧", monthlyRent: 799, deposit: 1599, tenureOptions: [6,12,24], available: 5, rating: 4.7, description: "6kg front-load washing machine with 12 wash programs.", tags: ["Popular"] },
  { id: 9, name: '43" Smart LED TV', category: "appliance", icon: "📺", monthlyRent: 699, deposit: 1399, tenureOptions: [3,6,12,24], available: 9, rating: 4.6, description: "43-inch Full HD Smart TV with built-in streaming apps.", tags: [] },
  { id: 10, name: "Microwave Oven", category: "appliance", icon: "♨️", monthlyRent: 349, deposit: 699, tenureOptions: [3,6,12,24], available: 15, rating: 4.4, description: "20L solo microwave oven with 5 power levels.", tags: ["New"] },
  { id: 11, name: "Split AC (1.5 Ton)", category: "appliance", icon: "❄️", monthlyRent: 1299, deposit: 2599, tenureOptions: [6,12,24], available: 4, rating: 4.9, description: "1.5-ton 5-star split AC with inverter technology.", tags: ["Premium"] },
  { id: 12, name: "Air Purifier", category: "appliance", icon: "💨", monthlyRent: 449, deposit: 899, tenureOptions: [3,6,12,24], available: 8, rating: 4.5, description: "HEPA air purifier covering up to 400 sq ft area.", tags: [] },
];

const ACTIVE_RENTALS_DEFAULT = [
  { id: "R001", product: PRODUCTS[0], tenure: 12, startDate: "2024-11-01", monthsPaid: 5, address: "Flat 3B, Sunrise Apts, Bangalore", status: "active" },
  { id: "R002", product: PRODUCTS[8], tenure: 6, startDate: "2025-01-15", monthsPaid: 2, address: "Flat 3B, Sunrise Apts, Bangalore", status: "active" },
  { id: "R003", product: PRODUCTS[6], tenure: 12, startDate: "2024-11-01", monthsPaid: 5, address: "Flat 3B, Sunrise Apts, Bangalore", status: "maintenance" },
];

const MAINTENANCE_REQUESTS_DEFAULT = [
  { id: "M001", rentalId: "R003", product: "Double Door Fridge", issue: "Not cooling properly", date: "2025-03-28", status: "in-progress" },
];

const TENURE_DISCOUNTS = { 3: 0, 6: 5, 12: 10, 24: 15 };

function Badge({ children, color = "amber" }) {
  const colors = {
    amber: "bg-amber-100 text-amber-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>{children}</span>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { label: "Active", color: "green" },
    maintenance: { label: "Maintenance", color: "amber" },
    completed: { label: "Completed", color: "slate" },
    "in-progress": { label: "In Progress", color: "amber" },
    pending: { label: "Pending", color: "blue" },
    resolved: { label: "Resolved", color: "green" },
  };
  const s = map[status] || { label: status, color: "slate" };
  return <Badge color={s.color}>{s.label}</Badge>;
}

function ProductCard({ product, onAdd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-36 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative">
        <span className="text-6xl">{product.icon}</span>
        {product.tags[0] && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.tags[0]}</span>
        )}
        <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${product.available > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {product.available > 0 ? `${product.available} left` : "Out of stock"}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</h3>
          <div className="flex items-center gap-0.5 ml-2 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-slate-600">{product.rating}</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 flex-1">{product.description}</p>
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-slate-400">From</span>
              <div className="font-bold text-slate-900 text-base">₹{product.monthlyRent}<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <div className="text-xs text-slate-400">Deposit ₹{product.deposit}</div>
            </div>
            <button
              onClick={() => onAdd(product)}
              disabled={product.available === 0}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onAddToCart }) {
  const [selectedTenure, setSelectedTenure] = useState(product.tenureOptions[1] || product.tenureOptions[0]);
  const discount = TENURE_DISCOUNTS[selectedTenure] || 0;
  const discountedRent = Math.round(product.monthlyRent * (1 - discount / 100));
  const totalRent = discountedRent * selectedTenure;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center relative">
          <span className="text-8xl">{product.icon}</span>
          <button onClick={onClose} className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-1 transition-colors">
            <X className="w-4 h-4 text-slate-600" />
          </button>
          {product.tags[0] && <Badge color="amber">{product.tags[0]}</Badge>}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-slate-700">{product.rating}</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-5">{product.description}</p>

          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Select Rental Tenure</p>
            <div className="grid grid-cols-4 gap-2">
              {product.tenureOptions.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTenure(t)}
                  className={`py-2 rounded-xl border text-sm font-semibold transition-all ${selectedTenure === t ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 text-slate-600 hover:border-amber-300"}`}
                >
                  {t}mo
                  {TENURE_DISCOUNTS[t] > 0 && <div className="text-xs opacity-80">{TENURE_DISCOUNTS[t]}% off</div>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Monthly rent</span>
              <span className="font-semibold text-slate-800">
                {discount > 0 && <span className="line-through text-slate-400 mr-1">₹{product.monthlyRent}</span>}
                ₹{discountedRent}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Security deposit</span>
              <span className="font-semibold text-slate-800">₹{product.deposit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total for {selectedTenure} months</span>
              <span className="font-semibold text-slate-800">₹{totalRent}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>You save</span>
                <span className="font-semibold">₹{(product.monthlyRent - discountedRent) * selectedTenure}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => { onAddToCart(product, selectedTenure); onClose(); }}
              disabled={product.available === 0}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onNavigate, onAdd }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-amber-400" style={{ width: Math.random()*60+20, height: Math.random()*60+20, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.5+0.1 }} />
          ))}
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1 text-amber-300 text-xs font-medium mb-4">
            <Zap className="w-3 h-3" /> Free delivery + setup on all orders
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Rent Premium Furniture<br />
            <span className="text-amber-400">&amp; Appliances</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-lg">Affordable monthly rentals for students & professionals. No upfront cost, free maintenance, easy relocation.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate("browse")} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
              Browse Products <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate("rentals")} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              My Rentals
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🏠", val: "10,000+", label: "Happy Renters" },
            { icon: "📦", val: "500+", label: "Products" },
            { icon: "🌆", val: "12", label: "Cities" },
            { icon: "⭐", val: "4.8/5", label: "Avg Rating" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-extrabold text-slate-900 text-xl">{s.val}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Browse by Category</h2>
        <p className="text-slate-500 mb-6">Everything you need for a complete home setup</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: "🛋️", label: "Sofas & Seating", count: 12, cat: "furniture" },
            { icon: "🛏️", label: "Beds & Mattresses", count: 8, cat: "furniture" },
            { icon: "🧊", label: "Refrigerators", count: 5, cat: "appliance" },
            { icon: "📺", label: "Televisions", count: 6, cat: "appliance" },
          ].map(c => (
            <button key={c.label} onClick={() => onNavigate("browse")} className="bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl p-5 text-center transition-all group">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-semibold text-slate-800 text-sm group-hover:text-amber-700">{c.label}</div>
              <div className="text-xs text-slate-400 mt-1">{c.count} items</div>
            </button>
          ))}
        </div>

        {/* Featured */}
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Featured Products</h2>
        <p className="text-slate-500 mb-6">Most rented this month</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {PRODUCTS.filter(p => p.tags.length > 0).slice(0, 6).map(p => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>

        {/* Why RentEase */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">Why RentEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "No Hidden Costs", desc: "Transparent pricing. What you see is what you pay." },
              { icon: Wrench, title: "Free Maintenance", desc: "All repairs handled by us at zero extra charge." },
              { icon: Truck, title: "Free Delivery", desc: "Free delivery & professional installation included." },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-1">{f.title}</div>
                  <div className="text-sm text-slate-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowsePage({ onAdd }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let p = PRODUCTS;
    if (cat !== "all") p = p.filter(x => x.category === cat);
    if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "price-asc") p = [...p].sort((a, b) => a.monthlyRent - b.monthlyRent);
    if (sort === "price-desc") p = [...p].sort((a, b) => b.monthlyRent - a.monthlyRent);
    if (sort === "rating") p = [...p].sort((a, b) => b.rating - a.rating);
    return p;
  }, [cat, search, sort]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Browse Products</h1>
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "furniture", "appliance"].map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${cat === c ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 text-slate-600 hover:border-amber-300"}`}>
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none">
          <option value="popular">Popular</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <p className="text-sm text-slate-500 mb-4">{filtered.length} products found</p>
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
        </div>
      )}
    </div>
  );
}

function CartPage({ cart, onUpdate, onRemove, onCheckout }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "Darshan K", phone: "9876543210", address: "Flat 3B, Sunrise Apartments, Bangalore", city: "Bangalore", pincode: "560001", date: "" });

  const subtotal = cart.reduce((s, i) => s + Math.round(i.product.monthlyRent * (1 - (TENURE_DISCOUNTS[i.tenure] || 0) / 100)) * i.tenure, 0);
  const totalDeposit = cart.reduce((s, i) => s + i.product.deposit, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-6">Add products from the Browse page to get started.</p>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed!</h2>
        <p className="text-slate-500 mb-6">Your rental order has been confirmed. Our team will contact you within 24 hours for delivery scheduling.</p>
        <div className="bg-slate-50 rounded-xl p-4 text-left mb-6 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-500">Order ID</span><span className="font-mono font-bold text-slate-800">#RE{Math.floor(Math.random()*90000+10000)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Items</span><span className="font-semibold">{cart.length}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Total Deposit</span><span className="font-semibold">₹{totalDeposit.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-500">Delivery to</span><span className="font-semibold text-right max-w-[60%]">{form.address}</span></div>
        </div>
        <button onClick={onCheckout} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl w-full transition-colors">
          Go to My Rentals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
        {step === 1 ? "Your Cart" : "Delivery Details"}
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {["Cart", "Address", "Confirm"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? "text-slate-800" : "text-slate-400"}`}>{s}</span>
            {i < 2 && <ChevronRight className="w-4 h-4 text-slate-300" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            {cart.map(item => {
              const disc = TENURE_DISCOUNTS[item.tenure] || 0;
              const rent = Math.round(item.product.monthlyRent * (1 - disc / 100));
              return (
                <div key={item.product.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-3xl shrink-0">{item.product.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">{item.product.name}</div>
                    <div className="text-xs text-slate-400 mb-2">Security deposit: ₹{item.product.deposit.toLocaleString()}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.product.tenureOptions.map(t => (
                        <button key={t} onClick={() => onUpdate(item.product.id, t)} className={`px-2 py-1 rounded-lg border text-xs font-semibold transition-all ${item.tenure === t ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 text-slate-500 hover:border-amber-300"}`}>
                          {t}mo
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900">₹{rent.toLocaleString()}/mo</div>
                    {disc > 0 && <div className="text-xs text-green-500">{disc}% off</div>}
                    <button onClick={() => onRemove(item.product.id)} className="text-red-400 hover:text-red-600 mt-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:w-72 bg-white border border-slate-100 rounded-2xl p-5 h-fit">
            <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {cart.map(i => (
                <div key={i.product.id} className="flex justify-between text-slate-600">
                  <span className="truncate mr-2">{i.product.name}</span>
                  <span className="shrink-0">₹{Math.round(i.product.monthlyRent * (1 - (TENURE_DISCOUNTS[i.tenure] || 0) / 100)).toLocaleString()} × {i.tenure}mo</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Total Rent</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-600"><span>Total Deposit</span><span>₹{totalDeposit.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-600 font-medium"><span>Delivery</span><span>FREE</span></div>
            </div>
            <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold text-slate-900">
              <span>Due Now</span><span>₹{totalDeposit.toLocaleString()}</span>
            </div>
            <button onClick={() => setStep(2)} className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
              Proceed to Address →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[["Full Name", "name"], ["Phone Number", "phone"]].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Full Address</label>
              <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["City", "city"], ["Pincode", "pincode"]].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Preferred Delivery Date</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} min={new Date().toISOString().split("T")[0]} />
            </div>
          </div>
          <div className="lg:w-72 space-y-3">
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 mb-3">Due Now</h3>
              <div className="text-3xl font-extrabold text-amber-500 mb-1">₹{totalDeposit.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Security deposit. Fully refundable.</p>
            </div>
            <button onClick={() => setStep(3)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
              Confirm Order →
            </button>
            <button onClick={() => setStep(1)} className="w-full border border-slate-200 text-slate-600 font-semibold py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RentalsPage({ rentals, onMaintenance }) {
  const [showMaintForm, setShowMaintForm] = useState(null);
  const [issue, setIssue] = useState("");
  const [requests, setRequests] = useState(MAINTENANCE_REQUESTS_DEFAULT);

  const handleSubmit = (rentalId, product) => {
    setRequests(r => [...r, { id: `M${Date.now()}`, rentalId, product, issue, date: new Date().toISOString().split("T")[0], status: "pending" }]);
    setShowMaintForm(null);
    setIssue("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">My Rentals</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Rentals", val: rentals.filter(r => r.status === "active").length, icon: Package, color: "amber" },
          { label: "Monthly Due", val: `₹${rentals.reduce((s,r) => s + r.product.monthlyRent, 0).toLocaleString()}`, icon: TrendingUp, color: "green" },
          { label: "Months Completed", val: rentals.reduce((s,r) => s + r.monthsPaid, 0), icon: CheckCircle, color: "blue" },
          { label: "Maintenance", val: requests.filter(r => r.status !== "resolved").length, icon: Wrench, color: "red" },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-100 rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${k.color === "amber" ? "bg-amber-100" : k.color === "green" ? "bg-green-100" : k.color === "blue" ? "bg-blue-100" : "bg-red-100"}`}>
              <k.icon className={`w-4 h-4 ${k.color === "amber" ? "text-amber-600" : k.color === "green" ? "text-green-600" : k.color === "blue" ? "text-blue-600" : "text-red-500"}`} />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{k.val}</div>
            <div className="text-xs text-slate-400">{k.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Active Rentals</h2>
      <div className="space-y-4 mb-8">
        {rentals.map(r => {
          const progress = Math.round((r.monthsPaid / r.tenure) * 100);
          const remaining = r.tenure - r.monthsPaid;
          return (
            <div key={r.id} className="bg-white border border-slate-100 rounded-2xl p-5">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-3xl shrink-0">{r.product.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-slate-900">{r.product.name}</h3>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" />{r.address}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Started {r.startDate} · {r.tenure}mo plan</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-slate-900">₹{r.product.monthlyRent.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <div className="text-xs text-slate-400">{remaining} months left</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{r.monthsPaid} of {r.tenure} months paid</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowMaintForm(r.id)} className="flex-1 text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-colors">
                  <Wrench className="w-3 h-3" /> Request Maintenance
                </button>
                <button className="flex-1 text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg py-1.5 flex items-center justify-center gap-1 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Extend Tenure
                </button>
              </div>
              {showMaintForm === r.id && (
                <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Describe the issue</p>
                  <textarea rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 mb-2" placeholder="e.g. Not cooling, making noise..." value={issue} onChange={e => setIssue(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => handleSubmit(r.id, r.product.name)} disabled={!issue.trim()} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">Submit</button>
                    <button onClick={() => setShowMaintForm(null)} className="text-slate-500 text-xs px-4 py-1.5 border border-slate-200 rounded-lg hover:bg-white transition-colors">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {requests.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Maintenance Requests</h2>
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{req.product}</div>
                  <div className="text-xs text-slate-400">{req.issue} · {req.date}</div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AdminPage() {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(PRODUCTS);

  const stats = {
    activeRentals: 128,
    totalRevenue: 342500,
    pendingDeliveries: 14,
    maintenanceOpen: 8,
    productUtilization: 74,
    topProduct: "Double Door Fridge",
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-400">Manage inventory, orders & analytics</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-100 pb-1">
        {[["overview", "Overview"], ["inventory", "Inventory"], ["orders", "Orders"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === key ? "bg-amber-500 text-white" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Active Rentals", val: stats.activeRentals, icon: Package, delta: "+12%", color: "amber" },
              { label: "Monthly Revenue", val: `₹${(stats.totalRevenue / 1000).toFixed(0)}k`, icon: TrendingUp, delta: "+8%", color: "green" },
              { label: "Pending Deliveries", val: stats.pendingDeliveries, icon: Truck, delta: "-3%", color: "blue" },
              { label: "Open Maintenance", val: stats.maintenanceOpen, icon: Wrench, delta: "+2", color: "red" },
              { label: "Utilization Rate", val: `${stats.productUtilization}%`, icon: BarChart2, delta: "+5%", color: "amber" },
              { label: "Total Users", val: "2,840", icon: Users, delta: "+18%", color: "green" },
            ].map(k => (
              <div key={k.label} className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.color === "amber" ? "bg-amber-100" : k.color === "green" ? "bg-green-100" : k.color === "blue" ? "bg-blue-100" : "bg-red-100"}`}>
                    <k.icon className={`w-4 h-4 ${k.color === "amber" ? "text-amber-600" : k.color === "green" ? "text-green-600" : k.color === "blue" ? "text-blue-600" : "text-red-500"}`} />
                  </div>
                  <span className={`text-xs font-semibold ${k.delta.startsWith("+") ? "text-green-500" : "text-red-400"}`}>{k.delta}</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">{k.val}</div>
                <div className="text-xs text-slate-400">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-4">Top Products by Rentals</h3>
            <div className="space-y-3">
              {PRODUCTS.slice(0, 6).map((p, i) => {
                const pct = Math.max(30, 95 - i * 10);
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-lg w-8">{p.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-slate-400">{pct}% utilized</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Product Inventory</h3>
              <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Product", "Category", "Monthly Rent", "Deposit", "Available", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p.icon}</span>
                          <span className="font-medium text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={p.category === "furniture" ? "amber" : "blue"}>{p.category}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">₹{p.monthlyRent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500">₹{p.deposit.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${p.available > 5 ? "text-green-600" : p.available > 0 ? "text-amber-600" : "text-red-500"}`}>{p.available}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={p.available > 0 ? "green" : "red"}>{p.available > 0 ? "In Stock" : "Out of Stock"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          {ACTIVE_RENTALS_DEFAULT.concat([
            { id: "R004", product: PRODUCTS[3], tenure: 6, startDate: "2025-02-01", monthsPaid: 2, address: "HSR Layout, Bangalore", status: "active" },
            { id: "R005", product: PRODUCTS[10], tenure: 12, startDate: "2025-01-20", monthsPaid: 3, address: "Whitefield, Bangalore", status: "active" },
          ]).map(r => (
            <div key={r.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-xl shrink-0">{r.product.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-slate-800 text-sm">{r.product.name}</span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-xs text-slate-400">{r.id} · {r.address} · {r.tenure}mo plan</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-slate-800 text-sm">₹{r.product.monthlyRent.toLocaleString()}/mo</div>
                <div className="text-xs text-slate-400">Since {r.startDate}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RentEase() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [rentals] = useState(ACTIVE_RENTALS_DEFAULT);
  const [modalProduct, setModalProduct] = useState(null);

  const handleAdd = (product) => setModalProduct(product);
  const handleAddToCart = (product, tenure) => {
    setCart(c => {
      const exists = c.find(i => i.product.id === product.id);
      if (exists) return c.map(i => i.product.id === product.id ? { ...i, tenure } : i);
      return [...c, { product, tenure }];
    });
  };
  const handleUpdateTenure = (productId, tenure) => setCart(c => c.map(i => i.product.id === productId ? { ...i, tenure } : i));
  const handleRemove = (productId) => setCart(c => c.filter(i => i.product.id !== productId));
  const handleCheckout = () => { setCart([]); setPage("rentals"); };

  const navItems = [
    { key: "home", label: "Home", icon: Home },
    { key: "browse", label: "Browse", icon: Package },
    { key: "cart", label: "Cart", icon: ShoppingCart, badge: cart.length },
    { key: "rentals", label: "My Rentals", icon: LayoutDashboard },
    { key: "admin", label: "Admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("home")}>
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">RE</span>
            </div>
            <span className="font-extrabold text-slate-900 text-lg">RentEase</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button key={n.key} onClick={() => setPage(n.key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors relative ${page === n.key ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
                <n.icon className="w-4 h-4" />
                {n.label}
                {n.badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{n.badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">DK</div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
        <div className="flex">
          {navItems.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold relative ${page === n.key ? "text-amber-600" : "text-slate-400"}`}>
              <n.icon className="w-5 h-5 mb-0.5" />
              {n.label}
              {n.badge > 0 && (
                <span className="absolute top-1 left-1/2 ml-2 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{n.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <main className="pb-16 md:pb-0">
        {page === "home" && <HomePage onNavigate={setPage} onAdd={handleAdd} />}
        {page === "browse" && <BrowsePage onAdd={handleAdd} />}
        {page === "cart" && <CartPage cart={cart} onUpdate={handleUpdateTenure} onRemove={handleRemove} onCheckout={handleCheckout} />}
        {page === "rentals" && <RentalsPage rentals={rentals} />}
        {page === "admin" && <AdminPage />}
      </main>

      {/* Product Modal */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
