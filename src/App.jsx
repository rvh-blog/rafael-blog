import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, X, Menu, Terminal, ChevronRight, ChevronLeft, ExternalLink, ArrowUpRight, Instagram, Twitter } from 'lucide-react';
import LiveFooterData from './FooterData'; // Adjust path if needed

// ============================================================================
//  1. DATA LOADING
// ============================================================================

const modules = import.meta.glob('./posts/*.js', { eager: true });

const blogPosts = Object.keys(modules)
  .filter(path => !path.includes('_template')) 
  .map(path => modules[path].default)
  .sort((a, b) => b.id - a.id); 

// Helper to fix image paths on sub-pages
const resolveImgPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path}`;
};

// ============================================================================
//  2. UTILITY COMPONENTS
// ============================================================================

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const useInView = (options = { threshold: 0.3 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options.threshold]); 

  return [ref, isInView];
};

const DynamicTitle = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      document.title = "RVH";
    } else if (location.pathname === '/blog') {
      document.title = "Archive | RVH";
    }
  }, [location]);
  return null;
};

// ============================================================================
//  3. UI SUB-COMPONENTS
// ============================================================================

const SectionHeader = ({ number, title, rightContent }) => (
  <div className="flex justify-between items-end mb-6 border-b border-stone-900 pb-2">
    <div className="flex items-center gap-3">
      <span className="font-mono text-orange-500 text-xs tracking-widest border border-orange-500/30 px-2 py-0.5 rounded-full">{number}</span>
      <h2 className="font-serif text-xl text-stone-200 tracking-wide">{title}</h2>
    </div>
    {rightContent}
  </div>
);

const CinematicCard = ({ post }) => {
  const [cardRef, isInView] = useInView({ threshold: 0.6 }); 
  const navigate = useNavigate();

  return (
    <div 
      ref={cardRef}
      onClick={() => navigate(`/post/${post.id}`)}
      className="group relative w-[85vw] md:w-[320px] h-[500px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer snap-center border border-stone-800/50"
    >
      <div className="absolute inset-0 z-0 bg-stone-900">
        <img 
          src={resolveImgPath(post.coverImage)} 
          alt={post.title} 
          loading="lazy"
          className={`w-full h-full object-cover opacity-80 transition-transform duration-[1.5s] ease-out lg:group-hover:scale-110 lg:group-hover:opacity-60 ${isInView ? 'scale-110 opacity-60 lg:scale-100 lg:opacity-80' : 'scale-100 opacity-80'}`} 
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"></div>
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
        
        <div className={`absolute top-6 left-6 right-6 flex justify-between items-start transition-all duration-700 ease-out 
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
            lg:opacity-0 lg:-translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0`}
        >
           <span className="font-mono text-[10px] text-stone-300 bg-stone-900/50 backdrop-blur-md px-2 py-1 rounded border border-stone-700">{post.category}</span>
           <span className="font-mono text-[10px] text-stone-300 bg-stone-900/50 backdrop-blur-md px-2 py-1 rounded border border-stone-700">{post.readTime}</span>
        </div>
        
        <div className={`transform transition-all duration-700 ease-out 
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            lg:opacity-100 lg:translate-y-0 lg:group-hover:-translate-y-2`}
        >
          <div className={`flex items-center gap-2 mb-2 transition-opacity lg:opacity-70 lg:group-hover:opacity-100 ${isInView ? 'opacity-100' : 'opacity-70'}`}>
            <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">{post.date}</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-3 drop-shadow-lg">
            {post.shortTitle || post.title}
          </h3>
          <p className={`font-sans text-stone-300 text-sm leading-relaxed line-clamp-2 transition-all duration-500 delay-100 
              ${isInView ? 'opacity-100 h-auto' : 'opacity-0'}
              lg:opacity-0 lg:h-0 lg:group-hover:opacity-100 lg:group-hover:h-auto`}
          >
            {post.excerpt}
          </p>
        </div>
        
        <div className={`mt-6 flex items-center gap-2 text-white font-mono text-xs transition-opacity duration-700 
            ${isInView ? 'opacity-100' : 'opacity-0'}
            lg:opacity-60 lg:group-hover:opacity-100`}
        >
          <span>READ {post.type === 'short' ? 'MEDITATION' : 'ANALYSIS'}</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

const BottomBox = ({ children, className, href, index, isActive, setRef }) => {
  const borderColor = isActive ? 'border-orange-500/50 lg:border-stone-800/50' : 'border-stone-800/50';
  const baseClasses = `block h-full group bg-stone-900/30 border p-8 rounded-xl flex flex-col justify-between transition-all duration-300 cursor-pointer ${className} ${borderColor} lg:hover:border-orange-500/50`;

  if (href) {
    return (
      <a 
        ref={el => setRef(index, el)} 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        className={baseClasses}
      >
        {children}
      </a>
    );
  }
  
  return (
    <div ref={el => setRef(index, el)} className={baseClasses}>
      {children}
    </div>
  );
};

const FeedCarousel = ({ items }) => {
  const scrollRef = useRef(null);
  const [activeBtn, setActiveBtn] = useState(null);

  const scroll = (direction) => {
    if(scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const handleMobileInteract = (direction) => {
    scroll(direction);
    setActiveBtn(direction);
    setTimeout(() => setActiveBtn(null), 250); 
  };

  const btnBaseClass = "p-3 rounded-full border border-stone-800 transition-all duration-300 active:scale-95 lg:hover:text-orange-500 lg:hover:border-orange-500";
  const getBtnClass = (dir) => {
    return activeBtn === dir 
      ? `${btnBaseClass} text-orange-500 border-orange-500` 
      : `${btnBaseClass} text-stone-500`;
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

      <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => handleMobileInteract('left')} 
            className={getBtnClass('left')}
          >
            <ChevronLeft size={20}/>
          </button>
          <button 
            onClick={() => handleMobileInteract('right')} 
            className={getBtnClass('right')}
          >
            <ChevronRight size={20}/>
          </button>
      </div>
    </div>
  );
}

// ============================================================================
//  4. PAGE VIEWS
// ============================================================================

const HomeView = () => {
  const [activeBottomBoxIndex, setActiveBottomBoxIndex] = useState(null);
  const bottomSectionRef = useRef(null);
  const boxRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) return;
      const viewportCenter = window.innerHeight / 2;
      let minDistance = Infinity;
      let closestIndex = null;

      boxRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visiblePercent = Math.max(0, visibleHeight / rect.height);

        if (visiblePercent > 0.5 && distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
      });
      setActiveBottomBoxIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setBoxRef = (index, el) => { boxRefs.current[index] = el; };

  return (
    <div className="animate-fade-in px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20 items-center">
        <div className="lg:col-span-7">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-100 leading-[0.95] tracking-tight mb-8">
            A window into <br/>
            <span className="text-stone-500 italic">a curious mind.</span>
          </h1>

          <div className="group w-fit cursor-default mb-8">
            <div className="font-mono text-xs md:text-sm text-orange-500 flex items-center gap-2 overflow-hidden relative border border-orange-900/30 bg-orange-900/10 px-3 py-1 rounded-full transition-all duration-300">
                <span className="invisible pointer-events-none opacity-0 flex items-center gap-2">
                  <span>{'>_'}</span> The art of thinking out loud&nbsp;&nbsp;
                </span>
              <div className="absolute top-0 left-3 bottom-0 flex items-center gap-2 transition-all duration-500 transform group-hover:-translate-y-8 opacity-100 group-hover:opacity-0">
                  <Terminal size={12} />
                  <span>SYSTEM STATUS: ONLINE</span>
              </div>
              <div className="absolute top-0 left-3 bottom-0 flex items-center transition-all duration-500 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap text-orange-500">
                <span className="font-mono mr-2">{'>_'}</span>
                <span className="italic">The art of thinking out loud</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 mt-6 lg:mt-0">
            <div className="relative h-64 md:h-96 w-full border border-stone-800 bg-stone-900 rounded-lg overflow-hidden group">
                <div className="absolute inset-0 bg-stone-900/20 z-10 group-hover:bg-transparent transition-all duration-700"></div>
                <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(12,12,12,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(12,12,12,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                <img 
                  src="/perspective4.png" 
                  alt="Observation Deck" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-70 mix-blend-screen group-hover:scale-105 transition-transform duration-[2s]" 
                />
                <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] text-orange-500 border border-orange-500/50 px-2 py-1 bg-black/50 backdrop-blur-sm">
                  FIG. 1.0 // OBSERVATORY
                </div>
            </div>
        </div>
      </div>

      <div className="border-t border-stone-900 pt-12 mb-20">
          <SectionHeader number="01" title="Recent Transmissions" />
          <FeedCarousel items={blogPosts} />
      </div>

      <div ref={bottomSectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-24">
          
          <div>
            <SectionHeader number="02" title="The Profile" />
            <BottomBox 
              href="https://www.instagram.com/rafaelvonhertzen/"
              index={0}
              isActive={activeBottomBoxIndex === 0}
              setRef={setBoxRef}
            >
              <div>
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img 
                            src="/profile.jpeg" 
                            alt="Rafael"
                            className={`w-full h-full object-cover grayscale transition-all duration-500 ${activeBottomBoxIndex === 0 ? 'grayscale-0 lg:grayscale' : ''} lg:group-hover:grayscale-0`} 
                          />
                      </div>
                      
                      <ArrowUpRight size={16} className={`transition-all duration-300 ${activeBottomBoxIndex === 0 ? 'opacity-100 text-orange-500' : 'opacity-0 text-stone-600'} lg:opacity-0 lg:text-stone-600 lg:group-hover:opacity-100 lg:group-hover:text-orange-500`} />
                  </div>
                  
                  <h3 className={`font-serif text-xl text-stone-200 mb-2 transition-colors ${activeBottomBoxIndex === 0 ? 'text-white lg:text-stone-200' : 'text-stone-200'} lg:group-hover:text-white`}>Rafael von Hertzen</h3>
                  
                  <p className={`font-sans text-stone-400 text-sm leading-relaxed transition-colors ${activeBottomBoxIndex === 0 ? 'text-stone-300 lg:text-stone-400' : 'text-stone-400'} lg:group-hover:text-stone-300`}>
                      I write to process the world, not to instruct. These are not lessons, but personal signals captured from the noise.
                  </p>
              </div>

              <div className={`mt-6 flex items-center gap-2 font-mono text-xs transition-colors duration-300 ${activeBottomBoxIndex === 0 ? 'text-orange-500' : 'text-stone-500'} lg:text-stone-500 lg:group-hover:text-orange-500`}>
                  VISIT PROFILE <ArrowRight size={12}/>
              </div>
            </BottomBox>
          </div>

          <div>
            <SectionHeader number="03" title="The Input" />
            <BottomBox 
              href="https://www.notion.so/Book-Database-645e72649a4a4d9abd53c6e3e5391f13?source=copy_link"
              index={1}
              isActive={activeBottomBoxIndex === 1}
              setRef={setBoxRef}
            >
              <div>
                  <div className="flex justify-between items-start mb-6">
                      <BookOpen size={24} className={`transition-colors duration-300 ${activeBottomBoxIndex === 1 ? 'text-orange-500' : 'text-stone-600'} lg:text-stone-600 lg:group-hover:text-orange-500`} />
                      <ArrowUpRight size={16} className={`transition-all duration-300 ${activeBottomBoxIndex === 1 ? 'opacity-100 text-orange-500' : 'opacity-0 text-stone-600'} lg:opacity-0 lg:text-stone-600 lg:group-hover:opacity-100 lg:group-hover:text-orange-500`} />
                  </div>
                  <h3 className={`font-serif text-xl text-stone-200 mb-2 transition-colors ${activeBottomBoxIndex === 1 ? 'text-white lg:text-stone-200' : 'text-stone-200'} lg:group-hover:text-white`}>
                      Digital Library
                  </h3>
                  <p className={`font-sans text-stone-400 text-sm leading-relaxed transition-colors ${activeBottomBoxIndex === 1 ? 'text-stone-300 lg:text-stone-400' : 'text-stone-400'} lg:group-hover:text-stone-300`}>
                  An archive of inputs. Every book I've read in the past few years, accompanied by ratings and raw notes—some extensive, others not.
                  </p>
              </div>
              <div className={`mt-6 flex items-center gap-2 font-mono text-xs transition-colors duration-300 ${activeBottomBoxIndex === 1 ? 'text-orange-500' : 'text-stone-500'} lg:text-stone-500 lg:group-hover:text-orange-500`}>
                  OPEN DATABASE <ArrowRight size={12}/>
              </div>
            </BottomBox>
          </div>

          <div>
            <SectionHeader number="04" title="The Output" />
            <BottomBox 
              href="https://percepthelsinki.com"
              index={2}
              isActive={activeBottomBoxIndex === 2}
              setRef={setBoxRef}
            >
              <div>
                  <div className="flex justify-between items-center mb-6">
                      <ExternalLink size={24} className={`transition-colors duration-300 ${activeBottomBoxIndex === 2 ? 'text-orange-500' : 'text-stone-600'} lg:text-stone-600 lg:group-hover:text-orange-500`} />
                      <ArrowUpRight size={16} className={`transition-all duration-300 ${activeBottomBoxIndex === 2 ? 'opacity-100 text-orange-500' : 'opacity-0 text-stone-600'} lg:opacity-0 lg:text-stone-600 lg:group-hover:opacity-100 lg:group-hover:text-orange-500`} />
                  </div>
                  <h3 className={`font-serif text-xl text-stone-200 mb-2 transition-colors ${activeBottomBoxIndex === 2 ? 'text-white lg:text-stone-200' : 'text-stone-200'} lg:group-hover:text-white`}>Percept Helsinki</h3>
                  <p className={`font-sans text-stone-400 text-sm transition-colors ${activeBottomBoxIndex === 2 ? 'text-stone-300 lg:text-stone-400' : 'text-stone-400'} lg:group-hover:text-stone-300`}>
                  What I work on every day. A home decor brand designed for men. Built from scratch as a solopreneur to six-figure annual revenue.
                  </p>
              </div>
              <div className={`mt-6 flex items-center gap-2 font-mono text-xs transition-colors duration-300 ${activeBottomBoxIndex === 2 ? 'text-orange-500' : 'text-stone-500'} lg:text-stone-500 lg:group-hover:text-orange-500`}>
                  VISIT SITE <ArrowRight size={12}/>
              </div>
            </BottomBox>
          </div>
      </div>
    </div>
  );
};

const BlogIndexView = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in px-6 max-w-5xl mx-auto">
        <div className="space-y-8">
          {blogPosts.map(post => (
            <div key={post.id} onClick={() => navigate(`/post/${post.id}`)} className="group cursor-pointer border-b border-stone-900 pb-8">
              <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={resolveImgPath(post.coverImage)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <div className="font-mono text-xs mb-2 text-orange-600">{post.date}</div>
                    <h2 className="font-serif text-3xl mb-3 transition-colors text-stone-300 group-hover:text-white">{post.title}</h2>
                    <p className="text-sm max-w-2xl text-stone-500">{post.excerpt}</p>
                  </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

const BlogPostView = () => {
  const { id } = useParams();
  const selectedPost = blogPosts.find(p => p.id.toString() === id);

  useEffect(() => {
    if (selectedPost) {
      document.title = `${selectedPost.title} | RVH`;
    }
  }, [selectedPost]);

  if (!selectedPost) return <div className="text-center pt-20 text-stone-500">Post not found.</div>;

  return (
    <article className="animate-fade-in w-full">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="group mb-12 flex items-center gap-2 font-mono text-xs transition-colors text-stone-500 hover:text-blue-800">
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} />
          RETURN TO INDEX
        </Link>

        <header className="mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex gap-4 font-mono text-xs mb-6 border rounded-full px-4 py-1 text-blue-800 border-blue-300 bg-blue-50">
            <span>{selectedPost.category.toUpperCase()}</span>
            <span className="text-stone-400">|</span>
            <span>{selectedPost.date}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-8 text-stone-900">
            {selectedPost.title}
          </h1>
        </header>
        
        <div className="mb-16 w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <img src={resolveImgPath(selectedPost.coverImage)} alt={selectedPost.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-p:font-sans prose-p:leading-loose transition-colors duration-1000
          prose-headings:text-stone-900 prose-p:text-stone-800 prose-li:text-stone-800 prose-strong:text-stone-900 marker:text-blue-800">
          <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
        </div>
      </div>
    </article>
  );
};

// ============================================================================
//  5. MAIN LAYOUT & ROUTING
// ============================================================================

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isPaperMode = location.pathname.includes('/post/');

  return (
    <div 
      className={`min-h-screen font-sans transition-colors duration-1000 ease-in-out 
        ${isPaperMode 
          ? 'bg-[#f5f5f4] text-stone-800 selection:bg-blue-200 selection:text-blue-900' 
          : 'bg-[#080808] text-stone-300 selection:bg-orange-500/30 selection:text-orange-200'
        }`}
    >
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-1000 
          ${isPaperMode ? 'bg-[#f5f5f4]/80 border-stone-200' : 'bg-[#080808]/80 border-stone-900/50'}`}>
        
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="cursor-pointer group flex items-center gap-3">
              <div className={`w-3 h-3 rounded-sm group-hover:rotate-45 transition-transform duration-300 ${isPaperMode ? 'bg-blue-700' : 'bg-orange-600'}`}></div>
              <div className={`font-serif text-xl tracking-tight transition-colors duration-1000 ${isPaperMode ? 'text-stone-900' : 'text-stone-200 group-hover:text-white'}`}>
               RVH
             </div>
          </Link>

          <div className={`hidden md:flex items-center gap-10 font-mono text-xs tracking-widest transition-colors duration-1000 ${isPaperMode ? 'text-stone-500' : 'text-stone-500'}`}>
            <Link to="/" className={`transition-colors ${isPaperMode ? 'hover:text-blue-800' : 'hover:text-orange-600'} ${location.pathname === '/' ? (isPaperMode ? 'text-stone-900' : 'text-white') : ''}`}>INDEX</Link>
            <Link to="/blog" className={`transition-colors ${isPaperMode ? 'hover:text-blue-800' : 'hover:text-orange-600'} ${location.pathname === '/blog' ? (isPaperMode ? 'text-stone-900' : 'text-white') : ''}`}>ARCHIVE</Link>
            <a href="https://notion.so" target="_blank" rel="noreferrer" className={`transition-colors flex items-center gap-2 ${isPaperMode ? 'hover:text-blue-800' : 'hover:text-orange-600'}`}>
              BOOK DATABASE <ArrowUpRight size={10} />
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden transition-colors duration-1000 ${isPaperMode ? 'text-stone-900' : 'text-stone-300'}`}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-40 pt-24 px-6 md:hidden animate-fade-in ${isPaperMode ? 'bg-[#f5f5f4]' : 'bg-[#080808]'}`}>
          <div className="flex flex-col gap-8 font-serif text-3xl">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-left ${isPaperMode ? 'text-stone-900' : 'text-stone-200'}`}>Index</Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)} className={`text-left ${isPaperMode ? 'text-stone-900' : 'text-stone-200'}`}>Archive</Link>
            
            {/* UPDATED MOBILE LINK with Arrow */}
            <a href="https://notion.so" target="_blank" rel="noreferrer" onClick={() => setIsMenuOpen(false)} className="text-left text-stone-500 flex items-center gap-2">
              Book Database <ArrowUpRight size={16} />
            </a>

          </div>
        </div>
      )}

      <main className="relative z-10 w-full pt-32 pb-20">
        {children}
      </main>

      <footer className={`border-t mt-20 py-12 transition-colors duration-1000 ${isPaperMode ? 'border-stone-300' : 'border-stone-900'}`}>
        {/* FIXES:
            1. 'text-sm': Restored standard size (removed text-xs).
            2. 'whitespace-nowrap': Keeps links solid.
            3. 'X / TWITTER': Shorter text helps it fit at the larger size.
        */}
        <div className={`max-w-7xl mx-auto px-6 overflow-x-hidden grid grid-cols-[auto_auto] justify-start gap-x-6 gap-y-2 pl-8 md:pl-0 md:flex md:flex-row md:justify-between md:items-center text-sm font-mono transition-colors ${isPaperMode ? 'text-stone-500' : 'text-stone-600'}`}>
          
          {/* GROUP 1: RVH + Location */}
          <div className="contents md:flex md:flex-row md:gap-12 md:items-center">
            <div className="whitespace-nowrap">RVH © 2025</div>
            {/* Added the isPaperMode prop here! */}
            <LiveFooterData isPaperMode={isPaperMode} />
          </div>
          
          {/* GROUP 2: Social Links */}
          <div className="contents md:flex md:flex-row md:gap-6 md:items-center">
            <a href="https://x.com/rafael_v_h" target="_blank" rel="noreferrer" className={`whitespace-nowrap transition-colors flex items-center gap-2 ${isPaperMode ? 'hover:text-blue-800' : 'hover:text-orange-500'}`}>
              <Twitter size={14}/> X / TWITTER
            </a>
            <a href="https://www.instagram.com/rafaelvonhertzen/" target="_blank" rel="noreferrer" className={`whitespace-nowrap transition-colors flex items-center gap-2 ${isPaperMode ? 'hover:text-blue-800' : 'hover:text-orange-500'}`}>
              <Instagram size={14}/> INSTAGRAM
            </a>
          </div>

        </div>
      </footer>    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <DynamicTitle />
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/blog" element={<BlogIndexView />} />
          <Route path="/post/:id" element={<BlogPostView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;