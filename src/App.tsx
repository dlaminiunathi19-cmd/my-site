import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const projectRows = [
  { phase: 'Initiation', task: 'Project Charter, Stakeholder Register, Problem Statement', status: 'Completed', duration: '3 days' },
  { phase: 'Initiation', task: 'Objectives & High-Level Scope', status: 'Completed', duration: '3 days' },
  { phase: 'Planning', task: 'WBS, Gantt Chart, Budget, Risk Register', status: 'Completed', duration: '5 days' },
  { phase: 'Planning', task: 'Communication Plan, Quality Plan, RACI Matrix', status: 'Completed', duration: '5 days' },
  { phase: 'Execution', task: 'Stakeholder Engagement (2+ real stakeholders)', status: 'Completed', duration: '4 days' },
  { phase: 'Execution', task: 'Multimedia Collection (photos, interviews, videos)', status: 'Completed', duration: '4 days' },
  { phase: 'Monitoring', task: 'Progress Reports, Updated Gantt, Risk Mitigation', status: 'Completed', duration: '3 days' },
  { phase: 'Closing', task: 'Final Report, Lessons Learned, Reflection', status: 'Completed', duration: '2 days' },
]

const galleryDances = [
  {
    id: 1,
    title: 'Tswana Traditional',
    video: '${import.meta.env.BASE_URL}videos/vid-hero-1.mp4',
    image: '${import.meta.env.BASE_URL}images/img-hero-1.jpg',
  },
  {
    id: 2,
    title: 'Pantsula',
    video: '${import.meta.env.BASE_URL}videos/vid-hero-2.mp4',
    image: '${import.meta.env.BASE_URL}images/img-hero-2.jpg',
  },
  {
    id: 3,
    title: 'Sokkie',
    video: '${import.meta.env.BASE_URL}videos/vid-hero-3.mp4',
    image: '${import.meta.env.BASE_URL}images/img-hero-3.jpg',
  },
  {
    id: 4,
    title: 'Amapiano',
    video: '${import.meta.env.BASE_URL}videos/vid-hero-4.mp4',
    image: '${import.meta.env.BASE_URL}images/img-hero-4.jpg',
  },
]

