import type { Startup } from "../components/StartupCard";

export interface Post {
  id: number;
  image: string;
  caption: string;
  likes: number;
  saves?: number;
  comments: number;
  timestamp: string;
}

export const mockStartups: Startup[] = [
  {
    id: 1,
    name: 'StyleThread',
    founder: 'Sarah Johnson',
    description: 'Sustainable fashion for the modern generation. We create eco-friendly clothing that makes a statement.',
    image: 'https://images.unsplash.com/photo-1564518160120-94178fcdf5d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwY2xvdGhpbmclMjBzdGFydHVwfGVufDF8fHx8MTc3MzQ0MDg2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fashion',
    likes: 234,
    comments: 45,
    verified: true
  },
  {
    id: 2,
    name: 'TechLaunch Hub',
    founder: 'Michael Chen',
    description: 'Building the next generation of productivity tools for remote teams. Making work collaboration seamless.',
    image: 'https://images.unsplash.com/photo-1702047048032-e734daa2473d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMHdvcmtzcGFjZSUyMGxhcHRvcHxlbnwxfHx8fDE3NzM0NDA4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Tech',
    likes: 567,
    comments: 89,
    verified: true
  },
  {
    id: 3,
    name: 'Fresh Bowl Co.',
    founder: 'Emma Williams',
    description: 'Healthy smoothie bowls delivered to your door. Made fresh daily with organic ingredients.',
    image: 'https://images.unsplash.com/photo-1569089572172-ab475d1a8bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwYnVzaW5lc3MlMjBoZWFsdGh5JTIwc21vb3RoaWV8ZW58MXx8fHwxNzczNDQwODYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Food',
    likes: 389,
    comments: 62,
    verified: true
  },
  {
    id: 4,
    name: 'Glow Natural',
    founder: 'Olivia Martinez',
    description: 'Handcrafted natural beauty products. Cruelty-free and made with love for your skin.',
    image: 'https://images.unsplash.com/photo-1630331811881-58a6f87bf7f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzM0NDA4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Beauty',
    likes: 445,
    comments: 78,
    verified: true
  },
  {
    id: 5,
    name: 'Urban Harvest',
    founder: 'David Thompson',
    description: 'Farm-to-table produce delivery service. Supporting local farmers and bringing fresh food to urban communities.',
    image: 'https://images.unsplash.com/photo-1708796705570-33fd29ef67d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm0lMjBmcmVzaCUyMHByb2R1Y2V8ZW58MXx8fHwxNzczNDQwODYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Agriculture',
    likes: 312,
    comments: 54,
    verified: true
  },
  {
    id: 6,
    name: 'Canvas Dreams',
    founder: 'Isabella Garcia',
    description: 'Custom artwork and design services for modern spaces. Bringing your creative visions to life.',
    image: 'https://images.unsplash.com/photo-1759150467548-5a97257e583a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBkZXNpZ24lMjBjcmVhdGl2ZSUyMHN0dWRpb3xlbnwxfHx8fDE3NzM0NDA4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Art',
    likes: 523,
    comments: 91,
    verified: true
  },
  {
    id: 7,
    name: 'Craft & Co',
    founder: 'Sophia Lee',
    description: 'Handmade jewelry and accessories. Each piece tells a unique story and is crafted with care.',
    image: 'https://images.unsplash.com/photo-1767476106226-ff48f2e12286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzczMzUyNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Art',
    likes: 278,
    comments: 43,
    verified: true
  },
  {
    id: 8,
    name: 'ProConsult',
    founder: 'James Anderson',
    description: 'Business consulting services for growing companies. Helping young entrepreneurs turn ideas into successful businesses.',
    image: 'https://images.unsplash.com/photo-1769636929132-e4e7b50cfac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1ciUyMGJ1c2luZXNzJTIwb3duZXJ8ZW58MXx8fHwxNzczNDQwODY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Services',
    likes: 401,
    comments: 67,
    verified: true
  }
];

