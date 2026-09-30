import aboutCommunity from '../assets/images/site/about-community.jpg';
import aboutHeroImage from '../assets/images/site/about-hero.png';
import hero from '../assets/images/site/hero.jpg';
import logo from '../assets/images/site/logo.png';
import alvaroJaimes from '../assets/images/team/alvaro-jaimes.jpg';
import sallyJaimes from '../assets/images/team/sally-jaimes-hi.jpg';
import nancyBrogdon from '../assets/images/team/nancy.webp';
import alvaroSally from '../assets/images/team/alvaro-sally.jpg';

export const imageMap = {
  aboutCommunity,
  aboutHeroImage,
  hero,
  logo,
  alvaroJaimes,
  sallyJaimes,
  nancyBrogdon,
  alvaroSally,
} as const;

export const teamPhotos = {
  'alvaro-jaimes': alvaroJaimes,
  'sally-jaimes': sallyJaimes,
  'nancy-brogdon': nancyBrogdon,
  'alvaro-sally': alvaroSally,
} as const;