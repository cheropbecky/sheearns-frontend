import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Clock, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { imageFive, imageSix, imageSeven, imageOne, imageTwo, imageFour } from "../assets/localImages";

const tags = ["All Posts", "Success Stories", "Money Tips", "Growth"];
const MEMBER_BLOGS_KEY = "sheearns_member_blogs_v1";

const tagStyles = {
  "Success Stories": "text-[#500088] bg-[rgba(80,0,136,0.08)]",
  "Money Tips": "text-[#855300] bg-[rgba(133,83,0,0.08)]",
  Growth: "text-[#940058] bg-[rgba(148,0,88,0.08)]",
};

const articles = [
  {
    tag: "Success Stories",
    tagColor: tagStyles["Success Stories"],
    image: imageFive,
    title: "How Amina Made Ksh 15,000 Her First Month Braiding",
    excerpt:
      "Amina didn't have a salon. She had a chair, a talent, and the SheEarns marketing toolkit. Here's her step-by-step roadmap.",
    author: "Amina K.",
    readTime: "5 min read",
  },
  {
    tag: "Money Tips",
    tagColor: tagStyles["Money Tips"],
    image: imageSix,
    title: "Saving for Scale: Why Your First Ksh 5,000 Matters",
    excerpt:
      "Financial freedom isn't about millions — it's about the systems you build with your first few thousands. Learn the 50/30/20 rule.",
    author: "Faith W.",
    readTime: "4 min read",
  },
  {
    tag: "Growth",
    tagColor: tagStyles.Growth,
    image: imageSeven,
    title: "TikTok for Business: Finding Your First 100 Clients",
    excerpt:
      "Stop posting randomly. Discover the Hook-Story-Offer framework that turned casual viewers into loyal paying customers.",
    author: "Brenda O.",
    readTime: "6 min read",
  },
  {
    tag: "Money Tips",
    tagColor: tagStyles["Money Tips"],
    image: imageTwo,
    title: "3 Pricing Scripts That Help You Close Clients Faster",
    excerpt:
      "Use these tested response scripts when clients ask for discounts. Protect your value while sounding warm and professional.",
    author: "Mercy N.",
    readTime: "3 min read",
  },
  {
    tag: "Growth",
    tagColor: tagStyles.Growth,
    image: imageOne,
    title: "How to Turn One Happy Client Into Five Referrals",
    excerpt:
      "Referrals are not luck. Learn the follow-up message sequence top earners use after each completed service.",
    author: "Joy A.",
    readTime: "4 min read",
  },
  {
    tag: "Success Stories",
    tagColor: tagStyles["Success Stories"],
    image: imageFour,
    title: "From Side Hustle to Full-Time Income in 90 Days",
    excerpt:
      "With consistency and clear weekly goals, Wanjiru replaced her salary with client work and now mentors other young women.",
    author: "Wanjiru P.",
    readTime: "5 min read",
  },
];

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function getExpandedContent(article) {
  if (article?.content) return article.content;

  return `${article.excerpt}\n\nWhat this means for your hustle:\n1. Focus on one clear outcome clients can pay for this week.\n2. Package your service so it is easy to explain and easy to buy.\n3. Follow up quickly and ask every happy client for a referral.\n\nSheEarns tip: Keep testing your offer every 7 days and track what messages convert best in your city.`;
}

