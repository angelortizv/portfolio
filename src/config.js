module.exports = {
  email: 'angelo@angelortizv.com',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/angelortizv',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/angelortizv',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/angelortizv',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Gallery',
      url: '/#gallery',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    green: '#64ffda',
    primary: '#3b83f6',
    bg: '#ffffff',
    darkNavy: '#020c1b',
    navy: '#0a192f',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),

  translations: [
    {
      language: 'English',
      symbol: 'en',
      text: 'Hi, my name is',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    },
    {
      language: 'Mandarin',
      symbol: 'zh',
      text: '你好，我的名字是',
      flag: '🇨🇳',
    },
    {
      language: 'Arabic',
      symbol: 'ar',
      text: 'مرحبا "أسمي هو',
      flag: '🇸🇦',
    },
    {
      language: 'Dutch',
      symbol: 'nl',
      text: 'Hallo mijn naam is',
      flag: '🇳🇱',
    },
    {
      language: 'French',
      symbol: 'fr',
      text: `Salut je m'appelle`,
      flag: '🇫🇷',
    },
    {
      language: 'German',
      symbol: 'de',
      text: 'Hi, mein Name ist',
      flag: '🇩🇪',
    },
    {
      language: 'Italian',
      symbol: 'it',
      text: 'Ciao, mi chiamo',
      flag: '🇮🇹',
    },
    {
      language: 'Japanese',
      symbol: 'ja',
      text: 'こんにちは、私の名前は',
      flag: '🇯🇵',
    },
    {
      language: 'Russian',
      symbol: 'ru',
      text: 'Привет, меня зовут',
      flag: '🇷🇺',
    },
    {
      language: 'Spanish',
      symbol: 'es',
      text: 'Hola, mi nombre es',
      flag: '🇪🇸',
    },
    {
      language: 'Turkish',
      symbol: 'tr',
      text: 'Merhaba, benim adım',
      flag: '🇹🇷',
    },
    {
      language: 'Ukrainian',
      symbol: 'uk',
      text: 'Привіт, я мене звати',
      flag: '🇺🇦',
    },
    {
      language: 'Vietnamese',
      symbol: 'vi',
      text: 'Xin chào, tôi tên là',
      flag: '🇻🇳',
    },
    {
      language: 'Korean',
      symbol: 'ko',
      text: '안녕하세요, 제 이름은',
      flag: '🇰🇷',
    },
    {
      language: 'Polish',
      symbol: 'pl',
      text: 'Cześć, nazywam się',
      flag: '🇵🇱',
    },
    {
      language: 'Portuguese',
      symbol: 'pt',
      text: 'Olá, meu nome é',
      flag: '🇵🇹',
    },
    {
      language: 'Romanian',
      symbol: 'ro',
      text: 'Bună ziua, numele meu este',
      flag: '🇷🇴',
    },
    {
      language: 'Swedish',
      symbol: 'sv',
      text: 'Hej, mitt namn är',
      flag: '🇸🇪',
    },
    {
      language: 'Thai',
      symbol: 'th',
      text: 'สวัสดีค่ะ, ฉันชื่อ',
      flag: '🇹🇭',
    },
  ],
};
