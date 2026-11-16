import treeUrl from '../assets/images/tree.webp';

/** The snow-covered Christmas tree with warm fairy lights and a glowing star. */
export function ChristmasTree() {
  return (
    <div className="ca-tree">
      <img className="ca-art ca-tree-art" src={treeUrl} alt="" draggable={false} />
      <div className="ca-tree-star" />
    </div>
  );
}
