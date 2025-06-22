import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readerMode, setReaderMode] = useState('webtoon');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [pagesLoaded, setPagesLoaded] = useState(3);
  const [currentPage, setCurrentPage] = useState(window.location.hash.slice(1) || 'home');
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  const observerTarget = useRef(null);

  // Detect route changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.slice(1) || 'home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Infinite Scroll Observer
  useEffect(() => {
    if (readerMode !== 'webtoon') return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPagesLoaded(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [readerMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Show survey modal on first visit
  useEffect(() => {
    const visited = localStorage.getItem('surveyShown');
    if (!visited) {
      setTimeout(() => setShowSurveyModal(true), 2000);
      localStorage.setItem('surveyShown', 'true');
    }
  }, []);

  const chapters = [
    { id: 1, title: "Chapter 1 - The Beginning" },
    { id: 2, title: "Chapter 2 - Shadows Rise" },
    { id: 3, title: "Chapter 3 - Forgotten Memories" },
    { id: 4, title: "Chapter 4 - Return of the Hero" },
    { id: 5, title: "Chapter 5 - Betrayal" },
  ];

  const characters = [
    {
      name: 'Kira Tachibana',
      bio: 'A fierce and mysterious warrior who holds the key to an ancient prophecy.',
      image: 'https://placehold.co/300x400/FFB6C1/333?text=Kira'
    },
    {
      name: 'Renjiro Sato',
      bio: 'A genius inventor and reluctant hero caught in a world he never asked for.',
      image: 'https://placehold.co/300x400/87CEEB/333?text=Renjiro'
    },
    {
      name: 'Yuna Kurogane',
      bio: 'An elite assassin with a tragic past and unmatched swordsmanship.',
      image: 'https://placehold.co/300x400/696969/FFFFFF?text=Yuna'
    },
  ];

  const filteredChapters = chapters.filter(ch =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Route = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* Hero Banner */}
            <section className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1200x400/4A00FF/FFFFFF?text=Anime+Themed+Banner')"}}>
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative container mx-auto px-4 flex items-center justify-center h-full">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">Welcome to MyWebComic</h2>
              </div>
            </section>

            {/* Comic Reader Section */}
            <section id="comics" className="py-12">
              <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Chapter List Sidebar */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h3 className="font-bold text-lg mb-4">Chapters</h3>
                  <input
                    type="text"
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
                  />
                  <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredChapters.length > 0 ? (
                      filteredChapters.map(ch => (
                        <li key={ch.id}>
                          <button
                            onClick={() => {
                              setCurrentChapter(ch.id);
                              setPagesLoaded(3);
                              setCurrentPage('read');
                            }}
                            className={`block w-full text-left px-3 py-2 rounded hover:bg-purple-100 dark:hover:bg-gray-700 ${
                              currentChapter === ch.id ? 'bg-purple-200 dark:bg-purple-900' : ''
                            }`}
                          >
                            {ch.title}
                          </button>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No chapters found.</p>
                    )}
                  </ul>
                </div>

                {/* Reader Area */}
                <div className="lg:col-span-3">
                  <h2 className="text-3xl font-bold mb-6">Chapter {currentChapter}</h2>
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setReaderMode('webtoon')}
                      className={`px-4 py-2 rounded-md ${readerMode === 'webtoon' ? 'bg-purple-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      Webtoon Mode
                    </button>
                    <button
                      onClick={() => setReaderMode('manga')}
                      className={`px-4 py-2 rounded-md ${readerMode === 'manga' ? 'bg-purple-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      Manga Mode
                    </button>
                  </div>
                  <div className={`comic-reader ${readerMode === 'webtoon' ? 'overflow-y-scroll max-h-[70vh] border border-gray-300 dark:border-gray-600 p-2 rounded' : ''} mb-6`}>
                    {readerMode === 'webtoon' ? (
                      <>
                        {Array.from({ length: pagesLoaded }).map((_, i) => (
                          <img
                            key={i}
                            src={`https://placehold.co/700x1500/EEE/333?text=Page+${i + 1}`}
                            alt={`Webtoon Page ${i + 1}`}
                            className="w-full mb-4"
                          />
                        ))}
                        <div ref={observerTarget} className="h-4"></div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <img src="https://placehold.co/700x1000/EEE/333?text=Manga+Page+1" alt="Manga Page 1" className="w-full rounded shadow-md" />
                        <img src="https://placehold.co/700x1000/EEE/333?text=Manga+Page+2" alt="Manga Page 2" className="w-full rounded shadow-md" />
                        <img src="https://placehold.co/700x1000/EEE/333?text=Manga+Page+3" alt="Manga Page 3" className="w-full rounded shadow-md" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50" disabled={currentChapter <= 1}>
                      Previous Chapter
                    </button>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Next Chapter</button>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      case 'read':
        return <div>Redirecting...</div>;
      case 'characters':
        return (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6">Characters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {characters.map((char, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-transform hover:scale-105">
                    <img src={char.image} alt={char.name} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{char.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{char.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'shop':
        return (
          <section className="py-12 bg-gray-200 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6">Merch Shop</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden transition-transform hover:scale-105">
                    <img src={`https://placehold.co/400x400/AAA/333?text=Product+${i}`} alt={`Product ${i}`} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">T-Shirt Design {i}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">High-quality anime-themed apparel.</p>
                      <button className="mt-3 w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'support':
        return (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Support Me</h2>
              <p className="max-w-xl mx-auto mb-6">If you enjoy my work, consider supporting me through Ko-fi or Patreon.</p>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
                  <span>☕ Ko-fi</span>
                </button>
                <button className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-2">
                  <span>🪙 Patreon</span>
                </button>
              </div>
            </div>
          </section>
        );
      default:
        return <div>404 Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">MyWebComic</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="hover:underline">Home</a> 
            <a href="#characters" className="hover:underline">Characters</a>
            <a href="#shop" className="hover:underline">Shop</a>
            <a href="#support" className="hover:underline">Support</a>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-white/20 transition">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 rounded-md hover:bg-white/20"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowSidebar(false)}>
          <div
            className="bg-white dark:bg-gray-800 h-full w-64 p-4 shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSidebar(false)}
              className="mb-6 text-xl font-bold text-right w-full"
            >
              ✕
            </button>
            <nav className="flex flex-col space-y-4">
              <a href="#home" onClick={() => setShowSidebar(false)}>Home</a>
              <a href="#characters" onClick={() => setShowSidebar(false)}>Characters</a>
              <a href="#shop" onClick={() => setShowSidebar(false)}>Shop</a>
              <a href="#support" onClick={() => setShowSidebar(false)}>Support</a>
            </nav>
          </div>
        </div>
      )}

      {/* Content Routing */}
      <main className="container mx-auto px-4 py-8">
        <Route />
      </main>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-6 max-w-xl mx-auto">Subscribe to our newsletter for updates on new chapters and merch drops!</p>
          <form className="flex flex-col sm:flex-row gap-2 justify-center">
            <input type="email" placeholder="Your email" className="px-4 py-2 rounded outline-none w-full sm:w-64 text-black" />
            <button className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2025 MyWebComic. All rights reserved.</p>
      </footer>

      {/* Survey Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Where did you hear about us?</h3>
            <div className="space-y-2">
              {['TikTok', 'Instagram', 'Twitter', 'Google', 'Facebook'].map((source) => (
                <button
                  key={source}
                  onClick={() => setShowSurveyModal(false)}
                  className="w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {source}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSurveyModal(false)}
              className="mt-4 w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}