import Url from 'url';
const IMG_URL = process.env.IMG_URL;

const Image = ({ path }) => {
  return <img src={Url.resolve(IMG_URL, path)} />;
};

export default Image;