function App() {
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const gallerySectionRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  const heritageRef = useRef<HTMLDivElement>(null)
  const dancesRef = useRef<HTMLDivElement>(null)
  const communityRef = useRef<HTMLDivElement>(null)
  const videoShowcaseRef = useRef<HTMLDivElement>(null)
  const projectRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const youtubeRef = useRef<HTMLDivElement>(null)

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const onMouseEnterPanel = () => {
      cursor.classList.add('active')
      cursor.classList.add('hover')
    }

    const onMouseLeavePanel = () => {
      cursor.classList.remove('hover')
    }

    const onMouseEnterGallery = () => {
      cursor.classList.add('active')
    }

    const onMouseLeaveGallery = () => {
      cursor.classList.remove('active')
      cursor.classList.remove('hover')
    }

    window.addEventListener('mousemove', onMouseMove)

    const gallery = galleryRef.current
    const gallerySection = gallerySectionRef.current

    if (gallerySection) {
      gallerySection.addEventListener('mouseenter', onMouseEnterGallery)
      gallerySection.addEventListener('mouseleave', onMouseLeaveGallery)
    }

    const panels = gallery?.querySelectorAll('.gallery__panel')
    panels?.forEach((panel) => {
      panel.addEventListener('mouseenter', onMouseEnterPanel)
      panel.addEventListener('mouseleave', onMouseLeavePanel)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (gallerySection) {
        gallerySection.removeEventListener('mouseenter', onMouseEnterGallery)
        gallerySection.removeEventListener('mouseleave', onMouseLeaveGallery)
      }
      panels?.forEach((panel) => {
        panel.removeEventListener('mouseenter', onMouseEnterPanel)
        panel.removeEventListener('mouseleave', onMouseLeavePanel)
      })
    }
  }, [])

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1.4,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Horizontal scroll gallery
  useEffect(() => {
    const gallery = galleryRef.current
    const gallerySection = gallerySectionRef.current
    if (!gallery || !gallerySection) return

    const panels = gallery.querySelectorAll('.gallery__panel')
    const totalWidth = gallery.scrollWidth
    const viewportWidth = window.innerWidth
    const maxScroll = totalWidth - viewportWidth

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallerySection,
          start: 'top top',
          end: '+=1000vh',
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = self.progress * 100
            setProgress(prog)

            const panelWidthWithGap = viewportWidth * 0.7 + viewportWidth * 0.06
            const scrollX = self.progress * maxScroll
            const newIndex = Math.min(
              3,
              Math.max(0, Math.floor((scrollX + viewportWidth * 0.35) / panelWidthWithGap))
            )
            setActiveIndex(newIndex)
          },
        },
        defaults: { ease: 'none' },
      })

      tl.fromTo(gallery, { x: 0 }, { x: -maxScroll })

      // Panel title animations
      panels.forEach((panel, i) => {
        const title = panel.querySelector('.panel-title')
        if (!title) return

        const text = title.textContent || ''
        title.innerHTML = text
          .split('')
          .map((char) =>
            char === ' '
              ? ' '
              : `<span class="char" style="display:inline-block;transform:translateY(40px);opacity:0">${char}</span>`
          )
          .join('')

        const chars = title.querySelectorAll('.char')

        ScrollTrigger.create({
          trigger: gallerySection,
          start: 'top top',
          end: '+=1000vh',
          scrub: true,
          onUpdate: (self) => {
            const panelStart = i / panels.length
            const panelEnd = (i + 1) / panels.length
            const progress = self.progress

            if (progress >= panelStart && progress <= panelEnd) {
              const localProgress = (progress - panelStart) / (panelEnd - panelStart)
              if (localProgress > 0.1 && localProgress < 0.9) {
                chars.forEach((char, ci) => {
                  gsap.to(char, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: ci * 0.025,
                    ease: 'power3.out',
                    overwrite: true,
                  })
                })
              }
            }
          },
        })
      })
    }, gallerySection)

    return () => ctx.revert()
  }, [])

  // Section entrance animations
  const animateSection = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, options: { x?: number; y?: number; stagger?: number; scale?: number } = {}) => {
      if (!ref.current) return

      const { x = 0, y = 40, stagger = 0.12, scale } = options
      const elements = ref.current.querySelectorAll('.animate-item')

      gsap.set(elements, { opacity: 0, x, y, scale: scale || 1 })

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(elements, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger,
            ease: 'power3.out',
          })
        },
      })
    },
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      animateSection(heritageRef, { x: -60, y: 0, stagger: 0.12 })
      animateSection(dancesRef, { y: 50, stagger: 0.15 })
      animateSection(communityRef, { x: -40, y: 0, stagger: 0.12 })
      animateSection(videoShowcaseRef, { x: -40, y: 0, stagger: 0.15 })
      animateSection(youtubeRef, { y: 40, stagger: 0.12 })
      animateSection(projectRef, { y: 20, stagger: 0.08 })
    }, 100)

    return () => clearTimeout(timer)
  }, [animateSection])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 })
    }
  }

  return (
    <div className="relative">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-6 md:px-10"
        style={{ background: 'rgba(245, 245, 244, 0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E7E5E4' }}>
        <div className="font-bold text-sm md:text-base tracking-[0.1em] uppercase" style={{ fontFamily: "'Archivo', sans-serif" }}>
          Mangaung Moves
        </div>
        <div className="flex gap-6 md:gap-10">
          <button onClick={() => scrollToSection('explore')} className="nav-link">Explore</button>
          <button onClick={() => scrollToSection('dances')} className="nav-link hidden sm:block">Dances</button>
          <button onClick={() => scrollToSection('heritage')} className="nav-link hidden sm:block">Heritage</button>
          <button onClick={() => scrollToSection('project')} className="nav-link hidden sm:block">Project</button>
        </div>
      </nav>

      {/* Hero — Horizontal Scroll Video Gallery */}
      <section id="explore" ref={gallerySectionRef} className="gallery-section">
        <div ref={galleryRef} className="gallery">
          {galleryDances.map((dance) => (
            <figure key={dance.id} className="gallery__panel">
              <video
                src={dance.video}
                poster={dance.image}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                aria-label={`${dance.title} dance performance`}
              />
              <figcaption>
                <span className="panel-title">{dance.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Gallery Overlay */}
        <div className="gallery__overlay">
          <div className="flex justify-between items-start">
            <div>
              <p className="mono-text" style={{ color: '#A8A29E', letterSpacing: '0.1em' }}>Scroll to explore</p>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ marginTop: '8px', opacity: 0.5 }}>
                <path d="M8 0v20m0 0l-6-6m6 6l6-6" stroke="#A8A29E" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="gallery__overlay-center">
            <h1>DANCE</h1>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: '#F5F5F4', textTransform: 'uppercase', letterSpacing: '-0.02em', opacity: 0.15, mixBlendMode: 'overlay' }}>
              Mangaung
            </p>
          </div>

          <div className="flex justify-between items-end">
            <div className="mono-text" style={{ color: '#A8A29E' }}>
              <span style={{ color: '#B45309' }}>0{activeIndex + 1}</span>
              <span> / 04</span>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="hidden md:block" style={{ maxWidth: '200px', textAlign: 'right' }}>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 500, fontSize: '0.875rem', color: '#A8A29E' }}>
                Discover the rhythms of Mangaung
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section id="heritage" ref={heritageRef} style={{ padding: '120px 0', background: '#F5F5F4' }}>
        <div className="mx-auto flex flex-col lg:flex-row gap-16 items-center" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="animate-item w-full lg:w-[55%] relative">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: '#B45309' }} />
            <img
              src="/images/img-heritage.jpg"
              alt="Elderly Tswana woman in traditional attire"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '3/4' }}
            />
          </div>

          <div className="w-full lg:w-[45%] flex flex-col gap-8">
            <div className="animate-item">
              <span className="section-label">Heritage</span>
            </div>
            <h2 className="animate-item section-heading" style={{ lineHeight: 0.95 }}>
              Where Every Step Tells a Story
            </h2>
            <p className="animate-item body-text" style={{ maxWidth: '520px' }}>
              From the sacred grounds of Tswana ceremonies to the electric streets of Bloemfontein, dance in Mangaung carries the memory of generations. Each movement is a language — speaking of resilience, celebration, identity, and belonging. Our project documents these living traditions before they fade into silence.
            </p>

            <div className="animate-item flex flex-wrap gap-8 mt-4">
              <div>
                <div className="stat-number">04</div>
                <div className="stat-label">Dance Styles Documented</div>
              </div>
              <div>
                <div className="stat-number">15+</div>
                <div className="stat-label">Community Dancers Interviewed</div>
              </div>
              <div>
                <div className="stat-number">SSE316C</div>
                <div className="stat-label">Project Management Module</div>
              </div>
            </div>

            <div className="animate-item mt-4">
              <button onClick={() => scrollToSection('project')} className="btn-bordered" style={{ color: '#1C1917' }}>
                Read Our Full Research
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DANCES SECTION WITH IMAGES & HISTORY ===== */}
      <section id="dances" ref={dancesRef} style={{ padding: '120px 0', background: '#FAFAF9' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="animate-item mb-4">
            <span className="section-label">The Dances</span>
          </div>
          <h2 className="animate-item section-heading mb-16" style={{ lineHeight: 0.95 }}>
            Four Rhythms, One Community
          </h2>

          {/* TSWANA TRADITIONAL */}
          <div className="animate-item mb-20">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="w-full lg:w-[45%]">
                <img
                  src="/images/img-dance-tswana.jpg"
                  alt="Tswana traditional dancers performing a ceremonial dance"
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
              <div className="w-full lg:w-[55%] flex flex-col gap-5">
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '2rem', color: '#1C1917', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  Tswana Traditional Dance
                </h3>
                <p className="body-text">
                  The history of Tswana traditional dance is deeply rooted in the cultural practices of the Tswana people, who have inhabited Southern Africa for centuries. The dance has evolved from the traditional dances of the Tswana people, performed at important events such as weddings and funerals, to a more stylized form that incorporates new movements and rhythms.
                </p>
                <p className="body-text">
                  Tswana dance originated centuries ago among ethnic groups such as the Bangwaketse tribe. It plays a crucial role in celebrations, rituals, and daily life within Setswana culture. Many elements of Tswana dance come from interactions with neighboring ethnic groups — South African dance styles, in particular, have shaped movements and rhythms in these dances. Traditional dances like <strong>Borankana</strong> and <strong>Phathisi</strong> showcase this influence through vibrant expressions.
                </p>
                <p className="body-text">
                  The dance is a celebration of life, love, and community, bringing people together in a spirit of joy and harmony. It is a form of storytelling, with each movement having a meaning and significance. The dance is often performed in a circle, with synchronized and rhythmic movements, and is characterized by energetic and lively style.
                </p>
                <div style={{ background: '#F5F5F4', borderLeft: '4px solid #B45309', padding: '1.25rem 1.5rem' }}>
                  <h4 className="mono-text mb-2" style={{ color: '#B45309', fontWeight: 500 }}>COSTUMES & STYLE</h4>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#44403C', lineHeight: 1.6 }}>
                    Tswana dancers wear vibrant traditional attire that reflects their rich culture. Women often don a colorful dress called a "koto," while men typically wear patterned shirts and long trousers known as "lepants." Women adorn themselves with intricate beadwork, including necklaces and bracelets. Men may add hats called "ngaka" to their outfits. The music used during Tswana dance is typically provided by drums and other percussion instruments, creating a rhythm that the dancers move to.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['TRADITIONAL', 'TSWANA', 'CEREMONY'].map((tag) => (
                    <span key={tag} className="mono-text" style={{ color: '#A8A29E', fontSize: '0.75rem' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PANTSULA */}
          <div className="animate-item mb-20">
            <div className="flex flex-col lg:flex-row-reverse gap-10 items-start">
              <div className="w-full lg:w-[45%]">
                <img
                  src="/images/img-dance-pantsula.jpg"
                  alt="Pantsula dancer in township street attire"
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
              <div className="w-full lg:w-[55%] flex flex-col gap-5">
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '2rem', color: '#1C1917', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  Pantsula
                </h3>
                <p className="body-text">
                  Pantsula is a high-energy street dance from South Africa's townships, originating in the 1950s–60s as a form of social expression and resistance during apartheid. It emerged in the black townships of Sophiatown and Alexandra in Johannesburg, initially performed by older men in informal street competitions, gradually spreading across townships and later including dancers of all ages and genders.
                </p>
                <p className="body-text">
                  By the 1980s, Pantsula had developed strong political overtones, serving as a form of resistance against apartheid and a platform to raise awareness about social issues such as AIDS. The dance communicated stories of daily life, societal challenges, and youth rebellion. After apartheid ended in 1994, Pantsula continued as a cultural emblem, gaining popularity across racial lines and maintaining its role as a symbol of South African identity.
                </p>
                <p className="body-text">
                  The dance is characterized by <strong>fast-paced, syncopated footwork, low-to-the-ground movements, and group synchronization</strong>. Its style draws from tap dance, jive, gumboot, traditional African dance, and everyday gestures like dice-rolling. The term "Pantsula" itself means "walk like a duck," referencing the distinctive footwork. Today, Pantsula remains a vibrant part of South African urban culture, performed globally and featured in media such as the dance film "Hear Me Move."
                </p>

                {/* PANTSULA ATTIRE */}
                <div style={{ background: '#1C1917', padding: '1.5rem' }}>
                  <h4 className="mono-text mb-3" style={{ color: '#B45309', fontWeight: 500, letterSpacing: '0.08em' }}>PANTSULA ATTIRE & FASHION</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <li style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#D6D3D1', lineHeight: 1.5 }}>
                      <strong style={{ color: '#F5F5F4' }}>Brightly colored or patterned shirts</strong> — often plaid or checkered button-up shirts
                    </li>
                    <li style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#D6D3D1', lineHeight: 1.5 }}>
                      <strong style={{ color: '#F5F5F4' }}>Slim-fit trousers or chinos</strong> — usually in neutral or earthy tones
                    </li>
                    <li style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#D6D3D1', lineHeight: 1.5 }}>
                      <strong style={{ color: '#F5F5F4' }}>White sneakers</strong> — a signature footwear choice, often Converse All Stars or similar styles
                    </li>
                    <li style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#D6D3D1', lineHeight: 1.5 }}>
                      <strong style={{ color: '#F5F5F4' }}>Hats or caps</strong> — such as flat caps, bucket hats, or berets, adding to the street-smart look
                    </li>
                    <li style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#D6D3D1', lineHeight: 1.5 }}>
                      <strong style={{ color: '#F5F5F4' }}>Accessories</strong> — sometimes suspenders or belts to complete the outfit
                    </li>
                  </ul>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.875rem', color: '#A8A29E', lineHeight: 1.5, marginTop: '1rem', fontStyle: 'italic' }}>
                    The attire reflects township street culture, individuality, and pride. It is designed for comfort and flexibility to allow for the fast, intricate footwork of Pantsula dancing. Over time, it has become a recognizable symbol of urban South African identity.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {['TOWNSHIP', 'HISTORY', 'RESISTANCE'].map((tag) => (
                    <span key={tag} className="mono-text" style={{ color: '#A8A29E', fontSize: '0.75rem' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SOKKIE */}
          <div className="animate-item mb-20">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="w-full lg:w-[45%]">
                <img
                  src="/images/img-dance-sokkie.jpg"
                  alt="Couple performing Sokkie partner dance"
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
              <div className="w-full lg:w-[55%] flex flex-col gap-5">
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '2rem', color: '#1C1917', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  Sokkie
                </h3>
                <p className="body-text">
                  Sokkie dance is a vibrant and lively social dance style that originated from the movements of Afrikaner trekkers. It combines quick steps with close partner holds, making it a favorite at Afrikaans nightclubs. The dance is characterized by its relaxed costumes inspired by African traditions and its technique set to lively 4-beat music.
                </p>
                <p className="body-text">
                  The Sokkie dance has deep roots influenced by Afrikaner trekkers. These travelers brought their traditions and styles, which mixed with local cultures. This fusion created a unique dance form that combines traditional movements and everyday gestures. The connection to tap dancing also plays a key role in its evolution. As Afrikaner trekkers settled into communities, they shared this lively dance at social gatherings and nightclubs.
                </p>
                <p className="body-text">
                  Sokkie became popular in Afrikaans nightclubs, where partners danced closely together. The emphasis on fun and community spirit shaped its current style. Sokkie dance reflects both traditional and modern influences in South African culture, celebrating unity through rhythm and movement. It is a style that thrives in Afrikaans nightclubs across South Africa, where couples fill the floors, showcasing their skills and enjoying vibrant music. The energetic beats drive the movements in Sokkie dance, and participants embrace the close hold with their partners, creating a feeling of unity on the floor.
                </p>
                <div style={{ background: '#F5F5F4', borderLeft: '4px solid #B45309', padding: '1.25rem 1.5rem' }}>
                  <h4 className="mono-text mb-2" style={{ color: '#B45309', fontWeight: 500 }}>WHAT MAKES SOKKIE UNIQUE</h4>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#44403C', lineHeight: 1.6 }}>
                    The Sokkie dance is unique because it combines quick steps with close partner holds. It evolved from the rich cultural practices of South Africa, blending tap dancing with everyday gestures to create a lively performance. Dancers use quick-stepping movements, adding rhythm through their feet. Nightclubs become hubs for celebration, where people come together to enjoy dancing and cultural expression.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['PARTNER', 'AFRIKAANS', 'SOCIAL'].map((tag) => (
                    <span key={tag} className="mono-text" style={{ color: '#A8A29E', fontSize: '0.75rem' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AMAPIANO */}
          <div className="animate-item">
            <div className="flex flex-col lg:flex-row-reverse gap-10 items-start">
              <div className="w-full lg:w-[45%]">
                <img
                  src="/images/img-dance-amapiano.jpg"
                  alt="Young dancers performing Amapiano moves"
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
              <div className="w-full lg:w-[55%] flex flex-col gap-5">
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '2rem', color: '#1C1917', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  Amapiano
                </h3>
                <p className="body-text">
                  Amapiano dance emerged alongside the Amapiano music genre in South African townships during the 2010s, evolving through social media, township parties, and viral dance challenges. The dance developed in tandem with Amapiano music, which originated in the early 2010s in the townships of Gauteng province, particularly around Johannesburg and Pretoria. The genre blends kwaito, deep house, jazz, and soul, characterized by piano melodies and the distinctive log drum bassline.
                </p>
                <p className="body-text">
                  The dance culture grew organically in township parties, local clubs, and informal gatherings, where residents expressed themselves through movement that matched the music's slow tempo, deep bass, and rhythmic complexity. The dance style is highly improvisational, reflecting the communal and creative spirit of township life. Early moves were influenced by kwaito and house dance styles, incorporating fluid footwork, hip movements, and body isolations that complement the music's percussive beats.
                </p>
                <p className="body-text">
                  Signature moves often mimic the rhythm of the log drum, emphasizing bounce, groove, and syncopation. Amapiano dance gained wider recognition in the late 2010s through platforms like <strong>TikTok, Instagram, and WhatsApp</strong>, where viral dance challenges allowed local moves to reach national and international audiences. These challenges encouraged dancers to innovate, creating new steps and variations that became part of the evolving Amapiano dance lexicon.
                </p>
                <div style={{ background: '#F5F5F4', borderLeft: '4px solid #B45309', padding: '1.25rem 1.5rem' }}>
                  <h4 className="mono-text mb-2" style={{ color: '#B45309', fontWeight: 500 }}>KEY INFLUENCERS</h4>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: '0.9375rem', color: '#44403C', lineHeight: 1.6 }}>
                    Prominent Amapiano artists such as <strong>Kabza De Small, DJ Maphorisa, and Vigro Deep</strong> played a crucial role in popularizing the music and, by extension, the dance. DJs and producers often showcased dance moves in music videos, live performances, and social media content, inspiring fans to replicate and adapt them. Township dancers and local crews also contributed to the style's evolution.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['CONTEMPORARY', 'YOUTH', 'TRENDING'].map((tag) => (
                    <span key={tag} className="mono-text" style={{ color: '#A8A29E', fontSize: '0.75rem' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section ref={communityRef} style={{ padding: '120px 0', background: '#1C1917' }}>
        <div className="mx-auto flex flex-col lg:flex-row gap-16 items-center" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="animate-item w-full lg:w-[40%] flex flex-col gap-8">
            <span className="section-label">Community</span>
            <h2 className="section-heading section-heading-light" style={{ lineHeight: 0.95 }}>
              More Than Movement
            </h2>
            <p className="body-text body-text-light">
              This project engaged real dancers, community elders, and cultural organizations across Mangaung. Through interviews, video documentation, and collaborative research, we captured not just the steps — but the stories, struggles, and triumphs behind every dance.
            </p>
            <div>
              <button onClick={() => scrollToSection('project')} className="btn-bordered btn-bordered-light">
                View Project Documentation
              </button>
            </div>
          </div>

          <div className="animate-item w-full lg:w-[60%] relative overflow-hidden">
            <img
              src="/images/img-community.jpg"
              alt="Community dancers in Botshabelo"
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '16/9' }}
            />
            <p className="mono-text mt-3" style={{ color: '#78716C', fontSize: '0.75rem' }}>
              Community dancers in Botshabelo
            </p>
          </div>
        </div>
      </section>

      {/* ===== VIDEO SHOWCASE WITH ALL 4 VIDEOS ===== */}
      <section id="videos" ref={videoShowcaseRef} style={{ padding: '120px 0', background: '#F5F5F4' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="animate-item mb-4">
            <span className="section-label">Watch</span>
          </div>
          <h2 className="animate-item section-heading mb-4" style={{ lineHeight: 0.95 }}>
            See the Dances in Motion
          </h2>
          <p className="animate-item body-text mb-12" style={{ maxWidth: '600px' }}>
            Watch our documented performances and interviews with community dancers from across Mangaung. Each video captures the authentic spirit and energy of these living traditions.
          </p>

          {/* Row 1: Tswana + Amapiano */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="animate-item w-full lg:w-1/2">
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>
                Tswana Traditional Dance
              </h3>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 400, fontSize: '0.9375rem', color: '#78716C', lineHeight: 1.5, marginBottom: '1rem' }}>
                Experience the grounded, ceremonial movements of Tswana traditional dance performed by community dancers in Mangaung.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/VEerjsMcTuM"
                  title="Tswana Traditional Dance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="animate-item w-full lg:w-1/2">
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>
                Amapiano Dance
              </h3>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 400, fontSize: '0.9375rem', color: '#78716C', lineHeight: 1.5, marginBottom: '1rem' }}>
                Watch the fluid, expressive moves that have made Amapiano South Africa's most popular dance and music genre.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/wh-Wso8_d6c"
                  title="Amapiano Dance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Row 2: Pantsula Interview + Sokkie */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="animate-item w-full lg:w-1/2">
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>
                Pantsula Interview
              </h3>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 400, fontSize: '0.9375rem', color: '#78716C', lineHeight: 1.5, marginBottom: '1rem' }}>
                An in-depth interview with a Pantsula dancer from the Mangaung community, sharing insights on the dance's history and cultural significance.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/WFB6ZJLFJxY"
                  title="Pantsula Interview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="animate-item w-full lg:w-1/2">
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: '1.25rem', color: '#1C1917', marginBottom: '0.5rem' }}>
                Sokkie Dance
              </h3>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 400, fontSize: '0.9375rem', color: '#78716C', lineHeight: 1.5, marginBottom: '1rem' }}>
                Watch the lively partner dance style that brings communities together across language lines in the Free State.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/nTdN2onYfpY"
                  title="Sokkie Dance"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== YOUTUBE CHANNEL SECTION ===== */}
      <section ref={youtubeRef} style={{ padding: '80px 0', background: '#1C1917' }}>
        <div className="mx-auto text-center" style={{ maxWidth: '800px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="animate-item mb-4">
            <span className="section-label">Our Channel</span>
          </div>
          <h2 className="animate-item section-heading section-heading-light mb-6" style={{ lineHeight: 0.95 }}>
            Mangaung Festives on YouTube
          </h2>
          <p className="animate-item body-text body-text-light mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            Subscribe to our YouTube channel @mangaung_festives for more dance performances, interviews with community dancers, and behind-the-scenes content from our project documenting Mangaung's rich dance culture.
          </p>
          <div className="animate-item">
            <a
              href="https://youtube.com/@mangaung_festives"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bordered btn-bordered-light inline-flex items-center gap-3"
              style={{ textDecoration: 'none' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5F5F4">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* Project Documentation Table */}
      <section id="project" ref={projectRef} style={{ padding: '120px 0', background: '#FAFAF9' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="animate-item mb-4">
            <span className="section-label">Project Details</span>
          </div>
          <h2 className="animate-item section-heading mb-12" style={{ lineHeight: 0.95 }}>
            SSE316C — Project Management III
          </h2>

          <div className="animate-item overflow-x-auto">
            <table className="project-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {projectRows.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{row.phase}</td>
                    <td>{row.task}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: '#1C1917',
                        color: '#F5F5F4',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.75rem',
                        letterSpacing: '0.04em',
                      }}>
                        {row.status}
                      </span>
                    </td>
                    <td className="mono-text">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="animate-item mt-8">
            <p className="mono-text" style={{ color: '#78716C' }}>
              Project Team: The Redeemed — Unathi Dlamini (PM), Gugu Radebe, Amogelang Selebi, Thembi Mofokeng, Samkelo Zondo
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} style={{ background: '#1C1917', padding: '80px 0 0' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#F5F5F4', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                MANGAUNG MOVES
              </h3>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 400, fontSize: '0.875rem', color: '#78716C', lineHeight: 1.6 }}>
                A Project Management III initiative documenting dance culture in Mangaung, Bloemfontein.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection('explore')} className="nav-link" style={{ color: '#A8A29E', width: 'fit-content' }}>Explore</button>
              <button onClick={() => scrollToSection('dances')} className="nav-link" style={{ color: '#A8A29E', width: 'fit-content' }}>The Dances</button>
              <button onClick={() => scrollToSection('heritage')} className="nav-link" style={{ color: '#A8A29E', width: 'fit-content' }}>Heritage</button>
              <button onClick={() => scrollToSection('project')} className="nav-link" style={{ color: '#A8A29E', width: 'fit-content' }}>Project</button>
            </div>

            <div>
              <p className="mono-text" style={{ color: '#78716C', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                CENTRAL UNIVERSITY OF TECHNOLOGY
              </p>
              <p className="mono-text" style={{ color: '#78716C', fontSize: '0.75rem' }}>
                2026 / SSE316C
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #292524', padding: '24px 0' }}>
          <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4" style={{ maxWidth: '1280px', padding: '0 clamp(24px, 4vw, 64px)' }}>
            <p className="mono-text" style={{ color: '#78716C', fontSize: '0.75rem' }}>
              The Redeemed — Unathi, Gugu, Amogelang, Thembi, Samkelo
            </p>
            <button
              onClick={() => scrollToSection('explore')}
              className="flex items-center gap-2 px-4 py-2 border transition-colors"
              style={{ borderColor: '#292524', color: '#78716C', fontSize: '0.75rem' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#292524' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 16V0m0 0L2 6m6-6l6 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Back to top
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
