export const siteConfig = {
  name: 'Right At Home Realty Team',
  legalName: 'Right At Home Realty Team',
  domain: 'https://rightathomerealtyteam.com',
  phone: '+1-704-779-1180',
  phoneHref: 'tel:+17047791180',
  email: 'Realtoralvarojaimes@gmail.com',
  emailHref: 'mailto:Realtoralvarojaimes@gmail.com',
  serviceArea: 'North Carolina, South Carolina & all over the United States',
  serviceAreaDetail:
    'Charlotte, Gastonia, Concord, Rock Hill, Tega Cay and beyond - plus referrals in all 50 states.',
  founded: 'By Alvaro & Sally Jaimes',
  heroBadge: 'Hablamos Español',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/rightathomerealtyteam/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@realtoralvarojaimes1' },
  ],
  formEndpoint: 'https://api.web3forms.com/submit',
  web3formsAccessKey: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? '',
  mapEmbed:
    'https://maps.google.com/maps?q=Charlotte%2C%20NC&z=10&output=embed',
  contactMapEmbed: 'https://maps.google.com/maps?q=Gastonia%2C%20NC&z=9&output=embed',
  idxSearchSrc:
    'https://idxaddons.com/addon/omnisearch/MnJtNXlEU1NNM3E%3DcDm-qgLoemE/?pts=tabs&srt=newest',
  idxSearchAgentId: '15903955',
  idxFeaturedSrc:
    'https://idxaddons.com/addon/featured/MnJtNXlEU1NNM3E%3DcDm-qgLoemE/?fallback=3820&agent=15903955&listingagent=72068411&per=6&theme=casabella',
  idxSearchPageBuilderSrc:
    'https://idxaddons.com/addon/pagebuilder/cDm-qgLoemE2rm5yDSSM3q/973b18bb541fb993e0fd4f8c7e493588',
} as const;