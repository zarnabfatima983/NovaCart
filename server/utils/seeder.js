const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

mongoose.connect(process.env.MONGO_URI);

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Cutting-edge gadgets, devices and accessories for the modern tech enthusiast.', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', icon: '💻', color: '#6366f1' },
  { name: 'Fashion', slug: 'fashion', description: 'Trendy clothing, footwear, and accessories for every style.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', icon: '👗', color: '#ec4899' },
  { name: 'Beauty', slug: 'beauty', description: 'Premium skincare, makeup, and wellness products.', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', icon: '💄', color: '#f43f5e' },
  { name: 'Home & Living', slug: 'home-living', description: 'Transform your living space with elegant home décor and essentials.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', icon: '🏠', color: '#10b981' },
  { name: 'Accessories', slug: 'accessories', description: 'Stylish bags, watches, jewelry, and more to complete any outfit.', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', icon: '⌚', color: '#f59e0b' },
  { name: 'Sports', slug: 'sports', description: 'Equipment and gear for athletes and fitness enthusiasts.', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', icon: '⚽', color: '#3b82f6' },
  { name: 'Books', slug: 'books', description: 'Explore bestsellers, classics, and educational titles across every genre.', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', icon: '📚', color: '#8b5cf6' },
  { name: 'Gaming', slug: 'gaming', description: 'Consoles, games, peripherals, and accessories for gamers.', image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=400', icon: '🎮', color: '#06b6d4' },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const createProducts = (catMap) => [
  // ELECTRONICS
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with exceptional sound quality. The WH-1000XM5 features 30-hour battery life, multipoint connection, and crystal-clear hands-free calling. Perfect for travel, work from home, and daily commute.',
    shortDescription: 'Premium noise-cancelling wireless headphones with 30-hour battery.',
    price: 399.99, discount: 15,
    category: catMap['Electronics'], brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'],
    stock: 45, isFeatured: true, isNewArrival: false, isOnSale: true,
    colors: ['Black', 'Silver', 'Midnight Blue'],
    specifications: [{ name: 'Battery Life', value: '30 hours' }, { name: 'Connectivity', value: 'Bluetooth 5.2' }, { name: 'Weight', value: '250g' }, { name: 'Charging', value: 'USB-C' }],
    tags: ['headphones', 'wireless', 'noise-cancelling', 'sony'],
  },
  {
    name: 'Apple MacBook Pro 16" M3 Pro',
    description: 'The most powerful MacBook Pro ever. Featuring the M3 Pro chip with a 12-core CPU and 18-core GPU, up to 36GB unified memory, and an incredible Liquid Retina XDR display. Built for professionals who demand ultimate performance.',
    shortDescription: 'Powerhouse laptop with M3 Pro chip and stunning Liquid Retina XDR display.',
    price: 2499.99, discount: 0,
    category: catMap['Electronics'], brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600','https://images.unsplash.com/photo-1611186871525-7dc3d35ad9e8?w=600'],
    stock: 20, isFeatured: true, isNewArrival: true, isOnSale: false,
    colors: ['Space Black', 'Silver'],
    specifications: [{ name: 'Chip', value: 'Apple M3 Pro' }, { name: 'RAM', value: '18GB Unified' }, { name: 'Storage', value: '512GB SSD' }, { name: 'Display', value: '16.2" Liquid Retina XDR' }],
    tags: ['laptop', 'apple', 'macbook', 'professional'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate Galaxy experience. With the built-in S Pen, a 200MP camera, and titanium frame, the S24 Ultra pushes boundaries. AI-powered features transform the way you capture, create, and communicate.',
    shortDescription: 'Flagship Android smartphone with built-in S Pen and 200MP camera.',
    price: 1299.99, discount: 10,
    category: catMap['Electronics'], brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600','https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600'],
    stock: 35, isFeatured: true, isNewArrival: true, isOnSale: true,
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
    specifications: [{ name: 'Display', value: '6.8" QHD+ Dynamic AMOLED' }, { name: 'Camera', value: '200MP Quad Camera' }, { name: 'Battery', value: '5000mAh' }, { name: 'Processor', value: 'Snapdragon 8 Gen 3' }],
    tags: ['smartphone', 'samsung', 'android', 's-pen'],
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'The ultimate iPad experience with M2 chip. Blazing-fast performance, stunning Liquid Retina XDR display, Apple Pencil hover, and all-day battery life. The computer that reimagines the computer.',
    shortDescription: 'Pro-grade tablet with M2 chip and stunning Liquid Retina XDR display.',
    price: 1099.99, discount: 8,
    category: catMap['Electronics'], brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600','https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=600'],
    stock: 28, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Space Gray', 'Silver'],
    specifications: [{ name: 'Chip', value: 'Apple M2' }, { name: 'Display', value: '12.9" Liquid Retina XDR' }, { name: 'Storage', value: '256GB' }, { name: 'Battery', value: 'Up to 10 hours' }],
    tags: ['tablet', 'apple', 'ipad'],
  },
  {
    name: 'LG 27" 4K UltraFine Monitor',
    description: 'Professional 27" 4K monitor designed for creative professionals. With IPS panel, 99% DCI-P3 color coverage, Thunderbolt 4 connectivity, and built-in calibration, it delivers studio-quality accuracy.',
    shortDescription: '27" 4K IPS monitor with 99% DCI-P3 and Thunderbolt 4.',
    price: 699.99, discount: 20,
    category: catMap['Electronics'], brand: 'LG',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'],
    stock: 15, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Silver'],
    specifications: [{ name: 'Resolution', value: '3840x2160 (4K)' }, { name: 'Panel', value: 'IPS' }, { name: 'Refresh Rate', value: '60Hz' }, { name: 'Connectivity', value: 'Thunderbolt 4, USB-C' }],
    tags: ['monitor', 'lg', '4k', 'professional'],
  },
  {
    name: 'Bose QuietComfort Earbuds II',
    description: 'Personalized noise cancellation with CustomTune technology that automatically calibrates to your ear. Up to 6 hours battery + 12 more from the case. Premium audio in an ultra-compact form.',
    shortDescription: 'True wireless earbuds with personalized noise cancellation.',
    price: 279.99, discount: 12,
    category: catMap['Electronics'], brand: 'Bose',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    stock: 60, isFeatured: true, isNewArrival: false, isOnSale: true,
    colors: ['Triple Black', 'Soapstone'],
    specifications: [{ name: 'Battery', value: '6hrs + 12hrs case' }, { name: 'Connectivity', value: 'Bluetooth 5.3' }, { name: 'Water Resistance', value: 'IPX4' }, { name: 'ANC', value: 'CustomTune' }],
    tags: ['earbuds', 'bose', 'wireless', 'noise-cancelling'],
  },

  // FASHION
  {
    name: 'Premium Merino Wool Crewneck Sweater',
    description: 'Crafted from 100% superfine Merino wool, this crewneck sweater delivers unmatched softness, temperature regulation, and durability. A wardrobe staple that transitions seamlessly from office to weekend.',
    shortDescription: '100% Merino wool sweater — soft, warm, and timeless.',
    price: 189.99, discount: 0,
    category: catMap['Fashion'], brand: 'Everlane',
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'],
    stock: 80, isFeatured: true, isNewArrival: true, isOnSale: false,
    colors: ['Navy', 'Camel', 'Heather Gray', 'Ivory'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    specifications: [{ name: 'Material', value: '100% Merino Wool' }, { name: 'Fit', value: 'Regular' }, { name: 'Care', value: 'Hand wash cold' }],
    tags: ['sweater', 'wool', 'merino', 'knitwear'],
  },
  {
    name: 'Slim-Fit Chino Pants',
    description: 'These versatile slim-fit chinos are crafted from a stretch-cotton blend for all-day comfort and a polished appearance. Perfect for both smart-casual office looks and weekend outings.',
    shortDescription: 'Versatile stretch-cotton slim-fit chinos for any occasion.',
    price: 89.99, discount: 25,
    category: catMap['Fashion'], brand: 'Banana Republic',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
    stock: 120, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Khaki', 'Navy', 'Olive', 'Black'],
    sizes: ['28x30', '30x30', '32x30', '34x30', '36x30'],
    specifications: [{ name: 'Material', value: '97% Cotton, 3% Elastane' }, { name: 'Fit', value: 'Slim' }, { name: 'Rise', value: 'Mid-Rise' }],
    tags: ['pants', 'chinos', 'slim-fit'],
  },
  {
    name: 'Classic White Oxford Shirt',
    description: 'The timeless Oxford shirt reimagined. Made from premium pinpoint Oxford cotton with a subtle texture, this shirt goes from business meetings to casual Fridays with ease. Button-down collar, chest pocket.',
    shortDescription: 'Premium pinpoint Oxford cotton shirt — the perfect everyday essential.',
    price: 120.00, discount: 0,
    category: catMap['Fashion'], brand: 'Brooks Brothers',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600'],
    stock: 95, isFeatured: false, isNewArrival: true, isOnSale: false,
    colors: ['White', 'Light Blue', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: [{ name: 'Material', value: '100% Cotton Oxford' }, { name: 'Collar', value: 'Button-Down' }, { name: 'Fit', value: 'Classic' }],
    tags: ['shirt', 'oxford', 'button-down'],
  },
  {
    name: 'Leather Chelsea Boots',
    description: 'Handcrafted from full-grain leather with a stacked heel and elastic side panels, these Chelsea boots combine timeless style with everyday wearability. Blake-stitched construction ensures longevity.',
    shortDescription: 'Handcrafted full-grain leather Chelsea boots with stacked heel.',
    price: 299.99, discount: 0,
    category: catMap['Fashion'], brand: 'Thursday Boot Company',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    stock: 40, isFeatured: true, isNewArrival: false, isOnSale: false,
    colors: ['Dark Brown', 'Black', 'Cognac'],
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    specifications: [{ name: 'Upper', value: 'Full-Grain Leather' }, { name: 'Sole', value: 'Rubber' }, { name: 'Construction', value: 'Blake-Stitched' }],
    tags: ['boots', 'chelsea', 'leather'],
  },

  // BEAUTY
  {
    name: 'La Mer Crème de la Mer Moisturizing Cream',
    description: 'The legendary moisturizer with miracle Broth™ at its heart. Powered by our fermentation process, this rich cream visibly transforms skin, leaving it renewed, restored, and deeply hydrated.',
    shortDescription: 'The iconic luxury moisturizing cream that transforms skin.',
    price: 185.00, discount: 0,
    category: catMap['Beauty'], brand: 'La Mer',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
    stock: 50, isFeatured: true, isNewArrival: false, isOnSale: false,
    specifications: [{ name: 'Size', value: '1 oz / 30ml' }, { name: 'Skin Type', value: 'All Skin Types' }, { name: 'Key Ingredient', value: 'Miracle Broth™' }],
    tags: ['moisturizer', 'luxury', 'skincare', 'la mer'],
  },
  {
    name: 'Charlotte Tilbury Airbrush Flawless Foundation',
    description: 'A bestselling, full-coverage, skin-blurring liquid foundation. Lightweight formula feels like nothing on skin while blurring pores, fine lines, and imperfections for a perfect airbrush finish.',
    shortDescription: 'Full-coverage skin-blurring foundation for a perfect airbrush finish.',
    price: 49.00, discount: 0,
    category: catMap['Beauty'], brand: 'Charlotte Tilbury',
    images: ['https://images.unsplash.com/photo-1631214524020-3c69d43d6b53?w=600'],
    stock: 75, isFeatured: false, isNewArrival: true, isOnSale: false,
    colors: ['1 Cool', '2 Neutral', '3 Warm', '4 Fair', '5 Medium', '8 Deep'],
    specifications: [{ name: 'Coverage', value: 'Full' }, { name: 'Finish', value: 'Matte' }, { name: 'SPF', value: 'SPF 20' }],
    tags: ['foundation', 'makeup', 'full-coverage'],
  },
  {
    name: 'Dyson Airwrap Multi-Styler',
    description: 'Style and dry hair simultaneously with no extreme heat. The Airwrap uses the Coanda effect to attract and wrap hair around the barrel, creating curls, waves, and smooth styles without damage.',
    shortDescription: 'The revolutionary multi-styler that curls, waves, and smoothes without extreme heat.',
    price: 599.99, discount: 0,
    category: catMap['Beauty'], brand: 'Dyson',
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'],
    stock: 25, isFeatured: true, isNewArrival: false, isOnSale: false,
    colors: ['Fuchsia/Nickel', 'Copper/Nickel', 'Prussian Blue/Rich Copper'],
    specifications: [{ name: 'Technology', value: 'Coanda Effect' }, { name: 'Heat Settings', value: '3' }, { name: 'Attachments', value: '6 included' }],
    tags: ['hair', 'styling', 'dyson'],
  },

  // HOME & LIVING
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    description: 'Replace 7 appliances with one: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. Cook up to 70% faster than traditional cooking methods.',
    shortDescription: '7-in-1 multi-cooker that replaces multiple kitchen appliances.',
    price: 99.99, discount: 30,
    category: catMap['Home & Living'], brand: 'Instant Pot',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
    stock: 65, isFeatured: false, isNewArrival: false, isOnSale: true,
    specifications: [{ name: 'Capacity', value: '6 Quart' }, { name: 'Functions', value: '7-in-1' }, { name: 'Material', value: 'Stainless Steel' }, { name: 'Safety', value: '10 Safety Mechanisms' }],
    tags: ['kitchen', 'pressure-cooker', 'instant-pot'],
  },
  {
    name: 'Casper Original Foam Mattress',
    description: 'The original bed-in-a-box with four layers of premium foam including pressure-relieving memory foam and a supportive base layer. Designed to keep you cool, comfortable, and supported all night.',
    shortDescription: 'The original pressure-relieving foam mattress for perfect sleep.',
    price: 995.00, discount: 10,
    category: catMap['Home & Living'], brand: 'Casper',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'],
    stock: 12, isFeatured: true, isNewArrival: false, isOnSale: true,
    sizes: ['Twin', 'Full', 'Queen', 'King', 'Cal King'],
    specifications: [{ name: 'Material', value: 'Memory Foam' }, { name: 'Height', value: '11 inches' }, { name: 'Trial', value: '100 nights' }, { name: 'Warranty', value: '10 years' }],
    tags: ['mattress', 'sleep', 'foam', 'casper'],
  },
  {
    name: 'Philips Hue Smart Bulb Starter Kit',
    description: 'Transform your home with millions of colors and white light shades. Control with voice, app, or switch. Includes 4 color bulbs and the Hue Bridge for a complete smart lighting setup.',
    shortDescription: 'Smart lighting starter kit with 4 color bulbs and Hue Bridge.',
    price: 199.99, discount: 0,
    category: catMap['Home & Living'], brand: 'Philips',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    stock: 45, isFeatured: false, isNewArrival: true, isOnSale: false,
    specifications: [{ name: 'Bulbs', value: '4 x A19 Color Bulbs' }, { name: 'Colors', value: '16 million' }, { name: 'Compatibility', value: 'Alexa, Google, Apple HomeKit' }],
    tags: ['smart home', 'lighting', 'philips hue'],
  },

  // ACCESSORIES
  {
    name: 'Rolex Submariner Date 41mm',
    description: 'The iconic Rolex Submariner — the reference among divers\' watches. Water-resistant to 300 metres, featuring the new calibre 3235 movement, Oystersteel case, and Cerachrom bezel insert.',
    shortDescription: 'The iconic luxury diver\'s watch with 300m water resistance.',
    price: 10550.00, discount: 0,
    category: catMap['Accessories'], brand: 'Rolex',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600','https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600'],
    stock: 5, isFeatured: true, isNewArrival: false, isOnSale: false,
    colors: ['Black Dial', 'Blue Dial'],
    specifications: [{ name: 'Case Size', value: '41mm' }, { name: 'Movement', value: 'Calibre 3235' }, { name: 'Water Resistance', value: '300m / 1000ft' }, { name: 'Bracelet', value: 'Oyster' }],
    tags: ['watch', 'luxury', 'rolex', 'diver'],
  },
  {
    name: 'Louis Vuitton Neverfull MM Tote',
    description: 'The Neverfull is the iconic Louis Vuitton bag that has stood the test of time. Made from durable Monogram canvas with a spacious main compartment and internal zip pocket, it is the perfect everyday tote.',
    shortDescription: 'The iconic spacious LV tote bag in classic Monogram canvas.',
    price: 1860.00, discount: 0,
    category: catMap['Accessories'], brand: 'Louis Vuitton',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'],
    stock: 8, isFeatured: false, isNewArrival: false, isOnSale: false,
    colors: ['Monogram', 'Damier Ebene', 'Damier Azur'],
    specifications: [{ name: 'Material', value: 'Monogram Canvas' }, { name: 'Size', value: 'MM (Medium)' }, { name: 'Dimensions', value: '31 × 28 × 14 cm' }],
    tags: ['bag', 'tote', 'luxury', 'louis vuitton'],
  },
  {
    name: 'Ray-Ban Aviator Classic Sunglasses',
    description: 'The original American Classic since 1937. Metal frame, crystal lenses offering 100% UV protection, and that iconic teardrop shape. Available in multiple lens colors to suit every lifestyle.',
    shortDescription: 'The original iconic aviator sunglasses with crystal lenses.',
    price: 183.00, discount: 0,
    category: catMap['Accessories'], brand: 'Ray-Ban',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
    stock: 100, isFeatured: false, isNewArrival: false, isOnSale: false,
    colors: ['Gold/Green', 'Silver/Blue', 'Gold/Brown'],
    specifications: [{ name: 'Frame', value: 'Metal' }, { name: 'Lenses', value: 'Crystal' }, { name: 'UV Protection', value: '100% UV400' }],
    tags: ['sunglasses', 'aviator', 'ray-ban'],
  },

  // SPORTS
  {
    name: 'Nike Air Zoom Pegasus 41',
    description: 'The Nike Pegasus has been your long-run companion for 40 years. The Pegasus 41 brings Air Zoom cushioning for a smooth, responsive ride that keeps you going whether you\'re training or racing.',
    shortDescription: 'The iconic running shoe with Air Zoom cushioning for your best run.',
    price: 130.00, discount: 0,
    category: catMap['Sports'], brand: 'Nike',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    stock: 150, isFeatured: true, isNewArrival: true, isOnSale: false,
    colors: ['Black/White', 'Blue/Orange', 'White/Red'],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    specifications: [{ name: 'Type', value: 'Road Running' }, { name: 'Cushioning', value: 'Air Zoom' }, { name: 'Drop', value: '10mm' }, { name: 'Weight', value: '283g' }],
    tags: ['running', 'shoes', 'nike', 'pegasus'],
  },
  {
    name: 'Peloton Bike+',
    description: 'The Bike+ features a 23.8" HD touchscreen that auto-follows your form, a world-class sound system, Apple GymKit integration, and automatic resistance changes. The most immersive at-home cycling experience.',
    shortDescription: 'The ultimate smart home exercise bike with 23.8" HD touchscreen.',
    price: 2495.00, discount: 0,
    category: catMap['Sports'], brand: 'Peloton',
    images: ['https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600'],
    stock: 8, isFeatured: true, isNewArrival: false, isOnSale: false,
    colors: ['Black'],
    specifications: [{ name: 'Screen', value: '23.8" HD Touchscreen' }, { name: 'Resistance', value: 'Magnetic' }, { name: 'Weight Capacity', value: '297 lbs' }, { name: 'Dimensions', value: '59" L x 22" W' }],
    tags: ['exercise', 'cycling', 'peloton', 'fitness'],
  },
  {
    name: 'Hydro Flask 40 oz Wide Mouth Bottle',
    description: 'TempShield double-wall vacuum insulation keeps beverages cold for up to 24 hours and hot for up to 12 hours. Powder coated exterior provides sure grip and lasting durability.',
    shortDescription: 'Insulated vacuum bottle keeps drinks cold 24hrs, hot 12hrs.',
    price: 44.95, discount: 0,
    category: catMap['Sports'], brand: 'Hydro Flask',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
    stock: 200, isFeatured: false, isNewArrival: false, isOnSale: false,
    colors: ['Pacific', 'Black', 'White', 'Sage', 'Flamingo', 'Cobalt'],
    specifications: [{ name: 'Capacity', value: '40 oz / 1182ml' }, { name: 'Insulation', value: 'TempShield Vacuum' }, { name: 'Material', value: '18/8 Pro-Grade Stainless Steel' }],
    tags: ['water bottle', 'insulated', 'hydro flask'],
  },

  // BOOKS
  {
    name: 'Atomic Habits by James Clear',
    description: 'No.1 New York Times bestseller. An Easy & Proven Way to Build Good Habits & Break Bad Ones. Discover how tiny changes can lead to remarkable results with the definitive guide to habit formation.',
    shortDescription: 'The #1 bestselling guide to building good habits and breaking bad ones.',
    price: 27.00, discount: 20,
    category: catMap['Books'], brand: 'Penguin Random House',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    stock: 300, isFeatured: true, isNewArrival: false, isOnSale: true,
    specifications: [{ name: 'Author', value: 'James Clear' }, { name: 'Pages', value: '320' }, { name: 'Publisher', value: 'Avery' }, { name: 'Language', value: 'English' }],
    tags: ['self-help', 'habits', 'productivity', 'bestseller'],
  },
  {
    name: 'Dune by Frank Herbert',
    description: 'The greatest science fiction novel ever written. Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides and his destiny as the mysterious messiah known as Muad\'Dib.',
    shortDescription: 'The greatest science fiction novel — winner of the Hugo and Nebula Awards.',
    price: 19.99, discount: 0,
    category: catMap['Books'], brand: 'Ace Books',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'],
    stock: 250, isFeatured: false, isNewArrival: false, isOnSale: false,
    specifications: [{ name: 'Author', value: 'Frank Herbert' }, { name: 'Pages', value: '896' }, { name: 'Genre', value: 'Science Fiction' }, { name: 'Award', value: 'Hugo & Nebula Award' }],
    tags: ['sci-fi', 'classic', 'fiction', 'dune'],
  },

  // GAMING
  {
    name: 'PlayStation 5 Console',
    description: 'Play has no limits. Lightning-speed loading with an ultra-high speed SSD, deeper immersion with the DualSense controller\'s haptic feedback, and breathtaking 4K gaming with ray tracing.',
    shortDescription: 'Next-gen gaming with ultra-fast SSD, 4K graphics, and haptic DualSense.',
    price: 499.99, discount: 0,
    category: catMap['Gaming'], brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600','https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=600'],
    stock: 18, isFeatured: true, isNewArrival: false, isOnSale: false,
    colors: ['White'],
    specifications: [{ name: 'CPU', value: 'AMD Zen 2 8-core' }, { name: 'GPU', value: 'AMD RDNA 2' }, { name: 'Storage', value: '825GB Custom SSD' }, { name: 'Resolution', value: 'Up to 8K' }],
    tags: ['gaming', 'console', 'playstation', 'ps5'],
  },
  {
    name: 'Razer DeathAdder V3 Pro Gaming Mouse',
    description: 'The iconic DeathAdder ergonomic design with the Focus Pro 30K optical sensor, Razer HyperSpeed wireless, and up to 90 hours battery life. Engineered for the most demanding esports professionals.',
    shortDescription: 'Pro-grade wireless gaming mouse with Focus Pro 30K sensor.',
    price: 149.99, discount: 15,
    category: catMap['Gaming'], brand: 'Razer',
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=600'],
    stock: 75, isFeatured: false, isNewArrival: true, isOnSale: true,
    colors: ['Black', 'White'],
    specifications: [{ name: 'Sensor', value: 'Focus Pro 30K Optical' }, { name: 'Battery', value: 'Up to 90 hours' }, { name: 'Connectivity', value: 'HyperSpeed Wireless' }, { name: 'Weight', value: '64g' }],
    tags: ['gaming', 'mouse', 'razer', 'wireless'],
  },
  {
    name: 'SteelSeries Arctis Nova Pro Wireless Headset',
    description: 'Engineered with the 360° Spatial Audio and Hi-Res certified speakers, this headset delivers a reference-quality audio experience. Multi-system with simultaneous Bluetooth and dual wireless.',
    shortDescription: 'Premium wireless gaming headset with 360° Spatial Audio and Hi-Res audio.',
    price: 349.99, discount: 10,
    category: catMap['Gaming'], brand: 'SteelSeries',
    images: ['https://images.unsplash.com/photo-1612444530582-fc66183b16f0?w=600'],
    stock: 35, isFeatured: false, isNewArrival: true, isOnSale: true,
    colors: ['Black', 'White'],
    specifications: [{ name: 'Audio', value: 'Hi-Res Certified' }, { name: 'Connectivity', value: 'Dual Wireless + Bluetooth' }, { name: 'Battery', value: 'Unlimited (hot-swap)' }, { name: 'Drivers', value: '40mm Neodymium' }],
    tags: ['gaming', 'headset', 'steelseries', 'wireless'],
  },
  {
    name: 'Logitech G Pro X Superlight 2 Mouse',
    description: 'The ultimate wireless gaming mouse for esports professionals. Weighing less than 60g, featuring HERO 2 sensor with 32,000 DPI, and LIGHTSPEED wireless for a perfectly reliable connection.',
    shortDescription: 'Ultra-light 60g wireless esports mouse with HERO 2 sensor.',
    price: 159.99, discount: 0,
    category: catMap['Gaming'], brand: 'Logitech',
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=600'],
    stock: 55, isFeatured: false, isNewArrival: false, isOnSale: false,
    colors: ['Black', 'White', 'Pink'],
    specifications: [{ name: 'Sensor', value: 'HERO 2 (32K DPI)' }, { name: 'Weight', value: '60g' }, { name: 'Battery', value: 'Up to 95 hours' }, { name: 'Connectivity', value: 'LIGHTSPEED Wireless' }],
    tags: ['gaming', 'mouse', 'logitech', 'esports'],
  },

  // More electronics
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'The Apple Watch Series 9 features the new S9 chip with on-device Siri, a double tap gesture, and the brightest Apple Watch display ever. Track your health, fitness, and stay connected throughout your day.',
    shortDescription: 'The most advanced Apple Watch with S9 chip and double tap gesture.',
    price: 429.99, discount: 5,
    category: catMap['Electronics'], brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600'],
    stock: 42, isFeatured: true, isNewArrival: true, isOnSale: true,
    colors: ['Midnight', 'Starlight', 'Pink', 'Red', 'Silver'],
    sizes: ['41mm', '45mm'],
    specifications: [{ name: 'Chip', value: 'S9 SiP' }, { name: 'Display', value: 'Always-On Retina LTPO OLED' }, { name: 'Battery', value: '18 hours' }, { name: 'Water Resistance', value: '50m' }],
    tags: ['watch', 'smartwatch', 'apple', 'fitness'],
  },
  {
    name: 'Kindle Paperwhite (11th Gen)',
    description: 'The thinnest, lightest Kindle Paperwhite ever, with a flush-front design and 6.8" display. IPX8 waterproof, 10 weeks of battery life, and adjustable warm light for comfortable reading day or night.',
    shortDescription: 'The thinnest, lightest Kindle with 6.8" waterproof display.',
    price: 139.99, discount: 20,
    category: catMap['Electronics'], brand: 'Amazon',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    stock: 88, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Black', 'Denim', 'Agave'],
    specifications: [{ name: 'Display', value: '6.8" 300 PPI' }, { name: 'Storage', value: '8GB' }, { name: 'Battery', value: 'Up to 10 weeks' }, { name: 'Water Resistance', value: 'IPX8' }],
    tags: ['ereader', 'kindle', 'amazon', 'reading'],
  },

  // More sports
  {
    name: 'Lululemon Align High-Rise Pant 28"',
    description: 'Our signature buttery-soft, barely-there feel. Made with Nulu™ fabric to feel like nothing. Designed for yoga and low-impact workouts, these high-rise leggings move with you in every direction.',
    shortDescription: 'Buttery-soft high-rise leggings made with Nulu™ fabric for yoga.',
    price: 128.00, discount: 0,
    category: catMap['Sports'], brand: 'Lululemon',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
    stock: 110, isFeatured: false, isNewArrival: true, isOnSale: false,
    colors: ['Black', 'Heathered Deep Coal', 'Jasmine Green', 'Variegated Knit'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '0', '2', '4', '6', '8', '10', '12'],
    specifications: [{ name: 'Fabric', value: 'Nulu™' }, { name: 'Rise', value: 'High' }, { name: 'Length', value: '28"' }],
    tags: ['yoga', 'leggings', 'lululemon', 'activewear'],
  },

  // More home
  {
    name: 'Vitamix 5200 Blender Professional Grade',
    description: 'The Vitamix 5200 is the gold standard in blenders. With a powerful 2HP motor, variable speed controls, and the ability to heat soup through friction, it\'s the only blender most kitchens will ever need.',
    shortDescription: 'Professional-grade 2HP blender that can blend, cook, and more.',
    price: 549.95, discount: 0,
    category: catMap['Home & Living'], brand: 'Vitamix',
    images: ['https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600'],
    stock: 30, isFeatured: false, isNewArrival: false, isOnSale: false,
    colors: ['Black', 'White', 'Red'],
    specifications: [{ name: 'Motor', value: '2.0 HP' }, { name: 'Container', value: '64oz Low-Profile' }, { name: 'Speed', value: '10 Variable + High' }, { name: 'Warranty', value: '7 years' }],
    tags: ['blender', 'vitamix', 'kitchen'],
  },

  // More accessories
  {
    name: 'AirPods Pro (2nd Generation)',
    description: 'Rebuilt from the ground up, AirPods Pro 2 feature up to 2x more Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, and the new H2 chip. Up to 30 hours total battery.',
    shortDescription: 'Next-gen AirPods with 2x ANC, Adaptive Transparency, and H2 chip.',
    price: 249.00, discount: 0,
    category: catMap['Accessories'], brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'],
    stock: 90, isFeatured: true, isNewArrival: false, isOnSale: false,
    colors: ['White'],
    specifications: [{ name: 'Chip', value: 'Apple H2' }, { name: 'ANC', value: '2x Active Noise Cancellation' }, { name: 'Battery', value: '6hrs + 24hrs case' }, { name: 'Resistance', value: 'IPX4' }],
    tags: ['earbuds', 'apple', 'airpods', 'wireless'],
  },

  // Flash sale items
  {
    name: 'JBL Charge 5 Portable Bluetooth Speaker',
    description: 'Bold JBL Original Pro Sound with powerful bass. IP67 waterproof and dustproof. 20 hours of playtime. USB-A charging output to charge your devices. PartyBoost for stereo sound with two speakers.',
    shortDescription: 'IP67 waterproof portable speaker with 20-hour battery and powerful bass.',
    price: 179.99, discount: 35,
    category: catMap['Electronics'], brand: 'JBL',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    stock: 70, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Black', 'Blue', 'Red', 'Green', 'Squad'],
    specifications: [{ name: 'Battery', value: '20 hours' }, { name: 'Water Resistance', value: 'IP67' }, { name: 'Connectivity', value: 'Bluetooth 5.1' }, { name: 'Output', value: '40W' }],
    tags: ['speaker', 'bluetooth', 'portable', 'jbl'],
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 26K)',
    description: 'Charge your MacBook Pro from 0 to 100% twice over. 140W total output, 26,800mAh, and an intelligent display that shows exact power remaining. Charges 3 devices simultaneously.',
    shortDescription: '26,800mAh power bank with 140W output and intelligent display.',
    price: 149.99, discount: 25,
    category: catMap['Electronics'], brand: 'Anker',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
    stock: 95, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Black'],
    specifications: [{ name: 'Capacity', value: '26,800mAh' }, { name: 'Output', value: '140W Max' }, { name: 'Ports', value: '2x USB-C, 1x USB-A' }, { name: 'Weight', value: '726g' }],
    tags: ['powerbank', 'anker', 'charging'],
  },
  {
    name: 'Nespresso Vertuo Pop Coffee Machine',
    description: 'The most compact Vertuo machine, designed for single-serve coffee perfection. Centrifusion™ technology reads each capsule\'s barcode for a perfectly extracted cup, from espresso to alto.',
    shortDescription: 'Compact coffee machine with Centrifusion™ tech for perfect extraction.',
    price: 129.00, discount: 40,
    category: catMap['Home & Living'], brand: 'Nespresso',
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
    stock: 55, isFeatured: false, isNewArrival: false, isOnSale: true,
    colors: ['Mango Yellow', 'Coconut White', 'Candy Pink', 'Pacific Blue'],
    specifications: [{ name: 'Technology', value: 'Centrifusion™' }, { name: 'Pressure', value: '19 bars' }, { name: 'Warm-up', value: '30 seconds' }, { name: 'Capsules', value: 'Vertuo Capsules' }],
    tags: ['coffee', 'nespresso', 'kitchen'],
  },
];

// ─── USERS ───────────────────────────────────────────────────────────────────
const users = [
  { name: 'Admin User', email: 'admin@novacart.com', password: 'admin123', role: 'admin', phone: '+1 (555) 000-0001' },
  { name: 'Sarah Johnson', email: 'sarah@example.com', password: 'password123', role: 'customer', phone: '+1 (555) 123-4567' },
  { name: 'Michael Chen', email: 'michael@example.com', password: 'password123', role: 'customer', phone: '+1 (555) 234-5678' },
  { name: 'Emma Williams', email: 'emma@example.com', password: 'password123', role: 'customer', phone: '+1 (555) 345-6789' },
  { name: 'James Rodriguez', email: 'james@example.com', password: 'password123', role: 'customer', phone: '+1 (555) 456-7890' },
  { name: 'Olivia Martinez', email: 'olivia@example.com', password: 'password123', role: 'customer', phone: '+1 (555) 567-8901' },
];

// ─── COUPONS ─────────────────────────────────────────────────────────────────
const coupons = [
  { code: 'WELCOME20', description: '20% off your first order', discountType: 'percentage', discountValue: 20, minimumOrder: 50, maximumDiscount: 100, expiryDate: new Date('2027-12-31') },
  { code: 'SAVE50', description: '$50 off orders over $200', discountType: 'fixed', discountValue: 50, minimumOrder: 200, expiryDate: new Date('2027-06-30') },
  { code: 'FLASH15', description: '15% off flash sale items', discountType: 'percentage', discountValue: 15, minimumOrder: 0, expiryDate: new Date('2027-03-31') },
  { code: 'NOVA10', description: '10% off sitewide', discountType: 'percentage', discountValue: 10, minimumOrder: 30, expiryDate: new Date('2027-12-31') },
  { code: 'FREESHIP', description: 'Free shipping on any order', discountType: 'fixed', discountValue: 9.99, minimumOrder: 0, expiryDate: new Date('2027-09-30') },
];

// ─── IMPORT DATA ─────────────────────────────────────────────────────────────
const importData = async () => {
  try {
    console.log('🗑️  Clearing existing data...'.yellow);
    await Promise.all([
      User.deleteMany(), Category.deleteMany(), Product.deleteMany(),
      Order.deleteMany(), Review.deleteMany(), Coupon.deleteMany(),
    ]);

    console.log('👤 Creating users...'.cyan);
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const customerUsers = createdUsers.filter((u) => u.role === 'customer');

    console.log('📁 Creating categories...'.cyan);
    const createdCategories = await Category.create(categories);
    const catMap = {};
    createdCategories.forEach((cat) => { catMap[cat.name] = cat._id; });

    console.log('📦 Creating products...'.cyan);
    const productData = createProducts(catMap);
    const createdProducts = await Product.create(productData);

    console.log('⭐ Creating reviews...'.cyan);
    const reviewTexts = [
      { title: 'Absolutely love it!', comment: 'This product exceeded my expectations. The quality is outstanding and it works exactly as described. Highly recommend to anyone considering this purchase.' },
      { title: 'Great value for money', comment: 'Really impressed with the build quality and performance. Fast shipping too. Would definitely buy from NOVA CART again.' },
      { title: 'Premium quality', comment: 'You can feel the quality the moment you take it out of the box. Packaging was also pristine. 5 stars without hesitation.' },
      { title: 'Solid product', comment: 'Does exactly what it says on the tin. Setup was easy and performance has been flawless. Very happy with this purchase.' },
      { title: 'Highly recommended', comment: 'I was skeptical at first but this has genuinely impressed me. The attention to detail is remarkable. My whole family loves it.' },
      { title: 'Worth every penny', comment: 'At first I thought it was expensive but after using it I completely understand the price. This is a premium product through and through.' },
      { title: 'Amazing product', comment: 'Already recommended this to 3 of my friends. It\'s just that good. The features are intuitive and the design is beautiful.' },
      { title: 'Exceeded expectations', comment: 'I ordered this after reading reviews and I can confirm they\'re all true. Exceptional quality and great customer service from NOVA CART.' },
    ];

    const reviews = [];
    for (let i = 0; i < Math.min(createdProducts.length, 30); i++) {
      const product = createdProducts[i];
      const numReviews = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numReviews && j < customerUsers.length; j++) {
        const rt = reviewTexts[(i + j) % reviewTexts.length];
        reviews.push({
          user: customerUsers[j % customerUsers.length]._id,
          product: product._id,
          rating: Math.floor(Math.random() * 2) + 4,
          title: rt.title,
          comment: rt.comment,
          isVerifiedPurchase: j % 2 === 0,
        });
      }
    }
    await Review.create(reviews);

    // Update product ratings
    for (const product of createdProducts) {
      const stats = await Review.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        await Product.findByIdAndUpdate(product._id, {
          rating: Math.round(stats[0].avgRating * 10) / 10,
          numReviews: stats[0].numReviews,
        });
      }
    }

    console.log('🎟️  Creating coupons...'.cyan);
    await Coupon.create(coupons);

    console.log('🛒 Creating sample orders...'.cyan);
    const sampleOrders = [
      {
        user: customerUsers[0]._id,
        items: [
          { product: createdProducts[0]._id, name: createdProducts[0].name, image: createdProducts[0].images[0], price: createdProducts[0].price, discount: createdProducts[0].discount, discountedPrice: createdProducts[0].discountedPrice, quantity: 1 },
          { product: createdProducts[5]._id, name: createdProducts[5].name, image: createdProducts[5].images[0], price: createdProducts[5].price, discount: createdProducts[5].discount, discountedPrice: createdProducts[5].discountedPrice, quantity: 1 },
        ],
        shippingAddress: { fullName: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 (555) 123-4567', street: '123 Maple Street', city: 'New York', state: 'NY', postalCode: '10001', country: 'United States' },
        paymentMethod: 'card', shippingMethod: 'express',
        subtotal: 578.98, shippingCost: 0, tax: 52.11, discount: 0, total: 631.09,
        status: 'delivered', isPaid: true, paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: customerUsers[1]._id,
        items: [
          { product: createdProducts[2]._id, name: createdProducts[2].name, image: createdProducts[2].images[0], price: createdProducts[2].price, discount: createdProducts[2].discount, discountedPrice: createdProducts[2].discountedPrice, quantity: 1 },
        ],
        shippingAddress: { fullName: 'Michael Chen', email: 'michael@example.com', phone: '+1 (555) 234-5678', street: '456 Oak Avenue', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'United States' },
        paymentMethod: 'paypal', shippingMethod: 'standard',
        subtotal: 1169.99, shippingCost: 0, tax: 105.30, discount: 0, total: 1275.29,
        status: 'shipped', isPaid: true, paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: customerUsers[2]._id,
        items: [
          { product: createdProducts[10]._id, name: createdProducts[10].name, image: createdProducts[10].images[0], price: createdProducts[10].price, discount: createdProducts[10].discount, discountedPrice: createdProducts[10].discountedPrice, quantity: 2 },
        ],
        shippingAddress: { fullName: 'Emma Williams', email: 'emma@example.com', phone: '+1 (555) 345-6789', street: '789 Pine Road', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'United States' },
        paymentMethod: 'cod', shippingMethod: 'standard',
        subtotal: 379.98, shippingCost: 9.99, tax: 34.20, discount: 0, total: 424.17,
        status: 'processing', isPaid: false,
      },
    ];

    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      await order.save();
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
      }
    }

    // Update productCount for each category
    console.log('📊 Updating category product counts...'.cyan);
    for (const cat of createdCategories) {
      const count = await Product.countDocuments({ category: cat._id, isActive: true });
      await Category.findByIdAndUpdate(cat._id, { productCount: count });
    }

    console.log('\n✅ Data seeded successfully!'.green.bold);
    console.log('─'.repeat(40).gray);
    console.log('🔐 Admin:    admin@novacart.com / admin123'.white);
    console.log('👤 Customer: sarah@example.com / password123'.white);
    console.log('─'.repeat(40).gray);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`.red.bold);
    console.error(error);
    process.exit(1);
  }
};

importData();
