import classes from './comment-list.module.css';

function CommentList(props) {
  const { items } = props;
  return (
    <ul className={classes.comments}>
      {!items && <p>No comments</p>}
      {items &&
        items.map((comment) => (
          <li key={comment.id}>
            {' '}
            <p>{comment.text}</p>
            <div>
              By <address>{comment.name}</address>
            </div>
          </li>
        ))}
    </ul>
  );
}

export default CommentList;
