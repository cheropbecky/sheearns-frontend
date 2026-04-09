import { useMemo, useState } from "react";
import { ChevronRight, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tags = ["All Posts", "Success Stories", "Money Tips", "Growth"];

const articles = [
  {
    tag: "Success Stories",
    tagColor: "text-[#500088] bg-[rgba(80,0,136,0.08)]",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop",
    title: "How Amina Made Ksh 15,000 Her First Month Braiding",
    excerpt:
      "Amina didn't have a salon. She had a chair, a talent, and the SheEarns marketing toolkit. Here's her step-by-step roadmap.",
    author: "Amina K.",
    readTime: "5 min read",
  },
  {
    tag: "Money Tips",
    tagColor: "text-[#855300] bg-[rgba(133,83,0,0.08)]",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80&auto=format&fit=crop",
    title: "Saving for Scale: Why Your First Ksh 5,000 Matters",
    excerpt:
      "Financial freedom isn't about millions — it's about the systems you build with your first few thousands. Learn the 50/30/20 rule.",
    author: "Faith W.",
    readTime: "4 min read",
  },
  {
    tag: "Growth",
    tagColor: "text-[#940058] bg-[rgba(148,0,88,0.08)]",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80&auto=format&fit=crop",
    title: "TikTok for Business: Finding Your First 100 Clients",
    excerpt:
      "Stop posting randomly. Discover the Hook-Story-Offer framework that turned casual viewers into loyal paying customers.",
    author: "Brenda O.",
    readTime: "6 min read",
  },
];

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All Posts");

  const filtered = useMemo(
    () =>
      activeTag === "All Posts"
        ? articles
        : articles.filter((article) => article.tag === activeTag),
    [activeTag],
  );

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <Navbar active="Blog" />

      <main>
        <section className="pt-32 pb-20 min-h-[280px] relative overflow-hidden" data-aos="fade-up">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80&auto=format&fit=crop"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(80,0,136,0.80)] to-[rgba(80,0,136,0.60)]" />
          <div className="relative z-10 max-w-[1280px] mx-auto px-6">
            <div className="max-w-[800px] mx-auto text-center" data-aos="fade-up" data-aos-delay="50">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-4xl md:text-5xl leading-tight inline-flex items-center justify-center gap-3">
                <span role="img" aria-label="book">
                  📚
                </span>
                Real Stories. Real Money. Real Queens.
              </h1>
              <p className="text-white text-lg mt-5 leading-relaxed">
                Empowering the modern African woman with the knowledge, skills, and
                community to turn ambitions into income.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20" data-aos="fade-up" data-aos-delay="100">
          <div className="max-w-[1280px] mx-auto px-6">
            <article className="bg-white rounded-3xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-5">
              <div className="relative lg:col-span-3">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop"
                  alt="Featured story"
                  loading="lazy"
                  className="w-full h-full min-h-[320px] lg:min-h-[420px] object-cover"
                />
                <span className="absolute top-5 left-5 bg-[#fea619] text-[#684000] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Featured Story
                </span>
              </div>

              <div className="lg:col-span-2 p-8 flex flex-col gap-5 justify-center">
                <span className="bg-[rgba(80,0,136,0.08)] text-[#500088] text-xs font-bold px-3 py-1 rounded-full self-start">
                  Money Tips
                </span>

                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-3xl leading-tight">
                  The Pricing Mistake Every Girl Makes
                </h2>

                <p className="text-[#4c4452] text-base leading-relaxed">
                  Are you undercharging for your brilliance? We dive deep into why
                  high-value earners focus on results, not hours, and how to double
                  your rates today.
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80"
                    alt="Zahara M."
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm">
                    <span className="font-bold text-[#1c1c18]">Zahara M.</span>
                    <span className="text-[#4c4452] mx-2">•</span>
                    <span className="text-[#4c4452] text-xs">Hair Specialist • Nairobi</span>
                  </p>
                </div>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[#500088] font-bold text-sm no-underline hover:gap-3 transition-all"
                >
                  Read Story
                  <ChevronRight size={16} />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="py-20" data-aos="fade-up" data-aos-delay="140">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {tags.map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={
                      isActive
                        ? "bg-[#500088] text-white font-bold text-sm px-5 py-2 rounded-2xl shadow-sm"
                        : "bg-white border border-[#cfc2d4] text-[#1c1c18] font-medium text-sm px-5 py-2 rounded-2xl hover:border-[#500088] transition-colors"
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20" data-aos="fade-up" data-aos-delay="180">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map((article, index) => (
                <article
                  key={article.title}
                  data-aos="fade-up"
                  data-aos-delay={220 + index * 100}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-56 w-full overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col gap-3 h-full">
                    <span className={`self-start text-xs font-bold px-2 py-1 rounded-full ${article.tagColor}`}>
                      {article.tag}
                    </span>

                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-lg leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-[#4c4452] text-sm leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(207,194,212,0.2)]">
                      <span className="text-[#1c1c18] text-xs font-bold">{article.author}</span>
                      <span className="text-[#4c4452] text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" data-aos="fade-up" data-aos-delay="240">
          <div className="max-w-[1280px] mx-auto">
            <div className="mx-6 bg-[#500088] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=1400&q=60&auto=format&fit=crop"
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.15]"
              />
              <div className="absolute inset-0 bg-[rgba(80,0,136,0.86)]" />
              <div className="absolute w-48 h-48 rounded-full bg-[rgba(133,83,0,0.15)] -top-12 -right-12 blur-2xl" />
              <div className="absolute w-36 h-36 rounded-full bg-[rgba(107,0,62,0.15)] -bottom-8 -left-8 blur-2xl" />

              <div className="relative z-10">
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-4xl leading-tight">
                  Join the 10,000+ Queens Winning
                </h2>
                <p className="text-[#d7a8ff] text-lg mt-3 leading-relaxed max-w-3xl mx-auto">
                  Get weekly earning strategies, success stories, and exclusive
                  event invites straight to your inbox.
                </p>

                <form className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm px-5 py-4 rounded-2xl outline-none focus:border-white/60"
                  />
                  <button
                    type="submit"
                    className="bg-[#fea619] text-[#684000] font-bold text-sm px-6 py-4 rounded-2xl hover:bg-[#ffb930] transition-colors whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
