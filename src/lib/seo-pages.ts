export interface FAQItem {
  question: string
  answer: string
}

export interface SEOPage {
  slug: string
  title: string
  description: string
  headline: string
  intro: string
  keyword: string
  ctaTitle: string
  ctaDescription: string
  sections: Array<{
    title: string
    body: string[]
  }>
  faqs: FAQItem[]
  relatedToolSlugs: string[]
  relatedGuideSlugs: string[]
  indexable: boolean
}

export interface GuidePage {
  slug: string
  title: string
  description: string
  headline: string
  intro: string
  category: "how-to" | "faq" | "comparison" | "troubleshooting" | "legal" | "devices"
  sections: Array<{
    title: string
    body: string[]
  }>
  faqs?: FAQItem[]
  relatedToolSlugs: string[]
  indexable: boolean
  author: string
  testedOn: string
  reviewMethod: string
  purpose: string
  observations?: Array<{
    scenario: string
    observed: string
    implication: string
  }>
}

export const toolPages: SEOPage[] = [
  {
    slug: "threads-video-downloader",
    title: "Threads Video Downloader",
    description: "Legacy landing page for the Threads video downloader topic. The maintained downloader now lives on the homepage.",
    headline: "Threads Video Downloader Topic Page",
    intro: "This older topic page remains available for users who land here from older search results or shared links. The actively maintained downloader experience now lives on the homepage.",
    keyword: "threads video downloader",
    ctaTitle: "Use the maintained downloader on the homepage",
    ctaDescription: "Paste a public Threads post URL into the main homepage tool. For tested troubleshooting and device notes, use the guides linked below.",
    sections: [
      {
        title: "Why this page is no longer the primary entry point",
        body: [
          "The site has consolidated downloader intent onto the homepage so one maintained page can hold the main tool, current usage notes, and the clearest explanation of what works.",
          "That reduces duplication across near-identical keyword pages and makes the maintained downloader easier to keep accurate.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where is the main downloader now?",
        answer: "Use the homepage for the maintained downloader workflow and the latest guidance for public Threads posts.",
      },
    ],
    relatedToolSlugs: [],
    relatedGuideSlugs: ["how-to-download-videos-from-threads", "threads-video-not-downloading"],
    indexable: false,
  },
  {
    slug: "download-threads-video-online",
    title: "Download Threads Video Online",
    description: "Legacy topic page retained for old links. The maintained browser workflow now lives on the homepage.",
    headline: "Download Threads Video Online",
    intro: "This page is kept online for older links, but the maintained browser workflow now points users to the homepage and tested support guides.",
    keyword: "download threads video online",
    ctaTitle: "Open the maintained homepage workflow",
    ctaDescription: "Use the homepage tool for current behavior and the guides below for failure checks and device-specific notes.",
    sections: [
      {
        title: "What changed",
        body: [
          "The site now avoids spreading the same downloader experience across multiple near-duplicate landing pages.",
          "Keeping one maintained entry point makes the public-post workflow clearer for both users and site reviewers.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I still use a browser?",
        answer: "Yes. The maintained downloader is still browser-based, but it now lives on the homepage instead of this legacy topic page.",
      },
    ],
    relatedToolSlugs: [],
    relatedGuideSlugs: ["download-threads-videos-on-iphone-android-pc", "threads-video-not-downloading"],
    indexable: false,
  },
  {
    slug: "threads-gif-downloader",
    title: "Threads GIF Downloader",
    description: "Legacy topic page retained for compatibility. The maintained explanations for looping media now live in the main guides.",
    headline: "Threads GIF Downloader Topic Page",
    intro: "This older page stays online for existing links, but the maintained site focus is the main downloader plus tested guides that explain media behavior.",
    keyword: "threads gif downloader",
    ctaTitle: "Use the homepage downloader and troubleshooting guides",
    ctaDescription: "Looping media on Threads often resolves to video delivery. The maintained guides explain what that means in practice.",
    sections: [
      {
        title: "Why this topic was consolidated",
        body: [
          "Looping-media questions are better handled inside tested troubleshooting and format guidance than in a standalone keyword page.",
          "The site now keeps those explanations in fewer, more maintainable pages.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do looping posts often download as MP4?",
        answer: "Many social apps deliver loop-style media as video files, so MP4 can be the original source format rather than a conversion error.",
      },
    ],
    relatedToolSlugs: [],
    relatedGuideSlugs: ["threads-video-not-downloading", "download-threads-videos-on-iphone-android-pc"],
    indexable: false,
  },
  {
    slug: "threads-photo-downloader",
    title: "Threads Photo Downloader",
    description: "Legacy topic page retained for older links. The maintained site now focuses on one downloader entry point and tested support guides.",
    headline: "Threads Photo Downloader Topic Page",
    intro: "This page remains available for direct visits, but it is no longer treated as a primary search landing page.",
    keyword: "threads photo downloader",
    ctaTitle: "Use the homepage for current downloader behavior",
    ctaDescription: "The maintained site focus is public-post workflows, tested failure notes, and device-specific guidance.",
    sections: [
      {
        title: "Why the site reduced topic pages",
        body: [
          "Image, video, and carousel behaviors are better covered in fewer pages that explain real user outcomes instead of targeting every query variation separately.",
          "That lets the site spend more effort on accuracy and less on thin topic expansion.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this page still contain the main tool?",
        answer: "The maintained tool is on the homepage. This page is retained only so older links do not break.",
      },
    ],
    relatedToolSlugs: [],
    relatedGuideSlugs: ["how-to-download-videos-from-threads", "threads-video-not-downloading"],
    indexable: false,
  },
  {
    slug: "threads-carousel-downloader",
    title: "Threads Carousel Downloader",
    description: "Legacy topic page for older links. Current guidance is consolidated into the homepage and tested guides.",
    headline: "Threads Carousel Downloader Topic Page",
    intro: "This older topic page is no longer a primary search page. The maintained site now focuses on one downloader entry point and fewer support pages with clearer testing notes.",
    keyword: "threads carousel downloader",
    ctaTitle: "Start from the homepage downloader",
    ctaDescription: "For current troubleshooting and device behavior, use the maintained guides linked below.",
    sections: [
      {
        title: "Why this page was retired from indexing",
        body: [
          "The site no longer treats each keyword variation as its own primary search page.",
          "Consolidation helps the maintained pages stay more useful, more current, and easier to review.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I still use this URL?",
        answer: "Yes, but the maintained downloader and current guidance now live on the homepage and in the tested guides.",
      },
    ],
    relatedToolSlugs: [],
    relatedGuideSlugs: ["threads-video-not-downloading", "download-threads-videos-on-iphone-android-pc"],
    indexable: false,
  },
  {
    slug: "threads-to-mp4",
    title: "Threads to MP4",
    description: "Legacy topic page retained for old links. Maintained format guidance now lives in the main downloader flow and support guides.",
    headline: "Threads to MP4 Topic Page",
    intro: "This older topic page stays online for compatibility, but the maintained site now keeps format guidance in the homepage workflow and tested support content.",
    keyword: "threads to mp4",
    ctaTitle: "Use the homepage and support guides",
    ctaDescription: "The homepage is the maintained downloader entry point. The guides below cover common output and compatibility questions.",
    sections: [
      {
        title: "Why format-specific pages were reduced",
        body: [
          "Format questions such as MP4 output are usually part of a broader downloader workflow, not a separate product experience.",
          "The site now answers those questions inside fewer, better-maintained pages.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Threads media often end up as MP4?",
        answer: "Yes. Public video delivery frequently resolves to MP4-compatible files or playback URLs.",
      },
    ],
    relatedToolSlugs: [],
    relatedGuideSlugs: ["how-to-download-videos-from-threads", "download-threads-videos-on-iphone-android-pc"],
    indexable: false,
  },
]

export const guidePages: GuidePage[] = [
  {
    slug: "how-to-download-videos-from-threads",
    title: "How to Download Videos from Threads",
    description: "Tested step-by-step instructions for downloading public Threads videos, including what we checked, what usually works, and when the workflow fails.",
    headline: "How to Download Videos from Threads",
    intro: "This guide is written from repeated tests of public Threads post URLs in the site downloader. It focuses on what a visitor actually needs: the shortest working path, the common failure points, and the limits of a public-post workflow.",
    category: "how-to",
    sections: [
      {
        title: "The shortest working path we tested",
        body: [
          "In repeated checks, the most reliable path was simple: copy the original public Threads post URL, paste that URL into the downloader on the homepage, then wait for the returned file before saving it through the browser.",
          "The key detail is to use the original post URL each time. Reusing an old media URL or a redirected asset URL failed more often than starting from the public post itself.",
        ],
      },
      {
        title: "What usually works and what does not",
        body: [
          "The workflow is designed for public Threads posts. Public video posts were the most predictable input in testing. Private posts, posts visible only in a signed-in session, or expired upstream asset links were the most common non-working cases.",
          "If a result opens in a preview tab instead of immediately downloading, that is often a browser behavior difference rather than a failed extraction.",
        ],
      },
      {
        title: "Who, how, and why this guide is maintained",
        body: [
          "Who: this guide is maintained by the Threads Extractor editorial team and linked to a working downloader on the homepage.",
          "How: the team checks public post URLs, retries from original post links instead of cached media links, and updates the page when the downloader behavior or browser handling changes. AI may help draft copy, but the published guidance is manually reviewed against tested behavior.",
          "Why: this page exists to help users complete a public-post download workflow, not to create extra search pages that repeat the homepage in different words.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need the Threads app to use this workflow?",
        answer: "No. You only need the public post URL and a browser. The downloader itself runs on the website.",
      },
      {
        question: "Why should I retry from the original post URL instead of an old media URL?",
        answer: "Because asset URLs can expire or change. Starting from the public post URL gives the downloader a fresh chance to resolve the current media source.",
      },
    ],
    relatedToolSlugs: ["threads-video-downloader"],
    indexable: true,
    author: "Threads Extractor editorial team",
    testedOn: "2026-04-15",
    reviewMethod: "Manual checks of public post URLs and browser download behavior",
    purpose: "Help visitors complete a public Threads video download with the fewest steps and the clearest limits.",
    observations: [
      {
        scenario: "Fresh public post URL pasted into the homepage tool",
        observed: "This remained the clearest working path across repeated checks because the downloader could resolve the current media source from the post itself.",
        implication: "If a user asks whether to reuse an older extracted file URL, the safer guidance is still to restart from the original public post URL.",
      },
      {
        scenario: "Old asset link retried hours or days later",
        observed: "Older media URLs were more likely to fail or behave inconsistently than a fresh retry from the post URL.",
        implication: "A result that worked yesterday can still fail tomorrow if the retry starts from a stale asset URL instead of the source post.",
      },
      {
        scenario: "Result opened in a preview tab instead of downloading immediately",
        observed: "This happened more often on mobile browsers and did not always indicate an extraction failure.",
        implication: "Users should check the preview tab, browser download controls, or the Files/Downloads app before assuming the tool failed.",
      },
    ],
  },
  {
    slug: "threads-video-downloader-faq",
    title: "Threads Video Downloader FAQ",
    description: "Legacy FAQ page retained for older links. The maintained site now keeps key answers in the main guides and homepage.",
    headline: "Threads Video Downloader FAQ",
    intro: "This older FAQ page remains online for direct visits, but it is no longer a primary indexed page.",
    category: "faq",
    sections: [
      {
        title: "Why this FAQ is no longer indexed",
        body: [
          "The site has moved recurring answers into the maintained homepage and tested guides instead of spreading the same guidance across multiple FAQ and landing pages.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where should I start now?",
        answer: "Start from the homepage downloader, then use the tested guides for failure checks and device-specific behavior.",
      },
    ],
    relatedToolSlugs: ["threads-video-downloader"],
    indexable: false,
    author: "Threads Extractor editorial team",
    testedOn: "2026-04-15",
    reviewMethod: "Legacy compatibility page",
    purpose: "Preserve old links while consolidating maintained guidance elsewhere.",
  },
  {
    slug: "threads-video-downloader-vs-screen-recording",
    title: "Threads Video Downloader vs Screen Recording",
    description: "Legacy comparison page retained for old links. The maintained site now focuses on fewer tested support pages.",
    headline: "Threads Video Downloader vs Screen Recording",
    intro: "This comparison page remains accessible for older links, but it is no longer a primary search page.",
    category: "comparison",
    sections: [
      {
        title: "Why this page was retired from indexing",
        body: [
          "The maintained site now keeps core support inside fewer pages that focus on tested downloader behavior rather than broader keyword coverage.",
        ],
      },
    ],
    relatedToolSlugs: ["threads-video-downloader"],
    indexable: false,
    author: "Threads Extractor editorial team",
    testedOn: "2026-04-15",
    reviewMethod: "Legacy compatibility page",
    purpose: "Preserve older links while keeping the maintained support set smaller and clearer.",
  },
  {
    slug: "threads-video-not-downloading",
    title: "Threads Video Not Downloading",
    description: "Tested troubleshooting guide for Threads videos that do not download, covering public-post checks, expired media URLs, and browser-specific behavior.",
    headline: "Threads Video Not Downloading? Start Here",
    intro: "This troubleshooting guide is based on repeated failure patterns seen when testing public Threads post URLs. It focuses on the checks that explain most unsuccessful attempts before users assume the downloader is broken.",
    category: "troubleshooting",
    sections: [
      {
        title: "First check: confirm the post is public",
        body: [
          "The fastest diagnostic step is still the most important one: open the Threads post in a fresh browser session and confirm it is publicly reachable. If the post only works while signed in, a public downloader will usually fail.",
          "In practical use, this explained a large share of failed attempts more quickly than device or browser debugging.",
        ],
      },
      {
        title: "Second check: retry from the original post, not an old asset link",
        body: [
          "Another common pattern was stale asset links. When users retried with an old extracted media URL, results were less reliable than restarting with the original public post URL.",
          "That matters because upstream delivery URLs can expire, rotate, or respond differently between requests.",
        ],
      },
      {
        title: "Third check: account for browser behavior before assuming failure",
        body: [
          "On iPhone, Android, and some desktop browsers, a successful result may open in a preview tab, hand off to a share sheet, or save into a browser-managed downloads area. That can look like failure even when the extraction step succeeded.",
          "If the file opened somewhere unexpected, check the browser downloads list or Files/Downloads app before retrying.",
        ],
      },
      {
        title: "When the same post works one day and fails later",
        body: [
          "A result that worked earlier can fail later when the retry uses an old asset URL instead of the original Threads post URL. Upstream delivery links can rotate, expire, or respond differently between requests.",
          "That is why the safest retry advice is still to start from the original public post, not from a copied media file URL or an old redirected link.",
        ],
      },
      {
        title: "Format and multi-media edge cases",
        body: [
          "Some posts that look like GIFs are actually delivered as short video files, so MP4 output can be expected rather than wrong. The problem is often expectation mismatch, not a failed extraction.",
          "Carousel-style posts are another edge case. Users may expect every media item to be returned, but mixed-media or multi-item posts can behave differently from a single public video post. If only part of a carousel is reachable, the page should be treated as a different media situation rather than proof that every single-item workflow is broken.",
        ],
      },
      {
        title: "Who, how, and why this guide is maintained",
        body: [
          "Who: this page is maintained by the Threads Extractor editorial team as the primary troubleshooting guide for the downloader.",
          "How: the team reviews failed attempts against public-post availability, fresh post URLs, and device-specific browser handling. Draft copy can be assisted by AI, but the final guidance is manually reviewed against tested behavior.",
          "Why: this page exists to reduce failed attempts and dead ends for real users, not to create a separate landing page for every error phrase.",
        ],
      },
    ],
    faqs: [
      {
        question: "If the file opens in a new tab, did the downloader fail?",
        answer: "Not necessarily. Some browsers preview media before saving it. Check the browser download controls or save the file manually from that tab.",
      },
      {
        question: "What is the most common true failure case?",
        answer: "A post that is not publicly reachable is still the most common true blocker for a public web downloader.",
      },
    ],
    relatedToolSlugs: ["threads-video-downloader"],
    indexable: true,
    author: "Threads Extractor editorial team",
    testedOn: "2026-04-15",
    reviewMethod: "Manual troubleshooting checks against public-post visibility, fresh URLs, and browser handling",
    purpose: "Help visitors diagnose failed downloads quickly and distinguish true extraction failures from normal browser behavior.",
    observations: [
      {
        scenario: "Threads post opens while signed in but not in a fresh browser session",
        observed: "This usually pointed to a non-public or session-dependent view rather than a downloader issue.",
        implication: "Treat public availability as the first diagnostic step before debugging the extractor.",
      },
      {
        scenario: "The same post worked previously but fails after retrying from a saved media link",
        observed: "Stale media URLs were less reliable than a fresh retry from the original post URL.",
        implication: "The change in outcome may reflect URL expiry or upstream rotation rather than a new bug in the site.",
      },
      {
        scenario: "GIF-like or carousel-style post returns something different from what the user expected",
        observed: "Looping media often resolves to MP4, and carousel-like posts may not behave like a single-item video workflow.",
        implication: "Not every unexpected format or partial result is a failed download. Some cases are format or multi-media limitations that need separate explanation.",
      },
    ],
  },
  {
    slug: "threads-downloader-copyright-safety",
    title: "Threads Downloader Copyright and Responsible Use Guide",
    description: "A practical guide to copyright and responsible use when saving public Threads content, including reuse limits, reposting risk, and how to respect the original creator.",
    headline: "Threads Downloader Copyright and Responsible Use Guide",
    intro: "This guide exists for users who do not just want to know whether a public Threads post can be saved, but whether saving or reusing that content creates extra risk. It is written as a practical judgment guide, not a legal threat page.",
    category: "legal",
    sections: [
      {
        title: "Public access is not the same as free reuse",
        body: [
          "A public Threads post can be reachable in a browser and still remain protected by copyright or platform rules. Being able to download a file is not the same thing as having a broad license to repost, remix, or monetize it.",
          "That distinction matters because many users treat public visibility as implied permission. It is safer to treat public access as technical availability, not automatic reuse permission.",
        ],
      },
      {
        title: "Saving for personal reference is different from reposting",
        body: [
          "Saving a public post for personal reference, offline viewing, or a temporary working copy is usually a narrower act than republishing it elsewhere. The risk changes when the content is redistributed, re-edited, or uploaded into another public channel.",
          "The biggest jump in risk usually happens when saved content is posted again under a new account, included in a commercial asset, or detached from the original creator context.",
        ],
      },
      {
        title: "Commercial reuse raises the bar",
        body: [
          "If saved content is used in advertising, client work, a monetized page, or a branded social post, the need for permission becomes much stronger. A technically downloadable file can still be a poor candidate for commercial reuse.",
          "When the original creator is identifiable, attribution alone is not always enough. Permission and scope still matter.",
        ],
      },
      {
        title: "How to respect the original creator",
        body: [
          "When possible, link back to the original post, keep creator context intact, and avoid stripping marks that identify the source. If the content is sensitive, personal, or likely to be reposted out of context, the safer choice is often not to redistribute it at all.",
          "If reuse is important, the most responsible path is to contact the creator and ask for permission that matches the intended use.",
        ],
      },
    ],
    faqs: [
      {
        question: "If a Threads post is public, does that mean I can repost it anywhere?",
        answer: "No. Public access makes a post easier to view and sometimes easier to save, but it does not automatically grant a broad right to republish or monetize it.",
      },
      {
        question: "Is saving for personal reference different from posting it again?",
        answer: "Yes. Personal reference is usually a narrower use than redistribution, especially when the repost is public, edited, or commercial.",
      },
      {
        question: "What is the safest rule if I want to reuse someone else's content?",
        answer: "Assume permission is needed unless the reuse is clearly allowed by the creator, the platform terms, or the law that applies to your situation.",
      },
    ],
    relatedToolSlugs: ["threads-video-downloader"],
    indexable: true,
    author: "Threads Extractor editorial team",
    testedOn: "2026-04-15",
    reviewMethod: "Editorial review of user-facing copyright and reuse questions related to public Threads posts",
    purpose: "Help users understand the difference between technical downloadability and responsible reuse before they save or redistribute public content.",
    observations: [
      {
        scenario: "User saves a public post only for personal reference",
        observed: "The practical risk is usually lower than public redistribution, but the content is still not converted into a free-for-all asset.",
        implication: "The guide should distinguish personal retention from public reposting instead of treating all download behavior as equally risky.",
      },
      {
        scenario: "User wants to repost saved content on another social platform",
        observed: "Risk rises because the saved file is moving into a new public context that may detach it from the original creator and intended audience.",
        implication: "The safest guidance is to seek permission and keep source attribution clear when reuse goes beyond private reference.",
      },
      {
        scenario: "User wants to use saved content commercially",
        observed: "Commercial or brand use raises the permission bar even when the original Threads post is public.",
        implication: "The site should clearly tell users that technical access is not enough justification for commercial reuse.",
      },
    ],
  },
  {
    slug: "download-threads-videos-on-iphone-android-pc",
    title: "Download Threads Videos on iPhone, Android, and PC",
    description: "Tested device guide for downloading public Threads videos on iPhone, Android, Windows, and Mac, with notes on browser-specific save behavior.",
    headline: "Download Threads Videos on iPhone, Android, and PC",
    intro: "This device guide focuses on the practical differences that showed up during browser-based checks. The downloader flow is similar across devices, but what happens after extraction can differ a lot between Safari, Chrome, and desktop browsers.",
    category: "devices",
    sections: [
      {
        title: "What changed the most on iPhone",
        body: [
          "On iPhone, the biggest point of confusion was not the paste-and-submit step. It was what happened after a result was returned. Depending on Safari and iOS behavior, the media may open in a preview first or save into Files rather than looking like a classic direct download.",
          "That means many 'it did not work' reports on iPhone are really save-location or preview-flow questions.",
        ],
      },
      {
        title: "What Android and desktop users should expect",
        body: [
          "Android browsers usually behave closer to a direct download flow, but prompts and storage locations still vary by browser. Desktop browsers on Windows and Mac were generally the most predictable because they expose the browser download manager more clearly.",
          "Across all devices, starting from the original public post URL remained more reliable than retrying an old asset URL.",
        ],
      },
      {
        title: "Why iPhone Safari and Android Chrome can feel different",
        body: [
          "The downloader flow may be the same, but the save flow is not. Safari is more likely to route users through preview-style behavior or Files, while Android Chrome often feels closer to a direct browser download flow.",
          "That means users can describe the same successful extraction very differently depending on their device. A 'working' result on desktop may feel obvious, while the same outcome on iPhone may feel hidden or indirect.",
        ],
      },
      {
        title: "Who, how, and why this guide is maintained",
        body: [
          "Who: this page is maintained by the Threads Extractor editorial team as the main device-specific support page.",
          "How: the team reviews the same public-post workflow on mobile and desktop browsers, then updates the page when browser save behavior changes. AI may assist with wording, but the published instructions are manually reviewed against tested behavior.",
          "Why: this page exists because device handling changes the user experience even when the extraction step is the same. It is maintained to reduce confusion, not to multiply search pages.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why does iPhone feel less direct than desktop?",
        answer: "Because Safari and iOS may preview or hand off the file differently, which can hide the normal 'downloaded' feeling users expect on desktop.",
      },
      {
        question: "Which device was the most predictable in testing?",
        answer: "Desktop browsers on Windows and Mac were generally the clearest because file-save behavior is easier to inspect and repeat.",
      },
    ],
    relatedToolSlugs: ["threads-video-downloader"],
    indexable: true,
    author: "Threads Extractor editorial team",
    testedOn: "2026-04-15",
    reviewMethod: "Manual checks of the same public-post workflow across mobile and desktop browsers",
    purpose: "Help visitors understand device-specific save behavior so they do not mistake normal browser handling for extraction failures.",
    observations: [
      {
        scenario: "iPhone Safari returns a playable preview instead of a visible download prompt",
        observed: "This often feels less direct even when the extraction step worked.",
        implication: "Users need explicit guidance about Files, preview tabs, and share-sheet style handling on iPhone.",
      },
      {
        scenario: "Android Chrome starts a more familiar browser download flow",
        observed: "The result usually looks closer to what desktop users expect, although prompts and storage locations still vary.",
        implication: "Android users may report fewer false negatives because the save behavior is easier to interpret.",
      },
      {
        scenario: "Desktop browser handles the same post more predictably than mobile",
        observed: "Windows and Mac browsers made it easier to verify whether the file was downloaded or merely previewed.",
        implication: "When a mobile result is unclear, testing the same public post on desktop can help separate browser behavior from extractor failure.",
      },
    ],
  },
]

export const indexableToolPages = toolPages.filter((page) => page.indexable)
export const indexableGuidePages = guidePages.filter((page) => page.indexable)

export function getToolPage(slug: string) {
  return toolPages.find((page) => page.slug === slug)
}

export function getGuidePage(slug: string) {
  return guidePages.find((page) => page.slug === slug)
}
