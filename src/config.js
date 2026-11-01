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
      name: 'about',
      url: '/#about',
    },
    {
      name: 'experience',
      url: '/#jobs',
    },
    {
      name: 'projects',
      url: '/#projects',
    },
    {
      name: 'gallery',
      url: '/#gallery',
    },
    {
      name: 'contact',
      url: '/#contact',
    },
  ],

  colors: {
    primary: '#ffffff',
    signal: '#a78bfa',
    bg: '#060010',
    darkBg: '#030008',
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
};