export default function Blog() {
  const { isLoggedIn, user } = useAuth();
  const [activeTag, setActiveTag] = useState("All Posts");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [memberBlogs, setMemberBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    tag: "Success Stories",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEMBER_BLOGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setMemberBlogs(parsed);
      }
    } catch {
      setMemberBlogs([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MEMBER_BLOGS_KEY, JSON.stringify(memberBlogs));
  }, [memberBlogs]);

  const allArticles = useMemo(() => [...memberBlogs, ...articles], [memberBlogs]);

  const filtered = useMemo(
    () =>
      activeTag === "All Posts"
        ? allArticles
        : allArticles.filter((article) => article.tag === activeTag),
    [activeTag, allArticles],
  );

  const handleCreateBlog = (event) => {
    event.preventDefault();
    const title = formData.title.trim();
    const excerpt = formData.excerpt.trim();

    if (!title || !excerpt) {
      setFormError("Please add both a title and story content.");
      return;
    }

    if (title.length < 8 || excerpt.length < 40) {
      setFormError("Please make your title and content a bit more detailed.");
      return;
    }

    const newBlog = {
      id: `member-${Date.now()}`,
      tag: formData.tag,
      tagColor: tagStyles[formData.tag] || tagStyles["Success Stories"],
      image: imageFour,
      title,
      excerpt,
      content: `${excerpt}\n\nMember insight:\nI learned that consistency beats perfection. Start with what you have, post your work, and improve with each client.\n\nAction step for this week:\nPick one service, share 3 portfolio examples, and ask 5 people in your network for referrals.`,
      author: user?.name || "SheEarns Member",
      readTime: estimateReadTime(`${title} ${excerpt}`),
      isMemberPost: true,
    };

    setMemberBlogs((prev) => [newBlog, ...prev]);
    setFormData({ title: "", excerpt: "", tag: "Success Stories" });
    setFormError("");
  };

  const featuredStory = {
    tag: "Money Tips",
    tagColor: tagStyles["Money Tips"],
    image: imageOne,
    title: "The Pricing Mistake Every Girl Makes",
    excerpt:
      "Are you undercharging for your brilliance? We dive deep into why high-value earners focus on results, not hours, and how to double your rates today.",
    content:
      "Most women underprice because they charge for time instead of outcomes. Start by defining the clear result your client gets, then package your service in tiers: Starter, Standard, and Premium.\n\nWhen a client asks for a lower price, avoid discounting immediately. Instead, adjust scope while protecting your minimum profitable rate.\n\nFinally, review your pricing every 30 days. If your calendar is filling up quickly, increase rates gradually and communicate the added value clearly.",
    author: "Zahara M.",
    readTime: "5 min read",
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <Navbar active="Blog" />

      <main>
        <section className="pt-32 pb-20 h-100 sm:h-125 md:h-140 relative overflow-hidden" data-aos="fade-up">
          <img
            src={imageOne}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[rgba(80,0,136,0.55)] to-[rgba(80,0,136,0.38)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="max-w-200 mx-auto text-center" data-aos="fade-up" data-aos-delay="50">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-4xl sm:text-7xl lg:text-6xl leading-tight inline-flex items-center justify-center gap-3">
                Real Stories. Real Money. Real Queens
              </h1>
            </div>
          </div>
        </section>

        <section className="py-20" data-aos="fade-up" data-aos-delay="100">
          <div className="max-w-7xl mx-auto px-6">
            <article className="bg-white rounded-3xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-5">
              <div className="relative lg:col-span-3">
                <img
                  src={imageOne}
                  alt="Featured story"
                  loading="lazy"
                  className="w-full h-64 sm:h-72 md:h-105 object-cover"
                />
                <span className="absolute top-5 left-5 bg-[#fea619] text-[#684000] text-xs font-bold uppercase tracking-wide sm:tracking-widest px-3 py-1 rounded-full">
                  Featured Story
                </span>
              </div>

              <div className="lg:col-span-2 p-8 flex flex-col gap-5 justify-center">
                <span className={`text-xs font-bold px-3 py-1 rounded-full self-start ${featuredStory.tagColor}`}>
                  {featuredStory.tag}
                </span>

                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-xl sm:text-2xl lg:text-3xl leading-tight">
                  {featuredStory.title}
                </h2>

                <p className="text-[#4c4452] text-base leading-normal sm:leading-relaxed">
                  {featuredStory.excerpt}
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={imageFour}
                    alt="Zahara M."
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm">
                    <span className="font-bold text-[#1c1c18]">{featuredStory.author}</span>
                    <span className="text-[#4c4452] mx-2">•</span>
                    <span className="text-[#4c4452] text-xs">Hair Specialist • Nairobi</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(featuredStory)}
                  className="inline-flex items-center gap-2 text-[#500088] font-bold text-sm no-underline hover:gap-3 transition-all"
                >
                  See more
                  <ChevronRight size={16} />
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="py-20" data-aos="fade-up" data-aos-delay="140">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10 bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-[rgba(207,194,212,0.25)]">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-xl sm:text-2xl lg:text-3xl">
                Member Blog Corner
              </h2>
              <p className="text-[#4c4452] mt-2 text-sm md:text-base">
                Share your hustle wins, lessons, and client stories with the SheEarns community.
              </p>

              {!isLoggedIn && (
                <div className="mt-4 bg-[#f7f3ed] rounded-2xl p-4 flex flex-wrap items-center gap-3">
                  <p className="text-[#1c1c18] text-sm">You need to log in to publish a member blog.</p>
                  <a href="/login" className="no-underline bg-[#500088] text-white font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    Log In
                  </a>
                </div>
              )}

              {isLoggedIn && (
                <form onSubmit={handleCreateBlog} className="mt-6 grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Blog title"
                    className="bg-[#f7f3ed] text-[#1c1c18] text-sm px-4 py-3 rounded-2xl border border-transparent focus:border-[rgba(80,0,136,0.35)] outline-none"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <select
                      value={formData.tag}
                      onChange={(event) => setFormData((prev) => ({ ...prev, tag: event.target.value }))}
                      className="sm:col-span-1 bg-[#f7f3ed] text-[#1c1c18] text-sm px-4 py-3 rounded-2xl border border-transparent focus:border-[rgba(80,0,136,0.35)] outline-none"
                    >
                      {tags.filter((tag) => tag !== "All Posts").map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>

                    <textarea
                      value={formData.excerpt}
                      onChange={(event) => setFormData((prev) => ({ ...prev, excerpt: event.target.value }))}
                      placeholder="Write your story or tip..."
                      rows={4}
                      className="sm:col-span-2 bg-[#f7f3ed] text-[#1c1c18] text-sm px-4 py-3 rounded-2xl border border-transparent focus:border-[rgba(80,0,136,0.35)] outline-none resize-none"
                    />
                  </div>

                  {formError && <p className="text-sm text-[#a60000] font-semibold">{formError}</p>}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#500088] text-white font-bold text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity"
                    >
                      Publish Blog
                    </button>
                  </div>
                </form>
              )}
            </div>

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
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filtered.map((article, index) => (
                <article
                  key={article.title}
                  data-aos="fade-up"
                  data-aos-delay={220 + index * 100}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-2.5 h-full">
                    <span className={`self-start text-xs font-bold px-2 py-1 rounded-full ${article.tagColor}`}>
                      {article.tag}
                    </span>

                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-sm md:text-base leading-tight sm:leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-[#4c4452] text-sm leading-normal sm:leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      className="self-start inline-flex items-center gap-2 text-[#500088] font-bold text-sm hover:gap-3 transition-all"
                    >
                      See more
                      <ChevronRight size={16} />
                    </button>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(207,194,212,0.2)]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#1c1c18] text-xs font-bold">{article.author}</span>
                        {article.isMemberPost && (
                          <span className="text-[11px] font-bold text-[#500088]">Member Post</span>
                        )}
                      </div>
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
          <div className="max-w-7xl mx-auto">
            <div className="mx-6 bg-[#500088] rounded-3xl h-100 sm:h-125 md:h-140 p-10 md:p-16 text-center relative overflow-hidden flex items-center justify-center">
              <img
                src={imageTwo}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.15]"
              />
              <div className="absolute inset-0 bg-[rgba(80,0,136,0.60)]" />
              <div className="absolute w-48 h-48 rounded-full bg-[rgba(133,83,0,0.15)] -top-12 -right-12 blur-2xl" />
              <div className="absolute w-36 h-36 rounded-full bg-[rgba(107,0,62,0.15)] -bottom-8 -left-8 blur-2xl" />

              <div className="relative z-10">
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight">
                  Join the 10,000+ Queens Winning
                </h2>
                <p className="text-[#d7a8ff] text-sm md:text-base mt-3 leading-normal sm:leading-relaxed max-w-3xl mx-auto">
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

      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-[rgba(28,28,24,0.65)] px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-56 sm:h-72">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover object-center"
              />
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#1c1c18] flex items-center justify-center hover:bg-white"
                aria-label="Close"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex flex-col gap-4">
              <span className={`self-start text-xs font-bold px-3 py-1 rounded-full ${selectedArticle.tagColor}`}>
                {selectedArticle.tag}
              </span>

              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-xl sm:text-2xl lg:text-3xl leading-tight">
                {selectedArticle.title}
              </h3>

              <div className="flex items-center justify-between border-b border-[rgba(207,194,212,0.3)] pb-3">
                <span className="text-[#1c1c18] text-sm font-bold">{selectedArticle.author}</span>
                <span className="text-[#4c4452] text-xs inline-flex items-center gap-1">
                  <Clock size={12} />
                  {selectedArticle.readTime}
                </span>
              </div>

              <p className="text-[#4c4452] text-sm md:text-base leading-normal sm:leading-relaxed whitespace-pre-line">
                {getExpandedContent(selectedArticle)}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
