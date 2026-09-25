import React, { useEffect } from 'react';

// Disqus settings for LastBatch. The shortname cannot be changed in Disqus,
// and page.url / page.identifier are fixed so every comment lands in one thread.
const DISQUS_SHORTNAME = 'lastbatch';
const PAGE_URL = 'https://bakery-store-manager-lastbatch-mgmt-umber.vercel.app/';
const PAGE_IDENTIFIER = 'home';
const SCRIPT_ID = 'disqus-embed-script';

declare global {
  interface Window {
    DISQUS?: { reset: (options: { reload: boolean; config: () => void }) => void };
    disqus_config?: () => void;
  }
}

function disqusConfig(this: { page: { url: string; identifier: string } }) {
  this.page.url = PAGE_URL;
  this.page.identifier = PAGE_IDENTIFIER;
}

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Coming back from the "This week" tab: Disqus is already loaded,
    // so reset it into the new #disqus_thread instead of loading the script again.
    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true, config: disqusConfig });
      return;
    }

    // First visit: load the Disqus Universal Code exactly once.
    window.disqus_config = disqusConfig;
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', String(Date.now()));
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section id="feedback-section" className="px-4 pb-8 pt-2 max-w-md mx-auto w-full">
      <p className="text-sm text-stone-700 mb-3">
        Tried LastBatch? Tell us what worked for you and what did not.
      </p>
            <div
        id="disqus_thread"
        style={{ color: '#1c1917', backgroundColor: '#fafaf9' }}
      />
    </section>
  );
};
