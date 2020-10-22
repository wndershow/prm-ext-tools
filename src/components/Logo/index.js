import style from './style.scss';
export default () => {
  return (
    <div className="com-logo">
      <svg className="icon" aria-hidden="true">
        <use href="#icon-bean"></use>
      </svg>
      <style>{style[0][1]}</style>
    </div>
  );
};