export const startupExtendedData: Record<number, {
  banner: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  year: string;
  address: string;
  fullDescription: string;
  posts: Post[];
}> = {
  1: {
    banner: 'https://images.unsplash.com/photo-1569386130894-687d5dcd4bd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwYmFubmVyJTIwZ3JhZGllbnR8ZW58MXx8fHwxNzczODc5MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    phone: '+1 (555) 123-4567',
    email: 'contact@stylethread.com',
    website: 'www.stylethread.com',
    location: 'New York, NY',
    year: '2024',
    address: '123 Fashion Ave, New York, NY 10001',
    fullDescription: 'StyleThread is revolutionizing sustainable fashion by creating eco-friendly clothing that doesn\'t compromise on style. We believe that fashion should be both beautiful and responsible. Our pieces are made from recycled materials and organic fabrics, crafted with care by fair-trade artisans. Join us in making fashion sustainable, one thread at a time.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1769946797489-e99b2a5c1dfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0JTIwZGlzcGxheXxlbnwxfHx8fDE3NzM4NzkwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'New spring listing just dropped! 🌸 Made from 100% organic cotton and recycled materials. #SustainableFashion',
        likes: 342,
        comments: 28,
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1564518160120-94178fcdf5d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwY2xvdGhpbmclMjBzdGFydHVwfGVufDF8fHx8MTc3MzQ0MDg2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Behind the scenes at our studio 👕 Every piece is handcrafted with love',
        likes: 289,
        comments: 19,
        timestamp: '1 day ago'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1769946797489-e99b2a5c1dfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0JTIwZGlzcGxheXxlbnwxfHx8fDE3NzM4NzkwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Fashion should never cost the earth 🌍 Shop our eco-friendly listing now',
        likes: 451,
        comments: 34,
        timestamp: '3 days ago'
      }
    ]
  },
  2: {
    banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
    phone: '+1 (555) 234-5678',
    email: 'hello@techlaunchhub.com',
    website: 'www.techlaunchhub.com',
    location: 'San Francisco, CA',
    year: '2023',
    address: '456 Tech Blvd, San Francisco, CA 94105',
    fullDescription: 'TechLaunch Hub is building the next generation of productivity tools for remote teams. Our platform makes work collaboration seamless, efficient, and enjoyable. With features designed for modern teams, we help companies stay connected and productive no matter where they are.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1683813479742-4730f91fa3ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwd29ya3NwYWNlJTIwbGFwdG9wJTIwY29kZXxlbnwxfHx8fDE3NzM4NzkwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Excited to announce our new team collaboration feature! 🚀 Making remote work easier',
        likes: 523,
        comments: 67,
        timestamp: '4 hours ago'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1702047048032-e734daa2473d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMHdvcmtzcGFjZSUyMGxhcHRvcHxlbnwxfHx8fDE3NzM0NDA4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Our team at work 💻 Building something amazing!',
        likes: 412,
        comments: 45,
        timestamp: '2 days ago'
      }
    ]
  },
  3: {
    banner: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&h=400&fit=crop',
    phone: '+1 (555) 345-6789',
    email: 'info@freshbowl.co',
    website: 'www.freshbowl.co',
    location: 'Los Angeles, CA',
    year: '2024',
    address: '789 Health St, Los Angeles, CA 90001',
    fullDescription: 'Fresh Bowl Co. delivers healthy smoothie bowls made fresh daily with organic ingredients. We believe in nourishing your body with wholesome, delicious food. Every bowl is packed with nutrients and made with love.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1661257711676-79a0fc533569?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGJvd2wlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzM4NTMzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Today\'s special: Tropical Paradise Bowl 🥥🍓 Packed with vitamins and flavor!',
        likes: 389,
        comments: 52,
        timestamp: '1 hour ago'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1569089572172-ab475d1a8bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwYnVzaW5lc3MlMjBoZWFsdGh5JTIwc21vb3RoaWV8ZW58MXx8fHwxNzczNDQwODYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Fresh ingredients, fresh start 🌱 Order now for delivery!',
        likes: 298,
        comments: 31,
        timestamp: '1 day ago'
      }
    ]
  },
  4: {
    banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    phone: '+1 (555) 456-7890',
    email: 'hello@glownatural.com',
    website: 'www.glownatural.com',
    location: 'Miami, FL',
    year: '2023',
    address: '321 Beauty Lane, Miami, FL 33101',
    fullDescription: 'Glow Natural creates handcrafted natural beauty products that are cruelty-free and made with love for your skin. We use only the finest natural ingredients to help you look and feel your best.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1643379850274-77d2e3703ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljcyUyMG5hdHVyYWx8ZW58MXx8fHwxNzczODc5MDU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'New skincare line alert! ✨ 100% natural, 100% amazing',
        likes: 445,
        comments: 78,
        timestamp: '3 hours ago'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1630331811881-58a6f87bf7f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzM0NDA4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Glow from within 🌟 Shop our bestsellers',
        likes: 367,
        comments: 43,
        timestamp: '2 days ago'
      }
    ]
  },
  5: {
    banner: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&h=400&fit=crop',
    phone: '+1 (555) 567-8901',
    email: 'contact@urbanharvest.com',
    website: 'www.urbanharvest.com',
    location: 'Portland, OR',
    year: '2024',
    address: '654 Farm Road, Portland, OR 97201',
    fullDescription: 'Urban Harvest is a farm-to-table produce delivery service supporting local farmers and bringing fresh food to urban communities. We believe in sustainable agriculture and connecting people with their food sources.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBmYXJtJTIwcHJvZHVjZXxlbnwxfHx8fDE3NzM4NDE4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Fresh from the farm this morning! 🥕🥬 Order your weekly box now',
        likes: 312,
        comments: 54,
        timestamp: '5 hours ago'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1708796705570-33fd29ef67d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGZhcm0lMjBmcmVzaCUyMHByb2R1Y2V8ZW58MXx8fHwxNzczNDQwODYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Supporting local farmers, feeding our community 🌾',
        likes: 256,
        comments: 38,
        timestamp: '3 days ago'
      }
    ]
  },
  6: {
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=400&fit=crop',
    phone: '+1 (555) 678-9012',
    email: 'hello@canvasdreams.com',
    website: 'www.canvasdreams.com',
    location: 'Austin, TX',
    year: '2023',
    address: '987 Art District, Austin, TX 78701',
    fullDescription: 'Canvas Dreams provides custom artwork and design services for modern spaces. We bring your creative visions to life with unique, handcrafted pieces that tell your story.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1720217260759-cafa6de4e46b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMGNhbnZhcyUyMHN0dWRpb3xlbnwxfHx8fDE3NzM4NzkwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Latest commission piece finished! 🎨 DM for custom orders',
        likes: 523,
        comments: 91,
        timestamp: '6 hours ago'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1759150467548-5a97257e583a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBkZXNpZ24lMjBjcmVhdGl2ZSUyMHN0dWRpb3xlbnwxfHx8fDE3NzM0NDA4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Creating magic in the studio ✨ New listing coming soon',
        likes: 478,
        comments: 65,
        timestamp: '1 day ago'
      }
    ]
  },
  7: {
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=400&fit=crop',
    phone: '+1 (555) 789-0123',
    email: 'info@craftandco.com',
    website: 'www.craftandco.com',
    location: 'Seattle, WA',
    year: '2024',
    address: '147 Craft Lane, Seattle, WA 98101',
    fullDescription: 'Craft & Co specializes in handmade jewelry and accessories. Each piece tells a unique story and is crafted with care using sustainable materials and traditional techniques.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1767476106226-ff48f2e12286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzczMzUyNzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Handcrafted with love 💍 New listing available now',
        likes: 278,
        comments: 43,
        timestamp: '8 hours ago'
      }
    ]
  },
  8: {
    banner: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=400&fit=crop',
    phone: '+1 (555) 890-1234',
    email: 'contact@proconsult.com',
    website: 'www.proconsult.com',
    location: 'Boston, MA',
    year: '2023',
    address: '258 Business Park, Boston, MA 02101',
    fullDescription: 'ProConsult offers business consulting services for growing companies. We help young entrepreneurs turn ideas into successful businesses with strategic planning, mentorship, and expert guidance.',
    posts: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1769636929132-e4e7b50cfac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGVudHJlcHJlbmV1ciUyMGJ1c2luZXNzJTIwb3duZXJ8ZW58MXx8fHwxNzczNDQwODY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Helping entrepreneurs succeed 🚀 Book your free consultation today',
        likes: 401,
        comments: 67,
        timestamp: '4 hours ago'
      }
    ]
  }
};

export const mockComments = [
  {
    id: 1,
    author: 'Alex Rivera',
    text: 'This is amazing! Love the concept and execution. 🚀',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    author: 'Maya Patel',
    text: 'Great work! How can I order?',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    author: 'Jordan Kim',
    text: 'Impressive! Wishing you all the success!',
    timestamp: '1 day ago'
  }
];