import React, { useState, useRef } from 'react';
import { BookOpen, ArrowRight, X, Menu, Terminal, ChevronRight, ChevronLeft, ExternalLink, Calendar, Clock, ArrowUpRight, Instagram, Twitter } from 'lucide-react';

const App = () => {
  const [activeView, setActiveView] = useState('home'); // home, blog, post
  const [selectedPost, setSelectedPost] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock Data for Blogs
  const blogPosts = [
    {
      id: 1,
      title: "The Economics of Silence",
      date: "Oct 12, 2025",
      readTime: "6 min",
      type: "long", // 'short' or 'long'
      excerpt: "In a hyper-connected market, attention is the scarcest currency. What happens to value when we stop producing noise?",
      category: "Economics",
      coverImage: "https://picsum.photos/id/45/600/800", 
      content: `...`
    },
    {
      id: 2,
      title: "Architecting History",
      date: "Sept 28, 2025",
      readTime: "8 min",
      type: "long",
      excerpt: "History is not a linear timeline. A structural analysis suggests it is more akin to a recursive loop.",
      category: "Philosophy",
      coverImage: "https://picsum.photos/id/249/600/800",
      content: "..."
    },
    {
      id: 3,
      title: "Entropy & Order",
      date: "Aug 15, 2025",
      readTime: "3 min",
      type: "short",
      excerpt: "Why systems fall apart and why the human mind is desperate to categorize the chaos.",
      category: "Philosophy",
      coverImage: "https://picsum.photos/id/191/600/800", 
      content: "..."
    },
    {
      id: 4,
      title: "Digital Brutalism",
      date: "July 02, 2025",
      readTime: "4 min",
      type: "short",
      excerpt: "Raw materials, exposed structures, and the rejection of decoration in the modern web.",
      category: "Design",
      coverImage: "https://picsum.photos/id/230/600/800",
      content: "..."
    }
  ];

  const navigateTo = (view, post = null) => {
    window.scrollTo(0, 0);
    setActiveView(view);
    setSelectedPost(post);
    setIsMenuOpen(false);
  };

  const SectionHeader = ({ number, title, rightContent }) => (
    <div className="flex justify-between items-end mb-6 border-b border-stone-900 pb-2">
      <div className="flex items-center gap-3">
        <span className="font-mono text-orange-500 text-xs tracking-widest border border-orange-500/30 px-2 py-0.5 rounded-full">{number}</span>
        <h2 className="font-serif text-xl text-stone-200 tracking-wide">{title}</h2>
      </div>
      {rightContent}
    </div>
  );

  // V3 Component: Cinematic "Story" Card
  const CinematicCard = ({ post }) => (
    <div 
      onClick={() => navigateTo('post', post)}
      className="group relative w-[85vw] md:w-[320px] h-[500px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer snap-center border border-stone-800/50"
    >
      <div className="absolute inset-0 z-0 bg-stone-900">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover opacity-80 transition-transform duration-[1.5s] ease-out group-hover:scale-110 group-hover:opacity-60" 
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"></div>
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
           <span className="font-mono text-[10px] text-stone-300 bg-stone-900/50 backdrop-blur-md px-2 py-1 rounded border border-stone-700">{post.category}</span>
           <span className="font-mono text-[10px] text-stone-300 bg-stone-900/50 backdrop-blur-md px-2 py-1 rounded border border-stone-700">{post.readTime}</span>
        </div>
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <div className="flex items-center gap-2 mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">{post.date}</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-3 drop-shadow-lg">
            {post.title}
          </h3>
          <p className="font-sans text-stone-300 text-sm leading-relaxed line-clamp-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 delay-100">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 text-white font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity">
          <span>READ {post.type === 'short' ? 'MEDITATION' : 'ANALYSIS'}</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );

  const FeedCarousel = ({ items }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      if(scrollRef.current) {
        scrollRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
      }
    };

    return (
      <div className="relative group/carousel">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map(post => (
            <CinematicCard key={post.id} post={post} />
          ))}
          <div className="w-12 flex-shrink-0"></div>
        </div>

        {/* Centered Navigation Arrows Below Cards */}
        <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={() => scroll('left')} 
              className="p-3 rounded-full border border-stone-800 text-stone-500 hover:text-orange-500 hover:border-orange-500 transition-all active:scale-95"
            >
              <ChevronLeft size={20}/>
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="p-3 rounded-full border border-stone-800 text-stone-500 hover:text-orange-500 hover:border-orange-500 transition-all active:scale-95"
            >
              <ChevronRight size={20}/>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-stone-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Subtle Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-stone-900/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div onClick={() => navigateTo('home')} className="cursor-pointer group flex items-center gap-3">
             <div className="w-3 h-3 bg-orange-600 rounded-sm group-hover:rotate-45 transition-transform duration-300"></div>
             <div className="font-serif text-xl text-stone-200 tracking-tight group-hover:text-white transition-colors">
              RVH
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 font-mono text-xs tracking-widest text-stone-500">
            <button onClick={() => navigateTo('home')} className={`hover:text-stone-200 transition-colors ${activeView === 'home' ? 'text-white' : ''}`}>INDEX</button>
            <button onClick={() => navigateTo('blog')} className={`hover:text-stone-200 transition-colors ${activeView === 'blog' ? 'text-white' : ''}`}>ARCHIVE</button>
            <a href="https://notion.so" target="_blank" rel="noreferrer" className="hover:text-stone-200 transition-colors flex items-center gap-2">
              BOOK DATABASE <ArrowUpRight size={10} />
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-stone-300">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808] pt-24 px-6 md:hidden animate-fade-in">
          <div className="flex flex-col gap-8 font-serif text-3xl">
            <button onClick={() => navigateTo('home')} className="text-left text-stone-200">Index</button>
            <button onClick={() => navigateTo('blog')} className="text-left text-stone-200">Archive</button>
            <button className="text-left text-stone-500">Book Database</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* VIEW: HOME */}
        {activeView === 'home' && (
          <div className="animate-fade-in">
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20 items-center">
              <div className="lg:col-span-7">
                
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-100 leading-[0.95] tracking-tight mb-8">
                  A window into <br/>
                  <span className="text-stone-500 italic">a curious mind.</span>
                </h1>

                {/* System Status Interaction */}
                <div className="group w-fit cursor-default mb-8">
                  <div className="font-mono text-xs md:text-sm text-orange-500 flex items-center gap-2 overflow-hidden relative border border-orange-900/30 bg-orange-900/10 px-3 py-1 rounded-full transition-all duration-300">
                     
                     {/* The "Invisible" element determines width. Added nbsp for extra padding on right. */}
                     <span className="invisible pointer-events-none opacity-0 flex items-center gap-2">
                       <span>{'>_'}</span> The art of thinking out loud&nbsp;&nbsp;
                     </span>
                     
                     {/* The Visible Status (Initial) */}
                    <div className="absolute top-0 left-3 bottom-0 flex items-center gap-2 transition-all duration-500 transform group-hover:-translate-y-8 opacity-100 group-hover:opacity-0">
                       <Terminal size={12} />
                       <span>SYSTEM STATUS: ONLINE</span>
                    </div>

                    {/* The Hover Text (All Orange Now) */}
                    <div className="absolute top-0 left-3 bottom-0 flex items-center transition-all duration-500 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap text-orange-500">
                      <span className="font-mono mr-2">{'>_'}</span>
                      <span className="italic">The art of thinking out loud</span>
                    </div>
                  </div>
                </div>

              </div>

               {/* Hero Visual Restored */}
               <div className="lg:col-span-5 hidden lg:block">
                  <div className="relative h-96 w-full border border-stone-800 bg-stone-900 rounded-lg overflow-hidden group">
                     <div className="absolute inset-0 bg-stone-900/20 z-10 group-hover:bg-transparent transition-all duration-700"></div>
                     {/* Grid Overlay */}
                     <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(12,12,12,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(12,12,12,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                     <img 
                        src="https://picsum.photos/id/17/800/800" 
                        alt="Observation Deck" 
                        className="w-full h-full object-cover grayscale opacity-70 mix-blend-screen group-hover:scale-105 transition-transform duration-[2s]" 
                     />
                     <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] text-orange-500 border border-orange-500/50 px-2 py-1 bg-black/50 backdrop-blur-sm">
                        FIG. 1.0 // OBSERVATORY
                     </div>
                  </div>
               </div>
            </div>

            {/* CONTENT GRID */}
            <div className="border-t border-stone-900 pt-12 mb-20">
               <SectionHeader number="01" title="Recent Transmissions" />
               <FeedCarousel items={blogPosts} />
            </div>

            {/* BOTTOM GRID (Profile & Info) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
               {/* 02 Profile Card (Updated for Congruency & Gap Fix) */}
               <div>
                  <SectionHeader number="02" title="The Profile" />
                  <a 
                    href="https://www.instagram.com/rafaelvonhertzen/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block h-full group bg-stone-900/30 border border-stone-800/50 p-8 rounded-xl flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            {/* Profile Image: No border, grayscale transition to color on group hover */}
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                <img 
                                  src="https://picsum.photos/id/338/200/200" 
                                  alt="Rafael"
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                                />
                            </div>
                            {/* Top Right Icon: Hidden ArrowUpRight */}
                            <ArrowUpRight size={16} className="text-stone-600 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                        
                        <h3 className="font-serif text-xl text-stone-200 mb-2 group-hover:text-white transition-colors">Rafael von Hertzen</h3>
                        <p className="font-sans text-stone-400 text-sm leading-relaxed group-hover:text-stone-300">
                            Writing to understand, not to instruct. Nothing groundbreaking, just ideas worth capturing.
                        </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6 flex items-center gap-2 font-mono text-xs text-stone-500 group-hover:text-orange-500 transition-colors">
                        VISIT PROFILE <ArrowRight size={12}/>
                    </div>
                  </a>
               </div>

               {/* 03 Database Card */}
               <div>
                  <SectionHeader number="03" title="The Library" />
                  <a 
                    href="https://www.notion.so/Book-Database-645e72649a4a4d9abd53c6e3e5391f13?source=copy_link"
                    target="_blank"
                    rel="noreferrer" 
                    className="block h-full group bg-stone-900/30 border border-stone-800/50 p-8 rounded-xl hover:border-orange-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <BookOpen size={24} className="text-stone-600 group-hover:text-orange-500 transition-colors" />
                            <ArrowUpRight size={16} className="text-stone-600 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                        <h3 className="font-serif text-xl text-stone-200 mb-2 group-hover:text-white transition-colors">
                            Digital Garden
                        </h3>
                        <p className="font-sans text-stone-400 text-sm leading-relaxed group-hover:text-stone-300">
                        A collection of books read, rated, and annotated.
                        </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 font-mono text-xs text-stone-500 group-hover:text-orange-500 transition-colors">
                        OPEN DATABASE <ArrowRight size={12}/>
                    </div>
                  </a>
               </div>

               {/* 04 Work/Percept Card */}
               <div>
                 <SectionHeader number="04" title="The Work" />
                 <a 
                    href="https://percepthelsinki.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full group bg-stone-900/30 border border-stone-800/50 p-8 rounded-xl flex flex-col justify-between hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
                    >
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <ExternalLink size={24} className="text-stone-600 group-hover:text-orange-500 transition-colors" />
                            <ArrowUpRight size={16} className="text-stone-600 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                        <h3 className="font-serif text-xl text-stone-200 mb-2 group-hover:text-white transition-colors">Percept Helsinki</h3>
                        <p className="font-sans text-stone-400 text-sm group-hover:text-stone-300">
                        Strategic Design. Visual identity and digital experience.
                        </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 font-mono text-xs text-stone-500 group-hover:text-orange-500 transition-colors">
                        VISIT SITE <ArrowRight size={12}/>
                    </div>
                 </a>
               </div>

            </div>
          </div>
        )}

        {/* VIEW: BLOG LIST */}
        {activeView === 'blog' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
             {/* List View Implementation (Simpler for Archive) */}
             <div className="space-y-8">
               {blogPosts.map(post => (
                 <div key={post.id} onClick={() => navigateTo('post', post)} className="group cursor-pointer border-b border-stone-900 pb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                       <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={post.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                       </div>
                       <div>
                          <div className="font-mono text-xs text-orange-500 mb-2">{post.date}</div>
                          <h2 className="font-serif text-3xl text-stone-300 group-hover:text-white mb-3">{post.title}</h2>
                          <p className="text-stone-500 text-sm max-w-2xl">{post.excerpt}</p>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* VIEW: SINGLE POST */}
        {activeView === 'post' && selectedPost && (
          <article className="animate-fade-in max-w-3xl mx-auto">
            <button onClick={() => navigateTo('home')} className="group mb-12 flex items-center gap-2 font-mono text-xs text-stone-500 hover:text-orange-500 transition-colors">
              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} />
              RETURN TO INDEX
            </button>

            <header className="mb-12 text-center">
              <div className="inline-flex gap-4 font-mono text-xs text-orange-500 mb-6 border border-stone-800 rounded-full px-4 py-1">
                <span>{selectedPost.category.toUpperCase()}</span>
                <span className="text-stone-700">|</span>
                <span>{selectedPost.date}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl text-stone-100 leading-tight mb-8">
                {selectedPost.title}
              </h1>
            </header>
            
            <div className="mb-16 w-full aspect-video rounded-xl overflow-hidden">
               <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert prose-stone max-w-none prose-lg prose-headings:font-serif prose-p:font-sans prose-p:text-stone-300 prose-p:leading-8">
               {/* Content */}
               <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
               <p>This is a placeholder for the full article text. The design focuses on readability with ample whitespace and carefully selected typography.</p>
               <p>Ideally, this section would be populated from a Markdown file or a CMS like Contentful or Sanity.</p>
            </div>
          </article>
        )}

      </main>

      <footer className="border-t border-stone-900 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-600 text-sm font-mono">
          <div>RVH © 2025 // HELSINKI</div>
          
          <div className="flex gap-6">
            <a href="https://x.com/rafael_v_h" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-2">
              <Twitter size={14}/> X (TWITTER)
            </a>
            <a href="https://www.instagram.com/rafaelvonhertzen/" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-2">
              <Instagram size={14}/> INSTAGRAM
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;