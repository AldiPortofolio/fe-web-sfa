import In from './dictionary/in';
import En from './dictionary/en';

const langs = {
    In,
    En
};

export default function(lang = "In") {
  return langs[lang];
}