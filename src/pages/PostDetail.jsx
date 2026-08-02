import { useParams } from "react-router";

const PostDetail = () => {
  const { id } = useParams();

  return (
    <section>
      <h1>Post Detail</h1>
      <p>Post ID: {id}</p>
    </section>
  );
};

export default PostDetail;